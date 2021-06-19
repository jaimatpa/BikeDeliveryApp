<template>
<Page>
    <v-container>
        <v-btn block depressed color="primary" class="mb-5">
            <v-icon left medium color="white" class="mr-2">mdi-barcode-scan</v-icon>
            Scan Barcode
        </v-btn>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search by Order #, Name, Location" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field>
    </v-container>
    <v-data-table :headers="headers" :items="deliveries" :options.sync="options" :server-items-length="totalOrderDelivery" :loading="loading" :search="search" class="elevation-1 ml-3 mr-3" :mobile-breakpoint="0" sort-by="date" :sort-desc="false">
        <!-- Date -->
        <template v-slot:[`item.date`]="{ item }">
            {{ getDateFormat(item.date) }}
        </template>

        <!-- Actions -->
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon medium color="primary" @click.stop="$router.push({path: `/deliveryOrder/${item.orderid}`,})">
                mdi-page-next
            </v-icon>
        </template>
    </v-data-table>
</Page>
</template>

<script>
import Page from '../../components/paradym/Page'
import TruckBlock from '../../components/logistics/TruckBlock.vue'
export default {
    components: {
        Page,
        TruckBlock
    },
    data() {
        return {
            headers: [{
                    text: "DATE",
                    align: "start",
                    value: "date",
                },
                {
                    text: "NAME",
                    value: "name",
                },
                {
                    text: "LOCATION",
                    value: "location",
                },
                {
                    text: "ORDER#",
                    value: "orderid",
                },
                {
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
            deliveries: [],
            search: "",
            searchByBarcode: "",
            loading: false,
            totalOrderDelivery: 0,
            options: {},
        }
    },
    created() {
        this.getDeliveries();
    },
    watch: {
        search: function (newValue) {
            this.getDataFromApi();
        },
        searchByBarcode: function (newValue) {
            this.getDataFromApi();
        },
    },
    methods: {
        async getDeliveries() {
            let param = this.search ? {
                    search: this.search,
                    type: "DeliveryOrders",
                } :
                this.searchByBarcode ? {
                    barcodeid: this.searchByBarcode
                } : {
                    type: "DeliveryOrders",
                };

            const orderDeliveryMockData = await this.$axios.$get(
                "/api/user/deliveryOrder", {
                    params: param,
                }
            );
        },
        onKeyUp(event) {
            if (event.key === "Enter") {
                this.getDeliveries();
            } else if (`${event.target.value}`.length === 0) {
                // if someone clears the input field.
                this.getDeliveries();
            }
        },
        onClearClicked() {
            if (this.search !== "" || this.searchByBarcode !== "") {
                this.search = "";
                this.searchByBarcode = "";
            }
            this.getDeliveries();
        },
    }
}
</script>

<style>

</style>
