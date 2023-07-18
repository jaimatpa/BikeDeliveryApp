<template>
    <section class="pa-5 mt-3">
        <v-row align="center" class="mb-5">
            <v-col cols="12"> 
                <v-app-bar style="height: 40px;">
                    <v-row align="center">
                        <v-col cols="1"> 
                            <v-menu v-model="menuOpen" :close-on-content-click="true" >
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="selectedDate" label="Select a date" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="selectedDate" @input="updateScheduler()" ></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="3"> 
                            <v-checkbox label="Enable Yard Manager" v-model="enableYardManager"></v-checkbox>
                        </v-col>
                    </v-row>
                </v-app-bar>
            </v-col>
        </v-row>

        <v-row no-gutters align="center" class="flex-nowrap my-2" style="height: 40vh; overflow-x: auto;" >
            <v-col v-for="truck in trucks" :key="truck.id" class="flex-shrink-0 px-2"
                style="min-width: 350px; max-height: 100%; overflow-y: auto;">

                 <!-- Trips for each truck -->
                <v-card v-for="trip in truck.trips" :key="trip.tripNumber"
                    style="width: 100%;  overflow-x: hidden; margin-bottom: 10px; " :style="{ 'background-color': trip.released ? '#ececec' : 'inherit', 'pointer-effects': trip.released ? 'none' : 'inherit' }">
                    <v-card-subtitle>
                        <h4>
                            Trip #{{ trip.tripNumber }}
                        </h4>
                        <h5>
                            {{ truck.TruckName }}
                        </h5>
 

                        <div v-if="trip.released"  class="mt-4 mb-4" style="height: 3px; width:30%; background-color: orange;"></div>
                        <div v-if="trip.complete"  class="mt-4 mb-4" style="height: 3px; width:30%; background-color: green;"></div>
               
                        <v-select :items="drivers" :disabled="trip.released" :style="{ 'pointer-effects': trip.released ? 'none' : 'inherit' }" item-text="displayName" v-model="trip.selectedDriver" persistent-hint single-line return-object label="Driver Name" ></v-select>
                    </v-card-subtitle>

                    <div class="row" style="margin: 0px; overflow-x: auto; align-items: center;">
                        <div class="col-4" style="min-width: 100%; max-height: 100%; overflow-y: auto;">
                            <Draggable style="min-height: 120px" class="list-group" :list="trip.deliveryOrders"
                                :group="{ name: 'row' }"
                                :style="{ 'cursor': trip.released ? 'inherit' : 'move', 'pointer-effects': trip.released ? 'none' : 'inherit' }"
                                :disabled="trip.released"
                                @change="deliverOrderMoved(truck.id, trip.tripNumber, $event)"
                                >

                                <div class="list-group-item" v-for="deliveryOrder in trip.deliveryOrders"
                                    :key="deliveryOrder.id">
                                    <v-card color="white" class="mb-2">
                                        <v-card-text>
                                            <v-row align="center">
                                                <v-col cols="12" class="d-flex align-center">

                                                    <v-icon v-show="!trip.released">mdi-drag</v-icon>

                                                    <div v-show="deliveryOrder.type == 'delivery'" style="background: blue; height: 60px; width: 3px;"></div>
                                                    <div v-show="deliveryOrder.type == 'delivery' && deliveryOrder.swapOrder" style="background: purple; height: 60px; width: 3px;"></div>
                                                    <div v-show="deliveryOrder.type == 'pickup'" style="background: orange; height: 60px; width: 3px;"></div>
                                                    
                                                    <div class="" style="padding-left: 10px; display: block">
                                                        <span><strong>{{ deliveryOrder.orderid }}</strong></span><br/>
                                                        <span>{{ deliveryOrder.location }}</span>
                                                    </div>
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
                                <v-btn v-if="!trip.released" color="primary" outlined @click="releaseTrip(trip)">Release</v-btn>
                                <v-btn v-if="trip.released" color="primary" outlined disabled>Released</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search by Order #, Name, Location"
                    single-line
                    hide-details
                    outlined
                    dense
                    clearable
                    class="mb-5 order-search-text-field"
                    @keyup="onKeyUp"
                    @click:clear="onClearClicked"
                    ></v-text-field>
            </v-col>
        </v-row>
        <div class="row" style=" overflow-x: auto;">
            <div class="col-4" style="min-width: 250px; overflow-y: auto;">
                <h4>Deliveries</h4>
                <hr class="mb-2" />
                <Draggable class="list-group" 
                style="cursor: move;  max-height: 30vh; height: 30vh; background-color: #efefef" 
                :list="nonSwappedDeliveryOrders"  
                 
                    :group="{ name: 'row' }"
                    >
                    <div class="list-group-item" v-for="deliveryOrder in nonSwappedDeliveryOrders" :key="deliveryOrder.id">
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
                <Draggable class="list-group" style="cursor: move;  max-height: 30vh; height: 30vh; background-color: #efefef" :list="swappedDeliveryOrders"  
   
                    :group="{ name: 'row' }"
                    >
                    <div class="list-group-item" v-for="deliveryOrder in swappedDeliveryOrders" :key="deliveryOrder.id">
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
                <h4>Pickups</h4>
                <hr class="mb-2" />
                
                <Draggable class="list-group" style="cursor: move; max-height: 30vh; height: 30vh; background-color: #efefef" 
                @change="test"
                :list="unloadedPickups"  
                @start="dragging = true"
  @end="dragging = false"
                    :group="{ name: 'row' }"
                    >
                    <div class="list-group-item" v-for="deliveryOrder in this.unloadedPickups" :key="deliveryOrder.id">
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
        </div>
    </section>
</template>

<script>
import Page from "@/components/paradym/Page";
import Draggable from "vuedraggable";

import _ from "lodash";
import moment from "moment";
import {
    mapActions,
    mapState
} from "vuex";


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
            enableYardManager: false,
            search: '',
            areas: [],
            villas: [],
            drivers: [],
            streetAddresses: [],
            tripCount: 0,
            selectedDriver: [],
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
            deliveryOrders: [],
            nonSwappedDeliveryOrders: [],
            swappedDeliveryOrders: [],
            unloadedPickups: [],
            pickups: [],
            forceUpdate: false
        };
    },
    async mounted() { 
        await this.getAllDeliveryOrders();
        await this.getAllPickups();
        await this.getAllDrivers();
        await this.generateTrips();
        await this.loadData();
    },
    async created() {

    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        onClearClicked() {
            if (this.search !== "" || this.searchByBarcode !== "") {
                this.search = "";
                this.searchByBarcode = "";
            }
            this.loadData();
        }, 
        test(event) {  
        },  
        onKeyUp(event) {
            // console.log('key uppppppp ', typeof event.target.value,  `${event.target.value}`.length)
            if (event.key === "Enter") {
                this.loadData();
            } else if (`${event.target.value}`.length === 0) {
                // if someone clears the input field.
                this.loadData();
            }
        },
        async loadData() {
            this.swappedDeliveryOrders = this.deliveryOrders.filter(x=>x.swapOrder == 1 && x.truckID == null && x.tripID1 == null);
            this.nonSwappedDeliveryOrders = this.deliveryOrders.filter(x=>x.swapOrder == 0 && x.truckID == null && x.tripID1 == null); //
            this.unloadedPickups = this.pickups.filter(x=>x.swapOrder == 0 && x.truckID == null && x.tripID1 == null); 

            this.nonSwappedDeliveryOrders.forEach(x=>x.type == 'deliveries');
            this.swappedDeliveryOrders.forEach(x=>x.type == 'swaps');
            this.unloadedPickups.forEach(x=>x.type == 'pickup');
 
            this.trucks.forEach( truck => {
                truck.trips.forEach( trip => {
                    trip.released = false;
                });
            })

            console.log('trips:', this.trips.length);

            this.trips.forEach( trip => {
                console.log('searching for new trips: tripid:' + trip.id + ", truckid: " + trip.truckId);
                var deliveries = this.deliveryOrders.filter( x => x.truckID == trip.truckId && x.tripID1 == trip.id );
                var pickups = this.pickups.filter( x => x.truckID == trip.truckId && x.tripID1 == trip.id );
                
                var truck = this.trucks.filter( truck => truck.id == trip.truckId );
                 
                if(deliveries.length > 0) {
                    deliveries.forEach(x=> {
                        x.type = 'delivery';
                        x.fixed=true;
                    });
                }

                if(pickups.length > 0) {
                    pickups.forEach(x=> {
                        x.type = 'pickup';
                        x.fixed=true;
                    });
                }

                var orders = [...deliveries, ...pickups];
                
                 
                
            
                truck[0].trips[ trip.tripNumber-1 ].deliveryOrders = orders;
                truck[0].trips[ trip.tripNumber-1 ].id = trip.id;
                truck[0].trips[ trip.tripNumber-1 ].released = trip.released ? true : false;
                truck[0].trips[ trip.tripNumber-1 ].complete = trip.complete ? true : false;
                
                if(trip.driverId != null) {
                    var driver = this.drivers.filter( driver => driver.id == trip.driverId );
                    var selectedDriver = driver[0];

                    console.log('found driver? ', trip.driverId, driver);

                    truck[0].trips[ trip.tripNumber-1 ].selectedDriver = selectedDriver;
                }
            });  
            
            this.trucks.forEach( truck => {
                truck.trips.forEach( trip => {
                
                });
            })
        },
        async updateScheduler() {
            await this.generateTrips();
            await this.getAllDeliveryOrders();
            await this.getAllPickups();

            await this.loadData();
        }, 
        swapElement(array, newElement) {
            const index = array.findIndex((area) => area.id === newElement.id);
            if (index !== -1) {
                array.splice(index, 1, newElement);
            }
            return array;
        },
        async releaseTrip(trip) 
        {
            if( trip.selectedDriver == null ) 
            {
                this.showError('You must assign a driver to release this trip.');
                return;
            }

            if( trip.deliveryOrders.length == 0 ) 
            {
                this.showError('You must assign at least one delivery order to this trip.');
                return;
            }
            
            const data = {
                tripId: trip.id,
                tripNumber: trip.tripNumber,
                truckName: this.trucks[trip.truckId - 1].TruckName,
                truckId: this.trucks[trip.truckId - 1].id,
                driverId: trip.selectedDriver.id
            }

            var trips = this.trucks[trip.truckId - 1].trips.filter( _trip => _trip.id == trip.id );
            if(trips.length>0) {
                trips[0].released = true;
            }

            this.trucks = [...this.trucks];
            
            const response = await this.$axios.$post(`/api/user/trips/release`, data);

            this.showSuccess('The trip has been released.');

            // alert('This trip has been released. To see the changes please reload the page.')
        },
        /**
         * 
         * @param {*} tripNumber 
         * @param {*} truckId 
         * @returns {Trip}
         */
        getTripObject(tripNumber, truckId) {
            // todo can be offloaded to server side
            // const persistedTrip = this.trips.filter(trip => trip.truckId === truckId && trip.tripNumber === tripNumber).pop();

            // if (persistedTrip) {
            //     console.log('returned persistedTrip');
            //     return persistedTrip;
            // }

            return {
                id: null,
                tripNumber: tripNumber,
                date: new Date(),
                truckId: truckId,
                released: false,
                complete: false,
                notifyYardMAnager: false,
                driverId: null,
                deliveryOrders: []
            };
        },
        cloneAction(item) {
            // console.log("cloned", item);
        },
        async deliverOrderMoved(truckid, tripid, event) {
            console.log('deliverOrderMoved', truckid, tripid, event);

            if(typeof(truckid) !== 'number' && typeof(tripid) !== 'number') return;

            if (event.moved) {
                console.log('order has been moved.');
            }

            if (event.removed) {
                //trip.deliveryOrders.append(event.removed.element);
                console.log('order has been removed.', event.removed);
            }

            if (event.added) {
                console.log('order has been added.', event.added);
                console.log('orderId', event.added.element.id);


                var trucks = this.trucks.filter(x=>x.id == truckid);
                var truck = trucks[0];
                 
                console.log('truck', truck);
                //truck[0].trips = [];

                const data = {
                    date: this.selectedDate,
                    truckId: truck,
                    tripNumber: tripid,
                    action: 'add',
                    deliveryOrderId: event.added.element.id
                }

                var trip = this.getTripObject(truck.trips.length+1, truckid);
                console.log(truck.trips[truck.trips.length - 1]);
                if(truck.trips[truck.trips.length - 1].deliveryOrders.length > 0) {
                    truck.trips.push(trip);
                }

                const response = await this.$axios.$post(`/api/user/trips/`, data).then( () =>{

                    this.showSuccess("The order has been added to the schedule.");

                });

                console.log('submitting data', data);     
            }

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
            
        },
        async getAllTrips() {
            const response = await this.$axios.$get(`/api/user/trips?date=${this.selectedDate}`);
            console.log(`/api/user/trips?date=${this.selectedDate}`);
            this.trips = response;
        },
        async getAllTrucks() {
            const response = await this.$axios.$get("/api/user/truck");

            this.trucks = response;
        },
        async getAllDrivers() {
            const response = await this.$axios.$get("/api/user/drivers");

            this.drivers = response;
        },
        async getAllDeliveryOrders() {
            const response = await this.$axios.$get(`/api/user/deliveryOrder/query?order_type=scheduler&type=deliveries&date=${this.selectedDate}`);
            this.deliveryOrders = response;
        },
        async getAllPickups() {
            const response = await this.$axios.$get(`/api/user/deliveryOrder/query?order_type=scheduler&type=pickups&date=${this.selectedDate}`);
 
            this.pickups = response;
        },
        async handleDeliveryOrderMove(truck, trip, event) {
            // const { moved: { oldIndex, element } } = event.removed;

           
        }, 
    }
};
</script>