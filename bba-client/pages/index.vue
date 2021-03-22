<template>
  <Page>
    <v-row>
      <v-col
        v-for="(item, index) in dashboardItems"
        xs="6"
        sm="6"
        md="3"
        xl="3"
        :key="index"
        :class="isMobile ? 'custom-media-sm' : ''"
      >
        <v-card
          height="180"
          class="d-flex flex-column align-center justify-center cursor-pointer dashboard-card"
          elevation="0"
          :to="item.to"
          outlined
        >
          <v-img
            max-height="70"
            max-width="170"
            :src="item.icon"
            aspect-ratio="1.7"
            contain
          ></v-img>
          <p class="title text--secondary mt-3">{{ item.title }}</p>
        </v-card>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import PageSection from "@/components/paradym/PageSection";

export default {
  name: "pageIndex",
  auth: true,
  head() {
    return { title: "Home" };
  },
  components: { Page, PageSection },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      dashboardItems: [
        {
          title: "Search History",
          icon: require("./../assets/images/dashboard_search.svg"),
          to: "/search",
        },
        {
          title: "Delivery Order",
          icon: require("./../assets/images/dashboard_bike.svg"),
          to: "/deliveryOrder",
        },
        {
          title: "Locking",
          icon: require("./../assets/images/dashboard_lock.svg"),
          to: "/locking",
        },
        {
          title: "Resend",
          icon: require("./../assets/images/dashboard_resend.svg"),
          to: "/resend",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-media-sm {
  flex-basis: 50% !important;

  .dashboard-card {
    height: 120px !important;

    .v-image {
      max-height: 40px !important;
      max-width: 120px !important;
    }

    .title {
      font-size: 1rem !important;
      margin-top: 5px !important;
    }
  }
}
.dashboard-card {
  background-color: #E9E9E9;
  border: 2px solid #4c9a2a;
}
</style>
