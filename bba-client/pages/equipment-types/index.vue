<template>
    <section>
        <PageResource name="Equipment Type" :title="!isMobile ? 'Equipment Type' : ''" :fields="fields"
            endpoint="/api/user/equipment-types" />
    </section>
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
    name: "Equipment Type",
    auth: true,
    head() {
        return {
            title: "Equipment Types"
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
                Label: {
                    type: String,
                    required: true
                },
                BarcodePrefix: {
                    type: String,
                    required: true
                },
                CapacityConsumption: {
                    type: Number,
                    required: true
                },
                ProductLineId: {
                    type: String,
                    required: true
                },
                qty: {
                    type: Number,
                    defaultValue: 0,
                    required: true
                },
                qtyAvailable: {
                    type: Number,
                    defaultValue: 0,
                    required: true
                },
            },
        };
    },
};
</script>
