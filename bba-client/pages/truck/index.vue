<template>
<PageResource name="Truck" :title="!isMobile ? 'Trucks' : ''" :fields="fields" endpoint="/api/users" />
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
                Name: {
                    type: String,
                    required: true,
                },
                Notes: {
                    type: String,
                    required: true,
                },
            },
        };
    },
};
</script>
