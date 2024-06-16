<template>
    <Page :title="!isMobile ? `Location Sort` : ''">
        <!--<OverlayLoading :active="this.loading" message="Test"></OverlayLoading>-->
        <div v-show="this.loading" style="position: relative; left: 0; width: 100%; z-index: 9999; ">
            <div class="overlay-container" style="position: absolute; height: 100vh; width: 100%; xbackground-color: red;">
                <v-progress-circular
                :rotate="-90"
                :size="50"
                indeterminate
                color="secondary"
                style="align-items: middle; text-align: center; display: block; position: relative; margin-left: 50%; margin-right: 50%;"
                >
                </v-progress-circular>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <h3>Area</h3>
                <hr class="mb-2" />
                <Draggable class="list-group" style="cursor: move;" :list="areas" group="area" @change="handleAreaMove">
                    <div class="list-group-item" v-for="(area, index) in areas" :key="area.id">
                        <v-card color="white" :elevation="area.id === areaSelectedId ? 5 : 1" class="mb-2"
                            :style="{ outline: area.id === areaSelectedId ? '2px solid #4c9a2a' : 'none' }"
                            @click="handleCardClick(`area`, area)">
                            <v-card-title>
                                <v-row align="center">
                                    <v-col cols="10" class="d-flex align-center">
                                        <v-icon>mdi-drag</v-icon>
                                        <span>{{ area.name }}</span>
                                    </v-col>
                                    <v-col cols="2" class="text-right">
                                        <span>{{ index + 1 }}</span>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                        </v-card>
                    </div>
                </Draggable>
            </div>

            <div class="col-4">
                <h3>Villa</h3>
                <hr class="mb-2" />
                <Draggable class="list-group" style="cursor: move;" :list="villas" group="area" @change="handleVillaMove">
                    <div class="list-group-item" v-for="(villa, index) in villas" :key="villa.id">
                        <v-card color="white" :elevation="villa.id === villaSelectedId ? 5 : 1" class="mb-2"
                            :style="{ outline: villa.id === villaSelectedId ? '2px solid #4c9a2a' : 'none' }"
                            @click="handleCardClick(`villa`, villa)">
                            <v-card-title>
                                <v-row align="center">
                                    <v-col cols="10" class="d-flex align-center">
                                        <v-icon>mdi-drag</v-icon>
                                        <span>{{ villa.name }}</span>
                                    </v-col>
                                    <v-col cols="2" class="text-right">
                                        <span>{{ index + 1}}</span>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                        </v-card>
                    </div>
                </Draggable>
            </div>

            <div class="col-4">
                <h3>Street Address</h3>
                <hr class="mb-2" />
                <Draggable class="list-group" style="cursor: move;" :list="streetAddresses" group="area"
                    @change="handleStreetAddressMove">
                    <!-- No click event needed for street addresses -->
                    <div class="list-group-item" v-for="(streetAddress, index) in streetAddresses" :key="streetAddress.id">
                        <v-card color="white" class="mb-2">
                            <v-card-title>
                                <v-row align="center">
                                    <v-col cols="10" class="d-flex align-center">
                                        <v-icon>mdi-drag</v-icon>
                                        <span>{{ streetAddress.name }}</span>
                                    </v-col>
                                    <v-col cols="2" class="text-right">
                                        <span>{{ index + 1}}</span>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                        </v-card>
                    </div>
                </Draggable>
            </div>
        </div>
    </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import Draggable from "vuedraggable";
import OverlayLoading from "../../components/OverlayLoading.vue";

export default {
    name: "Location-Sort",
    auth: true,
    head() {
        return {
            title: "Location Sort"
        }
    },
    components: {
        Page,
        Draggable,
        OverlayLoading
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            loading: false,
            areaSelectedId: 0,
            villaSelectedId: 0,
            areas: [],
            villas: [],
            streetAddresses: []
        };
    },
    async mounted() {
        await this.getAllAreas();
    },
    methods: {
        sortByPriority(array) {
            array.sort((a, b) => a.priority - b.priority);
            return array;
        },
        swapElement(array, newElement) {
            const index = array.findIndex((area) => area.id === newElement.id);
            if (index !== -1) {
                array.splice(index, 1, newElement);
            }
            return array;
        },
        async getAllAreas() {
            this.loading = !this.loading;

            const response = await this.$axios.$get("/api/user/locations/areas");

            this.areas = response;

            // Sort by priority
            this.areas = this.sortByPriority(this.areas);

            this.loading = !this.loading;
        },
        async getAllVillasByArea() {
            this.loading = !this.loading;

            const response = await this.$axios.$get(`/api/user/locations/areas/${this.areaSelectedId}/villas`);

            this.villas = response;

            // Sort by priority
            this.villas = this.sortByPriority(this.villas);

            this.loading = !this.loading;
        },
        async getAllStreetAddressesByVilla() {
            this.loading = !this.loading;

            const response = await this.$axios.$get(`/api/user/locations/areas/villas/${this.villaSelectedId}/street-addresses`);

            this.streetAddresses = response;

            // Sort by priority
            this.streetAddresses = this.sortByPriority(this.streetAddresses);

            this.loading = !this.loading;
        },
        async handleAreaMove(event) {
            this.loading = !this.loading;
            const { moved: { newIndex, element } } = event;
            await this.$axios.$put(`/api/user/locations/areas/${element.id}?ctx=p_update`, { priority: newIndex + 1 });
            element.priority = newIndex + 1;

            // Perform swap
            // this.areas = this.swapElement(this.areas, element)

            await this.getAllAreas();

            this.loading = !this.loading;
        },
        async handleVillaMove(event) {
            this.loading = !this.loading;
            const { moved: { newIndex, element } } = event;
            await this.$axios.$put(`/api/user/locations/areas/villas/${element.id}?ctx=p_update`, { priority: newIndex + 1 });
            element.priority = newIndex + 1;

            // Perform swap
            // this.villas = this.swapElement(this.villas, element)

            await this.getAllVillasByArea();

            this.loading = !this.loading;
        },
        async handleStreetAddressMove(event) {
            this.loading = !this.loading;
            const { moved: { newIndex, element } } = event;
            await this.$axios.$put(`/api/user/locations/areas/villas/street-addresses/${element.id}?ctx=p_update`, { priority: newIndex + 1 });
            element.priority = newIndex + 1;

            // Perform swap
            // this.streetAddresses = this.swapElement(this.streetAddresses, element)
            await this.getAllStreetAddressesByVilla();

            this.loading = !this.loading;
        },
        async handleCardClick(cardType, element) {
            console.log(`${cardType} clicked`, element);
            if (cardType === "area") {
                this.villas = [];
                this.streetAddresses = [];

                this.areaSelectedId = element.id;
                await this.getAllVillasByArea();
            } else if (cardType === "villa") {
                this.streetAddresses = [];
                this.villaSelectedId = element.id;
                await this.getAllStreetAddressesByVilla();
            }
        }
    }
};
</script>