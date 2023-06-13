<template>
    <section>
        <PageResource name="Problem" :title="!isMobile ? 'Problem' : ''" :fields="fields" endpoint="/api/user/problems"
            :headers="headers" />
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
            headers: [
                {
                    text: "Email",
                    align: "start",
                    value: "Email",
                },
                {
                    text: "Type",
                    align: "start",
                    value: "TypeDesc",
                },
                {
                    text: "Notes",
                    align: "start",
                    value: "Notes",
                },
                {
                    text: "TimeStamp",
                    align: "start",
                    value: "TimeStamp"
                },
                {
                    text: "Status",
                    align: "start",
                    value: "Status",
                },
                {
                    text: "Barcode",
                    align: "start",
                    value: "Barcode",
                },
            ],
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
