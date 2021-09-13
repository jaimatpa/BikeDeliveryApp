<template lang="html">
  <Page :title="!isMobile ? 'Order Details' : ''">
    <div class="d-flex flex-column justify-space-between" style="height: 100%">
      <div>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field v-model="orderData.date" label="DATE" placeholder="Date" readonly dense outlined> </v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field v-model="orderData.name" label="NAME" placeholder="Name" readonly dense outlined> </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field v-model="orderData.location" label="LOCATION" placeholder="Location" readonly dense outlined> </v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field v-model="orderData.orderid" label="ORDER #" placeholder="Order#" readonly dense outlined> </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field v-model="orderData.combination" label="Combination" placeholder="Combination" readonly dense outlined> </v-text-field>
          </v-col>
        </v-row>

        <v-row cols="12">
          <header>
            <h1 class="text-h4 mb-4 ml-2 primary--text">Message History</h1>
          </header>
        </v-row>
        <v-data-table readonly width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="messageHeaders" :items="messages" item-key="name" class="elevation-6 ma-1 mb-5">
          <template v-slot:item.direction="{ item }">
            {{ getSentReceived(item.direction) }}
          </template>

          <template v-slot:item.from="{ item }">
            {{ formatPhoneNumber(item.from) }}
          </template>

          <template v-slot:item.to="{ item }">
            {{ formatPhoneNumber(item.to) }}
          </template>
        </v-data-table>
        <v-row cols="12">
          <header>
            <h1 class="text-h4 mb-4 ml-2 primary--text">Equipment</h1>
          </header>
        </v-row>
        <v-data-table readonly width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="headers" :items="equipment" item-key="name" class="elevation-6 ma-1 mb-5">
          <template v-slot:[`item.checkedDelievery`]="{ item }">
            <v-simple-checkbox v-model="item.checkedDelievery" v-ripple @input="saveUpdate(item)"> </v-simple-checkbox>
          </template>
          <template v-slot:[`item.checkPickup`]="{ item }">
            <v-simple-checkbox v-model="item.checkPickup" v-ripple @input="saveUpdate(item)"> </v-simple-checkbox>
          </template>
        </v-data-table>
        <v-row cols="12">
          <header>
            <h1 class="text-h4 mb-4 primary--text">Delivery Photos</h1>
          </header>
        </v-row>

        <v-row cols="12">
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/${orderData.barcode}-0.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/${orderData.barcode}-1.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/${orderData.barcode}-2.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/${orderData.barcode}-3.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/${orderData.barcode}-4.jpeg`" />
          </v-col>
        </v-row>

        <v-row cols="12">
          <header>
            <h1 class="text-h4 mb-4 primary--text">Pickup Photos</h1>
          </header>
        </v-row>

        <v-row cols="12">
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/pickup/${orderData.barcode}-0.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/pickup/${orderData.barcode}-1.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/pickup/${orderData.barcode}-2.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/pickup/${orderData.barcode}-3.jpeg`" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img :src="`https://images.hiretheproz.com/pickup/${orderData.barcode}-4.jpeg`" />
          </v-col>
        </v-row>

        <v-row v-if="uploadFilesData.length">
          <v-col v-for="(image, i) in uploadFilesData" :key="i" class="d-flex child-flex" cols="4">
            <v-img :src="image.filepath" :lazy-src="image.filepath" aspect-ratio="1" class="grey lighten-2">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="12" xl="12">
            <v-btn block depressed color="primary" class="mt-5" @click.stop="searchHistoryDialog = true">
              <v-icon left medium color="white">
                mdi-share
              </v-icon>
              Resend
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div>
        <!-- Notification Send Button -->
      </div>
    </div>

    <!-- Search History Dialog -->
    <v-dialog v-model="searchHistoryDialog" transition="dialog-bottom-transition" max-width="350" content-class="search-history-dialog">
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
            <v-btn class="mx-2" icon color="primary" @click="editNumber = !editNumber">
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
            <v-btn :disabled="smsObject.to === '' || smsObject.to === null" class="ma-2" color="primary" @click="sendNotification()">
              Confirm
            </v-btn>
            <v-btn class="ma-2" outlined color="error" @click.stop="searchHistoryDialog = false">
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
  components: {
    Page,
  },
  async created() {
    await this.getOrderDetails();
    await this.getOrderItems();
    this.getUploadDetails();
    this.getMsgTemplate();
    let searchParam = {
      phoneNumber: this.orderData.mobileNo,
    };
    this.messages = await this.$axios.$get("/api/user/twilio/", { params: searchParam });
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
        orderid: "",
        mediaUrl: [],
      },
      templateMsg: "",
      editNumber: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      loader: false,
      uploadFilesData: [],
      messageHeaders: [
        {
          text: "DATE SENT",
          value: "dateSent",
          width: "200",
        },
        {
          text: "MESSAGE",
          value: "body",
          sortable: false,
        },
        {
          text: "SENT/RECEIVED",
          value: "direction",
          sortable: false,
          width: "150",
        },
        {
          text: "FROM #",
          value: "from",
          width: "150",
          sortable: false,
        },
        {
          text: "TO #",
          value: "to",
          width: "150",
          sortable: false,
        },
        {
          text: "Photo #",
          value: "numMedia",
          align: "center",
        },
      ],
      messages: [],
      headers: [
        {
          text: "ITEM",
          align: "start",
          value: "item",
        },
        {
          text: "BARCODE",
          value: "serialbarcode",
        },
        {
          text: "DELIVERED",
          value: "checkedDelievery",
        },
        {
          text: "PICKED UP",
          value: "checkPickup",
          sortable: false,
          align: "center",
        },
      ],
      equipment: [],
    };
  },
  methods: {
    ...mapActions("snackbar", {
      showSuccess: "success",
      showError: "error",
    }),
    async getOrderItems() {
      try {
        let response = await this.$axios.$get("/api/user/deliveryItem", {
          params: {
            deliveryID: this.orderData.id,
          },
        });
        this.equipment = response;

        //  this.$router.go(-1);
      } catch (err) {
        console.log("Issue in getOrderItems", err.response);
      }
    },
    getSentReceived(direction) {
      console.log(direction);
      if (direction === "outbound-api") {
        return "Sent";
      } else if (direction === "outbound-reply") {
        return "Automatic Reply";
      } else {
        return "Received";
      }
    },
    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = match[1] ? "+1 " : "";
        return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
      }
      return null;
    },
    async saveUpdate(item) {
      // let response = await this.$axios.$put("/api/user/deliveryItem", item);
    },
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
      this.deliveryOrderDialog = false;
      this.loader = true;
      let dataToAdd = this.orderData;
      let userPositionData = this.userPosition;

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

      let output = this.getMessage(this.templateMsg, infoMap, dataToAdd, userPositionData);
      console.log("IN OUTPUT");

      console.log(output);
      this.smsObject.message = output;
      this.smsObject.orderid = this.orderData.orderid;

      // try {
      //     let response = await this.uploadFiles(this.smsObject);
      // } catch (error) {
      //     console.log("error", error);
      // }
      console.log("TESTING!!!!");
      console.log(this.orderData);

      try {
        let response = await this.$axios.$post("api/user/sendDeliveryEmail", this.smsObject);
      } catch (error) {}

      try {
        let response = await this.$axios.$post("api/user/resend", this.smsObject);
        this.loader = false;
        this.showSuccess(response.message);
        this.$router.push("/deliveryOrder");
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
        this.orderData.date = moment(response[0].date).format("MM/DD/YYYY hh:mm A");
        this.smsObject.to = this.orderData.mobileNo;

        //  this.$router.go(-1);
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    async getMsgTemplate() {
      try {
        let response = await this.$axios.$get("api/user/template");
        this.templateMsg = response.body;
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    getMessage(template, infoMap, userObj, userPosition) {
      let result = template;
      console.log(template, infoMap, userObj);
      try {
        for (let key in infoMap) {
          if (key === "[lock-combo]") {
            let key0 = infoMap[key][0];
            let key1 = infoMap[key][1];
            result = result.replaceAll(key, `${userObj[key0]}-${userObj[key1]}`);
          }

          if (key === "[geo-lat]" && userPosition) {
            result = result.replaceAll(key, userPosition.lat);
          }
          if (key === "[geo-long]" && userPosition) {
            result = result.replaceAll(key, userPosition.lng);
          }

          result = result.replaceAll(key, userObj[infoMap[key]]);
        }
        console.log("RETURNING RESULT", result);
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
.search-history-dialog {
  box-shadow: none !important;

  .sure-title {
    font-size: 1rem !important;
    line-height: 1.2rem !important;
  }
}
</style>
