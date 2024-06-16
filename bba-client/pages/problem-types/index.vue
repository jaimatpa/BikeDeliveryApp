<template>
    <section>
        <PageResource name="Problem Type" :title="!isMobile ? 'Problem Type' : ''" :fields="fields" :headers="headers"
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
            headers: [
                {
                    text: "Name",
                    align: "start",
                    value: "Name",
                },
                {
                    text: "Description",
                    align: "start",
                    value: "Description",
                },
            ],
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
