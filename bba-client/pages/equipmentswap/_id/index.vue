<template lang="html">
<Page :title="!isMobile ? 'Equipment Swap Details' : 'Swap Details'">
    <v-stepper v-model="deliveryStepper" class="order-details-stepper">
        <v-stepper-items>
            <!-- First Stepper -->
            <v-stepper-content step="1">
                <div class="d-flex flex-column justify-space-between" style="height: 100%">
                    <div class="mt-1">
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.orderid" label="ORDER #" placeholder="Order" readonly dense outlined>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="dateFormatted" label="Date" hint="MM/DD/YYYY format" persistent-hint v-bind="attrs" @blur="date = parseDate(dateFormatted)" v-on="on" readonly outlined dense></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.name" label="NAME" placeholder="Name" readonly dense outlined>
                                </v-text-field>
                            </v-col>

                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="deliveryOrderData.location" label="LOCATION" placeholder="Location" readonly dense outlined>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-select :items="colorItems" v-model="defaultColorValue" label="Color" dense outlined></v-select>
<!--                                <pre>{{ colorItems }}</pre>-->
                            </v-col>
                            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
                                <v-text-field v-model="defaultCombinationValue" label="COMBINATION" placeholder="Combination" readonly dense outlined>
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
                                <v-btn :disabled="isNextButtonDisabled" block depressed color="primary" @click.stop="deliveryStepper = 2">
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
                  <h3 class="mb-3">Pickup</h3>
                  <v-data-table width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="pickupheaders" :items="equipment2" item-key="name" class="elevation-1 ma-1 mb-5">
                        <template v-slot:[`item.checkPickup`]="{ item }">
                            <v-simple-checkbox v-model="item.checkPickup" v-ripple @input="saveUpdate(item)">

                            </v-simple-checkbox>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon size="50" medium color="primary" @click.stop="currentItem={...item, broken:1};scanDialogVisible = true;cameraRender += 1">
                                mdi-barcode
                            </v-icon>
                        </template>
                    </v-data-table>
                    
                    <h3 class="mb-3">Delivery</h3>
                    <v-data-table width="100%" block cols="12" xs="12" sm="12" md="12" xl="12" :headers="headers" :items="equipment" item-key="name" class="elevation-1 ma-1 mb-2">
                        <template v-slot:[`item.checkedDelievery`]="{ item }">
                            <v-simple-checkbox v-model="item.checkedDelievery" v-ripple @input="saveUpdate(item)">

                            </v-simple-checkbox>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon size="50" medium color="primary" @click.stop="currentItem={...item, broken:0};scanDialogVisible = true;cameraRender += 1">
                                mdi-barcode
                            </v-icon>
                        </template>
                    </v-data-table>
                    
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
                <ThirdSwapStepper ref="thirdStep" @set-delivery-stepper="setDelivaryStepper" :deliveryOrderData="deliveryOrderData" :userPosition="userPosition" @setUploadFiles="setUploadFilesDelivery" />
            </v-stepper-content>

            <!-- Fourth Stepper -->
            <v-stepper-content step="4">
                <FourthSwapStepper ref="fourthStep" @set-delivery-stepper="setDelivaryStepper"   :deliveryOrderData="deliveryOrderData"  :userPosition="userPosition" @setUploadFiles="setUploadFilesPickup" />
            </v-stepper-content>

            <v-stepper-content step="5">
                <FourthStepper :deliveryOrderData="deliveryOrderData" :cyclePhoto="cyclePhoto" @set-delivery-stepper="setDelivaryStepper" @set-delivery-order-dialog="setDelivaryDialog"   />
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>

    <!-- Search History Dialog -->
    <v-dialog v-model="deliveryOrderDialog" transition="dialog-bottom-transition" max-width="350" content-class="order-details-dialog">
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
                    {{smsObject.to}}
                    <v-btn class="mx-2" icon color="primary" @click="editNumber=!editNumber">
                        <v-icon small dark>
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </p>
                <v-text-field v-if="editNumber" v-model="smsObject.to" append-icon="mdi-mobile" label="You can change the number" single-line outlined dense clearable class="mb-5 order-search-text-field" :rules="[rules.required]"></v-text-field>

                <div class="d-flex flex-column">
                    <v-btn :disabled="smsObject.to==='' ||smsObject.to===null " class="ma-2" color="primary" @click="sendNotification()">
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
    <v-dialog v-model="deliveryCancelOrderDialog" transition="dialog-bottom-transition" max-width="350" content-class="order-details-dialog">
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

import ThirdSwapStepper from "@/components/delivery-order/steppers/ThirdSwapStepper";
import FourthSwapStepper from "@/components/delivery-order/steppers/FourthSwapStepper";
import FourthStepper from "@/components/delivery-order/steppers/FourthStepper";
const axios = require('axios');

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
    ThirdSwapStepper,
    FourthSwapStepper,
    FourthStepper
  },
  async created() {
    await this.getOrderDetails();
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
        {
          text: "ACTION",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      pickupheaders: [
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
          text: "PICKED UP",
          value: "checkPickup",
        },
        {
          text: "ACTION",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      equipment: [],
      equipment2: [],

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
      capturedPickupImagesFromVuex: (state) => (state.capturedPickupImages = []),
      
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
        if (data !== undefined){
          this.defaultCombinationValue = data && data.combination;
          // set the combination to the order combination
          this.deliveryOrderData.combination = this.defaultCombinationValue;
          this.deliveryOrderData.color = newVal;
          this.deliveryOrderData.lock = data && data.lockId;
        }
        // alert JSON stringify(data);
        // alert("334: " + JSON.stringify(data));



        // alert("Default color value is changed");
      }
    },
  },
  methods: {
    ...mapActions("snackbar", {
      showSuccess: "success",
      showError: "error",
      showWarn: "warning",
    }),
    async getOrderItems() {
      try { 
        let response = await this.$axios.$get("/api/user/deliveryItem", {
          params: {
            deliveryID: this.deliveryOrderData.id,
          },
        });

        this.equipment = response;

        let response2 = await this.$axios.$get("/api/user/deliveryItem", {
          params: {
            deliveryID: this.deliveryOrderData.swapOrderDeliveryId,
          },
        });

        this.equipment2 = response2;

        //  this.$router.go(-1);
      } catch (err) {
        console.log("Issue in getOrderItems 1234", err.response);
      }
    },
    async code(value) {
      console.log("CURRENTITEM", this.currentItem);
      this.closeScanner();
      if(this.currentItem.broken == 1){
        if(this.currentItem.serialbarcode != value){
          this.showError('You sanned a wrong item');
        }else{
          this.currentItem.checkPickup = true;
          this.saveUpdate(this.currentItem);
        }
      }else{
        if(this.equipment2.find(item=>item.serialbarcode == value)){
          this.showError('You sanned a broken item');
        }else{
          if(this.currentItem.serialbarcode == value) {
            this.showWarn('You already scanned this item');
            return;
          }

          const response = await axios.post(this.$config.bodhisysAPIURL+"/product/getproductdetailbybarcode",
            {
              barcode: value,
            }
          );

          if(!response || !response.data) {
            this.showError('You sanned a wrong item');
            return;
          }

          if(this.currentItem.item != response.data.family.display_name) {
            this.showError('You sanned a wrong item');
            return;
          }

          if(response.data.status >= 2 ) {
            this.showError('This item is not available');
            return;
          }

          this.currentItem.serialbarcode = value;
          this.currentItem.checkedDelievery = true;
          this.saveUpdate(this.currentItem);
        }
      }
    },
    async saveUpdate(item) {
      let response = await this.$axios.$put("/api/user/deliveryItem", item);
      this.getOrderItems();
    },
    closeScanner() {
      this.scanDialogVisible = false;

      const video = document.querySelector("video");

      // A video's MediaStream object is available through its srcObject attribute
      const mediaStream = video.srcObject;
      if(mediaStream === null) return;

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
      this.searchHistoryDialog = false;
      this.deliveryOrderDialog = false;
      this.loader = true;
      let dataToAdd = this.deliveryOrderData;
      let userPositionData = this.userPosition;

      // alert(this.defaultColorValue);

      // return;

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
      this.smsObject.images = [ ...this.deliveryImages, ...this.pickupImages ];

      try 
      {
        let response = await this.uploadFiles(this.smsObject);
      } 
      catch (error) 
      {
        console.log("error", error);
      }

      try 
      {
        let emailResponse = await this.$axios.post(
          "api/user/sendDeliveryEmail",
          {
            params: {
              orderid: this.deliveryOrderData.orderid,
              message: this.smsObject.message,
              images: this.smsObject.images
            },
          }
        );
      } catch (error) {
        this.loader = false;
      }

      try {
        let response = await this.$axios
          .$post("api/user/sendSMS", this.smsObject)
          .then(async (response) => {
            let saveData = {
              id: this.deliveryOrderData.id,
              date: this.dateFormatted,
              name: this.deliveryOrderData.name,
              location: this.deliveryOrderData.location,
              color: this.defaultColorValue,
              combination: this.defaultCombinationValue,
              orderid: this.deliveryOrderData.orderid,
              swapOrder: 1,
              status: 1,
              textSent: 1,
              picturesSent: 1,
            };

            let result = await this.$axios.$post(
              "/api/user/deliveryorderupdate",
              saveData
            );
            console.log("RESPONSE", response);
            this.loader = false;
            this.showSuccess(response.message);
            this.$router.push("/equipmentswap");
          });
      } catch (error) {
        console.log("errror 1234", error);
        this.loader = false;
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
            `https://images.bodhisys.io/D-${this.orderData.orderid}/${image}`
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
            search: this.$route.params.id,
            type: 'SwapOrder'
          },
        });

        if(response.length > 0) {
          this.deliveryOrderData = response[0]; 
        }
        else {
          this.showError('There is no delivery data for this order');
          this.$router.push('/equipmentswap/');
          return;
        }

        // console.log("TESTING CAPTURED IMAGES", ThirdStepper.capturedImages);
        // console.log(
        //   "TESTING CAPTURED IMAGES BEFORE",
        //   this.$refs.thirdStep.local_files_to_upload
        // );

        this.$refs.thirdStep.local_files_to_upload = [];
        this.$refs.fourthStep.local_pickup_images_to_upload = [];
        // ThirdStepper.local_files_to_upload = [];
        console.log(
          "TESTING CAPTURED IMAGES AFTER",
          this.$refs.fourthStep.local_pickup_images_to_upload
        );

        // this.$emit("captured-camera-images", ThirdStepper.capturedImages);

        this.date = response[0].date.substr(0, 10);
        this.dateFormatted = this.formatDate(response[0].date.substr(0, 10));
        this.defaultColorValue = response[0].color;
        this.defaultCombinationValue = response[0].combination;
        this.smsObject.to = this.deliveryOrderData.mobileNo;

        //ThirdStepper.capturedImages = [];
        //FourthStepper.capturedPickupImages = [];
        
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
    async upload(upload, type, pictureNumber) {
      const blob = await fetch(upload.local_blob_url).then((r) => r.blob());
      const newfileObj = new File([blob], `${upload.originalName}.jpeg`, {
        type: blob.type,
      });  
    
      let formData = new FormData();
      formData.append("file", newfileObj);

      try {
        var pictureName = `${this.deliveryOrderData.orderid}-${pictureNumber}`;

        if(type == 'pickup') {
          pictureName = `${this.deliveryOrderData.orderid}-pickup-${pictureNumber}`;
        }

        let result = await this.$axios.$post(
          `/api/user/upload?orderid=${pictureName}`,
          formData
        );

        if (result.success) {
          console.log(
            `Photo upload was successful. ${this.deliveryOrderData.orderid}`
          );

          const saveData = {
            id: this.orderData.id,
            date: this.dateFormatted,
            name: this.deliveryOrderData.name,
            location: this.deliveryOrderData.location,
            color: this.defaultColorValue,
            combination: this.defaultCombinationValue,
            orderid: this.deliveryOrderData.orderid,
            status: 1,
            swapOrder: 1,
          };

          let result = await this.$axios.$post(
            "/api/user/deliveryorderupdate",
            saveData
          );
        } else {
          console.log("upload failed!!!");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async uploadFiles(messageObject) {
      var counter = 0;
      console.log('uploading....');

      // const images = [ ...this.deliveryImages, ...this.pickupImages ];

      for (const upload of this.deliveryImages) {
        console.log('uploading deliveryImage', upload);
        let uploadResponse = await this.upload(upload, 'delivery', counter);
        messageObject.mediaUrl.push(
          `https://images.bodhisys.io/${this.deliveryOrderData.barcode}-${counter}.jpeg`
        );
        counter = counter + 1;
      }

      for (const upload of this.pickupImages) {
        console.log('uploading pickupImages', upload);
        let uploadResponse = await this.upload(upload, 'pickup', counter);
        messageObject.mediaUrl.push(
          `https://images.bodhisys.io/pickup/${this.deliveryOrderData.barcode}-${counter}.jpeg`
        );
        counter = counter + 1;
      }


    },
    async setUploadFilesDelivery(uploads) { 
      this.deliveryImages = uploads;
    },
    async setUploadFilesPickup(uploads) { 
      this.pickupImages = uploads;
    },
    async setUploadFiles(uploads) { 
      console.log(uploads);
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
