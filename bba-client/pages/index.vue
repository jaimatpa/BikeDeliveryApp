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

    <v-row>
      <v-col xs="12" sm="12" md="12" xl="12" class="mt-5" justify="center">
        <div :class="[isMobile ? 'text-center' : '']">
          <p class="headline text-uppercase primary--text mb-1">
            Today's Delivaries
          </p>
          <v-divider :class="[isMobile ? 'mobile-divider' : '']"></v-divider>
        </div>
      </v-col>
    </v-row>

    <!-- Orders Mock Data Table -->
    <v-row>
      <v-col xs="12" sm="12" md="12" xl="12" class="mt-1">
        <v-data-table
          :headers="headers"
          :items="orders"
          :options.sync="options"
          :server-items-length="totalOrders"
          :loading="loading"
          class="elevation-1"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import PageSection from "@/components/paradym/PageSection";
import orderMockData from "@/webHooks/ORDER_MOCK_DATA.json";

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
      totalOrders: 0,
      orders: [],
      loading: true,
      options: {},
      headers: [
        {
          text: "Order#",
          align: "start",
          sortable: false,
          value: "order",
        },
        { text: "Name", value: "name" },
        { text: "Location", value: "location" },
      ],
      dashboardItems: [
        {
          title: "Search History",
          icon: require("./../assets/images/dashboard_search.svg"),
          to: "/searchHistory",
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
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    async getDataFromApi() {
      this.loading = true;
      this.apiCall().then((data) => {
        this.orders = data.items;
        this.totalOrders = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        let items = orderMockData;
        const total = orderMockData.length;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]];
            const sortB = b[sortBy[0]];

            if (sortDesc[0]) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }

        if (itemsPerPage > 0) {
          items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        }

        setTimeout(() => {
          resolve({
            items,
            total,
          });
        }, 1000);
      });
    },
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
  background-color: #e9e9e9;
  border: 2px solid #4c9a2a;
}
.mobile-divider {
  max-width: 50%;
  margin: 0 auto;
}
</style>
