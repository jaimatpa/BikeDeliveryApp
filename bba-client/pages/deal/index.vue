<template>
    <section>
        <PageResource name="Deals" :title="!isMobile ? 'Deals' : ''" :fields="fields" endpoint="/api/user/deals" />
    </section>
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
    name: "Activity",
    auth: true,
    head() {
        return {
            title: "Deals"
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
                Title: {
                    type: String,
                },
                Description: {
                    type: String,
                },
                ImagePath: {
                    type: String,
                },
                WebPath: {
                    type: String,
                },
                Notes: {
                    type: String,
                },
                Status: {
                    type: String,
                }
            },
        };
    },
};
</script>
