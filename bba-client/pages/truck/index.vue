<template>
    <section>
        <PageResource name="Truck" :title="!isMobile ? 'Trucks' : ''" :fields="fields" endpoint="/api/user/truck" />
    </section>
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
    name: "pageTrucks",
    auth: true,
    head() {
        return {
            title: "Trucks"
        };
    },
    components: {
        PageResource
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            breakpoint: 640,
            fields: {
                LicensePlate: {
                    type: String,
                },
                TruckName: {
                    type: String
                },
                MaxCapacity: {
                    type: Number,
                    default: 0
                },
                HHI_Resort: {
                    type: String
                },
                Ocean_1: {
                    type: String
                },
                PD_Pass: {
                    type: String
                },
                SP_Pass: {
                    type: String
                },
                SY_Pass: {
                    type: String

                },
                notes: {
                    type: String
                },
            },
        };
    },
};
</script>
