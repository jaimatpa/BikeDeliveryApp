<template lang="html">
  <Page :title="!isMobile ? 'Delivery Order Details' : ''">
    <v-stepper v-model="deliveryStepper" class="order-details-stepper">
      <v-stepper-items>
        <!-- First Stepper -->
        <v-stepper-content step="1">
          <div class="d-flex flex-column justify-space-between" style="height: 100%">
            <div class="mt-1">
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-text-field v-model="deliveryOrderData.orderid" label="ORDER #" placeholder="Order" readonly dense
                    outlined>
                  </v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition"
                    offset-y max-width="290px" min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="dateFormatted" label="Date" hint="MM/DD/YYYY format" persistent-hint
                        v-bind="attrs" @blur="date = parseDate(dateFormatted)" v-on="on" readonly outlined
                        dense></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-text-field v-model="deliveryOrderData.name" label="NAME" placeholder="Name" readonly dense
                    outlined>
                  </v-text-field>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-text-field v-model="deliveryOrderData.location" label="LOCATION" placeholder="Location" readonly
                    dense outlined>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-select :items="colorItems" v-model="defaultColorValue" label="Color" dense outlined></v-select>
                  <!--                                <pre>{{ colorItems }}</pre>-->
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-text-field v-model="defaultCombinationValue" label="COMBINATION" placeholder="Combination" readonly
                    dense outlined>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row cols="12" xs="12" sm="12" md="12" xl="12">
                <v-textarea v-model="deliveryOrderData.note" label="NOTES" placeholder="NOTES" readonly dense outlined>
                </v-textarea>
              </v-row>
            </div>
            <div>
              <!-- First Stepper Button -->
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-btn block depressed color="error" @click.stop="deliveryCancelOrderDialog = true">
                    Cancel
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                  <v-btn :disabled="isNextButtonDisabled" block depressed color="primary"
                    @click.stop="deliveryStepper = 2">
                    Next
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div>
            <v-row dense style="margin-top: 10px;">
              <v-col cols="6" xs="6" sm="6" md="6" xl="6">
                <v-text-field v-model="manualCode" label="Barcode" placeholder="Barcode" dense outlined>
                </v-text-field>
              </v-col>
              <v-col cols="3" xs="3" sm="3" md="3" xl="3">
                <v-btn block depressed color="primary" @click="manualScan">
                  Scan
                </v-btn>
              </v-col>
              <v-col cols="3" xs="3" sm="3" md="3" xl="3">
                <v-btn block depressed color="blue" @click.stop="openScanner">
                  <v-icon size="50" medium color="white">
                    mdi-barcode
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="headers"
              :items="equipment" item-key="name" class="elevation-1 ma-1 mb-2">
              <template v-slot:[`item.checkedDelievery`]="{ item }">
                <v-simple-checkbox v-model="item.checkedDelievery" v-ripple @input="saveUpdate(item)" :disabled="true">

                </v-simple-checkbox>
              </template>
              <!-- <template v-slot:[`item.actions`]="{ item }">
                            <v-icon size="50" medium color="primary" @click.stop="currentItem=item;scanDialogVisible = true;cameraRender += 1">
                                mdi-barcode
                            </v-icon>
                        </template> -->
            </v-data-table>

            <h3 class="mb-2 mt-2">Extras</h3>
            <v-data-table width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="headersextras"
              :items="extras" item-key="name" class="elevation-6 ma-1 mb-2">
            </v-data-table>

            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12" xl="12">
                <v-checkbox label="Unable to deliver all extra items" v-model="deliveryOrderData.extrasDelivered"
                  v-ripple></v-checkbox>
                <v-textarea label="Reason why you can't deliver all extra items." visible
                  v-model="deliveryOrderData.extrasDeliveredReason" :disabled="!deliveryOrderData.extrasDelivered"
                  :v-show="deliveryOrderData.extrasDelivered" hide-details></v-textarea>
              </v-col>

            </v-row>
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-btn block depressed color="accent" @click.stop="deliveryStepper = 1">
                  Back
                </v-btn>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                <v-btn block depressed color="primary" @click.stop="deliveryStepper = 3">
                  Next
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-stepper-content>

        <!-- Third Stepper -->
        <v-stepper-content step="3">
          <ThirdStepper ref="thirdStep" @set-delivery-stepper="setDelivaryStepper"
            :deliveryOrderData="deliveryOrderData" :userPosition="userPosition" />
        </v-stepper-content>

        <!-- Fourth Stepper -->
        <v-stepper-content step="4">
          <FourthStepper :deliveryOrderData="deliveryOrderData" :cyclePhoto="cyclePhoto"
            @set-delivery-stepper="setDelivaryStepper" @set-delivery-order-dialog="setDelivaryDialog"
            @setUploadFiles="setUploadFiles" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <!-- Search History Dialog -->
    <v-dialog v-model="deliveryOrderDialog" transition="dialog-bottom-transition" max-width="350"
      content-class="order-details-dialog">
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
            <v-btn class="mx-2" icon color="primary" @click="editNumber = !editNumber">
              <v-icon small dark>
                mdi-pencil
              </v-icon>
            </v-btn>
          </p>
          <v-text-field v-if="editNumber" v-model="smsObject.to" append-icon="mdi-mobile"
            label="You can change the number" single-line outlined dense clearable class="mb-5 order-search-text-field"
            :rules="[rules.required]"></v-text-field>

          <div class="d-flex flex-column">
            <v-btn :disabled="smsObject.to === '' || smsObject.to === null" class="ma-2" color="primary"
              @click="sendNotification()">
              Confirm
            </v-btn>
            <v-btn class="ma-2" outlined color="error" @click.stop="deliveryOrderDialog = false">
              Cancel
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delivery Cancel Dialog -->
    <v-dialog v-model="deliveryCancelOrderDialog" transition="dialog-bottom-transition" max-width="350"
      content-class="order-details-dialog">
      <v-card>
        <v-toolbar dense color="error" dark elevation="0">
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
            <v-btn class="ma-2" color="primary" @click.stop="$router.go(-1)">
              Yes
            </v-btn>
            <v-btn class="ma-2" outlined color="error" @click.stop="deliveryCancelOrderDialog = false">
              No
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="scanDialogVisible" fullscreen>
      <v-card>
        <v-card-title class="title primary--text">
          <!-- Scanning Barcode -->
        </v-card-title>

        <v-card-text>
          <BarScanner @code="code" :key="cameraRender" />
          <v-btn depressed color="primary" class="mb-5" @click.stop="closeScanner">
            Close
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapActions, mapState } from "vuex";

import Page from "@/components/paradym/Page";
import emptyPhoto from "@/assets/images/empty.jpg";
import cyclePhoto from "@/assets/images/cycle@2x.png";

import ThirdStepper from "@/components/delivery-order/steppers/ThirdStepper";
import FourthStepper from "@/components/delivery-order/steppers/FourthStepper";
const axios = require('axios');

import OfflineQueueProcessor from '../../../plugins/OfflineQueueProcessor.js';



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
    await this.getOrderDetails();
    await this.getOrderExtras();
    await this.getOrderItems();
    await this.getOrderImages();
    this.getMsgTemplate();
    this.getUserlocation();
    this.getLockingDetails();
  },
  data() {
    return {
      breakpoint: 640,
      deliveryOrderData: {},
      deliveryStepper: 1,
      deliveryOrderDialog: false,
      extrasDeliveredReason: '',
      unableToDeliverItems: false,
      deliveryCancelOrderDialog: false,
      emptyPhoto: emptyPhoto,
      cyclePhoto: cyclePhoto,
      loader: false,
      scanDialogVisible: false,
      currentItem: {},
      cameraRender: 0,
      userPosition: null,
      defaultColorValue: "",
      defaultCombinationValue: "",
      defaultLockId: "",
      colorItems: [],
      scannedItems: [],
      manualCode: "",
      lockingData: [],
      colors: [
        "Red",
        "Green",
        "Teal",
        "Pink",
        "Goldenrod",
        "Blue",
        "Gray",
        "Purple",
      ],
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
        // {
        //   text: "ACTION",
        //   value: "actions",
        //   sortable: false,
        //   align: "center",
        // },
      ],
      equipment: [],
      headersextras: [{
        text: "Name",
        align: "start",
        value: "extraName",
      }
      ],
      extras: [],
      // Date field
      date: null,
      dateFormatted: null,
      menu1: false,
      smsObject: {
        to: "",
        message: "",
        orderid: "",
        mediaUrl: [],
      },
      templateMsg: "",
      editNumber: false,
      deliveryImages: [],
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    ...mapState({
      capturedImagesFromVuex: (state) => (state.capturedImages = []),
    }),
    isNextButtonDisabled() {
      if (
        this.defaultCombinationValue == null ||
        this.defaultCombinationValue == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    async defaultColorValue(newVal, oldVal) {
      console.log("NEWVAL", newVal, "OLD VAL", oldVal, newVal != oldVal);

      // alert default color value is changed
      // alert("Default color value is changed");

      if (newVal === null) {
        // this.defaultCombinationValue = "";
        await this.getLockingDetails();
      }

      if (newVal !== oldVal && newVal != null) {
        console.log(this.lockingData);
        const data = _.find(this.lockingData, (o) => o.color === newVal);
        if (data !== undefined) {
          this.defaultCombinationValue = data && data.combination;
          // set the combination to the order combination
          this.deliveryOrderData.combination = this.defaultCombinationValue;
          this.deliveryOrderData.color = newVal;
          this.deliveryOrderData.lock = data && data.lockId;
        }
      }
    },
  },
  methods: {
    ...mapActions("snackbar", {
      showSuccess: "success",
      showError: "error",
    }),
    async getOrderItems() {
      try {
        console.log("IN ORDER ITEMS", this.deliveryOrderData);
        let response = await this.$axios.$get("/api/user/deliveryItem", {
          params: {
            deliveryID: this.deliveryOrderData.id,
          },
        });

        this.equipment = response;

        //  this.$router.go(-1);
      } catch (err) {
        console.log("Issue in getOrderItems 1234", err.response);
      }
    },
    async code(value) {
      if (!this.scannedItems.includes(value)) {
        this.loader = true;
        this.closeScanner();
        try {
          const response = await axios.post(this.$config.bodhisysAPIURL + "/reservation/scanbarcode",
            {
              reservation_id: this.deliveryOrderData.id,
              barcode: value,
            }
          );
          this.showSuccess(`${response.data.barcode} scanned successfully`)
          this.equipment.forEach(item => {
            if (item.id == response.data.item_id) {
              item.serialbarcode = response.data.barcode;
              item.checkedDelievery = 1;
            }
          })
          this.scannedItems.push(value);
          this.loader = false;
          this.openScanner();
        } catch (error) {
          if (error?.response?.data?.error) this.showError(error.response.data.error);
          else this.showError("Error ocuured")
          this.loader = false;
        }
      } else {
      }
    },
    async manualScan() {
      try {
        const response = await axios.post(this.$config.bodhisysAPIURL + "/reservation/scanbarcode",
          {
            reservation_id: this.deliveryOrderData.id,
            barcode: this.manualCode,
          }
        );
        this.showSuccess(`${response.data.barcode} scanned successfully`)
        this.equipment.forEach(item => {
          if (item.id == response.data.item_id) {
            item.serialbarcode = response.data.barcode;
            item.checkedDelievery = 1;
          }
        })
        this.manualCode = "";
      } catch (error) {
        if (error?.response?.data?.error) this.showError(error.response.data.error);
        else this.showError("Error ocuured")
      }
    },
    async saveUpdate(item) {
      console.log("ITEM", item);
      let response = await this.$axios.$put("/api/user/deliveryItem", item);
      // let response = await this.$axios.$put("/api/user/deliveryItem/translate", item);
      console.log("RESPONSE", response);
      this.closeScanner();
      this.getOrderItems();
    },
    async getOrderExtras() {
      try {
        let response = await this.$axios.$get("/api/user/deliveryItem/extras", {
          params: {
            deliveryID: this.deliveryOrderData.id,
          },
        });

        this.extras = response;
        console.log("Extras", this.extras);

        //  this.$router.go(-1);
      } catch (err) {
        console.log("Issue in getOrderExtras", err);
      }
    },
    closeScanner() {
      this.scanDialogVisible = false;

      const video = document.querySelector("video");

      // A video's MediaStream object is available through its srcObject attribute
      const mediaStream = video.srcObject;
      if (mediaStream === null) return;

      // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
      const tracks = mediaStream.getTracks();

      // Tracks are returned as an array, so if you know you only have one, you can stop it with:
      // tracks[0].stop();

      // Or stop all like so:
      tracks.forEach((track) => track.stop());
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    async getLockingDetails() {
      const lockingDataResponse = await this.$axios.$get("/api/user/locking");
      this.lockingData = lockingDataResponse;
      console.log(lockingDataResponse);
      this.colorItems = _.map(lockingDataResponse, "color");
    },
    getUserlocation() {
      if (process.client) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("Clicked on pointer, position === ", position);
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
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

    async sendNotification() {
      try {
        await this.uploadFiles(this.smsObject);
      } catch (error) {
        console.log("error", error);
      }

      this.searchHistoryDialog = false;
      this.deliveryOrderDialog = false;
      this.loader = true;

      let dataToAdd = this.deliveryOrderData;
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
      this.smsObject.message = output;
      this.smsObject.orderid = this.deliveryOrderData.orderid;

      try {
        let saveData = {
          date: this.dateFormatted,
          name: this.deliveryOrderData.name,
          location: this.deliveryOrderData.location,
          color: this.defaultColorValue,
          combination: this.defaultCombinationValue,
          orderid: this.deliveryOrderData.orderid,
          swapOrder: this.deliveryOrderData.swapOrder,
          status: 1,
          textSent: 1,
          picturesSent: 1,
          unableToDeliverItems: this.deliveryOrderData.unableToDeliverItems,
          note: this.deliveryOrderData.note,
          extrasDelivered: this.deliveryOrderData.extrasDelivered,
          extrasDeliveredReason: this.deliveryOrderData.extrasDeliveredReason,
          delivered: true,
          message: this.smsObject.message,
          images: this.smsObject.mediaUrl
        };

        if (navigator.onLine) {
          // If online, submit directly
          try {
            let emailResponse = await this.$axios.post(
              "api/user/sendDeliveryEmail",
              {
                params: {
                  orderid: this.deliveryOrderData.orderid,
                  message: this.smsObject.message,
                  images: this.smsObject.mediaUrl
                },
              }
            );
          } catch (error) {
            this.loader = false;
          } 
          
          let response = await this.$axios
            .$post("api/user/sendSMS", this.smsObject)
            .then(async (response) => {
              let saveData = {
                date: this.dateFormatted,
                name: this.deliveryOrderData.name,
                location: this.deliveryOrderData.location,
                color: this.defaultColorValue,
                combination: this.defaultCombinationValue,
                orderid: this.deliveryOrderData.orderid,
                swapOrder: this.deliveryOrderData.swapOrder,
                status: 1,
                textSent: 1,
                picturesSent: 1,
                unableToDeliverItems: this.deliveryOrderData.unableToDeliverItems,
                note: this.deliveryOrderData.note,
                extrasDelivered: this.deliveryOrderData.extrasDelivered,
                extrasDeliveredReason: this.deliveryOrderData.extrasDeliveredReason,
                delivered: true
              }
            }); 
            
          await this.$axios.$post("/api/user/deliveryorderupdate", saveData);
          this.showSuccess("Order submitted successfully");
        } else {
          // If offline, queue the submission
          await OfflineQueueProcessor.submitDeliveryOrder(saveData);
          this.showSuccess("Order queued for submission when online");
        }

        this.loader = false;
        this.$router.push("/deliveryOrder");
      } catch (error) {
        console.log("Error handling order submission:", error);
        this.loader = false;
        if (navigator.onLine) {
          this.showError("Failed to submit order. Please try again.");
        } else {
          this.showError("Failed to queue order. It will be retried automatically when online.");
        }
      }
    },
    async getOrderImages() {
      try {
        let response = await this.$axios.$get(
          "/api/user/searchhistory/images",
          {
            params: {
              orderID: this.deliveryOrderData.orderid,
            },
          }
        );
        let localDeliveryArray = [];
        // 'https://images.bodhisys.io/D-Apr0020-22/637848762657544860'
        response.D.forEach((image) => {
          localDeliveryArray.push(
            `https://images.bodhisys.io/d-${this.orderData.orderid}/${image}`
          );
        });
        this.deliveryImages = localDeliveryArray;

      } catch (error) {
        console.log("ERROR", error);
      }
    },
    async getOrderDetails() {
      try {
        let response = await this.$axios.$get("/api/user/deliveryOrder", {
          params: {
            search: this.$route.params.orderId,
          },
        });
        this.deliveryOrderData = response[0];
        this.date = response[0].date.substr(0, 10);
        this.dateFormatted = this.formatDate(response[0].date.substr(0, 10));
        this.defaultColorValue = response[0].color;
        this.defaultCombinationValue = response[0].combination;
        this.smsObject.to = this.deliveryOrderData.mobileNo;

        // console.log("TESTING CAPTURED IMAGES", ThirdStepper.capturedImages);
        // console.log(
        //   "TESTING CAPTURED IMAGES BEFORE",
        //   this.$refs.thirdStep.local_files_to_upload
        // );
        this.$refs.thirdStep.local_files_to_upload = [];
        ThirdStepper.capturedImages = [];
        // this.$emit("captured-camera-images", ThirdStepper.capturedImages);

        // ThirdStepper.local_files_to_upload = [];
        // console.log(
        //   "TESTING CAPTURED IMAGES AFTER",
        //   this.$refs.thirdStep.local_files_to_upload
        // );

        // this.$refs.fourthStep.local_files_to_upload = [];
        // FourthStepper.capturedImages = [];


        //  this.$router.go(-1);
      } catch (err) {
        console.log("errror", err.response);
      }
    },
    setDelivaryStepper(param) {
      // this is only when it goes back in number of step
      // alert("Stepper set to " + param);
      // return;
      this.deliveryStepper = param;
    },
    async upload(upload, pictureNumber) {
      const blob = await fetch(upload.local_blob_url).then((r) => r.blob());
      const newfileObj = new File([blob], `${upload.originalName}.jpeg`, {
        type: blob.type,
      });
      
      let formData = new FormData();
      formData.append("file", newfileObj);

      try {
        let pictureName = `d-${this.deliveryOrderData.orderid}-${pictureNumber}`;
        let result;

        if (navigator.onLine) {
          result = await this.$axios.$post(
            `/api/user/upload?orderid=${pictureName}`,
            formData
          );
        } else {
          // Store the upload data in the queue if offline
          const uploadQueue = JSON.parse(localStorage.getItem('uploadQueue')) || [];
          uploadQueue.push({ pictureName, formData });
          localStorage.setItem('uploadQueue', JSON.stringify(uploadQueue));
          console.log('Image added to queue. Waiting for internet connection to upload.');
        }

        if (result.success) {
          console.log(
            `Photo upload was successful. ${this.deliveryOrderData.orderid}`
          );
 
          const saveData = {
            date: this.dateFormatted,
            name: this.deliveryOrderData.name,
            location: this.deliveryOrderData.location,
            color: this.defaultColorValue,
            combination: this.defaultCombinationValue,
            extrasDelivered: this.deliveryOrderData.extrasDelivered,
            extrasDeliveredReason: this.deliveryOrderData.extrasDeliveredReason,    
            orderid: this.deliveryOrderData.orderid,
            status: 1,
            swapOrder: 1
          };

          let result = await this.$axios.$post(
            "/api/user/deliveryorderupdate",
            saveData
          );
        
        // if (navigator.onLine) {
        //   // If online, upload directly
        //   const formData = new FormData();
        //   formData.append('file', newfileObj);
        //   const url = process.env.API_URL + `/api/user/upload?orderid=d-${this.deliveryOrderData.orderid}-${pictureNumber}`;
        //   await this.$axios.$post(url, formData);
        //   console.log(`Photo uploaded for ${this.deliveryOrderData.orderid}`);

        } else {
          // If offline, queue the upload
          await OfflineQueueProcessor.uploadImage(
            newfileObj,
            this.deliveryOrderData.orderid,
            pictureNumber
          );
          console.log(`Photo upload queued for ${this.deliveryOrderData.orderid}`);
        }
      } catch (err) {
        console.log("Error handling photo upload:", err);
        this.showError("Failed to handle photo upload. Please try again.");
      }
    },

    async uploadFiles(messageObject) {
      var counter = 0;

      for (const upload of this.uploads) {
        await this.upload(upload, counter);
        messageObject.mediaUrl.push(
          `https://images.bodhisys.io/d-${this.deliveryOrderData.orderid}-${counter}.jpeg`
        );
        counter = counter + 1;
      }
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
    openScanner() {
      this.scanDialogVisible = true;
      this.cameraRender += 1
    }
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
