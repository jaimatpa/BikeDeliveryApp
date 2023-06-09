<template>
    <section>
        <PageResource name="Problem Type" :title="!isMobile ? 'Problem Type' : ''" :fields="fields"
            endpoint="/api/user/problem-types" />
    </section>
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
    name: "Problem Type",
    auth: true,
    head() {
        return {
            title: "Problem Types"
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
                },
                Description: {
                    type: String,
                }
            },
        };
    },
};
</script>
