<template lang="html">
    <Page :title="!isMobile ? `Location Management` : ''">
        <v-tabs fixed-tabs bg-color="indigo-darken-2" v-model="selectedTab" @change="handleTabChange">
            <v-tab>
                Area
            </v-tab>
            <v-tab>
                Villa
            </v-tab>
            <v-tab>
                Street Address
            </v-tab>
        </v-tabs>

        <!-- Area -->
        <Area v-if="selectedTab === 0" :cancel-edit="cancelEditSignal" @editingCanceled="() => cancelEditSignal = false" />

        <!-- Villa -->
        <Villa v-if="selectedTab === 1" :cancel-edit="cancelEditSignal" @editingCanceled="() => cancelEditSignal = false" />

        <!-- StreetAddress -->
        <StreetAddress v-if="selectedTab === 2" :cancel-edit="cancelEditSignal" @editingCanceled="() => cancelEditSignal = false" />
    </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import Area from "@/components/location-management/Area";
import Villa from "@/components/location-management/Villa";
import StreetAddress from "@/components/location-management/StreetAddress";

export default {
    name: "Location-Management",
    auth: true,
    head() {
        return {
            title: "Location Management"
        }
    },
    components: {
        Page,
        Area,
        Villa,
        StreetAddress
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            selectedTab: 0,
            cancelEditSignal: false
        };
    },
    mounted() {
        document.addEventListener("keydown", this.handleKeydown);
    },
    beforeDestroy() {
        document.removeEventListener("keydown", this.handleKeydown);
    },
    methods: {
        handleTabChange(tab) {
            console.log('Selected tab:', tab);
        },
        handleKeydown(event) {
            if (event.key === "Escape") {
                this.cancelEditSignal = true;
            }
        }
    }
};
</script>