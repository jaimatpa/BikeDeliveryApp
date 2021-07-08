<template lang="html">
<Page :title="isMobile ? 'Equipment Swap' : 'Equipment Swap'">
    <h2 class="primary--text">Order Information</h2>
    <hr class="mb-4">
    </hr>
    <div class="d-flex flex-column justify-space-between" style="height: 100%">
        <div class="mt-1">
            <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field v-model="deliveryOrderData.orderid" label="ORDER #" placeholder="Order" readonly dense outlined>
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
            <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field v-model="deliveryOrderData.name" label="NAME" placeholder="Name" readonly dense outlined>
                    </v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field v-model="deliveryOrderData.location" label="LOCATION" placeholder="Location" readonly dense outlined>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row cols="12" xs="12" sm="12" md="12" xl="12">
                <v-textarea v-model="deliveryOrderData.note" class="ml-3 mr-3" clearable auto-grow rows="1" label="NOTES" placeholder="NOTES" dense outlined>
                </v-textarea>
            </v-row>
            <h2 class="primary--text">Item Information</h2>
            <hr class="mb-4">
            </hr>
            <v-data-table width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="headers" :items="equipment" item-key="name" class="elevation-6 ma-1 mb-2">
                <template v-slot:[`item.checkedDelievery`]="{ item }">
                    <v-simple-checkbox v-model="item.checkPickup" v-ripple @input="saveUpdate(item)">

                    </v-simple-checkbox>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon size="50" medium color="primary" @click.stop="currentItem=item;scanDialogVisible = true;cameraRender += 1">
                        mdi-barcode
                    </v-icon>
                </template>
            </v-data-table>
        </div>
    </div>
    <v-dialog v-model="scanDialogVisible" fullscreen>
        <v-card>
            <v-card-title class="title primary--text">
                <!-- Scanning Barcode -->
            </v-card-title>

            <v-card-text>
                <BarScanner @code="code" :key="cameraRender" />
                <v-btn depressed color="primary" class="mb-5" @click.stop="closeScanner">
                    Close
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
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
    },
    async created() {
        await this.getOrderDetails();
        await this.getOrderItems();
    },
    data() {
        return {
            breakpoint: 640,
            deliveryOrderData: {},
            scanDialogVisible: false,
            currentItem: {},
            cameraRender: 0,
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
                    text: "DELIVERED",
                    value: "checkedDelievery",
                },
                {
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
            equipment: [],
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
        async getOrderItems() {
            try {
                let response = await this.$axios.$get("/api/user/deliveryItem", {
                    params: {
                        deliveryID: this.deliveryOrderData.id,
                    },
                });
                this.equipment = response;

                //  this.$router.go(-1);
            } catch (err) {
                console.log("Issue in getOrderItems", err.response);
            }
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
        async code(value) {
            console.log("CURRENTITEM", this.currentItem);
            this.currentItem.serialbarcode = value;
            this.saveUpdate(this.currentItem);
        },
        async saveUpdate(item) {
            console.log("ITEM", item);
            let response = await this.$axios.$put("/api/user/deliveryItem", item);
            console.log("RESPONSE", response);
            this.closeScanner();
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
        async getOrderDetails() {
            try {
                let response = await this.$axios.$get("/api/user/deliveryOrder", {
                    params: {
                        search: this.$route.params.id,
                    },
                });
                this.deliveryOrderData = response[0];

                this.date = response[0].date.substr(0, 10);
                this.dateFormatted = this.formatDate(response[0].date.substr(0, 10));
                this.defaultColorValue = response[0].color;
                this.defaultCombinationValue = response[0].combination;
                this.smsObject.to = this.deliveryOrderData.mobileNo
            } catch (err) {
                console.log("ERROR IN: Get Order Details", err.response);
            }
        },
        setDelivaryStepper(param) {
            this.deliveryStepper = param;
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
