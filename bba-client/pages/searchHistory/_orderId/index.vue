<template lang="html">
  <Page :title="!isMobile ? 'Order Details' : ''">
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="orderData.date"
          label="Date"
          placeholder="Date"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="orderData.name"
          label="Name"
          placeholder="Name"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="orderData.location"
          label="Location"
          placeholder="Location"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="orderData.orderid"
          label="Order"
          placeholder="Order"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="orderData.rack"
          label="Bike Rack"
          placeholder="Bike Rack"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Notification Send Button -->
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-btn
          block
          depressed
          color="primary"
          @click.stop="searchHistoryDialog = true"
        >
          <v-icon left medium color="white">
            mdi-share
          </v-icon>
          Resend
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search History Dialog -->
    <v-dialog
      v-model="searchHistoryDialog"
      transition="dialog-bottom-transition"
      max-width="350"
      content-class="search-history-dialog"
    >
      <v-card>
        <v-toolbar dense color="primary" dark elevation="0">
          <v-toolbar-title>Resend</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click.stop="searchHistoryDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="my-5 text-center">
          <p class="title mb-3 secondary--text sure-title">
            Are you sure you want to resend this information?
          </p>

          <div class="d-flex flex-column">
            <v-btn class="ma-2" color="primary" @click="sendNotification()">
              Confirm
            </v-btn>
            <v-btn
              class="ma-2"
              outlined
              color="error"
              @click.stop="searchHistoryDialog = false"
            >
              Cancel
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapActions } from "vuex";

import Page from "@/components/paradym/Page";
import searchMockData from "@/webHooks/SEARCH_MOCK_DATA.json";

export default {
  name: "searchHistoryDetails",
  auth: true,
  head() {
    return {
      title: "Search History Details",
    };
  },
  components: { Page },
  async created() {
   this.getOrderDetails()
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      searchHistoryDialog: false,
      orderData: {},
    };
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    sendNotification() {
      this.searchHistoryDialog = false;
      this.showSuccess("Notification Sent.");
      this.$router.go(-1);
    },
    async getOrderDetails() {

       try {
        let response = await this.$axios.$get(
          "/api/user/deliveryOrder",
          {
            params: {
              search : this.$route.params.orderId
            },
          }
        );
        console.log('respones', response);
        const responseData = _.omit(response[0], "date");
        this.orderData = responseData;
        this.orderData.date = moment(response[0].date).format('MM/DD/YYYY hh:mm A');
       
        //  this.$router.go(-1);
       
      } catch (err) {
        console.log('errror', err.response);
       
      }

    },
  },
};
</script>

<style lang="scss">
.search-history-dialog {
  box-shadow: none !important;

  .sure-title {
    font-size: 1rem !important;
    line-height: 1.2rem !important;
  }
}
</style>
