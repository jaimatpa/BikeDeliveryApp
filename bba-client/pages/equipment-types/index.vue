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
                },
                BarcodePrefix: {
                    type: String,
                },
                CapacityConsumption: {
                    type: Number,
                },
                ProductLineId: {
                    type: String,
                },
                qty: {
                    type: Number,
                    defaultValue: 0,
                },
                qtyAvailable: {
                    type: Number,
                    defaultValue: 0,
                },
            },
        };
    },
};
</script>
