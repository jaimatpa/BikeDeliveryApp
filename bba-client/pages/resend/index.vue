<template lang="html">
<Page>
    <!-- Order Search Field -->
    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search by Order #, Name, Location" single-line hide-details outlined dense clearable class="mb-5 order-search-text-field" @keyup="onKeyUp" @click:clear="onClearClicked"></v-text-field>

    <v-data-table :headers="headers" :items="resends" :options.sync="options" :server-items-length="totalResend" :loading="loading" :search="search" class="elevation-1" :mobile-breakpoint="0" sort-by="date" :sort-desc="true">
        <!-- Date -->
        <template v-slot:item.date="{ item }">
            {{ getDateFormat(item.date) }}
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
            <v-icon class="resend-icon" small color="white" @click.stop="handleData(item)">
                mdi-share
            </v-icon>
        </template>
    </v-data-table>

    <!-- Resend Dialog -->
    <v-dialog v-model="resendDialog" transition="dialog-bottom-transition" max-width="350" content-class="resend-dialog">
        <v-card>
            <v-toolbar dense color="primary" dark elevation="0">
                <v-toolbar-title>Resend</v-toolbar-title>
                <v-spacer />
                <v-btn icon dark @click="resendDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="my-5 text-center">
                <p class="title mb-3 secondary--text sure-title">
                    Are you sure you want to resend this information?
                </p>

                <div class="d-flex flex-column">
                    <v-btn class="ma-2" color="primary" @click="sendNotification()">
                        Confirm
                    </v-btn>
                    <v-btn class="ma-2" outlined color="error" @click="resendDialog = false">
                        Cancel
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-overlay :value="loader">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
</Page>
</template>

<script>
import moment from "moment";
import {
    mapActions
} from "vuex";
import Page from "@/components/paradym/Page";

export default {
    name: "resend",
    auth: true,
    head() {
        return {
            title: "Resend",
        };
    },
    components: {
        Page
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            breakpoint: 640,
            totalResend: 0,
            resendDialog: false,
            search: "",
            resends: [],
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
                    value: "orderid"
                },
                {
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
            loader: false,
            dataToSent: {},
            smsObject: {
                to: "+8801745476473",
                message: "",
            },
        };
    },
    watch: {
        search: function (newValue) {
            this.getDataFromApi();
        },
        options: {
            handler() {
                if (this.initialRender === false) {
                    this.getDataFromApi();
                }
            },
            deep: true,
        },
    },
    created() {
        this.getDataFromApi();
        this.initialRender = false;
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        getDateFormat(date) {
            return moment(date).add(4, 'hours').format("MM/DD/YYYY hh:mm A");
        },
        onClearClicked() {
            if (this.search !== "") {
                this.search = "";
            }
            this.getDataFromApi();
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
        async sendNotification() {
            this.searchHistoryDialog = false;
            this.deliveryOrderDialog = false;
            this.loader = true;
            let dataToAdd = this.orderData;
            let userPositionData = this.userPosition;

            let infoMap = {
                "[customer-name]": "name",
                "[location]": "location",
                "[lock-combo]": ["lock", "combination"],
                "[lock]": "lock",
                "[combination]": "combination",
                "[delivery-number]": "orderid",
                "[color]": "color",
                "[rack]": "rack",
                "[geo-lat]": "geo-lat",
                "[geo-long]": "geo-long",
            };


            let output = this.getMessage(
                this.templateMsg,
                infoMap,
                dataToAdd,
                userPositionData
            );
            console.log("IN OUTPUT");

            console.log(output);
            this.smsObject.message = output;
            this.smsObject.orderid = this.orderData.orderid;
            this.smsObject.images = this.orderData.images;

            console.log("TESTING!!!! dsagdsg");
            console.log(this.orderData);

            try {
                let response = await this.$axios.$post(
                    "api/user/resend",
                    this.smsObject,
                );
                this.loader = false;
                this.showSuccess(response.message);
                this.$router.push('/deliveryOrder');
            } catch (err) {
                console.log("errror", err.response);
                this.loader = false;
            }
        },
        getMessage(template, infoMap, userObj, userPosition) {
            let result = template;
            console.log(template, infoMap, userObj);
            try {
                for (let key in infoMap) {
                    if (key === "[lock-combo]") {
                        let key0 = infoMap[key][0];
                        let key1 = infoMap[key][1];
                        result = result.replaceAll(key, `${userObj[key0]}-${userObj[key1]}`);
                    }

                    if (key === "[geo-lat]" && userPosition) {
                        result = result.replaceAll(key, userPosition.lat);
                    }
                    if (key === "[geo-long]" && userPosition) {
                        result = result.replaceAll(key, userPosition.lng);
                    }

                    result = result.replaceAll(key, userObj[infoMap[key]]);
                }
                console.log("RETURNING RESULT", result);
                return result;
            } catch (error) {
                console.log(error)
            }

            return '';
        },
        async getDataFromApi() {
            this.loading = true;
            this.apiCall().then((data) => {
                this.resends = data.items;
                this.totalResend = data.total;
                this.loading = false;
            });
        },
        apiCall() {
            return new Promise(async (resolve, reject) => {
                let param = this.search ? {
                    search: this.search,
                    type: "Resend"
                } : {
                    type: "Resend"
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
        handleData(item) {
            console.log("Data to send sms", item);
            this.resendDialog = true;
            this.dataToSent = item;
        },
    },
};
</script>

<style lang="scss">
.resend-dialog {
    box-shadow: none !important;

    .sure-title {
        font-size: 1rem !important;
        line-height: 1.2rem !important;
    }
}

.resend-icon {
    background: #4c9a2a;
    padding: 5px;
    border-radius: 5px;
}

.order-search-text-field {
    .v-label {
        font-size: 14px !important;
        color: #b5b5b5 !important;
    }
}
</style>
