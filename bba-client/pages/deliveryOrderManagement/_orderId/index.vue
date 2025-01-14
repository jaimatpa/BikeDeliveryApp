<template lang="html">
<Page :title="!isMobile ? 'Delivery Order Details' : ''">
    <v-container dense>
        <v-row dense>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-text-field v-model="deliveryOrderData.orderid" label="ORDER #" placeholder="Order" dense outlined>
                </v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="dateFormatted" label="Date" append-icon="mdi-calendar" clearable show-adjacent-months readonly v-bind="attrs" @blur="date = parseDate(dateFormatted)" v-on="on" outlined dense></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-text-field v-model="deliveryOrderData.name" label="NAME" placeholder="Name" dense outlined>
                </v-text-field>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-text-field v-model="deliveryOrderData.location" label="LOCATION" placeholder="Location" dense outlined>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-text-field v-model="deliveryOrderData.mobileNo" label="MOBILE #" placeholder="Mobile Phone" dense outlined>
                </v-text-field>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-text-field v-model="deliveryOrderData.email" label="EMAIL" placeholder="Email Address" dense outlined>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-select :items="colorItems" v-model="defaultColorValue" label="Color" dense outlined></v-select>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-text-field v-model="defaultCombinationValue" label="COMBINATION" placeholder="Combination" dense outlined>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row dense cols="12" xs="12" sm="12" md="12" xl="12">
            <v-textarea v-model="deliveryOrderData.note" class="mlr-1" label="NOTES" placeholder="NOTES" dense outlined>
            </v-textarea>
        </v-row>
        <v-row dense>
            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
                <v-btn block depressed color="primary" @click="saveDeliveryOrder()">
                    SAVE
                </v-btn>
            </v-col>
        </v-row>

<!--        <v-row>-->
<!--          <pre>-->
<!--            {{ JSON.stringify(defaultColorValue, undefined, 4) }}-->
<!--          </pre>-->
<!--        </v-row>-->

    </v-container>
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
            search: "",
            searchByBarcode: "",
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
            const data = _.find(this.lockingData, (o) => o.color === newVal);
            this.defaultCombinationValue = data && data.combination;
        },
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        async saveDeliveryOrder() {
            this.deliveryOrderData.date = this.date
            this.deliveryOrderData.color = this.defaultColorValue; // THIS was added by Justin
            this.deliveryOrderData.combination = this.defaultCombinationValue; // THIS was added by Justin
            // this.deliveryOrderData.lock = ""; // THIS was added by Justin
            if (this.deliveryOrderData) {
              console.log(this.deliveryOrderData);
                if (this.deliveryOrderData.id) {
                    console.log("IN EXISTING");
                    let response = await this.$axios.$put("/api/user/deliveryOrderManagement/", this.deliveryOrderData);
                  this.$router.push('/locking/');
                } else {
                    console.log("IN NEW");
                    let response = await this.$axios.$post("/api/user/deliveryOrderManagement/", this.deliveryOrderData);
                  this.$router.push('/locking/');
                }
            }

        },
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
        async getOrderDetails() {
            if (this.$route.params.orderId === "0") {
                this.deliveryOrderData = 
                {
                    id: 0,
                    date: null,
                    name: null,
                    location: null,
                    orderid: null,
                    mobileNo: null,
                    color: null,
                    combination: null,
                    email: null,
                    note: null,
                };
            } else {
                try {
                let response = await this.$axios.$get("/api/user/deliveryOrder", {
                    params: {
                        search: this.$route.params.orderId,
                    },
                });
                this.deliveryOrderData = response[0];

                // console.log("TESTING CAPTURED IMAGES", ThirdStepper.capturedImages);
                console.log("TESTING CAPTURED IMAGES BEFORE", this.$refs.thirdStep.local_files_to_upload);
                this.$refs.thirdStep.local_files_to_upload = [];
                // ThirdStepper.local_files_to_upload = [];
                console.log("TESTING CAPTURED IMAGES AFTER", this.$refs.thirdStep.local_files_to_upload);

                ThirdStepper.capturedImages = [];
                // this.$emit("captured-camera-images", ThirdStepper.capturedImages);

                this.date = response[0].date.substr(0, 10);
                this.dateFormatted = this.formatDate(response[0].date.substr(0, 10));
                this.defaultColorValue = response[0].color;
                this.defaultCombinationValue = response[0].combination;
                this.smsObject.to = this.deliveryOrderData.mobileNo
                //  this.$router.go(-1);
            } catch (err) {
                console.log("errror", err.response);
            }
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
                        orderid: this.deliveryOrderData.orderid,
                        status: 1,
                    };

                    let result = await this.$axios.$post(
                        "/api/user/deliveryorderupdate",
                        saveData
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
                messageObject.mediaUrl.push(`https://images.bodhisys.io/${this.deliveryOrderData.barcode}-${counter}.jpeg`);
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
