<template>
  <PageResource
    name="Asset"
    :title="!isMobile ? 'List of Assets' : 'Assets'"
    :fields="fields"
    endpoint="/api/user/asset"
  />
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
  name: "pageAssets",
  auth: true,
  head() {
    return { title: "Assets" };
  },
  components: { PageResource },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      fields: {
        barcode: {
          type: String,
          required: true,
        },
        item: {
          type: String,
          required: true,
        },
        lastDelivery: {
          type: Date,
        },
        status: {
          type: String,
        },
      },
    };
  },
};
</script>