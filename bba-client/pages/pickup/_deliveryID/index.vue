<template lang="html">
<Page :title="!isMobile ? 'Pickup - Order Details' : ''">
    <v-stepper v-model="deliveryStepper">
        <v-stepper-items>
            <v-stepper-content step="1">
                <div class="d-flex flex-column justify-space-between" style="height: 100%">
                    <div class="mt-1">
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="orderData.orderid" label="ORDER #" placeholder="Order" readonly disabled dense outlined>
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
                                <v-text-field v-model="orderData.name" label="NAME" placeholder="Name" disabled readonly dense outlined>
                                </v-text-field>
                            </v-col>

                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="orderData.location" label="LOCATION" placeholder="Location" disabled readonly dense outlined>
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

                        <v-row cols="12">
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-0.jpeg`" onload="this.style='display: block;'" style="display:none"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-1.jpeg` "onload="this.style='display: block;'" style="display:none"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-2.jpeg`" onload="this.style='display: block;'" style="display:none"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-3.jpeg`" onload="this.style='display: block;'" style="display:none"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-4.jpeg`" onload="this.style='display: block;'" style="display:none"></img>
                            </v-col>
                        </v-row>
                    </div>
                    <div>
                        <!-- First Stepper Button -->
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
                                <v-btn block depressed color="primary" @click.stop="deliveryStepper = 2">
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
            <v-stepper-content step="2">
                <PhotoCaptureComp ref="thirdStep" @set-delivery-stepper="setDelivaryStepper" :deliveryOrderData="orderData" :userPosition="userPosition" />
            </v-stepper-content>
            <v-stepper-content step="3">
                <div class="d-flex flex-column justify-space-between ma-1" style="height: 100%">
                    <div>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="orderData.date" label="DATE" placeholder="Date" filled readonly dense outlined>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="orderData.name" label="NAME" placeholder="Name" readonly filled dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="orderData.location" label="LOCATION" placeholder="Location" readonly dense filled outlined>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="orderData.orderid" label="ORDER #" placeholder="Order#" readonly filled dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-btn color="primary" x-large block @click.stop="scanDialogVisible = true;cameraRender += 1">Scan Barcode</v-btn>

                        <v-data-table width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="headers" :items="equipment" item-key="name" class="elevation-6 ma-1 mb-2">
                            <template v-slot:[`item.checkpickup`]="{ item }">
                                <v-simple-checkbox v-model="item.checkPickup" v-ripple @input="saveUpdate(item)">

                                </v-simple-checkbox>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon size="50" medium color="primary" @click.stop="currentItem=item;scanDialogVisible = true;cameraRender += 1">
                                    mdi-barcode
                                </v-icon>
                            </template>
                        </v-data-table>

                        <v-data-table width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="headersextras" :items="extras" item-key="name" class="elevation-6 ma-1 mb-2">
                        </v-data-table>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
                                <v-checkbox label="Unable to pickup all extra items." v-model="unableToDeliverItems" v-ripple></v-checkbox>
                                <v-textarea label="Reason why you can't pickup all extra items"
                                        :disabled="!unableToDeliverItems"
                                        :v-show="unableToDeliverItems"
                                        visible
                                         hide-details
                                            ></v-textarea>
                            </v-col>
                            
                        </v-row>


                        <!-- <v-row cols="12">
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-pickup-0.jpeg`"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-pickup-1.jpeg`"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-pickup-2.jpeg`"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-pickup-3.jpeg`"></img>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                                <img :src="`https://images.hiretheproz.com/${orderData.barcode}-pickup-4.jpeg`"></img>
                            </v-col>
                        </v-row> -->

                        <v-row v-if="uploadFilesData.length">
                            <v-col v-for="(image, i) in uploadFilesData" :key="i" class="d-flex child-flex" cols="4">
                                <v-img :src="image.filepath" :lazy-src="image.filepath" aspect-ratio="1" class="grey lighten-2">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-btn block depressed color="error" class="mt-5" @click.stop="deliveryStepper = 2">
                                    <v-icon left medium color="white">
                                        mdi-keyboard-backspace
                                    </v-icon>
                                    BACK
                                </v-btn>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-btn block depressed color="primary" class="mt-5" @click="save">
                                    <v-icon left medium color="white">
                                        mdi-save
                                    </v-icon>
                                    SAVE
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-stepper-content>

            <v-dialog v-model="scanDialogVisible" fullscreen>
                <v-card>
                    <v-card-title class="title primary--text">
                        <!-- Scanning Barcode -->
                    </v-card-title>

                    <v-card-text>
                        <BarScanner @code="code" :key="cameraRender" />
                        <v-btn :block="isMobile" depressed color="primary" class="mb-5" @click.stop="closeScanner">
                            Close
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-stepper-items>
    </v-stepper>
</Page>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import {
    mapState,
    mapActions,
    mapMutations
} from "vuex";

import Page from "@/components/paradym/Page";
import BarScanner from "@/components/BarScanner";
import PhotoCaptureComp from "../../../components/PhotoCaptureComp";

export default {
    name: "mainPickup",
    auth: true,
    head() {
        return {
            title: "Pick Up Details",
        };
    },
    components: {
        Page,
        BarScanner,
        PhotoCaptureComp
    },
    watch: {
        options: {
            handler() {
                this.getDataFromApi();
            },
            deep: true,
        },
        date(val) {
            this.dateFormatted = this.formatDate(this.date);
        },
        defaultColorValue(newVal, oldVal) {
            if (oldVal) {
                const data = _.find(this.lockingData, (o) => o.color === newVal);
                this.defaultCombinationValue = data && data.combination;
            }
        },
        capturedImagesFromVuex: {
            deep: true,
            immediate: true,
            handler: function (newVal, oldVal) {
                if (newVal !== undefined && newVal.length > 0) {
                    this.clickedImage = {
                        ...newVal[0],
                        array_index: 0
                    };
                    // this.$emit('uploadFiles', this.clickedImage)
                } else {
                    this.clickedImage = {};
                }
                console.log(newVal);
                console.log("Hellooooo 2");
                this.setUploadFiles(newVal);
            },
        },
    },
    async created() {
        await this.getOrderDetails();
        await this.getOrderItems();
        await this.getOrderExtras();
        await this.getLockingDetails();
    },
    computed: {
        ...mapState({
            capturedImagesFromVuex: (state) => state.capturedImages,
        }),
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            breakpoint: 640,
            searchHistoryDialog: false,
            scanDialogVisible: false,
            unableToDeliverItems: false,
            cameraRender: 0,
            currentItem: {},
            orderData: {},
            pickedUp: [],
            selected: [],
            userPosition: {},
            date: null,
            dateFormatted: null,
            defaultCombinationValue: "",
            defaultColorValue: "",
            menu1: false,
            deliveryStepper: 1,
            colorItems: [],
            headers: [{
                    text: "ITEM",
                    align: "start",
                    value: "item",
                },
                {
                    text: "BARCODE",
                    value: "serialbarcode",
                },
                {
                    text: "PICKED UP",
                    value: "checkpickup",
                }
            ],
            headersextras: [{
                    text: "Name",
                    align: "start",
                    value: "extraName",
                }
            ],
            extras: [],
            equipment: [],
            smsObject: {
                to: "",
                message: "",
                orderid: '',
                mediaUrl: [],
            },
            templateMsg: "",
            editNumber: false,
            rules: {
                required: (value) => !!value || "Required.",
            },
            loader: false,
            uploadFilesData: [],
        };
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        ...mapMutations(["SET_CAPTURED_IMAGES_IN_VUEX"]),
        async scanDialog(item) {},
        async saveUpdate(item) {
            console.log(item);
            let response = await this.$axios.$put("/api/user/deliveryItem", item);
            console.log("RESPONSE", response);
        },
        async code(value) {
            this.scanDialogVisible = false;
            let foundEquipment = this.equipment.filter(e => e['serialbarcode'] === value);
            console.log("FOUND STUFF", foundEquipment);
            if (foundEquipment.length > 0) {
                var index = this.equipment.findIndex(item => item.serialbarcode === value);
                this.equipment[index].checkPickup = true;
                this.saveUpdate(this.equipment[index]);
            } else {
                console.log("DIDN'T FIND IT");
            }
        },
        async getLockingDetails() {
            const lockingDataResponse = await this.$axios.$get("/api/user/locking");
            this.lockingData = lockingDataResponse;
            console.log(lockingDataResponse);
            this.colorItems = _.map(lockingDataResponse, "color");
        },
        async updateOrderDetails() {
            var data = {
                id: this.orderData.id,
                orderid: this.orderData.orderid,
                unableToDeliverItems: this.orderData.unableToDeliverItems,
                reason: this.orderData.pickupNotes
            };
            
            console.log(data);

            await this.$axios.$post(
              "/api/user/deliveryorderupdate", data).then(  response => {
                this.showSuccess('The order have been marked as picked up.');
            });
            
            this.$router.push("/pickup");
        },
        async save() {
            this.uploads = this.$refs.thirdStep.local_files_to_upload
            this.uploadFiles(this.uploads);
            this.updateOrderDetails();
        },
        closeScanner() {
            this.scanDialogVisible = false;

            const video = document.querySelector("video");

            // A video's MediaStream object is available through its srcObject attribute
            const mediaStream = video.srcObject;

            // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
            const tracks = mediaStream.getTracks();

            // Tracks are returned as an array, so if you know you only have one, you can stop it with:
            // tracks[0].stop();

            // Or stop all like so:
            tracks.forEach((track) => track.stop());

        },
        async getOrderDetails() {
            try {
                let response = await this.$axios.$get("/api/user/searchhistory", {
                    params: {
                        search: this.$route.params.deliveryID,
                    },
                });
                console.log("respones", response);
                const responseData = _.omit(response[0], "date");
                this.orderData = responseData;
                this.orderData.date = moment(response[0].date).format(
                    "MM/DD/YYYY hh:mm A"
                );
                this.date = response[0].date.substr(0, 10);
                this.dateFormatted = this.formatDate(response[0].date.substr(0, 10));
                this.defaultColorValue = response[0].color;
                console.log("D", this.defaultColorValue);
                this.defaultCombinationValue = response[0].combination;

                //  this.$router.go(-1);
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        setDelivaryStepper(param) {
            this.deliveryStepper = param;
        },
        async getOrderItems() {
            try {
                let response = await this.$axios.$get("/api/user/deliveryItem", {
                    params: {
                        deliveryID: this.orderData.id,
                    },
                });

                this.equipment = response;
                console.log("EQUIPMENT", this.equipment);

                //  this.$router.go(-1);
            } catch (err) {
                console.log("Issue in getOrderItems 2", err.response);
            }
        },
        async getOrderExtras() {
            try {
                let response = await this.$axios.$get("/api/user/deliveryItem/extras", {
                    params: {
                        deliveryID: this.orderData.id,
                    },
                });

                this.extras = response;
                console.log("Extras", this.extras);

                //  this.$router.go(-1);
            } catch (err) {
                console.log("Issue in getOrderItems 3", err.response);
            }
        },
        async getMsgTemplate() {
            try {
                let response = await this.$axios.$get("api/user/template");
                this.templateMsg = response.body;
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        async uploadFiles(messageObject) {
            var counter = 0;
            for (const upload of this.uploads) {
                console.log("COUNTER", counter);
                let uploadResponse = await this.upload(upload, counter);
                counter = counter + 1;
            }
        },
        async upload(upload, pictureNumber) {
            const blob = await fetch(upload.local_blob_url).then((r) => r.blob());
            const newfileObj = new File([blob], `/pickup/${upload.originalName}.jpeg`, {
                type: blob.type,
            });

            let formData = new FormData();
            formData.append("file", newfileObj);

            try {
                let pictureName = `/pickup/${this.orderData.orderid}-${pictureNumber}`
                let result = await this.$axios.$post(
                    `/api/user/upload?orderid=${pictureName}`,
                    formData
                );

                if (result.success) {
                    console.log(`Photo upload was successful. ${this.orderData.orderid}`);
                    // this.$router.push({
                    //   path: "/callForHelp",
                    //   query: { orderid: this.deliveryOrderData.orderid },
                    // });

                    // const saveData = {
                    //     date: this.dateFormatted,
                    //     name: this.orderData.name,
                    //     location: this.orderData.location,
                    //     color: this.defaultColorValue,
                    //     combination: this.defaultCombinationValue,
                    // };

                    // let result = await this.$axios.$post(
                    //     "/api/user/deliveryorderupdate",
                    //     saveData, {
                    //         params: {
                    //             orderid: this.orderData.orderid,
                    //             status: 1,
                    //         },
                    //     }
                    // );
                } else {
                    console.log("upload failed!!!");
                }
            } catch (err) {
                console.log(err);
            }
        },
        async setUploadFiles(uploads) {
            this.uploads = uploads;
        },
        formatDate(date) {
            if (!date) return null;

            const [year, month, day] = date.split("-");
            return `${month}/${day}/${year}`;
        },
        getMessage(template, infoMap, userObj, userPosition) {
            let result = template;
            console.log(template, infoMap, userObj);
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
                console.log("RETURNING RESULT", result);
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
.search-history-dialog {
    box-shadow: none !important;

    .sure-title {
        font-size: 1rem !important;
        line-height: 1.2rem !important;
    }
}
</style>
