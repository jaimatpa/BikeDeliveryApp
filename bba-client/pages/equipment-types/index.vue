<template>
    <section>
        <PageResource name="Equipment Type" :title="!isMobile ? 'Equipment Type' : ''" 
        includeStockTrackingLink=true
        :fields="fields" 
        :headers="headers"
            endpoint="/api/user/equipment-types" />
    </section>
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
    name: "Equipment-Type",
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
    async created() {
         
    },
    data() {
        return {
            breakpoint: 640,
            headers: [
                {
                    text: "Label",
                    align: "start",
                    value: "Label",
                },
                {
                    text: "Barcode Prefix",
                    align: "start",
                    value: "BarcodePrefix",
                },
                {
                    text: "Capacity Consumption",
                    align: "start",
                    value: "CapacityConsumption",
                },
                {
                    text: "Product Line",
                    align: "start",
                    value: "ProductLineId",
                },
                {
                    text: "Qty",
                    align: "start",
                    value: "qty",
                },
                // {
                //     text: "Qty Available",
                //     align: "start",
                //     value: "qtyAvailable",
                // },
            ],
            fields: {
                Label: {
                    type: String,
                    required: true,
                    value: 'hey',
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
