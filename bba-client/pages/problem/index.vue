<template>
    <section>
        <PageResource name="Problem" :title="!isMobile ? 'Problem' : ''" :fields="fields" endpoint="/api/user/problems" />
    </section>
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
    name: "Problem",
    auth: true,
    head() {
        return {
            title: "Problems"
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
                Notes: {
                    type: String,
                },
                Status: {
                    type: "ProblemStatus",
                },
                TypeDesc: {
                    type: String,
                },
                Tag: {
                    type: String,
                },
                Email: {
                    type: String,
                    email: true
                },
                Barcode: {
                    type: String,
                },
            },
        };
    },
};
</script>
