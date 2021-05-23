<template lang="html">
<Page>
    <!-- Lock Scan Button  -->
    <v-btn @click.stop="dialog = true;cameraRender += 1" block depressed color="primary" class="mb-5">
        <v-icon left medium color="white" class="mr-2">
            mdi-barcode-scan
        </v-icon>
        Scan Barcode
    </v-btn>

    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search by Order #, Name, Location" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field>

    <v-data-table :headers="headers" :items="delivaries" :options.sync="options" :server-items-length="totalOrderDelivery" :loading="loading" :search="search" class="elevation-1" :mobile-breakpoint="0">
        <!-- Date -->
        <template v-slot:item.date="{ item }">
            {{ getDateFormat(item.date) }}
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
            <v-icon medium color="primary" @click.stop="
            $router.push({
              path: `/locking/${item.orderid}`,
            })
          ">
                mdi-page-next
            </v-icon>
        </template>
    </v-data-table>
    <v-dialog v-model="dialog" fullscreen>
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
</Page>
</template>

<script>
import _ from "lodash";
import { mapActions } from "vuex";

import Page from "@/components/paradym/Page";
import BarScanner from "@/components/BarScanner";
import moment from "moment";
export default {
    name: "lock",
    auth: true,
    head() {
        return {
            title: "Lock",
        };
    },
    components: {
        Page,
        BarScanner
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            breakpoint: 640,
            totalOrderDelivery: 0,
            showQrScanner: false,
            decodedResult: "",
            search: "",
            delivaries: [],
            lockingData: [],
            loading: true,
            initialRender: true,
            options: {},
            selectColor: "",
            colors: [],
            headers: [{
                    text: "DATE",
                    align: "start",
                    value: "date",
                },
                {
                    text: "NAME",
                    value: "name"
                },
                {
                    text: "COLOR",
                    value: "color"
                },
                {
                    text: "LOCATION",
                    value: "location"
                },
                {
                    text: "ORDER#",
                    value: "orderid"
                },
                {
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
            searchByBarcode: "",
            dialog: false,
            cameraRender: 0,
        };
    },
    created() {
        this.getDataFromApi();
        this.initialRender = false;
        this.getColors();
        this.getLockingDetails();
    },
    watch: {
        selectColor: function (newValue) {
            this.getDataFromApi();
        },
        options: {
            handler() {
                this.getDataFromApi();
            },
            deep: true,
        },
    },
    methods: {
        getDateFormat(date) {
            return moment(date).add(4, 'hours').format("MM/DD/YYYY hh:mm A");
        },
        delivarieselectValueColor(color) {
            return {
                width: "20px",
                height: "20px",
                "background-color": color,
            };
        },
        async getLockingDetails() {
            const lockingDataResponse = await this.$axios.$get("/api/user/locking");
            this.lockingData = lockingDataResponse;
            console.log(this.lockingData);
            this.colors = this.lockingData.filter(fil => fil.color != null).map(x => x.color);
        },
        onDecode(decodedString) {
            console.log("decodedString", decodedString);
            if (decodedString) {
                this.decodedResult = decodedString;
                this.search = decodedString;
                this.showQrScanner = false;
            }
        },
        onClearClicked() {
            if (this.search !== "" || this.searchByBarcode !== "") {
                this.search = "";
                this.searchByBarcode = "";
            }
            this.getDataFromApi();
        },
        async code(value) {

            this.closeScanner();
            var stringWithoutDash = value.substring(1);
            this.search = stringWithoutDash;
            let orderParam = {
                orderid: stringWithoutDash
            }
            let result = await this.$axios.get(`/api/user/getOrder`, {
                params: orderParam
            });
            console.log(result);
            if (result.data == '1') {
                this.$router.push(`/locking/${stringWithoutDash}`);
            } else {
                this.showError("The scanned order does not appear to be in the system.");
            }

        },

        onKeyUp(event) {
            // console.log('key uppppppp ', typeof event.target.value,  `${event.target.value}`.length)
            if (event.key === "Enter") {
                this.getDataFromApi();
            } else if (`${event.target.value}`.length === 0) {
                // if someone clears the input field.
                this.getDataFromApi();
            }
        },
        async getColors() {
            console.log("In Color");
            const orderData = await this.$axios.$get("/api/user/deliveryOrder");
            console.log(orderData);
            // this.colors = orderData.filter(fil => fil.color != null).map(x => x.color);
            // this.colors = orderData.length ? _.map(orderData, "color") : [];
        },
        async getDataFromApi() {
            this.loading = true;
            this.apiCall().then((data) => {
                this.delivaries = data.items;
                this.totalOrderDelivery = data.total;
                this.loading = false;
            });
        },
        apiCall() {
            return new Promise(async (resolve, reject) => {
                let param = this.search ? {
                        search: this.search,
                        type: "Locking",
                    } :
                    this.searchByBarcode ? {
                        barcodeid: this.searchByBarcode
                    } : {
                        type: "Locking",
                    };

                const {
                    sortBy,
                    sortDesc,
                    page,
                    itemsPerPage
                } = this.options;

                const orderDeliveryMockData = await this.$axios.$get(
                    "/api/user/deliveryOrder", {
                        params: param
                    }
                );

                let items = orderDeliveryMockData;
                let total = orderDeliveryMockData?.length;

                if (sortBy?.length === 1 && sortDesc?.length === 1) {
                    items = items.sort((a, b) => {
                        const sortA = a[sortBy[0]];
                        const sortB = b[sortBy[0]];

                        if (sortDesc[0]) {
                            if (sortA < sortB) return 1;
                            if (sortA > sortB) return -1;
                            return 0;
                        } else {
                            if (sortA < sortB) return -1;
                            if (sortA > sortB) return 1;
                            return 0;
                        }
                    });
                }

                if (itemsPerPage > 0) {
                    items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
                }

                setTimeout(() => {
                    resolve({
                        items,
                        total,
                    });
                }, 1000);
            });
        },
        closeScanner() {
            this.dialog = false;

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
    },
};
</script>

<style lang="scss">
.custom-locking-bar-scanner {
  height: 100%;
  background-color: hsla(0, 0%, 13%, 0.95);
  padding: 0 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  .scan-container {
    padding: 0 !important;

    .scanner-container {
      .overlay-element {
        border: 0.1rem solid rgba(75, 152, 42, 0.2);
      }

      .overlay-element::before,
      .overlay-element::after {
        content: "";
        display: block;
        position: absolute;
        width: 10vw;
        height: 10vw;

        border: 0.2rem solid transparent;

        bottom: 0;
        border-bottom-color: #4c9a2a;
      }

      .overlay-element::before {
        left: 0;
        border-left-color: #4c9a2a;
      }

      .overlay-element::after {
        right: 0;
        border-right-color: #4c9a2a;
      }
    }

    .scanner-container::after,
    .scanner-container::before {
      content: "";
      display: block;
      position: absolute;
      width: 10vw;
      height: 10vw;

      border: 0.2rem solid transparent;

      top: 0;
      border-top-color: #4c9a2a;
    }

    .scanner-container::after {
      right: 0;
      border-right-color: #4c9a2a;
    }
    .scanner-container::before {
      left: 0;
      border-left-color: #4c9a2a;
    }
  }

  .scan-close-button {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    padding: 10px 20px;
  }
}
</style>
