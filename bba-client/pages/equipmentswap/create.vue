<template lang="html">
<Page>
    <!-- Order Search Field -->
    <v-row>
        <v-col> 
            <h2 class="mb-2">Order Lookup</h2>
                           
            <v-text-field v-model="lastname" append-icon="mdi-magnify" label="Search by Last Name" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field> 
            <v-text-field v-model="order_number" append-icon="mdi-magnify" label="Order #" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field>
            
            <v-btn block depressed color="primary" @click="lookup">
                <v-icon left medium color="white">
                    mdi-search
                </v-icon>
                Lookup
            </v-btn>

            <template v-if="typeof(order.id) == 'number'">
                <h2 class="mt-5 mb-2">Swap Order Details</h2>
                <v-select
                label="Reason"
                v-model="reason"
                :items="reasons"
                item-value="id"
                item-text="Name"
                return-object
                variant="solo"
                >
                    <template v-slot:selection="{ item }">
                    {{ item.Name }}
                    </template>
                    <template v-slot:item="{ item }">
                    {{ item.Name }}
                    </template>
            </v-select>
                <h4 class="mt-5">Equipment</h4>

                <v-select  :items="delivaries" v-for="(eq, index) in equipmentlist" 
                v-model="equipment" 
                item-value="id"
                item-text="item" 
                v-bind:key="index" 
                v-key="index"
                multiple
                return-object
                ></v-select>
    

                <!-- <v-btn block depressed color="primary" class="mt-5" @click="addEquipment">
                    <v-icon left medium color="white">
                        mdi-save
                    </v-icon>
                    Add New Equipment
                </v-btn> -->
        

                <v-checkbox  v-model="swap_location" label="Swap at new location"></v-checkbox>
                <v-text-field :disabled="!swap_location" v-model="location" label="New Location" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field>
                
                <v-textarea v-model="notes" label="Notes" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-textarea>
                <!-- <v-checkbox label="Initiate a swap order"></v-checkbox> -->
                <v-btn block depressed color="primary" class="mt-5" @click="save">
                    <v-icon left medium color="white">
                        mdi-save
                    </v-icon>
                    SAVE
                </v-btn>
            </template>
        </v-col>
    </v-row>
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
            reasons: [],
            dialog: false,
            cameraRender: 0,
            breakpoint: 640,
            totalOrderDelivery: 0,
            search: "",
            equipment: [],
            equipmentlist: [1],
            swap_location: "",
            order: {},
            location: "",
            items: [],
            lastname: '',
            order_number: "",
            reason: "",
            notes: "",
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
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
        };
    },
    created() {
        this.getProblems();
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
            return moment(date).add(4, 'hours').format("MM/DD/YYYY hh:mm A");
        },
        async save() { 
            // Does this reference or copy?
            var newOrder = this.order;
            newOrder.swappedReason = this.reason.Name;
            newOrder.PickupNotes = this.note;
            newOrder.swapOrderDeliveryId = this.order.id;

            if(this.swap_location) {
                newOrder.location = this.location;
            }

            await this.$axios.post(`/api/user/deliveryOrder/createEquipmentSwapOrder`, newOrder).then( async order => {
                console.log('order', order.data.id);
                this.equipment.forEach(x=>x.deliveryID = order.data.id);
                await this.$axios.post(`/api/user/deliveryItem/createEquipmentItemsSwapOrder`, this.equipment).then( items => {
                    
                    this.order_number = '';
                    this.order = {};

                    this.showSuccess('Your equipment order has been created.');
                });
            });
        },
        lookup() {
            this.equipmentlist=[1]
            this.delivaries=[];
            this.getDataFromApi();
        },
        addEquipment() {
            this.equipmentlist.push(1)
        },
        onClearClicked() {
            if (this.search !== "" || this.searchByBarcode !== "") {
                this.search = "";
                this.searchByBarcode = "";
            } 
            
            this.swap_location='';
            this.orderid='';
            this.equipmentlist=[1];
            this.delivaries=[];
        },
        async code(value) {
            if(value == '') return;

            this.search = value;
            let orderParam = {
                search: value
            }
            
            let result = await this.$axios.get(`/api/user/deliveryOrder`, {params: orderParam});
            if (result.data.length > 0 ) {
                this.order = result.data[0]
                return result.data[0];
            } else {
                this.showError("The order does not appear to be in the system.");
            }
        },
        async getProblems() {
            let result = await this.$axios.get(`/api/user/problem-types`);
            if (result.data.length > 0 ) {
                this.reasons = result.data;
                return result.data;
            }
        },
        onKeyUp(event) {
            // console.log('key uppppppp ', typeof event.target.value,  `${event.target.value}`.length)
            if (event.key === "Enter") {
                this.getDataFromApi();
            } else if (`${event.target.value}`.length === 0) {
                // if someone clears the input field.
                //this.getDataFromApi();
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
                // let param = this.search ? {
                //         search: this.search,
                //         type: "DeliveryOrders",
                //     } :
                //     this.searchByBarcode ? {
                //         barcodeid: this.searchByBarcode
                //     } : {
                //         type: "DeliveryOrders",
                //     };

                await this.code(this.order_number).then(async order=> {  
                    await this.$axios.get(`/api/user/deliveryItem`, {params: { deliveryID: order.id }}).then( orderDeliveryMockData =>
                    {
                        const {
                            sortBy,
                            sortDesc,
                            page,
                            itemsPerPage
                        } = this.options;

                        let items = orderDeliveryMockData.data;
                        console.log(items);
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
                });


                
            });
        }
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
