<template>
    <section>
        <PageResource name="Truck" :title="!isMobile ? 'Trucks' : ''" :fields="fields" :headers="headers" endpoint="/api/user/truck" />
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
            headers: [
                {
                    text: "Truck Name",
                    align: "start",
                    value: "TruckName",
                },
                {
                    text: "License Plate",
                    align: "start",
                    value: "LicensePlate",
                },
                {
                    text: "Notes",
                    align: "start",
                    value: "notes",
                },
                {
                    text: "Max Capacity",
                    align: "start",
                    value: "MaxCapacity",
                },
                {
                    text: "HHI Resort",
                    align: "start",
                    value: "HHI_Resort",
                },
                {
                    text: "Ocean 1.",
                    align: "start",
                    value: "Ocean_1",
                },
                {
                    text: "PD Pass",
                    align: "start",
                    value: "PD_Pass",
                },
                {
                    text: "SP Pass",
                    align: "start",
                    value: "SP_Pass",
                },
                {
                    text: "SY Pass",
                    align: "start",
                    value: "SY_Pass",
                },
            ],
            fields: {
                LicensePlate: {
                    type: String,
                    text: "License Plate",
                    required: true
                },
                TruckName: {
                    type: String,
                    required: true
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
