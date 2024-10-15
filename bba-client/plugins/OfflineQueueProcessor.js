import { openDB } from 'idb';
import axios from 'axios';

class OfflineQueueProcessor {
    constructor() {
        this.db = null;
        if(typeof(navigator) !== 'undefined' && !navigator.onLine) {
            this.isOnline = navigator.onLine;
            this.initDB();
            this.setupEventListeners();
            this.processInterval = 30000;
            this.connectionCheckInterval = 60000;
            this.maxRetries = 3;
            this.retryDelay = 5000;
            this.startProcessingQueue();
            this.startConnectionCheck();
        }
        else {
            console.log('Offline queue processor is not initialized because the device is online.')
        }
    }

    async initDB() {
        this.db = await openDB('OfflineQueue', 1, {
            upgrade(db) {
                const store = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp');
                store.createIndex('retries', 'retries');
            },
        });
    }

    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processQueue();
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    async enqueueRequest(url, method, data) {
        await this.db.add('requests', {
            url,
            method,
            data,
            timestamp: Date.now(),
            retries: 0,
        });
    }

    async processQueue() {
        if (!this.isOnline) return;

        const tx = this.db.transaction('requests', 'readwrite');
        const store = tx.objectStore('requests');
        const index = store.index('timestamp');

        let cursor = await index.openCursor();
        while (cursor) {
            const request = cursor.value;
            if (request.retries < this.maxRetries) {
                try {
                    await this.sendRequest(request);
                    await store.delete(cursor.primaryKey);
                } catch (error) {
                    console.error('Failed to process request:', error);
                    request.retries++;
                    request.lastAttempt = Date.now();
                    await cursor.update(request);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            } else {
                console.error('Max retries reached for request:', request);
                await store.delete(cursor.primaryKey);
            }
            cursor = await cursor.continue();
        }

        await tx.done;
    }

    async sendRequest(request) {
        const { url, method, data } = request;
        const response = await axios({ method, url, data });
        return response.data;
    }

    startProcessingQueue() {
        setInterval(() => this.processQueue(), this.processInterval);
    }

    startConnectionCheck() {
        setInterval(() => this.checkConnection(), this.connectionCheckInterval);
    }

    async submitDeliveryOrder(orderData) {
        const completeOrderData = {
            ...orderData,
            gps: await this.getCurrentPosition(),
            timestamp: Date.now(),
        };

        if (this.isOnline) {
            try {
                try {
                    let emailResponse = await this.$axios.post(
                    "api/user/sendDeliveryEmail",
                    {
                        params: {
                        orderid: this.deliveryOrderData.orderid,
                        message: this.smsObject.message,
                        images: this.smsObject.mediaUrl
                        },
                    }
                    );
                } catch (error) {
                    this.loader = false;
                }

                let response = await this.$axios
                .$post("api/user/sendSMS", this.smsObject)
                .then(async (response) => {
                    let saveData = {
                        date: this.dateFormatted,
                        name: this.deliveryOrderData.name,
                        location: this.deliveryOrderData.location,
                        color: this.defaultColorValue,
                        combination: this.defaultCombinationValue,
                        orderid: this.deliveryOrderData.orderid,
                        swapOrder: this.deliveryOrderData.swapOrder,
                        status: 1,
                        textSent: 1,
                        picturesSent: 1,
                        unableToDeliverItems: this.deliveryOrderData.unableToDeliverItems,
                        note: this.deliveryOrderData.note,
                        extrasDelivered: this.deliveryOrderData.extrasDelivered,
                        extrasDeliveredReason: this.deliveryOrderData.extrasDeliveredReason,
                        delivered: true
                    }
                });

                this.loader = false;
                this.showSuccess("Order submitted successfully");
                
                return await this.sendRequest({
                    method: 'POST',
                    url: '/api/user/deliveryorderupdate',
                    data: completeOrderData
                }); 
            } 
            catch (error) {
                console.error('Failed to submit delivery order:', error);
                await this.enqueueRequest('/api/user/deliveryorderupdate', 'POST', completeOrderData);
            }
        } else {
            await this.enqueueRequest('/api/user/deliveryorderupdate', 'POST', completeOrderData);
        }
    }

    async uploadImage(file, orderId, pictureNumber) {
        const formData = new FormData();
        formData.append('file', file);
        const url = `${process.env.API_URL}/api/user/upload?orderid=d-${orderId}-${pictureNumber}`;

        if (this.isOnline) {
            try {
                return await this.sendRequest({ method: 'POST', url, data: formData });
            } catch (error) {
                console.error('Failed to upload image:', error);
                await this.enqueueRequest(url, 'POST', { file, orderId, pictureNumber });
            }
        } else {
            await this.enqueueRequest(url, 'POST', { file, orderId, pictureNumber });
        }
    }

    async checkConnection() {
        try {
            await axios.get('https://www.google.com', { timeout: 5000 });
            if (!this.isOnline) {
                this.isOnline = true;
                this.processQueue();
            }
        } catch (error) {
            this.isOnline = false;
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }
        });
    }
}

export default new OfflineQueueProcessor();