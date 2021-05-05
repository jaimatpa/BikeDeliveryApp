<template lang="html">
<Page :title="!isMobile ? 'Delivery Order Details' : ''">
    <v-stepper v-model="deliveryStepper" class="order-details-stepper">
        <v-stepper-items>
            <!-- First Stepper -->
            <v-stepper-content step="1">
                <div class="d-flex flex-column justify-space-between" style="height: 100%">
                    <div class="mt-1">
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.orderid" label="ORDER #" placeholder="Order" readonly disabled dense outlined>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="dateFormatted" label="Date" hint="MM/DD/YYYY format" persistent-hint v-bind="attrs" @blur="date = parseDate(dateFormatted)" v-on="on" disabled readonly outlined dense></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.name" label="NAME" placeholder="Name" disabled readonly dense outlined>
                                </v-text-field>
                            </v-col>

                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.location" label="LOCATION" placeholder="Location" disabled readonly dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-select :items="colorItems" v-model="defaultColorValue" label="Color" disabled readonly dense outlined></v-select>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="defaultCombinationValue" label="COMBINATION" placeholder="Combination" disabled readonly dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row cols="12" xs="12" sm="12" md="12" xl="12">
                             <v-textarea v-model="deliveryOrderData.note" label="NOTES" placeholder="NOTES" disabled readonly dense outlined>
                                </v-textarea>
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
                    Are you sure you want to send this information to this number?
                    {{smsObject.to}}
                    <v-btn class="mx-2" icon color="primary" @click="editNumber=!editNumber">
                        <v-icon small dark>
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </p>
                <v-text-field v-if="editNumber" v-model="smsObject.to" append-icon="mdi-mobile" label="You can change the number" single-line outlined dense clearable class="mb-5 order-search-text-field" :rules="[rules.required]"></v-text-field>

                <div class="d-flex flex-column">
                    <v-btn :disabled="smsObject.to==='' ||smsObject.to===null " class="ma-2" color="primary" @click="sendNotification()">
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
    mapActions,
    mapState
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
        // location.reload();
        this.getOrderDetails();
        this.getMsgTemplate();
        this.getUserlocation();
        this.getLockingDetails();
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

            userPosition: null,
            defaultColorValue: "",
            defaultCombinationValue: "",
            colorItems: [],
            lockingData: [],
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
            date: null,
            dateFormatted: null,
            menu1: false,
            smsObject: {
                to: "",
                message: "",
                orderid: '',
                mediaUrl: []
            },
            templateMsg: "",
            editNumber: false,
            rules: {
                required: (value) => !!value || "Required.",

            },
        };
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
        computedDateFormatted() {
            return this.formatDate(this.date);
        },
        ...mapState({
            capturedImagesFromVuex: (state) => state.capturedImages = [],
        }),
    },
    watch: {
        date(val) {
            this.dateFormatted = this.formatDate(this.date);
        },
        defaultColorValue(newVal, oldVal) {
            if (oldVal) {
                const data = _.find(this.lockingData, (o) => o.color === newVal);
                this.defaultCombinationValue = data && data.combination;
            }
        },
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        formatDate(date) {
            if (!date) return null;

            const [year, month, day] = date.split("-");
            return `${month}/${day}/${year}`;
        },
        parseDate(date) {
            if (!date) return null;

            const [month, day, year] = date.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        },
        async getLockingDetails() {
            const lockingDataResponse = await this.$axios.$get("/api/user/locking");
            this.lockingData = lockingDataResponse;
            console.log(lockingDataResponse);
            this.colorItems = _.map(lockingDataResponse, "color");
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

        async sendNotification() {
            this.searchHistoryDialog = false;
            this.deliveryOrderDialog = false;
            this.loader = true;
            let dataToAdd = this.deliveryOrderData;
            let userPositionData = this.userPosition;

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
            this.smsObject.message = output;
            this.smsObject.orderid = this.deliveryOrderData.orderid;

            try {
                let response = await this.uploadFiles(this.smsObject);
            } catch (error) {
                console.log("error", error);
            }

            try {
                let emailResponse = await this.$axios.post("api/user/sendDeliveryEmail", this.smsObject);
            } catch (error) {
                this.loader = false;
            }

            try {
                let response = await this.$axios.$post(
                    "api/user/sendSMS",
                    this.smsObject
                );
                this.loader = false;
                this.showSuccess(response.message);
                this.$router.push('/deliveryOrder');
            } catch (err) {
                console.log("errror", err.response);
                this.loader = false;
            }
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

                this.date = response[0].date.substr(0, 10);
                this.dateFormatted = this.formatDate(response[0].date.substr(0, 10));
                this.defaultColorValue = response[0].color;
                this.defaultCombinationValue = response[0].combination;
                this.smsObject.to = this.deliveryOrderData.mobileNo
                //  this.$router.go(-1);
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        setDelivaryStepper(param) {
            this.deliveryStepper = param;
        },
        async upload(upload, pictureNumber) {
            const blob = await fetch(upload.local_blob_url).then((r) => r.blob());
            const newfileObj = new File([blob], `${upload.originalName}.jpeg`, {
                type: blob.type,
            });

            let formData = new FormData();
            formData.append("file", newfileObj);

            try {
                let pictureName = `${this.deliveryOrderData.orderid}-${pictureNumber}`
                let result = await this.$axios.$post(
                    `/api/user/upload?orderid=${pictureName}`,
                    formData
                );

                if (result.success) {
                    console.log(`Photo upload was successful. ${this.deliveryOrderData.orderid}`);
                    // this.$router.push({
                    //   path: "/callForHelp",
                    //   query: { orderid: this.deliveryOrderData.orderid },
                    // });

                    const saveData = {
                        date: this.dateFormatted,
                        name: this.deliveryOrderData.name,
                        location: this.deliveryOrderData.location,
                        color: this.defaultColorValue,
                        combination: this.defaultCombinationValue,
                    };

                    let result = await this.$axios.$post(
                        "/api/user/deliveryorderupdate",
                        saveData, {
                            params: {
                                orderid: this.deliveryOrderData.orderid,
                                status: 1,
                            },
                        }
                    );
                } else {
                    console.log("upload failed!!!");
                }
            } catch (err) {
                console.log(err);
            }
        },
        async uploadFiles(messageObject) {
            var counter = 0;

            for (const upload of this.uploads) {
                let uploadResponse = await this.upload(upload, counter);
                messageObject.mediaUrl.push(`https://images.hiretheproz.com/${this.deliveryOrderData.barcode}-${counter}.jpeg`);
                counter = counter + 1;
            }
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
                this.templateMsg = response.body;
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        getMessage(template, infoMap, userObj, userPosition) {
            let result = template;
            try {
                for (let key in infoMap) {
                    if (key === "[lock-combo]") {
                        let key0 = infoMap[key][0];
                        let key1 = infoMap[key][1];
                        result = result.replaceAll(key, `${userObj[key0]}-${userObj[key1]}`);
                    }

                    if (key === "[geo-lat]" && userPosition) {
                        result = result.replaceAll(key, userPosition.lat);
                    }
                    if (key === "[geo-long]" && userPosition) {
                        result = result.replaceAll(key, userPosition.lng);
                    }

                    result = result.replaceAll(key, userObj[infoMap[key]]);
                }
                return result;
            } catch (error) {
                console.log(error)
            }

            return '';
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
