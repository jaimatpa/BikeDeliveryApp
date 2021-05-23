<template lang="html">
<Page>
    <v-simple-table dense class="color-combination-mapping-table">
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">COLOR KEY</th>
                    <th class="text-left">COMBINATION KEY</th>
                    <th class="text-left">COLOR VALUE 1</th>
                    <th class="text-left">COLOR VALUE 2</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(lock, i) in getLockingData" :key="i">
                    <td>
                        <v-text-field label="Color" outlined dense v-model="lock.color"></v-text-field>
                    </td>
                    <td>
                        <v-text-field label="Combination" outlined dense v-model="lock.combination"></v-text-field>
                    </td>
                    <td>
                        <v-color-picker mode='hexa' hide-canvas  v-model="lock.colorvalue"></v-color-picker>
                    </td>
                    <td>
                        <v-color-picker mode='hexa' hide-canvas  v-model="lock.colorvalue1"></v-color-picker>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>

    <FloatingButton @click="addRow()" color="primary" />

    <v-btn block color="primary" class="mt-5" @click="saveColorCombinationData()">
        Save
    </v-btn>
</Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import FloatingButton from "./../components/paradym/FloatingButton";
import {
    mapActions
} from "vuex";

export default {
    name: "colorCombination",
    auth: true,
    head() {
        return {
            title: "Color Combination",
        };
    },
    components: {
        Page,
        FloatingButton
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
        getLockingData() {
            return this.lockingData;
        },
    },
    data() {
        return {
            breakpoint: 640,
            lockingData: [],
            color: "",
            combination: "",
            colorvalue1: "",
            colorvalue2: "",
            rules: {
                required: (value) => !!value || "Required.",
            },
        };
    },
    created() {
        this.getLockingDetails();
    },
    watch: {
        lockingData(val) {
            console.log("locking data", val);

            // this.getLockingDetails()
        },
    },
    methods: {
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        addRow() {
            this.lockingData.push({
                color: this.color,
                combination: this.combination,
                colorvalue: this.colorvalue1,
                colorvalue1: this.colorvalue2
            });
        },
        async getLockingDetails() {
            const lockingDataResponse = await this.$axios.$get("/api/user/locking");
            console.log("LOCKING DATA RESPONSE", lockingDataResponse);
            this.lockingData = lockingDataResponse;
            console.log(this.lockingData);
        },
        saveColorCombinationData() {
            console.log("this.lockingData =>>>>>>>>", this.lockingData);

            const res = this.$axios
                .$post("/api/user/locking", this.lockingData)
                .then((result) => {
                    if (result) {
                        this.dialog = false;
                        this.getLockingDetails();
                        this.showSuccess("Update Successfully Done.");
                    }
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.color-combination-mapping-table {
    tbody {
        tr td {
            .v-input {
                height: 50% !important;
            }
        }
    }
}
</style>
