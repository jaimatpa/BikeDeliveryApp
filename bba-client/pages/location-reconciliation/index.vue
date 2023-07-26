<template lang="html">
    <Page :title="!isMobile ? `Location Reconciliation` : ''">
        <v-row>
            <v-col>
                <small>Current Selected Address: {{ getCurrentAddress }}</small>
                <hr />
                <v-row no-gutters>
                    <!-- Area -->
                    <v-col>
                        <v-data-table :headers="headers.area" :items="areas" :loading="loading" item-value="key"
                            hide-default-footer>
                            <template v-for="header in headers.area" v-slot:[`item.${header.value}`]="{ item }">
                                <td @click="handleColumnClick('area', item)"
                                    :class="{ 'highlighted-cell': item.id === selectedArea.id }">
                                    {{ item[header.value] }}</td>
                            </template>
                        </v-data-table>
                    </v-col>
                    <!-- Villas -->
                    <v-col>
                        <v-data-table :headers="headers.villa" :items="villas" :loading="loading" item-value="key"
                            hide-default-footer>
                            <template v-for="header in headers.villa" v-slot:[`item.${header.value}`]="{ item }">
                                <td @click="handleColumnClick('villa', item)"
                                    :class="{ 'highlighted-cell': item.id === selectedVilla.id }">{{ item[header.value] }}
                                </td>
                            </template>
                        </v-data-table>
                    </v-col>
                    <!-- Street addresses -->
                    <v-col>
                        <v-data-table :headers="headers.streetAddress" :items="streetAddresses" :loading="loading"
                            item-value="key" hide-default-footer>
                            <template v-for="header in headers.streetAddress" v-slot:[`item.${header.value}`]="{ item }">
                                <td @click="handleColumnClick('street_address', item)"
                                    :class="{ 'highlighted-cell': item.id === selectedStreetAddress.id }">
                                    {{ item[header.value] }}
                                </td>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
                <!-- Location table -->
            </v-col>
            <v-col>
                <!-- Delivery orders  -->
                <v-row>
                    <v-col cols="9">
                        <v-text-field class="mb-2" v-model="search" append-icon="mdi-magnify" label="Search" single-line
                            hide-details clearable></v-text-field>
                        <small class="mb-2">
                            Selected Number of Delivery Orders {{ getNumberSelectedDeliveryOrders }}
                        </small>
                    </v-col>

                    <v-col cols="3">
                        <v-checkbox v-model="showAllOrders" label="All Orders"></v-checkbox>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <v-btn depressed block color="red" class="mb-2" :disabled="getNumberSelectedDeliveryOrders < 1"
                            @click="() => deleteDialog = true">
                            <v-icon left medium color="white" class="mr-2">
                                mdi-delete
                            </v-icon>
                            <span style="color: white;">Delete</span>
                        </v-btn>
                    </v-col>

                    <v-col cols="8">
                        <v-btn depressed block color="primary" class="mb-2" @click="convertLocation()"
                            :disabled="disabledConvertLocation">
                            <v-icon left medium color="white" class="mr-2">
                                mdi-check
                            </v-icon>
                            Convert Location
                        </v-btn>
                    </v-col>
                </v-row>

                <v-data-table v-model="selectedDeliveryOrders" :headers="headers.deliveryOrder" :items="deliveryOrders"
                    :loading="loading" :search="search" item-value="key" class="elevation-1" show-select>
                    <template v-slot:item.name="{ item }">
                        <span style="display: none;">{{ item.name }}</span>
                    </template>
                    <template v-slot:header.name>
                        <span style="display: none;">{{ headers.deliveryOrder.find(header => header.value ===
                            'name').text }}</span>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <ModalConfirm v-model="deleteDialog" title="Delete Delivery Order"
            :message="`Delete <strong>${getNumberSelectedDeliveryOrders}</strong> Delivery ${getNumberSelectedDeliveryOrders <= 1 ? 'order' : 'orders'}`"
            confirmText="Yes" cancelText="No" @confirm="deleteDeliveryOrders" />
    </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import ModalConfirm from "@/components/paradym/modals/ModalConfirm";


export default {
    // todo Bad impl, can be divided into components

    name: "Location-Reconciliation",
    auth: true,
    head() {
        return {
            title: "Location Reconciliation"
        }
    },
    components: {
        // todo break into components
        Page,
        ModalConfirm
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
        getCurrentAddress() {
            let address = "";
            console.log(this.selectedArea?.name)

            if (this.selectedArea?.name) {
                address = address.concat(this.selectedArea.name);
            } else {
                address = "None";
            }

            if (this.selectedVilla?.name) {
                address = `${this.selectedVilla.name}, ${address}`;
            }

            if (this.selectedStreetAddress?.name) {
                address = `${this.selectedStreetAddress.name}, ${address}`;
            }

            return address;
        },
        disabledConvertLocation() {
            return this.selectedDeliveryOrders.length < 1 || Object.keys(this.selectedStreetAddress) < 1;
        },
        getNumberSelectedDeliveryOrders() {
            return this.selectedDeliveryOrders.length;
        }
    },
    watch: {
        showAllOrders(newVal) {
            this.showAllOrders = newVal;
            this.getAllDeliveryOrders();
        }
    },
    data() {
        return {
            selectedTab: 0,
            cancelEditSignal: false,
            loading: false,
            selectedArea: {},
            selectedVilla: {},
            selectedStreetAddress: {},
            areas: [],
            villas: [],
            streetAddresses: [],
            deliveryOrders: [],
            selectedDeliveryOrders: [],
            search: "",
            deleteDialog: false,
            showAllOrders: false,
            headers: {
                deliveryOrder: [
                    {
                        text: "Location",
                        align: "start",
                        sortable: false,
                        value: "location"
                    },
                    {
                        text: "Villa",
                        align: "start",
                        sortable: false,
                        value: "plantation"
                    },
                    {
                        text: "Area",
                        align: "start",
                        sortable: false,
                        value: "area"
                    },
                    {
                        text: "Order #",
                        align: "start",
                        sortable: false,
                        value: "orderid"
                    },
                    {
                        text: "Name",
                        align: "start",
                        sortable: false,
                        value: "name",
                        searchable: true
                    }
                ],
                area: [
                    {
                        text: "Area",
                        align: "start",
                        sortable: false,
                        value: "name",
                    }],
                villa: [
                    {
                        text: "Villa",
                        align: "start",
                        sortable: false,
                        value: "name",
                    },
                ],
                streetAddress: [
                    {
                        text: "Street Address",
                        align: "start",
                        sortable: false,
                        value: "name",
                    },
                ]
            },
        };
    },
    async mounted() {
        await this.getAllAreas();
        await this.getAllDeliveryOrders();
    },
    beforeDestroy() {
    },
    methods: {
        /**
         * Handles the click event on a column.
         * 
         * @param {"area" | "villa" | "street_address"} itemType - The type of item ('area' or 'villa').
         * @param {*} item - The clicked item.
         */
        handleColumnClick(itemType, item) {
            if (itemType === "area") {
                console.log(`Getting villas for ${itemType} ${item.id}`);
                this.getAllVillasByArea(item.id);
            }

            if (itemType === "villa") {
                console.log(`Getting street addresses for ${itemType} ${item.id}`);
                this.getAllStreetAddressesByVilla(item.id);
            }

            if (itemType === "street_address") {
                this.selectedStreetAddress = item
            }
        },
        async getAllDeliveryOrders() {
            this.loading = !this.loading;

            const response = await this.$axios.$get("api/user/deliveryOrder/location_reconciliation", {
                params: {
                    all: this.showAllOrders
                }
            });

            this.deliveryOrders = response;

            this.loading = !this.loading;
        },
        async getAllAreas() {
            this.loading = !this.loading;

            this.villas = [];

            const response = await this.$axios.$get("/api/user/locations/areas");

            this.areas = response;

            // this.areas.forEach(area => area.villas = []);

            this.loading = !this.loading;
        },
        async getAllVillasByArea(areaSelectedId) {
            this.loading = !this.loading;

            this.streetAddresses = [];
            this.selectedVilla = {};
            this.selectedStreetAddress = {};

            const response = await this.$axios.$get(`/api/user/locations/areas/${areaSelectedId}/villas`);

            // Find the index of the element in the array based on the 'id'
            const index = this.areas.findIndex(area => area.id === areaSelectedId);
            this.selectedArea = this.areas[index];

            this.villas = response;

            this.loading = !this.loading;
        },
        async getAllStreetAddressesByVilla(villaSelectedId) {
            this.loading = !this.loading;

            this.selectedStreetAddress = {};

            const response = await this.$axios.$get(`/api/user/locations/areas/villas/${villaSelectedId}/street-addresses`);

            const index = this.villas.findIndex(villa => villa.id === villaSelectedId);
            this.selectedVilla = this.villas[index];

            this.streetAddresses = response;

            this.loading = !this.loading;
        },
        async convertLocation() {
            // const { areaId, villaId, streetAddressId, deliveryOrderId } = req.body;

            const futureBuffer = this.selectedDeliveryOrders.map(deliveryOrder => this.$axios.$patch("api/user/deliveryOrder/location_reconciliation", {
                areaId: this.selectedArea.id,
                villaId: this.selectedVilla.id,
                streetAddressId: this.selectedStreetAddress.id,
                deliveryOrderId: deliveryOrder.id
            }));

            await Promise.all(futureBuffer);

            await this.getAllDeliveryOrders();
            this.selectedDeliveryOrders = [];
        },
        async deleteDeliveryOrders() {
            const futureBuffer = this.selectedDeliveryOrders.map(deliveryOrder => this.$axios.$delete(`api/user/deliveryOrder/${deliveryOrder.id}`))

            await Promise.all(futureBuffer);

            await this.getAllDeliveryOrders();
            this.selectedDeliveryOrders = [];
            this.deleteDialog = false;
        }
    }
};
</script>

<style scoped>
.highlighted-cell {
    background-color: #4c9a2a;
    color: white;
    font-weight: bold;
}
</style>