<template lang="html">
<Page :title="!isMobile ? 'Lock Details' : ''">
    <div class="d-flex flex-column justify-space-between" style="height: 100%">
        <div>
            <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field v-model="lockData.orderid" label="DELIVERY #" placeholder="DELIVERY Id" readonly disabled dense outlined>
                    </v-text-field>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-select :items="colorItems" v-model="defaultColorValue" label="COLOR" dense outlined></v-select>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-list :items="colorItems" label="COLOR">
                        <v-subheader>COLORS</v-subheader>
                        <v-list-item-group color="primary">
                            <v-list-item v-for="(item, i) in colorItems" :value="item" :key="i">
                                <v-list-item-action>
                                    <v-btn :color="item">{{item}}</v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-col>

                <!-- <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field v-model="defaultCombinationValue" label="COMBINATION" placeholder="Combination" disabled readonly dense outlined></v-text-field>
                </v-col> -->
            </v-row>
            <v-row>
                <v-col cols="12" xs="12" sm="12" md="12" xl="12">
                    <v-btn block depressed color="primary" @click.stop="saveLockingData()">
                        Save
                    </v-btn>
                </v-col>
            </v-row>
        </div>

        <div>
            <!-- Notification Send Button -->

        </div>
    </div>
</Page>
</template>

<script>
import _ from "lodash";

import Page from "@/components/paradym/Page";

export default {
    name: "lockDetails",
    auth: true,
    head() {
        return {
            title: "Lock Details",
        };
    },
    components: {
        Page
    },
    created() {
        this.getOrderDetails();
        this.getLockingDetails();
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    watch: {
        defaultColorValue(newVal, oldVal) {
                const data = _.find(this.lockingData, (o) => o.color == newVal);
                this.defaultCombinationValue = data && data.combination;
                this.defaultLockingValue = data && data.lockId;
        },
    },
    data() {
        return {
            breakpoint: 640,
            defaultColorValue: "",
            defaultCombinationValue: "",
            defaultLockingValue: "",
            colorItems: [],
            lockingData: [],
            lockData: {},
        };
    },
    methods: {
        async getLockingDetails() {
            const lockingDataResponse = await this.$axios.$get("/api/user/locking");
            this.lockingData = lockingDataResponse;
            this.colorItems = _.map(lockingDataResponse, "color");
        },
        async getOrderDetails() {
            try {
                let response = await this.$axios.$get("/api/user/deliveryOrder", {
                    params: {
                        search: this.$route.params.deliveryId,
                    },
                });
                this.lockData = response[0];
                this.defaultColorValue = response[0].color;
                this.defaultCombinationValue = response[0].combination;
                this.defaultLockingValue = response[0].lock;

                //  this.$router.go(-1);
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        async saveLockingData() {
            const res = await this.$axios.$post(
                "/api/user/deliveryorderupdate", {
                    color: this.defaultColorValue,
                    combination: this.defaultCombinationValue,
                    lock: this.defaultLockingValue,
                }, {
                    params: {
                        orderid: this.lockData.orderid,
                        status: 0,
                    },
                }
            );

            if (res) {
                this.$router.go(-1);
            }
        },
    },
};
</script>

<style lang="scss"></style>
