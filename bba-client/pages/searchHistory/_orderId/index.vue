<template lang="html">
  <Page :title="!isMobile ? 'Order Details' : ''">
    <div class="d-flex flex-column justify-space-between" style="height: 100%">
      <div>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field
              v-model="orderData.date"
              label="DATE"
              placeholder="Date"
              disabled
              filled
              readonly
              dense
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field
              v-model="orderData.name"
              label="NAME"
              placeholder="Name"
              disabled
              readonly
              filled
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
              label="LOCATION"
              placeholder="Location"
              disabled
              readonly
              dense
              filled
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field
              v-model="orderData.orderid"
              label="ORDER #"
              placeholder="Order#"
              disabled
              readonly
              filled
              dense
              outlined
            >
            </v-text-field>
          </v-col>
        </v-row>

        <!-- <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field
              v-model="orderData.rack"
              label="BIKE RACK"
              placeholder="Bike Rack"
              disabled
              readonly
              filled
              dense
              outlined
            >
            </v-text-field>
          </v-col>
        </v-row> -->
      </div>

      <div>
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
      </div>
    </div>

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
            Are you sure you want to send this information to this number?
            {{ smsObject.to }}
            <v-btn
              class="mx-2"
              icon
              color="primary"
              @click="editNumber = !editNumber"
            >
              <v-icon small dark>
                mdi-pencil
              </v-icon>
            </v-btn>
          </p>
          <v-text-field
            v-if="editNumber"
            v-model="smsObject.to"
            append-icon="mdi-mobile"
            label="You can change the number"
            single-line
            outlined
            dense
            clearable
            class="mb-5 order-search-text-field"
            :rules="[rules.required]"
          ></v-text-field>

          <div class="d-flex flex-column">
            <v-btn
              :disabled="smsObject.to === '' || smsObject.to === null"
              class="ma-2"
              color="primary"
              @click="sendNotification()"
            >
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
    this.getOrderDetails();
    this.getUploadDetails();
    this.getMsgTemplate();
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
      smsObject: {
        to: "",
        message: "",
      },
      templateMsg: "",
      editNumber: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      loader: false,
      uploadFilesData: [],
    };
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    async getUploadDetails() {
      try {
        let response = await this.$axios.$get("/api/user/upload", {
          params: {
            orderid: this.$route.params.orderId,
          },
        });

        this.uploadFilesData = response;
      } catch (error) {
        console.log("errror", err.response);
      }
    },
    async sendNotification() {
      this.searchHistoryDialog = false;
      // this.deliveryOrderDialog = false;
      this.loader = true;

      console.log("delivery information", this.orderData);
      let dataToAdd = this.orderData;

      // let message = `Hello ${dataToAdd.name}! Your bike is now available at ${dataToAdd.location}. Your deliver number is ${dataToAdd.orderid}, Bike Rack : ${dataToAdd.rack}, Color : ${dataToAdd.color}, Lock-Combo : ${dataToAdd.combination}. Thank You.`

      // let newMSG = `Hello [customer-name]! \nJOY\n\n\n\nBANGLA\n\n\n\nYour bike is now available at [geo-lat] [geo-long] Your deliver number is [delivery-number] Thank You.`

      let infoMap = {
        "[customer-name]": "name",
        "[location]": "location",
        "[lock-combo]": ["lock", "combination"],
        "[lock]": "lock",
        "[combination]": "combination",
        "[delivery-number]": "orderid",
        "[color]": "color",
        "[rack]": "rack",
        "[geo-lat]": "geo-lat",
        "[geo-long]": "geo-long",
      };

      let output = this.getMessage(this.templateMsg, infoMap, dataToAdd);

      // let message = `Hello ${dataToAdd.name}! Your bike is now available at ${dataToAdd.location}. Your deliver number is ${dataToAdd.orderid}, Bike Rack : ${dataToAdd.rack}, Color : ${dataToAdd.color}, Lock-Combo : ${dataToAdd.combination}. Thank You.`;
      // this.smsObject.message = message;

      // this.smsObject.to = dataToAdd.mobileNo;
      console.log("output", output);
      this.smsObject.message = output;
      // this.smsObject.to ="+8801745476473";

      console.log("Data ready====>", this.smsObject);
      try {
        let response = await this.$axios.$post(
          "api/user/sendSMS",
          this.smsObject
        );
        console.log("respones", response.message);
        this.loader = false;
        this.showSuccess(response.message);
        //  this.$router.go(-1);
      } catch (err) {
        console.log("errror", err.response);
        this.loader = false;
      }
    },
    async getOrderDetails() {
      try {
        let response = await this.$axios.$get("/api/user/searchhistory", {
          params: {
            search: this.$route.params.orderId,
          },
        });
        console.log("respones", response);
        const responseData = _.omit(response[0], "date");
        this.orderData = responseData;
        this.orderData.date = moment(response[0].date).format(
          "MM/DD/YYYY hh:mm A"
        );
        this.smsObject.to = this.orderData.mobileNo;

        //  this.$router.go(-1);
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    async getMsgTemplate() {
      try {
        let response = await this.$axios.$get("api/user/template");
        console.log("respones", response);
        this.templateMsg = response.body;
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    getMessage(template, infoMap, userObj) {
      console.log(template, infoMap, userObj);
      let result = template;
      for (let key in infoMap) {
        if (key === "[lock-combo]") {
          let key0 = infoMap[key][0];
          let key1 = infoMap[key][1];
          result = result.replaceAll(key, `${userObj[key0]}-${userObj[key1]}`);
        }

        result = result.replaceAll(key, userObj[infoMap[key]]);
      }
      return result;
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
