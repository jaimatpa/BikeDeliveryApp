<template>
    <section class="pa-1">

        <v-app-bar style="height: 40px;">
            <v-row no-gutters align="center">
                <v-col cols="4"></v-col>
                <v-col cols="4" class="pa-4">
                    <v-menu v-model="menuOpen" :close-on-content-click="false">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="selectedDate" label="Select a date" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="selectedDate"></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </v-app-bar>

        <v-row no-gutters align="center" class="flex-nowrap my-2" style="height: 45vh; overflow-x: auto;">
            <v-col v-for="truck in trucks" :key="truck.id" class="flex-shrink-0 px-2"
                style="min-width: 350px; max-height: 100%; overflow-y: auto;">
                <!-- Trips for each truck -->
                <v-card v-for="trip in truck.trips" :key="trip.tripNumber"
                    style="width: 100%; overflow-y: scroll; overflow-x: hidden; margin-bottom: 10px;">
                    <v-card-subtitle>
                        <h5>
                            {{ truck.TruckName }}
                        </h5>
                    </v-card-subtitle>

                    <div class="row" style="height: 120px; overflow-x: auto; align-items: center;">
                        <div class="col-4" style="min-width: 100%; max-height: 100%; overflow-y: auto;">
                            <Draggable class="list-group" style="cursor: move;" :list="trip.deliveryOrders"
                                group="deliveryOrder" @change="handleDeliveryOrderMove">
                                <div class="list-group-item" v-for="deliveryOrder in trip.deliveryOrders"
                                    :key="deliveryOrder.id">
                                    <v-card color="white" class="mb-2">
                                        <v-card-text>
                                            <v-row align="center">
                                                <v-col cols="2" class="d-flex align-center">
                                                    <v-icon>mdi-drag</v-icon>
                                                    <span>{{ deliveryOrder.orderid }}</span>
                                                </v-col>
                                                <v-col cols="10" class="text-right">
                                                    <span>{{ deliveryOrder.location }}</span>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </Draggable>
                        </div>
                    </div>

                    <v-card-text>
                        <v-row align="center" justify="space-between">
                            <v-col cols="auto">
                                <h4>
                                    Trip {{ trip.tripNumber }}
                                </h4>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="primary" outlined>Release</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <div class="row" style="height: 30vh; overflow-x: auto;">
            <div class="col-4" style="min-width: 250px; max-height: 100%; overflow-y: auto;">
                <h4>Deliveries</h4>
                <hr class="mb-2" />
                <Draggable class="list-group" style="cursor: move;" :list="deliveryOrders" group="deliveryOrder"
                    @change="handleDeliveryOrderMove">
                    <div class="list-group-item" v-for="deliveryOrder in deliveryOrders" :key="deliveryOrder.id">
                        <v-card color="white" :elevation="1" class="mb-2">
                            <v-card-text>
                                <v-row align="center">
                                    <v-col cols="4" class="d-flex align-center">
                                        <v-icon>mdi-drag</v-icon>
                                        <span>{{ deliveryOrder.orderid }}</span>
                                    </v-col>
                                    <v-col cols="8" class="text-right">
                                        <span>{{ deliveryOrder.location }}</span>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </div>
                </Draggable>
            </div>

            <div class="col-4">
                <h4>Swaps</h4>
                <hr class="mb-2" />
            </div>

            <div class="col-4">
                <h3>Pickups</h3>
                <hr class="mb-2" />
            </div>
        </div>
    </section>
</template>

<script>
import Page from "@/components/paradym/Page";
import Draggable from "vuedraggable";

/**
 * Represents a truck in the Trucks table.
 * @typedef {Object} Truck
 * @property {number} id - The ID of the truck.
 * @property {string|null} notes - Additional notes about the truck.
 * @property {string|null} createdAt - The date and time when the truck was created.
 * @property {string|null} updatedAt - The date and time when the truck was last updated.
 * @property {string|null} HHI_Resort - HHI Resort information.
 * @property {boolean|null} IsDeleted - Indicates whether the truck is deleted or not.
 * @property {string|null} LicensePlate - The license plate of the truck.
 * @property {number|null} MaxCapacity - The maximum capacity of the truck.
 * @property {string|null} Ocean_1 - Ocean_1 information.
 * @property {string|null} PD_Pass - PD_Pass information.
 * @property {string|null} SP_Pass - SP_Pass information.
 * @property {string|null} SY_Pass - SY_Pass information.
 * @property {string|null} TruckName - The name of the truck.
 * @property {number|null} defaultDriver - The ID of the default driver assigned to the truck.
 * @property {Trip[]} trips
 */

/**
* Represents a trip in the Trip table.
* @typedef {Object} Trip
* @property {number} id - The ID of the trip.
* @property {number|null} tripNumber - The trip number.
* @property {string|null} date - The date of the trip.
* @property {number|null} truckId - The ID of the associated truck.
* @property {boolean|null} released - Indicates whether the trip is released.
* @property {boolean|null} complete - Indicates whether the trip is complete.
* @property {boolean|null} notifyYardManager - Indicates whether to notify the yard manager.
* @property {number|null} driverId - The ID of the associated driver.
 * @property {DeliveryOrder[]} deliveryOrders
*/

/**
 * @typedef {Object} DeliveryOrder
 * @property {number} id - The unique identifier for the delivery order.
 * @property {Date} date - The date of the delivery order.
 * @property {string} name - The name associated with the delivery order.
 * @property {string} location - The location for the delivery.
 * @property {string} orderid - The order identifier.
 * @property {string} rack - The rack information.
 * @property {string} color - The color information.
 * @property {string} combination - The combination information.
 * @property {string} lock - The lock information.
 * @property {string} mobileNo - The mobile number of the customer.
 * @property {string} barcode - The barcode of the delivery order.
 * @property {Date} createdAt - The creation date of the order record.
 * @property {Date} updatedAt - The last update date of the order record.
 * @property {string} note - The note for the delivery order.
 * @property {string} email - The email of the customer.
 * @property {number} status - The status of the delivery order.
 * @property {string} plantation - The plantation information.
 * @property {string} area - The area information.
 * @property {string} lane - The lane information.
 * @property {string} endDate - The end date of the delivery.
 * @property {boolean} PickedUp - Whether the order has been picked up.
 * @property {string} PickupNotes - The notes for pickup.
 * @property {number} truckID - The ID of the truck.
 * @property {boolean} textSent - Whether the text was sent.
 * @property {boolean} picturesSent - Whether the pictures were sent.
 * @property {number} customerPickedUp - Whether the customer picked up the order.
 * @property {number} readyForDriverPickup - Whether the order is ready for driver pickup.
 * @property {string} driverDeliveredBy - Who the driver was delivered by.
 * @property {string} driverPickedUpBy - Who the driver was picked up by.
 * @property {number} TruckId1 - The first truck ID.
 * @property {number} StopNumber - The stop number.
 * @property {number} tripID1 - The first trip ID.
 * @property {number} tripID2 - The second trip ID.
 * @property {number} tripPriority1 - The first trip priority.
 * @property {number} tripPriority2 - The second trip priority.
 * @property {boolean} extrasDelivered - Whether extras were delivered.
 * @property {string} extrasDeliveredReason - The reason for delivering extras.
 * @property {boolean} extrasPickedUp - Whether extras were picked up.
 * @property {string} extrasPickedUpReason - The reason for picking up extras.
 * @property {boolean} swapOrder - Whether the order was swapped.
 */

export default {
    name: "Scheduler",
    auth: true,
    head() {
        return {
            title: "Scheduler"
        }
    },
    components: {
        Page,
        Draggable
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            loading: false,
            selectedDate: new Date().toISOString().substring(0, 10),
            menuOpen: false,
            areas: [],
            villas: [],
            streetAddresses: [],
            /**
             * @typedef {Truck[]} Trucks
            * @type {Trucks}
            */
            trucks: [],
            /**
             * @typedef {Trip[]} Trips
            * @type {Trips}
            */
            trips: [],
            /**
             * @typedef {DeliveryOrder[]} DeliveryOrders
            * @type {DeliveryOrders}
            */
            deliveryOrders: []
        };
    },
    async mounted() {
        await this.generateTrips();
        await this.getAllDeliveryOrders();
    },
    methods: {
        swapElement(array, newElement) {
            const index = array.findIndex((area) => area.id === newElement.id);
            if (index !== -1) {
                array.splice(index, 1, newElement);
            }
            return array;
        },
        /**
         * 
         * @param {*} tripNumber 
         * @param {*} truckId 
         * @returns {Trip}
         */
        async getTripObject(tripNumber, truckId) {
            // todo can be offloaded to server side
            const persistedTrip = this.trips.filter(trip => trip.truckId === truckId && trip.tripNumber === tripNumber).pop();

            if (persistedTrip) {
                return persistedTrip;
            }

            return {
                id: null,
                tripNumber,
                date: new Date(),
                truckId,
                released: false,
                complete: false,
                notifyYardMAnager: false,
                driverId: null,
                deliveryOrders: []
            };
        },
        async generateTrips() {
            await this.getAllTrips();
            await this.getAllTrucks();

            /**
             * truck: {
             *      trips: []
             * }
             */
            // Each truck can have max trips in a day
            this.trucks.forEach(truck => {
                truck.trips = Array.from({ length: 10 }, (_, index) => ({
                    ...this.getTripObject(index + 1, truck.id),
                }));
            });

            console.log(this.trucks);
        },
        async getAllTrips() {
            // todo change this to be dynamic, uncomment following line
            // const response = await this.$axios.$get(`/api/user/trips?date=${this.selectedDate}`);
            const response = await this.$axios.$get(`/api/user/trips?date=2022-10-01`);

            this.trips = response;
        },
        async getAllTrucks() {
            const response = await this.$axios.$get("/api/user/truck");

            this.trucks = response;
        },
        async getAllDeliveryOrders() {
            console.log(this.selectedDate);
            // todo change this to be dynamic, uncomment following line
            // const response = await this.$axios.$get(`/api/user/deliveryOrder/query?order_type=delivery_order&date=${this.selectedDate}`);
            const response = await this.$axios.$get(`/api/user/deliveryOrder/query?order_type=delivery_order&date=2022-10-01`);

            this.deliveryOrders = response;

            console.log(this.deliveryOrders)
        },
        async handleDeliveryOrderMove(event) {
            // const { moved: { newIndex, element } } = event;
            console.log(event);

            if (event.moved) {

            }

            if (event.removed) {

            }

            if (event.added) {

            }
        },
    }
};
</script>