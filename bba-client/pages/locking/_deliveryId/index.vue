<template lang="html">
<Page :title="!isMobile ? 'Lock Details' : ''">
    <div class="d-flex flex-column justify-space-between" style="height: 100%">
        <div>
            <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field v-model="lockData.orderid" label="DELIVERY #" placeholder="DELIVERY Id" readonly dense outlined>
                    </v-text-field>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-select :items="colorItems" v-model="defaultColorValue" label="COLOR" dense outlined></v-select>
                </v-col>

                <v-row>
                    <v-col cols="12" xs="2" sm="2" md="2" xl="2" v-for="(item, i) in colorItems" :value="item" :key="i">
                        <v-btn @click="setColor(item)" :color="getColor(item)" :class="getForegroundColor(item)">{{item}}</v-btn>
                    </v-col>
                </v-row>

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
            <v-row>
                <span class="button-description">
                    Last Used Color: {{ lastUsedColor ? lastUsedColor : 'No color used yet' }}
                </span> 
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
const axios = require('axios');

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
    mounted() {
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
            colorHexValues: [],
            lockingData: [],
            lockData: {},
            lastUsedColor: "",
        };
    },
    methods: {
        async getLockingDetails() {
            const lockingDataResponse = await this.$axios.$get("/api/user/locking");
            this.lockingData = lockingDataResponse;
            this.colorItems = _.map(lockingDataResponse, "color");
            this.colorHexValues = _.map(lockingDataResponse, "ColorValue");
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

                const lastCombinationData = await axios.post(this.$config.bodhisysAPIURL+"/reservations/getlastusedcolorcombinationbycustomerid",
                    {
                        customer_id: response[0].customer_id,
                        current_order_id: response[0].id,
                    }
                );

                console.log(lastCombinationData);
                if (lastCombinationData.data && lastCombinationData.data.color) {
                    this.lastUsedColor = lastCombinationData.data.color.color_key;
                } else {
                    this.lastUsedColor = '';
                }
                console.log(lastCombinationData);
                //  this.$router.go(-1);
            } catch (err) {
                console.log("errror", err.response);
            }
        },
        async setColor(item) {
            this.defaultColorValue = item;
        },
        getColor(item) {
            console.log("in get color");
            let colorIndex = this.colorItems.indexOf(item);
            let color = this.colorHexValues[colorIndex];
            return color;
        },
        getForegroundColor(item) {

        },
        async saveLockingData() {
            const res = await this.$axios.$post(
                "/api/user/deliveryorderupdate", {
                    color: this.defaultColorValue,
                    combination: this.defaultCombinationValue,
                    lock: this.defaultLockingValue,
                    orderid: this.lockData.orderid,
                        status: 0,
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
