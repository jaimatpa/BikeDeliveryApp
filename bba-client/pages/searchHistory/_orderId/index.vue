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
              label="LOCATION"
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
              label="ORDER #"
              placeholder="Order#"
              readonly
              dense
              outlined
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="6" sm="6" md="6" xl="6">
            <v-text-field
              v-model="orderData.combination"
              label="Combination"
              placeholder="Combination"
              readonly
              dense
              outlined
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6" md="6" xl="6">
            <v-simple-checkbox
              style="display: inline; margin-bottom: 10px"
              v-model="orderData.extrasDelivered"
              label="Extras Picked Up"
              placeholder=""
              readonly
              dense
              outlined
            >  
          </v-simple-checkbox>
            Could not deliver all extras

            <v-text-field
            style="margin-top: 10px"
            v-model="orderData.extrasDeliveredReason"
              label="Extras Delivery Reason"
              placeholder=""
              readonly
              dense
              outlined
            > Could not deliver all extras
            </v-text-field>
          </v-col>
 
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-simple-checkbox
            style="display: inline; margin-bottom: 10px"
              v-model="orderData.extrasPickedUp"
              label="Extras Picked Up"
              placeholder="Could not pickup all extra items"
              title="Could not pickup all extra items"
              text="hello"
              readonly
              dense
              outlined
            > 
          </v-simple-checkbox> 
          Could not pickup all extra items
          
            <v-text-field
            style="margin-top: 10px"
              v-model="orderData.extrasPickedUpReason"
              label="Extras Picked Up Reason"
              placeholder=""
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
              v-model="orderData.driverDeliveredBy"
              label="Delivered By"
              placeholder=""
              readonly
              dense
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6">
            <v-text-field
              v-model="orderData.driverPickedUpBy"
              label="Picked-up By"
              readonly
              dense
              outlined
            >
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6"> 
            <h1 class="text-h5 mb-4">Message History</h1>
          </v-col>
        </v-row>

        <v-data-table
          readonly
          width="100%"
          block
          cols="12"
          xs="12"
          sm="12"
          md="12"
          xl="12"
          :headers="messageHeaders"
          :items="messages"
          item-key="name"
          class="elevation-6 mb-5"
        >
          <template v-slot:item.direction="{ item }">
            <div>
              {{ getSentReceived(item.direction) }}
            </div>
          </template>

          <template v-slot:item.from="{ item }">
            <div>
              {{ formatPhoneNumber(item.from) }}
            </div>
          </template>

          <template v-slot:item.to="{ item }">
            <div>
              {{ formatPhoneNumber(item.to) }}
            </div>
          </template>
        </v-data-table>
        
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6"> 
            <h1 class="text-h5 mb-4">Equipment</h1>
          </v-col>
        </v-row>
        <v-data-table
          readonly
          width="100%"
          block
          cols="12"
          xs="12"
          sm="12"
          md="12"
          xl="12"
          :headers="headers"
          :items="equipment"
          item-key="name"
          class="elevation-6 mb-5"
        >
          <template v-slot:[`item.checkedDelievery`]="{ item }">
            <v-simple-checkbox
              v-model="item.checkedDelievery"
              v-ripple
              @input="saveUpdate(item)"
            >
            </v-simple-checkbox>
          </template>
          <template v-slot:[`item.checkPickup`]="{ item }">
            <v-simple-checkbox
              v-model="item.checkPickup"
              v-ripple
              @input="saveUpdate(item)"
            />
          </template>
        </v-data-table>

        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" xl="6"> 
            <h1 class="text-h5 mb-4">Extras</h1>
          </v-col>
        </v-row>
        <v-data-table
          readonly
          width="100%"
          block
          cols="12"
          xs="12"
          sm="12"
          md="12"
          xl="12"
          :headers="headersextras"
          :items="extras"
          item-key="name"
          class="elevation-6 mb-5"
        >
          <template v-slot:[`item.checkedDelievery`]="{ item }">
            <v-simple-checkbox
              v-model="item.checkedDelievery"
              v-ripple
              @input="saveUpdate(item)"
            >
            </v-simple-checkbox>
          </template>
          <template v-slot:[`item.checkPickup`]="{ item }">
            <v-simple-checkbox
              v-model="item.checkPickup"
              v-ripple
              @input="saveUpdate(item)"
            />
          </template>
        </v-data-table>
        

        <v-row class="mt-5">
          <v-col cols="12" xs="12" sm="12" md="6" xl="6"> 
            <h1 class="text-h5 mb-4">Delivery Photos</h1>
          </v-col>
        </v-row>

        <v-row cols="12">
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-0.jpeg`" onload="this.style='display: block;'" style="display:none" 
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-1.jpeg`" onload="this.style='display: block;'" style="display:none" 
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-2.jpeg`"  onload="this.style='display: block;'" style="display:none"
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-3.jpeg`" onload="this.style='display: block;'" style="display:none" 
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-4.jpeg`"  onload="this.style='display: block;'" style="display:none"
            />
          </v-col>
        </v-row>

        <v-row class="mt-5">
          <v-col cols="12" xs="12" sm="12" md="6" xl="6"> 
            <h1 class="text-h5 mb-4">Pickup Photos</h1>
          </v-col>
        </v-row>

        <v-row cols="12">
          
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-pickup-0.jpeg`"  onload="this.style='display: block;'" style="display:none"
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-pickup-1.jpeg`"  onload="this.style='display: block;'" style="display:none"
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-pickup-2.jpeg`" onload="this.style='display: block;'" style="display:none" 
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-pickup-3.jpeg`"  onload="this.style='display: block;'" style="display:none"
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="4" xl="4">
            <img
              :src="`https://images.bodhisys.io/${orderData.barcode}-pickup-4.jpeg`" onload="this.style='display: block;'" style="display:none"
            />
          </v-col>
        </v-row>
  
        <v-row class="mt-5">
          <v-col cols="12" xs="12" sm="12" md="6" xl="6"> 
            <h1 class="text-h5 mb-4">App Delivery Photos</h1>
          </v-col>
        </v-row>

        <v-row cols="12">
          <v-col
            style="background-color: #ececec;"
            v-for="image in deliveryImages"
            v-bind:key="image"
            xs="12"
            sm="12"
            md="4"
            lg="4"
            xl="4"
          >
            <v-card elevation="15">
              <v-img :src="image"   />
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-5">
          <v-col cols="12" xs="12" sm="12" md="6" xl="6"> 
            <h1 class="text-h5 mb-4">App Pickup Photos</h1>
          </v-col>
        </v-row>
 
        <v-row cols="12">
          <v-col
            v-for="image in pickupImages" 
            v-bind:key="image"
            xs="12"
            sm="12"
            md="4"
            lg="4"
            xl="4"
          >
            <v-card elevation="15">
              <v-img :src="image"   />
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="uploadFilesData.length">
          <v-col
            v-for="(image, i) in uploadFilesData"
            :key="i"
            class="d-flex child-flex"
            cols="4"
          >
            <v-img
              :src="image.filepath"
              :lazy-src="image.filepath"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="12" xl="12">
            <v-btn
              block
              depressed
              color="primary"
              class="mt-5"
              @click.stop="searchHistoryDialog = true"
            >
              <v-icon left medium color="white"> mdi-share </v-icon>
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
              <v-icon small dark> mdi-pencil </v-icon>
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
  components: {
    Page,
  },
  async mounted() {
    await this.getOrderDetails();
    await this.getOrderExtras();
    await this.getOrderItems();
    await this.getMsgTemplate();
    await this.getUserlocation();
    await this.getOrderImages();
    // await this.sendEmail(), 
    this.getUploadDetails();

    let searchParam = {
      phoneNumber: this.orderData.mobileNo,
    };
    this.messages = await this.$axios.$get("/api/user/twilio/", {
      params: searchParam,
    });
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
      headersextras: [{
              text: "Name",
              align: "start",
              value: "extraName",
          }
      ],
      extras: [],
      smsObject: {
        to: "",
        message: "",
        orderid: "",
        mediaUrl: [],
      },
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
      deliveryImages: [],
      pickupImages: [],
      templateMsg: "",
      userPosition: null,
    };
  },
  methods: {
    ...mapActions("snackbar", {
      showSuccess: "success",
      showError: "error",
    }),
    async getOrderExtras() {
          try 
          {
            let response = await this.$axios.$get("/api/user/deliveryItem/extras", {
                params: {
                    deliveryID: this.orderData.id,
                },
            });

            this.extras = response;
            console.log("Recieved Extras", this.orderData.id, this.extras);
            //  this.$router.go(-1);
          } catch (err) {
                console.log("Issue in getOrderExtras", err);
          }
        },
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
        console.log("Issue in getOrderItems 4", err.response);
      }
    },
    async getOrderImages() {
      // console.log("..................", this.orderData);
      try {
        let response = await this.$axios.$get(
          "/api/user/searchhistory/images",
          {
            params: {
              orderID: this.orderData.orderid,
            },
          }
        );
        let localDeliveryArray = [];
        let localPickupArray = [];
        console.log("IMAGES", response);
        // 'https://images.bodhisys.io/D-Apr0020-22/637848762657544860'
        response.D.forEach((image) => {
          localDeliveryArray.push(
            `https://images.bodhisys.io/${image}`
          );
        });
        response.P.forEach((image) => {
          localPickupArray.push(
            `https://images.bodhisys.io/${image}`
          );
        });
        this.deliveryImages = localDeliveryArray;
        this.pickupImages = localPickupArray;
        console.log("DELIVERY IMAGES", this.deliveryImages);
        console.log("PICKUP IMAGES", this.pickupImages);
      } catch (error) {
        console.log("ERROR", error);
      }
    },
    getUserlocation() {
      if (process.client) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // console.log("Clicked on pointer, position === ", position);
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              // console.log("pos ==== ", pos);
              this.userPosition = pos;
            },
            (error) => {
              // handle error here.
              console.log("error =========== ", error);
            }
          );
        }
      }
    },
    async sendEmail() {
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

      let dataToAdd = this.orderData;
      let userPositionData = this.userPosition;
     
     let output = this.getMessage(
        this.templateMsg,
        infoMap,
        dataToAdd,
        userPositionData
      );

      

      this.smsObject.message = output;
      this.smsObject.images = this.deliveryImages;
      console.log("MESSAGE", this.smsObject.message);
      console.log("IMAGES", this.smsObject.images)

      try {
        let emailResponse = await this.$axios.post(
          "api/user/sendDeliveryEmail",
          {
            params: {
              orderid: this.orderData.orderid,
              message: this.smsObject.message,
              images: this.smsObject.images
            },
          }
        );
      } catch (error) {
        this.loader = false;
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
        return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
          ""
        );
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

      let output = this.getMessage(
        this.templateMsg,
        infoMap,
        dataToAdd,
        userPositionData
      );
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
        let response = await this.$axios.$post(
          "api/user/sendDeliveryEmail",
          this.smsObject
        );
      } catch (error) {}

      try {
        let response = await this.$axios.$post(
          "api/user/resend",
          this.smsObject
        );
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

        const responseData = _.omit(response[0], "date");
        // console.log("ORDER DATA", responseData);
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
        // console.log("template response", response.body);
        this.templateMsg = response.body;
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    getMessage(template, infoMap, userObj, userPosition) {
      let result = template;
      console.log("TEMPLATE", template);
      console.log("TEMPLATE", infoMap);
      console.log("TEMPLATE", userObj);
      console.log("TEMPLATE", userPosition);
      console.log("Temp, InfoMap, UserObj", template, infoMap, userObj);
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
