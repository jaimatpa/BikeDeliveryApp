<template lang="html">
  <Page :title="!isMobile ? 'Delivery Order Details' : ''">
    <v-stepper v-model="deliveryStepper" class="order-details-stepper">
      <v-stepper-items>
        <!-- First Stepper -->
        <v-stepper-content step="1">
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
              <v-text-field
                v-model="deliveryOrderData.date"
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
                v-model="deliveryOrderData.name"
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
                v-model="deliveryOrderData.location"
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
                v-model="deliveryOrderData.orderid"
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
                v-model="deliveryOrderData.rack"
                label="Bike Rack"
                placeholder="Bike Rack"
                readonly
                dense
                outlined
              >
              </v-text-field>
            </v-col>
          </v-row>

          <!-- First Stepper Button -->
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
              <v-btn
                block
                depressed
                color="primary"
                @click.stop="deliveryStepper = 2"
              >
                Next
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
              <v-btn block depressed color="error" @click.stop="$router.go(-1)">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <!-- Second Stepper -->
        <v-stepper-content step="2">
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
              <v-text-field
                v-model="deliveryOrderData.color"
                label="Color"
                placeholder="Color"
                readonly
                dense
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
              <v-text-field
                v-model="deliveryOrderData.combination"
                label="Combination"
                placeholder="Combination"
                readonly
                dense
                outlined
              >
              </v-text-field>
            </v-col>
          </v-row>

          <!-- Second Stepper Button -->
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                color="primary"
                @click.stop="deliveryStepper = 3"
              >
                Next
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                color="accent"
                @click.stop="deliveryStepper = 1"
              >
                Back
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn block depressed color="error" @click.stop="$router.go(-1)">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <!-- Third Stepper -->
        <v-stepper-content step="3">
          <ThirdStepper @set-delivery-stepper="setDelivaryStepper" />
        </v-stepper-content>

        <!-- Fourth Stepper -->
        <v-stepper-content step="4">
          <FourthStepper
            :deliveryOrderData="deliveryOrderData"
            :cyclePhoto="cyclePhoto"
            @set-delivery-stepper="setDelivaryStepper"
            @set-delivery-order-dialog="setDelivaryDialog"
            @setUploadFiles="setUploadFiles"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <!-- Search History Dialog -->
    <v-dialog
      v-model="deliveryOrderDialog"
      transition="dialog-bottom-transition"
      max-width="350"
      content-class="order-details-dialog"
    >
      <v-card>
        <v-toolbar dense color="primary" dark elevation="0">
          <v-toolbar-title>Resend</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click.stop="deliveryOrderDialog = false">
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
              @click.stop="deliveryOrderDialog = false"
            >
              Cancel
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
      <v-overlay :value="loader">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </Page>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapActions } from "vuex";

import Page from "@/components/paradym/Page";
import deliveryOrderMockData from "@/webHooks/ORDER_DELIVERY_MOCK_DATA.json";
import emptyPhoto from "@/assets/images/empty.jpg";
import cyclePhoto from "@/assets/images/cycle@2x.png";

import ThirdStepper from "@/components/delivery-order/steppers/ThirdStepper";
import FourthStepper from "@/components/delivery-order/steppers/FourthStepper";

export default {
  name: "deliveryOrderDetails",
  auth: true,
  head() {
    return {
      title: "Delivery Order Details",
    };
  },
  components: { Page, ThirdStepper, FourthStepper },
  async created() {
    this.getOrderDetails();
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
      deliveryOrderData: {},
      deliveryStepper: 1,
      deliveryOrderDialog: false,
      emptyPhoto: emptyPhoto,
      cyclePhoto: cyclePhoto,
      loader: false,
      smsObject: {
        to: "",
        message: "",
      },
      templateMsg: "",
    };
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    async sendNotification() {
      this.searchHistoryDialog = false;
      this.deliveryOrderDialog = false;
      this.loader = true;

      console.log("delivery information", this.deliveryOrderData);
      let dataToAdd = this.deliveryOrderData;

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
      };

      let output = this.getMessage(this.templateMsg, infoMap, dataToAdd);

      // let message = `Hello ${dataToAdd.name}! Your bike is now available at ${dataToAdd.location}. Your deliver number is ${dataToAdd.orderid}, Bike Rack : ${dataToAdd.rack}, Color : ${dataToAdd.color}, Lock-Combo : ${dataToAdd.combination}. Thank You.`;
      // this.smsObject.message = message;

      this.smsObject.to = dataToAdd.mobileNo;
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

      try {
        this.uploadFiles();
      } catch (error) {
        console.log('error', error);
      }
    },
    async getOrderDetails() {
      try {
        let response = await this.$axios.$get("/api/user/deliveryOrder", {
          params: {
            search: this.$route.params.orderId,
          },
        });

        const responseData = _.omit(response[0], "date");
        this.deliveryOrderData = responseData;
        this.deliveryOrderData.date = moment(response[0].date).format("MM/DD/YYYY");

        //  this.$router.go(-1);
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    setDelivaryStepper(param) {
      this.deliveryStepper = param;
    },
    async upload(upload) {
      const blob = await fetch(upload.local_blob_url).then((r) => r.blob());
      const newfileObj = new File([blob], `${upload.originalName}.jpeg`, {
        type: blob.type,
      });

      let formData = new FormData();
      formData.append("file", newfileObj);

      try {
        let result = await this.$axios.$post(
          "/api/user/upload?orderid=" + this.deliveryOrderData.orderid,
          formData
        );

        if (result.success) {
          console.log(`upload success!!! ${this.deliveryOrderData.orderid}`);
          this.$router.push({path: "/callForHelp", query: {orderid: this.deliveryOrderData.orderid}})
        } else {
          console.log("upload failed!!!");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async uploadFiles() {
      this.uploads.forEach((upload) => {
        this.upload(upload);
      });
    },
    async setUploadFiles(uploads) {
      this.uploads = uploads;
    },

    setDelivaryDialog(param) {
      this.deliveryOrderDialog = param;
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
.order-details-stepper {
  .v-stepper__wrapper {
    .v-input {
      padding: 5px 0 !important;
    }
  }
}

.order-details-dialog {
  box-shadow: none !important;

  .sure-title {
    font-size: 1rem !important;
    line-height: 1.2rem !important;
  }
}
</style>
