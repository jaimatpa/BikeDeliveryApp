<template>
<Page>
    <v-row>
        <v-col v-for="(item, index) in dashboardItems" cols="12" xs="6" sm="6" md="3" xl="3" :key="index" :class="isMobile ? 'custom-media-sm' : ''">
            <v-card :height="isMobile ? '120' : '180'" class="d-flex flex-column align-center justify-center cursor-pointer dashboard-card" elevation="0" :to="item.to" outlined>
                <v-img :max-height="isMobile ? '40' : '60'" :max-width="isMobile ? '80' : '120'" :src="item.icon" aspect-ratio="1" contain></v-img>
                <p class="title text--secondary" :class="[isMobile ? 'mt-0 mb-0' : 'mt-3 mb-0']">
                    {{ item.title }}
                </p>
            </v-card>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" xl="12" class="mt-5" justify="center">
            <div :class="[isMobile ? 'text-center' : '']">
                <p class="headline text-uppercase primary--text mb-1">
                    Today's Deliveries - {{orders.filter(x => x.status === 1).length}} / {{orders.length}} Delivered.
                </p>
                <v-divider :class="[isMobile ? 'mobile-divider' : '']"></v-divider>
            </div>
        </v-col>
    </v-row>

    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search by Order #, Name, Location" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field>
    <!-- Orders Mock Data Table -->
    <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" xl="12" class="mt-1">
            <v-data-table :headers="headers" :items="orders" :search="search" :options.sync="options" :hide-default-footer="true" :server-items-length="totalOrders" :loading="loading" class="elevation-1" sort-by="date" :sort-desc="false" :mobile-breakpoint="0">
                <!-- Date -->
                <template v-slot:[`item.date`]="{ item }">
                    {{ getDateFormat(item.date) }}
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    {{ getBoolFormat(item.status) }}
                </template>
                <template v-slot:[`item.lock`]="{ item }">
                    {{ getLockFormat(item.lock) }}
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon v-if="item.status === 0" medium color="primary" @click.stop="$router.push({path: `/deliveryOrder/${item.orderid}`,})">
                        mdi-page-next
                    </v-icon>
                    <v-icon v-if="item.status === 1" medium color="primary" @click.stop="$router.push({path: `/searchHistory/${item.orderid}`,})">
                        mdi-page-next
                    </v-icon>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</Page>
</template>

<script>
import moment from "moment";
import Page from "@/components/paradym/Page";
import PageSection from "@/components/paradym/PageSection";

export default {
    name: "pageIndex",
    auth: true,
    head() {
        return {
            title: "Home"
        };
    },
    components: {
        Page,
        PageSection
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            breakpoint: 640,
            totalOrders: 0,
            orders: [],
            search: "",
            loading: true,
            options: {},
            headers: [{
                    text: "DATE",
                    align: "start",
                    value: "date",
                },
                {
                    text: "ORDER#",
                    align: "start",
                    sortable: true,
                    value: "orderid",
                },
                {
                    text: "NAME",
                    value: "name",
                    sortable: true
                },
                {
                    text: "LOCATION",
                    value: "location",
                    sortable: true
                },
                {
                    text: "LOCK",
                    value: "lock",
                    sortable: true,
                    align: "left"
                },
                {
                    text: "DELIVERED",
                    value: "status",
                    sortable: true,
                    align: "left"
                },
                {
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
            dashboardItems: [{
                    title: "Locking",
                    icon: require("./../assets/images/dashboard_lock.svg"),
                    to: "/locking",
                },
                {
                    title: "Search History",
                    icon: require("./../assets/images/dashboard_search.svg"),
                    to: "/searchHistory",
                },
                {
                    title: "Delivery Order",
                    icon: require("./../assets/images/dashboard_bike.svg"),
                    to: "/deliveryOrder",
                },
                {
                    title: "Resend",
                    icon: require("./../assets/images/dashboard_resend.svg"),
                    to: "/resend",
                },
            ],
        };
    },
    watch: {
        options: {
            handler() {
                this.getDataFromApi();
            },
            deep: true,
        },
        search: function (newValue) {
            this.getDataFromApi();
        },
    },
    created() {
        this.getDataFromApi();
    },
    methods: {
        getDateFormat(date) {
            return moment(date).add(4, 'hours').format("MM/DD/YYYY hh:mm A");
        },
        getBoolFormat(status) {
            if (status === 1) {
                return "YES";
            } else {
                return "NO"
            }
        },
        getLockFormat(lock) {
            if (lock) {
                return "YES";
            } else {
                return "NO"
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
                this.orders = data.items;
                this.totalOrders = data.total;
                this.loading = false;
            });
        },
        onClearClicked() {
            if (this.search !== "" || this.searchByBarcode !== "") {
                this.search = "";
                this.searchByBarcode = "";
            }
            this.getDataFromApi();
        },
        apiCall() {
            return new Promise(async (resolve, reject) => {
                let param = {
                    search: this.search,
                    type: "Dashboard",
                };

                const {
                    sortBy,
                    sortDesc,
                } = this.options;
                const orderMockData = await this.$axios.$get(
                    "/api/user/deliveryOrder", {
                        params: param
                    });

                let items = orderMockData;
                const total = orderMockData?.length;

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

                // if (itemsPerPage > 0) {
                //     items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
                // }

                setTimeout(() => {
                    resolve({
                        items,
                        total,
                    });
                }, 1000);
            });
        },
    },
};
</script>

<style lang="scss">
.custom-media-sm {
    flex-basis: 50% !important;
    align-items: center !important;
    justify-content: center !important;

    .dashboard-card {
        background-color: #f5f6fa;
        border: 2px solid #4c9a2a;

        .title {
            font-size: 14px !important;
        }
    }
}

.mobile-divider {
    max-width: 50%;
    margin: 0 auto;
}
</style>
