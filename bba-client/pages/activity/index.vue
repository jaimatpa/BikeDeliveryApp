<template>
    <section>
        <PageResource name="Activities" :title="!isMobile ? 'Activities' : ''" :fields="fields" :headers="headers"
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
            headers: [
                {
                    text: "Title",
                    align: "start",
                    value: "Title",
                },
                {
                    text: "Description",
                    align: "start",
                    value: "Description",
                },
                {
                    text: "Image Path",
                    align: "start",
                    value: "ImagePath",
                },
                {
                    text: "Location Id",
                    align: "start",
                    value: "LocationId",
                },
                {
                    text: "Web Path",
                    align: "start",
                    value: "WebPath",
                },
                {
                    text: "Notes",
                    align: "start",
                    value: "Notes",
                },
                {
                    text: "Status",
                    align: "start",
                    value: "Status",
                },
            ],
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
