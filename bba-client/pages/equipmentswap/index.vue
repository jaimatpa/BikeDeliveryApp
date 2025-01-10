<template lang="html">
<Page>
    <v-btn x-large block depressed color="primary" class="mb-5" @click.stop="dialog = true;cameraRender += 1">
        <v-icon size="50" left medium color="white" class="mr-2">
            mdi-barcode-scan
        </v-icon>
        Scan Barcode
    </v-btn>

    <!-- Order Search Field -->
    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search by Order #, Name, Location" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field>
    
    <v-btn block depressed color="primary" class="mb-5" @click="$router.push({path: `/equipmentswap/create`})" :disabled="newItemAddAllowed">
            <v-icon left medium color="white" class="mr-2">
                mdi-plus
            </v-icon>
            Swap Equipment
        </v-btn>

    <v-data-table :headers="headers" :items="delivaries" :options.sync="options" :server-items-length="totalOrderDelivery" :loading="loading" :search="search" class="elevation-1" :mobile-breakpoint="0" sort-by="date" :sort-desc="false">
        <!-- Date -->
        <template v-slot:item.date="{ item }">
            {{ getDateFormat(item.date) }}
        </template>

        <template v-slot:item.status="{ item }">
           {{ item.status == 1 ? 'Complete' : 'Pending' }}
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
            <v-icon v-show="item.status != 1" medium color="primary" @click.stop="$router.push({path: `/equipmentswap/${item.orderid}`,})">
                mdi-page-next
            </v-icon>

            <v-icon v-show="item.status == 1" medium color="primary" @click.stop="$router.push({path: `/searchHistory/${item.orderid}?type=swap`,})">
                mdi-page-next
            </v-icon>
            <v-icon v-show="item.delivered" medium color="primary" @click.stop="$router.push({path: `/searchHistory/${item.orderid}?type=swap`,})">
                mdi-page-next
            </v-icon>

        </template>
    </v-data-table>

    <v-dialog v-model="dialog" fullscreen>
        <v-card style="background-color: rgba(0, 0, 0, 0.95);">
            <v-card-title class="title primary--text">
                <!-- Scanning Barcode -->
            </v-card-title>

            <v-card-text>
                <BarScanner @code="code" :key="cameraRender" />
                <div class="scan-close-button">
                    <v-btn :block="isMobile" depressed color="primary" class="mb-5" @click.stop="closeScanner">
                        Close
                    </v-btn>
                </div>

            </v-card-text>
        </v-card>
    </v-dialog>
</Page>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import Page from "@/components/paradym/Page";
import BarScanner from "@/components/BarScanner";
import {
    mapActions,
    mapState
} from "vuex";

export default {
    name: "deliveryOrder",
    auth: true,
    head() {
        return {
            title: "Delivery Order",
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
            dialog: false,
            newItemAddAllowed: false,
            cameraRender: 0,
            breakpoint: 640,
            totalOrderDelivery: 0,
            search: "",
            searchByBarcode: "",
            delivaries: [],
            loading: true,
            initialRender: true,
            options: {},
            headers: [{
                    text: "DATE",
                    align: "start",
                    value: "date",
                },
                {
                    text: "NAME",
                    value: "name",
                    sortable: false
                },
                {
                    text: "LOCATION",
                    value: "location",
                    sortable: false
                },
                {
                    text: "ORDER#",
                    value: "orderid",
                    sortable: false
                },
                {
                    text: "COMPLETE",
                    value: "status",
                    sortable: false
                },
                {
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
        };
    },
    created() {
        this.getDataFromApi();
        this.initialRender = false;
    },
    watch: {
        search: function (newValue) {
            this.getDataFromApi();
        },
        searchByBarcode: function (newValue) {
            this.getDataFromApi();
        },
        options: {
            handler() {
                // console.log('watch this.options: ', this.options)
                if (this.initialRender === false) {
                    this.getDataFromApi();
                }
            },
            deep: true,
        },
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        getDateFormat(date) {
            return moment(date)
                // .add(4, 'hours')
                .format("MM/DD/YYYY");
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
            this.search = value;
            let orderParam = {
                orderid: value
            }
            let result = await this.$axios.get(`/api/user/getOrder`, {params: orderParam});
            console.log(result);
            if (result.data == '1') {
                this.$router.push(`/deliveryOrder/${value}`);
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
                        type: "EquipmentSwap",
                    } :
                    this.searchByBarcode ? {
                        barcodeid: this.searchByBarcode
                    } : {
                        type: "EquipmentSwap",
                    };

                const orderDeliveryMockData = await this.$axios.$get(
                    "/api/user/deliveryOrder", {
                        params: param,
                    }
                );

                const {
                    sortBy,
                    sortDesc,
                    page,
                    itemsPerPage
                } = this.options;

                let items = orderDeliveryMockData;
                let total = orderDeliveryMockData?.length;

                if (orderDeliveryMockData?.length === 1) this.dialog = false;

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
            if(mediaStream === null) return;

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
.order-search-text-field {
    .v-label {
        font-size: 14px !important;
        color: #b5b5b5 !important;
    }
}

.custom-delivery-bar-scanner {
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
