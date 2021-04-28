<template lang="html">
  <Page :title="!isMobile ? 'Delivery Order Details' : ''">
    <v-stepper v-model="deliveryStepper" class="order-details-stepper">
      <v-stepper-items>
        <!-- First Stepper -->
        <v-stepper-content step="1">
          <v-form ref="form" v-model="valid" lazy-validation>
            <div
              class="d-flex flex-column justify-space-between"
              style="height: 100%"
            >
              <div>
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field
                      v-model="deliveryOrderData.orderid"
                      label="ORDER #"
                      placeholder="Order"
                      readonly
                      disabled
                      filled
                      dense
                      outlined
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-datetime-picker
                      label="DATE"
                      v-model="datetime"
                      :textFieldProps="{ outlined: 'outlined', dense: 'dense' }"
                    >
                      <template v-slot:dateIcon>
                        <v-icon>mdi-calendar</v-icon>
                      </template>

                      <template v-slot:timeIcon>
                        <v-icon>mdi-clock-time-four-outline</v-icon>
                      </template>
                    </v-datetime-picker>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field
                      v-model="deliveryOrderData.name"
                      label="NAME"
                      placeholder="Name"
                      dense
                      outlined
                      :counter="30"
                      :rules="nameRules"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field
                      v-model="deliveryOrderData.location"
                      label="LOCATION"
                      placeholder="Location"
                      dense
                      outlined
                      :counter="30"
                      :rules="locationRules"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-select
                      :items="colorItems"
                      v-model="defaultColorValue"
                      label="COLOR"
                      dense
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-text-field
                      v-model="defaultCombinationValue"
                      label="COMBINATION"
                      placeholder="Combination"
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
                    v-model="deliveryOrderData.rack"
                    label="BIKE RACK"
                    placeholder="Bike Rack"
                    readonly
                    disabled
                    filled
                    dense
                    outlined
                  >
                  </v-text-field>
                </v-col>
              </v-row> -->
              </div>
              <div>
                <!-- First Stepper Button -->
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-btn
                      block
                      depressed
                      color="primary"
                      :disabled="!valid"
                      @click.stop="deliveryStepper = 3"
                    >
                      Next
                      <v-icon dark>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                    <v-btn
                      block
                      depressed
                      color="error"
                      @click.stop="deliveryCancelOrderDialog = true"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-form>
        </v-stepper-content>

        <!-- Third Stepper -->
        <v-stepper-content step="3">
          <ThirdStepper
            @set-delivery-stepper="setDelivaryStepper"
            @set-current-user-position="setCurrentUserPosition"
            :deliveryOrderData="deliveryOrderData"
          />
        </v-stepper-content>

        <!-- Fourth Stepper -->
        <v-stepper-content step="4">
          <FourthStepper
            :deliveryOrderData="deliveryOrderData"
            :emptyPhoto="emptyPhoto"
            :userPosition="userPosition"
            :dateTime="datetime"
            :defaultColorValue="defaultColorValue"
            :defaultCombinationValue="defaultCombinationValue"
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
          <v-toolbar-title>Send</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click.stop="deliveryOrderDialog = false">
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
              @click.stop="deliveryOrderDialog = false"
            >
              Cancel
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delivery Cancel Dialog -->
    <v-dialog
      v-model="deliveryCancelOrderDialog"
      transition="dialog-bottom-transition"
      max-width="350"
      content-class="order-details-dialog"
    >
      <v-card>
        <v-toolbar dense color="primary" dark elevation="0">
          <v-toolbar-title>Cancel Delivery</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click.stop="deliveryCancelOrderDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="my-5 text-center">
          <p class="title mb-3 secondary--text sure-title">
            Are you sure you want to cancel this delivery order?
          </p>

          <div class="d-flex flex-column">
            <v-btn class="ma-2" color="error" @click.stop="$router.go(-1)">
              Yes
            </v-btn>
            <v-btn
              class="ma-2"
              outlined
              color="error"
              @click.stop="deliveryCancelOrderDialog = false"
            >
              No
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </Page>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapActions } from "vuex";

import Page from "@/components/paradym/Page";
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
  components: {
    Page,
    ThirdStepper,
    FourthStepper,
  },
  async created() {
    this.getOrderDetails();
    this.getMsgTemplate();
    this.getLockingDetails();
  },
  data() {
    return {
      valid: true,
      breakpoint: 640,
      deliveryOrderData: {},
      deliveryStepper: 1,
      deliveryOrderDialog: false,
      deliveryCancelOrderDialog: false,
      emptyPhoto: emptyPhoto,
      cyclePhoto: cyclePhoto,
      loader: false,

      defaultColorValue: "",
      defaultCombinationValue: "",
      colorItems: [],
      lockingData: [],

      // Date field
      datetime: null,
      smsObject: {
        to: "",
        message: "",
      },
      templateMsg: "",
      editNumber: false,

      // Current User Data
      userPosition: {},

      //Rules
      rules: {
        required: (value) => !!value || "Required.",
      },
      nameRules: [
        (v) => !!v || "Name is required",
        (v) =>
          (v && v.length <= 30) ||
          "Name must be less than or equal 30 characters",
      ],
      locationRules: [
        (v) => !!v || "Location is required",
        (v) =>
          (v && v.length <= 30) ||
          "Location must be less than or equal 30 characters",
      ],
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  watch: {
    defaultColorValue(newVal, oldVal) {
      if (oldVal) {
        const data = _.find(this.lockingData, (o) => o.color === newVal);
        this.defaultCombinationValue = data && data.combination;
      }
    },
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    async getLockingDetails() {
      const lockingDataResponse = await this.$axios.$get("/api/user/locking");
      this.lockingData = lockingDataResponse;
      this.colorItems = _.map(lockingDataResponse, "color");
    },
    async sendNotification() {
      this.searchHistoryDialog = false;
      this.deliveryOrderDialog = false;
      this.loader = true;

      console.log("delivery information", this.deliveryOrderData);
      let dataToAdd = this.deliveryOrderData;
      let userPositionData = this.userPosition;

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

      let output = this.getMessage(
        this.templateMsg,
        infoMap,
        dataToAdd,
        userPositionData
      );

      // let message = `Hello ${dataToAdd.name}! Your bike is now available at ${dataToAdd.location}. Your deliver number is ${dataToAdd.orderid}, Bike Rack : ${dataToAdd.rack}, Color : ${dataToAdd.color}, Lock-Combo : ${dataToAdd.combination}. Thank You.`;
      // this.smsObject.message = message;

      // this.smsObject.to = dataToAdd.mobileNo;
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
        console.log("error", error);
      }
    },
    async getOrderDetails() {
      try {
        let response = await this.$axios.$get("/api/user/deliveryOrder", {
          params: {
            search: this.$route.params.orderId,
          },
        });

        // const responseData = _.omit(response[0], "date");
        // this.deliveryOrderData = responseData;
        // this.deliveryOrderData.date = moment(response[0].date).format(
        //   "MM/DD/YYYY hh:mm A"
        // );

        this.deliveryOrderData = response[0];

        this.datetime = new Date(response[0].date);
        this.defaultColorValue = response[0].color;
        this.defaultCombinationValue = response[0].combination;
        this.smsObject.to = this.deliveryOrderData.mobileNo;
        //  this.$router.go(-1);
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    setDelivaryStepper(param) {
      this.deliveryStepper = param;
    },
    setCurrentUserPosition(currentUserData) {
      this.userPosition = currentUserData;
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
          // this.$router.push({
          //   path: "/callForHelp",
          //   query: { orderid: this.deliveryOrderData.orderid },
          // });

          const saveData = {
            date: this.datetime,
            name: this.deliveryOrderData.name,
            location: this.deliveryOrderData.location,
            color: this.defaultColorValue,
            combination: this.defaultCombinationValue,
          };

          const result = await this.$axios.$post(
            "/api/user/deliveryorderupdate",
            saveData,
            {
              params: {
                orderid: this.deliveryOrderData.orderid,
              },
            }
          );

          if (result) this.$router.push("/deliveryOrder");
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
    getMessage(template, infoMap, userObj, userPosition) {
      let result = template;
      try {
        for (let key in infoMap) {
          if (key === "[lock-combo]") {
            let key0 = infoMap[key][0];
            let key1 = infoMap[key][1];
            result = result.replaceAll(
              key,
              `${userObj[key0]}-${userObj[key1]}`
            );
          }

          if (key === "[geo-lat]" && userPosition) {
            result = result.replaceAll(key, userPosition.lat);
          }
          if (key === "[geo-long]" && userPosition) {
            result = result.replaceAll(key, userPosition.lng);
          }

          result = result.replaceAll(key, userObj[infoMap[key]]);
        }

        return result;
      } catch (error) {
        console.log(error);
      }

      return "";
    },
  },
};
</script>

<style lang="scss">
.order-details-dialog {
  box-shadow: none !important;

  .sure-title {
    font-size: 1rem !important;
    line-height: 1.2rem !important;
  }
}
</style>
