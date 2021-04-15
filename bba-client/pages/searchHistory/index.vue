<template lang="html">
  <Page>
    <!-- Order Search Field -->
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search by Order#"
      single-line
      hide-details
      outlined
      dense
      clearable
      class="mb-5"
      @keyup="onKeyUp"
      @click:clear="onClearClicked"
    ></v-text-field>

    <v-data-table
      :headers="headers"
      :items="searchHistories"
      :options.sync="options"
      :server-items-length="totalSearchHistory"
      :loading="loading"
      :search="search"
      class="elevation-1"
      :mobile-breakpoint='0'
      :class="{mobile: isMobile}"
    >
    <!-- Date -->
      <template v-slot:item.date="{ item }">
        {{getDateFormat(item.date)}}
       
      </template>
      
      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <v-icon
          medium
          color="primary"
          @click.stop="
            $router.push({
              path: `/searchHistory/${item.orderid}`,
            })
          "
        >
          mdi-page-next
        </v-icon>
      </template>
 
    </v-data-table>
  </Page>
</template>

<script>
import moment from "moment";
import Page from "@/components/paradym/Page";

export default {
  name: "searchHistory",
  auth: true,
  head() {
    return {
      title: "Search History",
    };
  },
  components: { Page },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      totalSearchHistory: 0,

      search: "",
      searchHistories: [],
      loading: true,
      initialRender: true,
      options: {},
      headers: [
        {
          text: "DATE",
          align: "start",
          value: "date",
        },
        { text: "NAME", value: "name", sortable: false },
        { text: "LOCATION", value: "location", sortable: false },
        { text: "RACK", value: "rack", sortable: false },
        { text: "ORDER#", value: "orderid" },
        { text: "ACTION", value: "actions", sortable: false, align: "center" },
      ],
    };
  },
  watch: {
    search: function (newValue) {
      this.getDataFromApi();
    },
    options: {
      handler() {
        // console.log('watch this.options: ', this.options)
        if (this.initialRender === false) {
          this.getDataFromApi();
        }
      },
      deep: true,
    },
  },
  created() {
    this.getDataFromApi();
    this.initialRender = false;
  },
  methods: {
    getDateFormat(date){      
       return moment(date).format('MM/DD/YYYY hh:mm A');
    },
    onClearClicked() {
      if (this.search !== "") {
        this.search = "";
      }
      this.getDataFromApi();
    },
    onKeyUp(event) {
      // console.log('key uppppppp ', typeof event.target.value,  `${event.target.value}`.length)
      if (event.key === "Enter") {
        this.getDataFromApi();
      } else if (`${event.target.value}`.length === 0) {
        // if someone clears the input field.
        this.getDataFromApi();
      }
    },
    async getDataFromApi() {
      this.loading = true;
      this.apiCall().then((data) => {
        this.searchHistories = data.items;
        this.totalSearchHistory = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise(async (resolve, reject) => {
        let param = this.search ? { search: this.search } : {};

        const orderDeliveryMockData = await this.$axios.$get(
          "/api/user/deliveryOrder",
          {
            params: param,
          }
        );

        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        let items = orderDeliveryMockData;
        let total = orderDeliveryMockData?.length;

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
