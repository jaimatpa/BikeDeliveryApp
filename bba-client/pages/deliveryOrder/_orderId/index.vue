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
                v-model="deliveryOrderData.order"
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
                outlined
                color="primary"
                @click.stop="deliveryStepper = 2"
              >
                Next
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6" xl="6">
              <v-btn
                block
                depressed
                outlined
                color="error"
                @click.stop="$router.go(-1)"
              >
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
                outlined
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
                outlined
                color="accent"
                @click.stop="deliveryStepper = 1"
              >
                Back
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                outlined
                color="error"
                @click.stop="$router.go(-1)"
              >
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
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Date:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.date
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Name:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.name
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Location:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.location
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Order#:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.order
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Color:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.color
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Combination:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.combination
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Bike Rack:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.rack
                  }}</span>
                </p>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="12"
              xl="12"
              class="d-flex flex-column justify-center align-center"
            >
              <v-img max-height="180" max-width="220" :src="cyclePhoto"></v-img>
            </v-col>
          </v-row>
          <!-- Fourth Stepper Button -->
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                color="primary"
                @click.stop="deliveryOrderDialog = true"
              >
                Complete
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                outlined
                color="accent"
                @click.stop="deliveryStepper = 3"
              >
                Back
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                outlined
                color="error"
                @click.stop="$router.go(-1)"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
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
  </Page>
</template>

<script>
import _ from "lodash";
import { mapActions } from "vuex";

import Page from "@/components/paradym/Page";
import deliveryOrderMockData from "@/webHooks/ORDER_DELIVERY_MOCK_DATA.json";
import emptyPhoto from "@/assets/images/empty.jpg";
import cyclePhoto from "@/assets/images/cycle@2x.png";

import ThirdStepper from '../../../components/delivery-order/steppers/ThirdStepper'

export default {
  name: "deliveryOrderDetails",
  auth: true,
  head() {
    return {
      title: "Delivery Order Details",
    };
  },
  components: { Page, ThirdStepper },
  created() {
    this.deliveryOrderData = _.find(
      deliveryOrderMockData,
      (deliveryOrderData) =>
        deliveryOrderData.order === this.$route.params.orderId
    );
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      deliveryOrderData: null,
      deliveryStepper: 3,
      deliveryOrderDialog: false,
      emptyPhoto: emptyPhoto,
      cyclePhoto: cyclePhoto,
    };
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    sendNotification() {
      this.searchHistoryDialog = false;
      this.showSuccess("Notification Sent.");
      this.$router.go(-1);
    },
    setDelivaryStepper( param ) {
      this.deliveryStepper = param
    }
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
    font-size: 1.2rem !important;
    line-height: 1.5rem !important;
  }
}
</style>
