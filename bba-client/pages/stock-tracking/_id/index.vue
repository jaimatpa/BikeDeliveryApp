<template>  
    <section class="pa-5 mt-3">
 
        <v-row>
            <v-col col="12">
                <h3 class="mt-3 mb-3">Edit Equipment Types</h3>
                <v-card>
                    
                    <v-card-text class="my-5">
                        <v-row>
                            <v-col col="6">
                                <label for="Label">Label</label>
                                <v-text-field label="Label" v-model="equipmentType.Label" single-line autofocus></v-text-field>
                            </v-col>
                            <v-col col="6">
                                <label>Barcode Prefix</label>
                                <v-text-field label="Barcode Prefix" v-model="equipmentType.BarcodePrefix" single-line autofocus></v-text-field>
                                <label>Seperate multiple barcodes with commas.</label>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col col="6">
                                <label>Capacity Consumption</label>
                                <v-text-field label="Capacity Consumption" v-model="equipmentType.CapacityConsumption" single-line autofocus></v-text-field>
                            </v-col>
                            <v-col col="6">
                                <label>Product Line ID</label>
                                <v-text-field label="Product Line ID" v-model="equipmentType.ProductLineId" single-line autofocus></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col col="6">
                                <label>Stock Quantity</label>
                                <v-text-field label="Stock Quantity" v-model="equipmentType.qty" single-line autofocus></v-text-field>
                            </v-col>
                            <v-col col="6">
                                <label>Quantity Available</label>
                                <v-text-field label="Quantity Available" v-model="equipmentType.qtyAvailable" readonly single-line autofocus></v-text-field>
                            </v-col>            
                        </v-row>
                        <v-row>
                            <v-col class="text-right">
                                <v-btn :value="false" class="primary" @click.end="saveData">
                                    <span class="hidden-sm-and-down">Save</span>
                                    <v-icon right>
                                    mdi-floppy
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                

                <h3 class="mt-3 mb-3">Equipment Orders</h3>
                <v-data-table :headers="headers2" :items="items2"  item-value="key" class="elevation-1">
                     <!-- Show Custom isActive Column -->
                     <template v-slot:[`item.isActive`]="{ item }">
                        <v-chip v-if="item.isActive" color="primary" dark>
                            Yes
                        </v-chip>
                        <v-chip v-else color="error" dark>
                            No
                        </v-chip>
                    </template>

                    <!-- Show Custom CreatedAt Column -->
                    <template v-slot:[`item.pickup_date`]="{ item }">
                       Test {{ new Date(item.pickup_date).toUTCString() }}
                    </template>

                </v-data-table>

            </v-col>
        </v-row>
    </section>
</template>

<script>
// import PageResource from "@/components/paradym/PageResource";
import moment from "moment";
import {
    mapActions,
    mapState
} from "vuex";


export default {
    name: "Stock-Tracking",
    auth: true,
    head() {
        return {
            title: "Stock Tracking"
        };
    },
    components: {
        // PageResource
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    async mounted() {
        
        this.getEquipmentList().then(() =>
        {
            console.log(this.equipmentType.BarcodePrefix);
            this.getOrderEquipment();
        });
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        async saveData() {

            var data = {
                ...this.equipmentType,
                "itemID":this.equipmentType.id, 
                }

            let result = await this.$axios.put(`/api/user/equipment-types/${this.equipmentType.id}`, 
                data
            ).then( () => {
                this.showSuccess('The equipment type has been saved.');
            }).catch(() => {
                this.showError("There was an error saving the equipment type.")
            });
        }, 
        async getOrderEquipment() {
            // Draw the list of orders that belong to the equipment type.
            var barcodePrefix = this.equipmentType.BarcodePrefix.split('-');
            var prefix = `${barcodePrefix[0]}-${barcodePrefix[1]}-`;

            await this.$axios.$get(`/api/user/trips/checkOrderStock`).then( stock => {
                const filteredStock = stock.orders.filter( x=> x.barcode == prefix );
            
                this.items2 = filteredStock;
            });
        },
        async getEquipmentList() {
            // This displays the current requested data
            await this.$axios.get('/api/user/equipment-types/')
            .then( response => {
                this.items = response.data; 
                
                var filteredEquipment =  this.items.filter(x=>x.id == this.$route.params.id);

                this.equipmentType = filteredEquipment[0];

            }); 
        }
    },
    data() {
        return {
            _id: 0,
            pageCount: 25,
            breakpoint: 640,
            equipmentType: {},
            headers: [
                {
                    text: "Label", 
                    align: "start",
                    value: "Label",
                },
                {
                    text: "Barcode Prefix",
                    align: "start",
                    value: "BarcodePrefix",
                },
                {
                    text: "Capacity Consumption",
                    align: "start",
                    value: "CapacityConsumption",
                },
                {
                    text: "Product Line",
                    align: "start",
                    value: "ProductLineId",
                },
                {
                    text: "Quantity",
                    align: "start",
                    value: "qty",
                },
                // {
                //     text: "Qty Available",
                //     align: "start",
                //     value: "qtyAvailable",
                // },                
                {
                    text:"Actions",
                    align: "start",
                    value: "actions",
                },
            ],
            headers2: [
                {
                    text: "Order #",
                    align: "start",
                    value: "orderId",
                },
                {
                    text: "Equipment",
                    align: "start",
                    value: "Label",
                },
                {
                    text: "Barcode",
                    align: "start",
                    value: "SerialBarcode",
                },
                {
                    text: "Pickup Date",
                    align: "start",
                    value: "pickup_date",
                },
                // {
                //     text: "Qty Available",
                //     align: "start",
                //     value: "qtyAvailable",
                // },                
            ],
            items: [],
            items2: [],
            fields: {
                Label: {
                    type: String,
                    required: true,
                    value: 'hey',
                },
                BarcodePrefix: {
                    type: String,
                    required: true
                },
                CapacityConsumption: {
                    type: Number,
                    required: true
                },
                ProductLineId: {
                    type: String,
                    required: true
                },
                qty: {
                    type: Number,
                    defaultValue: 0,
                    required: true
                },
                qtyAvailable: {
                    type: Number,
                    defaultValue: 0,
                    required: true
                },
            },
        };
    },
};
</script>
