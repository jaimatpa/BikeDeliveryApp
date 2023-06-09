<template>
    <section>
        <PageResource name="Activities" :title="!isMobile ? 'Activities' : ''" :fields="fields"
            endpoint="/api/user/activities" />
    </section>
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
    name: "Activity",
    auth: true,
    head() {
        return {
            title: "Activities"
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
                LocationId: {
                    type: Number,
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
