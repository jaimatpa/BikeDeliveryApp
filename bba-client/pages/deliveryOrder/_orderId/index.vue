<template lang="html">
<Page :title="!isMobile ? 'Delivery Order Details' : ''">
    <v-stepper v-model="deliveryStepper" class="order-details-stepper">
        <v-stepper-items>
            <!-- First Stepper -->
            <v-stepper-content step="1">
                <div class="d-flex flex-column justify-space-between" style="height: 100%">
                    <div>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.orderid" label="ORDER #" placeholder="Order" readonly disabled filled dense outlined>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="dateFormatted" label="Date" hint="MM/DD/YYYY format" persistent-hint v-bind="attrs" @blur="date = parseDate(dateFormatted)" v-on="on" outlined dense></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.name" label="NAME" placeholder="Name" dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.location" label="LOCATION" placeholder="Location" dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-select :items="colors" v-model="deliveryOrderData.color" item-text="color" item-value="combination" label="Color" dense outlined></v-select>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.combination" label="COMBINATION" placeholder="Combination" disabled readonly filled dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                    <div>
                        <!-- First Stepper Button -->
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-btn block depressed color="error" @click.stop="deliveryCancelOrderDialog = true">
                                    Cancel
                                </v-btn>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-btn block depressed color="primary" @click.stop="deliveryStepper = 3">
                                    Next
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-stepper-content>

            <!-- Third Stepper -->
            <v-stepper-content step="3">
                <ThirdStepper @set-delivery-stepper="setDelivaryStepper" :deliveryOrderData="deliveryOrderData" :userPosition="userPosition" />
            </v-stepper-content>

            <!-- Fourth Stepper -->
            <v-stepper-content step="4">
                <FourthStepper :deliveryOrderData="deliveryOrderData" :cyclePhoto="cyclePhoto" @set-delivery-stepper="setDelivaryStepper" @set-delivery-order-dialog="setDelivaryDialog" @setUploadFiles="setUploadFiles" />
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>

    <!-- Search History Dialog -->
    <v-dialog v-model="deliveryOrderDialog" transition="dialog-bottom-transition" max-width="350" content-class="order-details-dialog">
        <v-card>
            <v-toolbar dense color="primary" dark elevation="0">
                <v-toolbar-title>Send</v-toolbar-title>
                <v-spacer />
                <v-btn icon dark @click.stop="deliveryOrderDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="my-5 text-center">
                <p class="title mb-3 secondary--text sure-title">
                    Are you sure you want to send this information?
                </p>

                <div class="d-flex flex-column">
                    <v-btn class="ma-2" color="primary" @click="sendNotification()">
                        Confirm
                    </v-btn>
                    <v-btn class="ma-2" outlined color="error" @click.stop="deliveryOrderDialog = false">
                        Cancel
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- Delivery Cancel Dialog -->
    <v-dialog v-model="deliveryCancelOrderDialog" transition="dialog-bottom-transition" max-width="350" content-class="order-details-dialog">
        <v-card>
            <v-toolbar dense color="error" dark elevation="0">
                <v-toolbar-title>Cancel Delivery</v-toolbar-title>
                <v-spacer />
                <v-btn icon dark @click.stop="deliveryCancelOrderDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="my-5 text-center">
                <p class="title mb-3 secondary--text sure-title">
                    Are you sure you want to cancel this delivery order?
                </p>

                <div class="d-flex flex-column">
                    <v-btn class="ma-2" color="primary" @click.stop="$router.go(-1)">
                        Yes
                    </v-btn>
                    <v-btn class="ma-2" outlined color="error" @click.stop="deliveryCancelOrderDialog = false">
                        No
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-overlay :value="loader">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
</Page>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import {
    mapActions
} from "vuex";

import Page from "@/components/paradym/Page";
import emptyPhoto from "@/assets/images/empty.jpg";
import cyclePhoto from "@/assets/images/cycle@2x.png";

import ThirdStepper from "@/components/delivery-order/steppers/ThirdStepper";
import FourthStepper from "@/components/delivery-order/steppers/FourthStepper";

export default {
    name: "deliveryOrderDetails",
    auth: true,
    head() {
        return {
            title: "Delivery Order Details",
        };
    },
    components: {
        Page,
        ThirdStepper,
        FourthStepper
    },
    async created() {
        this.getOrderDetails();
        this.getMsgTemplate();
        this.getUserlocation();
    },
    data() {
        return {
            breakpoint: 640,
            deliveryOrderData: {},
            deliveryStepper: 1,
            deliveryOrderDialog: false,
            deliveryCancelOrderDialog: false,
            emptyPhoto: emptyPhoto,
            cyclePhoto: cyclePhoto,
            loader: false,
            smsObject: {
                to: "",
                message: "",
                mediaUrl: [],
            },
            templateMsg: "",
            userPosition: null,
            defaultColorValue: {
                color: "Orange",
                combination: "4521"
            },
            colorItems: [{
                    color: "Orange",
                    combination: "4521"
                },
                {
                    color: "Red",
                    combination: "1236"
                },
                {
                    color: "Green",
                    combination: "9654"
                },
                {
                    color: "Teal",
                    combination: "6325"
                },
                {
                    color: "Gray",
                    combination: "7521"
                },
            ],
            colors: [
                "Red",
                "Green",
                "Teal",
                "Pink",
                "Goldenrod",
                "Blue",
                "Gray",
                "Purple",
            ],

            // Date field
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
        };
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
        computedDateFormatted() {
            return this.formatDate(this.date);
        },
    },
    watch: {
        date(val) {
            this.dateFormatted = this.formatDate(this.date);
        },
        menu1(val) {
            console.log("menu1", this.menu1);
        },
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        formatDate(date) {
            console.log("formate dated", date);

            if (!date) return null;

            const [year, month, day] = date.split("-");
            return `${month}/${day}/${year}`;
        },
        parseDate(date) {
            if (!date) return null;

            const [month, day, year] = date.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        },
        getUserlocation() {
            if (process.client) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            console.log("Clicked on pointer, position === ", position);
                            const pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            console.log("pos ==== ", pos);
                            this.userPosition = pos;
                        },
                        (error) => {
                            // handle error here.
                            console.log("error =========== ", error);
                        }
                    );
                }
            }
        },

        sendNotification() {
            console.log("In Send Notification");
            this.searchHistoryDialog = false;
            this.deliveryOrderDialog = false;
            this.loader = true;

            console.log("delivery information", this.deliveryOrderData);
            let dataToAdd = this.deliveryOrderData;
            let userPositionData = this.userPosition;

            // let message = `Hello ${dataToAdd.name}! Your bike is now available at ${dataToAdd.location}. Your deliver number is ${dataToAdd.orderid}, Bike Rack : ${dataToAdd.rack}, Color : ${dataToAdd.color}, Lock-Combo : ${dataToAdd.combination}. Thank You.`

            // let newMSG = `Hello [customer-name]! \nJOY\n\n\n\nBANGLA\n\n\n\nYour bike is now available at [geo-lat] [geo-long] Your deliver number is [delivery-number] Thank You.`

            let infoMap = {
                "[customer-name]": "name",
                "[location]": "location",
                "[lock-combo]": ["lock", "combination"],
                "[lock]": "lock",
                "[combination]": "combination",
                "[delivery-number]": "orderid",
                "[color]": "color",
                "[rack]": "rack",
                "[geo-lat]": "geo-lat",
                "[geo-long]": "geo-long",
            };

            let output = this.getMessage(
                this.templateMsg,
                infoMap,
                dataToAdd,
                userPositionData
            );

            console.log(this.templateMsg, "!!!!!", infoMap, "!!!!!", dataToAdd, "!!!!!", userPositionData);

            // let message = `Hello ${dataToAdd.name}! Your bike is now available at ${dataToAdd.location}. Your deliver number is ${dataToAdd.orderid}, Bike Rack : ${dataToAdd.rack}, Color : ${dataToAdd.color}, Lock-Combo : ${dataToAdd.combination}. Thank You.`;
            // this.smsObject.message = message;

            this.smsObject.to = dataToAdd.mobileNo;
            this.smsObject.message = output;

            // this.smsObject.to ="+8801745476473";

            try {
                this.uploadFiles();
            } catch (error) {
                console.log("error", error);
            }

            this.uploads.forEach((upload) => {
                console.log("IN THE UPLOAD FOR EACH",`localhost:3100/file-${upload.originalName}.jpeg`)
                this.smsObject.mediaUrl.push(`https://bikeappstaging.hiretheproz.com/${upload.originalName}.jpeg`);
            });

            console.log("Data ready====>", this.smsObject);
            console.log(this.smsObject);
            try {
                let response = this.$axios.$post(
                    "api/user/sendSMS",
                    this.smsObject
                );
                this.loader = false;
                this.showSuccess(response.message);
                //  this.$router.go(-1);
            } catch (err) {
                console.log("errror", err.response);
                this.loader = false;
            }

            this.loader = false;
        },
        async getOrderDetails() {
            try {
                let response = await this.$axios.$get("/api/user/deliveryOrder", {
                    params: {
                        search: this.$route.params.orderId,
                    },
                });

                // const responseData = _.omit(response[0], "date");
                // this.deliveryOrderData = responseData;
                // this.deliveryOrderData.date = moment(response[0].date).format(
                //   "MM/DD/YYYY hh:mm A"
                // );

                this.deliveryOrderData = response[0];

                console.log("this.deliveryOrderData", this.deliveryOrderData);

                //  this.$router.go(-1);
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        setDelivaryStepper(param) {
            this.deliveryStepper = param;
        },
        async upload(upload) {
            const blob = await fetch(upload.local_blob_url).then((r) => r.blob());
            const newfileObj = new File([blob], `${upload.originalName}.jpeg`, {
                type: blob.type,
            });

            let formData = new FormData();
            formData.append("file", newfileObj);

            try {
                let result = await this.$axios.$post(
                    "/api/user/upload?orderid=" + this.deliveryOrderData.orderid,
                    formData
                );

                if (result.success) {
                    console.log(`Upload was successful!!! ${this.deliveryOrderData.orderid}`);
                    // this.$router.push({
                    //   path: "/callForHelp",
                    //   query: { orderid: this.deliveryOrderData.orderid },
                    // });
                    this.$router.go(-1);
                } else {
                    console.log("upload failed!!!");
                }
            } catch (err) {
                console.log(err);
            }
        },
        async uploadFiles() {
            this.uploads.forEach((upload) => {
                this.upload(upload);
            });
        },
        async setUploadFiles(uploads) {
            this.uploads = uploads;
        },

        setDelivaryDialog(param) {
            this.deliveryOrderDialog = param;
        },
        async getMsgTemplate() {
            try {
                let response = await this.$axios.$get("api/user/template");
                console.log("respones", response);
                this.templateMsg = response.body;
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        getMessage(template, infoMap, userObj, userPosition) {
            let result = template;
            for (let key in infoMap) {
                if (key === "[lock-combo]") {
                    let key0 = infoMap[key][0];
                    let key1 = infoMap[key][1];
                    result = result.replaceAll(key, `${userObj[key0]}-${userObj[key1]}`);
                }

                if (key === "[geo-lat]") {
                    result = result.replaceAll(key, userPosition.lat);
                }
                if (key === "[geo-long]") {
                    result = result.replaceAll(key, userPosition.lng);
                }

                result = result.replaceAll(key, userObj[infoMap[key]]);
            }
            return result;
        },
    },
};
</script>

<style lang="scss">
.order-details-dialog {
    box-shadow: none !important;

    .sure-title {
        font-size: 1rem !important;
        line-height: 1.2rem !important;
    }
}
</style>
