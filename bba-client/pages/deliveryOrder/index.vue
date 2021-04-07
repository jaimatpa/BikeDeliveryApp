<template lang="html">
  <Page>

     <!-- <h1>vue-barcode-reader demo</h1> -->
  


    <!-- Delivery Order Scan Button  -->
    <v-btn v-if="isMobile" block depressed color="primary" class="mb-5" @click.stop="dialog = true">
      <v-icon left medium color="white" class="mr-2">
        mdi-barcode-scan
      </v-icon>
      Scan Barcode
    </v-btn>

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
      :items="delivaries"
      :options.sync="options"
      :server-items-length="totalOrderDelivery"
      :loading="loading"
      :search="search"
      class="elevation-1"
      :mobile-breakpoint='0'
    >
      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <v-icon
          medium
          color="primary"
          @click.stop="
            $router.push({
              path: `/deliveryOrder/${item.orderid}`,
            })
          "
        >
          mdi-page-next
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
     fullscreen
    >
      <v-card>
        <v-card-title class="title primary--text">
          Enter Barcode
        </v-card-title>
         <v-btn v-if="isMobile" block depressed color="primary" class="mb-5" @click.stop="dialog = false">
     
          Close
    </v-btn>
        <v-card-text>
          <v-text-field
            v-model="searchByBarcode"
            append-icon="mdi-magnify"
            label="Enter Barcode"
            single-line
            hide-details
            outlined
            dense
            clearable
            @click:clear="onClearClicked"
             @keyup="onKeyUp"
            class="mb-5"
          ></v-text-field>
            <BarScanner @code="code" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import _ from "lodash";
import Page from "@/components/paradym/Page";
import BarScanner from "@/components/BarScanner";


export default {
  name: "deliveryOrder",
  auth: true,
  head() {
    return {
      title: "Delivery Order",
    };
  },
  components: { Page,BarScanner},
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      dialog: false,
      breakpoint: 640,
      totalOrderDelivery: 0,
      search: "",
      searchByBarcode: "",
      delivaries: [],
      loading: true,
      initialRender: true,
      options: {},
      headers: [
        {
          text: "Date",
          align: "start",
          value: "date",
        },
        { text: "Name", value: "name", sortable: false },
        { text: "Location", value: "location", sortable: false },
        { text: "Bike Rack", value: "rack", sortable: false },
        { text: "Color", value: "color", sortable: false },
        { text: "Combination", value: "combination", sortable: false },
        { text: "Barcode", value: "barcode", sortable: false },
        { text: "Order", value: "orderid" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
     
    };
  },
  created() {
    this.getDataFromApi();
    this.initialRender = false;
  },
  watch: {
    search: function (newValue) {
      this.getDataFromApi();
    },
    searchByBarcode: function (newValue) {
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
  methods: {
 
    onClearClicked() {
      if (this.search !== "" || this.searchByBarcode !== "") {
        this.search = "";
        this.searchByBarcode = "";
      }
      this.getDataFromApi();
    },
    code(value){
      console.log('This value', value)
      this.searchByBarcode = value
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
        this.delivaries = data.items;
        this.totalOrderDelivery = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise(async (resolve, reject) => {
        let param = this.search
          ? { search: this.search }
          : this.searchByBarcode
          ? { barcodeid: this.searchByBarcode }
          : {};

        const orderDeliveryMockData = await this.$axios.$get(
          "/api/user/deliveryOrder",
          {
            params: param,
          }
        );
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        let items = orderDeliveryMockData;
        let total = orderDeliveryMockData?.length;

        if (orderDeliveryMockData?.length === 1) this.dialog = false;

        if (sortBy?.length === 1 && sortDesc?.length === 1) {
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
