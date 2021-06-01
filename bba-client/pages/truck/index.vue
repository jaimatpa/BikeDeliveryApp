<template>
<PageResource name="Truck" :title="!isMobile ? 'Trucks' : ''" :fields="fields" endpoint="/api/user/truck" />
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
                notes: {
                    type: String,
                    required: true,
                },
            },
        };
    },
};
</script>
