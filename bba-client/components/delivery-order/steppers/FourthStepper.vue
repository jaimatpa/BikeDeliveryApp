<template>
  <div class="d-flex flex-column justify-space-between" style="height: 100%">
    <div>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" xl="12">
          <div class="d-flex justify-space-between align-center flex-wrap">
            <p class="font-weight-black text--secondary mb-0">
              <span class="font-weight-bold">DATE:</span>
              <span class="font-weight-regular">{{
                deliveryOrderData.date
              }}</span>
            </p>
            <p class="font-weight-black text--secondary mb-0">
              <span class="font-weight-bold">NAME:</span>
              <span class="font-weight-regular">{{
                deliveryOrderData.name
              }}</span>
            </p>
          </div>

          <div class="d-flex justify-space-between align-center flex-wrap">
            <p class="font-weight-black text--secondary mb-0">
              <span class="font-weight-bold">LOCATION:</span>
              <span class="font-weight-regular">{{
                deliveryOrderData.location
              }}</span>
            </p>
            <p class="font-weight-black text--secondary mb-0">
              <span class="font-weight-bold">ORDER#:</span>
              <span class="font-weight-regular">{{
                deliveryOrderData.orderid
              }}</span>
            </p>
          </div>

          <div class="d-flex justify-space-between align-center flex-wrap">
            <p class="font-weight-black text--secondary mb-0">
              <span class="font-weight-bold">COLOR:</span>
              <span class="font-weight-regular">{{
                deliveryOrderData.color
              }}</span>
            </p>
            <p class="font-weight-black text--secondary mb-0">
              <span class="font-weight-bold">COMBINATION:</span>
              <span class="font-weight-regular">{{
                deliveryOrderData.combination
              }}</span>
            </p>
          </div>

          <div class="d-flex justify-space-between align-center flex-wrap">
            <p class="font-weight-black text--secondary mb-0">
              <span class="font-weight-bold">RACK:</span>
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
          <div v-if="Object.keys(clickedImage).length > 0">
            <div class="slider-img-container py-0 my-0" style="display:flex;">
              <img
                style="align-self: flex-end;"
                ref="currentImgRef"
                :src="clickedImage.local_blob_url"
                :width="innerWindowWidth > 800 ? 600 : 300"
              />
              <span
                class="img-cross-btn"
                @click="deleteImage(clickedImage.array_index)"
              >
                <v-icon color="black" style="font-size: 20px;cursor: pointer;">
                  mdi-close
                </v-icon>
              </span>
              <span class="img-left-btn" @click="goToNextImage('left')">
                <v-icon class="white--text">mdi-arrow-left-bold</v-icon>
              </span>
              <span class="img-right-btn" @click="goToNextImage('right')">
                <v-icon class="white--text">mdi-arrow-right-bold</v-icon>
              </span>
            </div>
            <div style="text-align:center; margin-top: 5px;">
              Photo {{ clickedImage.array_index + 1 }} of
              {{ capturedImagesFromVuex.length }}
            </div>
          </div>

          <v-img
            v-else
            max-height="180"
            max-width="220"
            :src="cyclePhoto"
          ></v-img>
        </v-col>
      </v-row>
    </div>

    <div>
      <!-- Fourth Stepper Button -->
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="4" xl="4">
          <v-btn
            block
            depressed
            color="primary"
            @click.stop="$emit('set-delivery-order-dialog', true)"
          >
            Complete
          </v-btn>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="4" xl="4">
          <v-btn
            block
            depressed
            color="accent"
            @click.stop="$emit('set-delivery-stepper', 3)"
          >
            <v-icon dark>
              mdi-chevron-left
            </v-icon>
            Back
          </v-btn>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="4" xl="4">
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

    <!-- Delivery Cancel Dialog -->
    <v-dialog
      v-model="deliveryCancelOrderDialog"
      transition="dialog-bottom-transition"
      max-width="350"
      content-class="order-details-dialog"
    >
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
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import touchScreen from "../../../service/touchScreen";

export default {
  name: "FourthStepper",
  props: {
    deliveryOrderData: {
      type: Object,
      default: {},
    },
    cyclePhoto: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      clickedImage: {},

      innerWindowWidth: 0,

      canvasHeight: 480,
      canvasWidth: 640,
      aspectRatio: null,
      reviewPhoto: false,
      allImages: undefined,
      deliveryCancelOrderDialog: false
    };
  },
  computed: {
    ...mapState({
      capturedImagesFromVuex: (state) => state.capturedImages,
    }),
  },

  mounted() {
    var el = this.$refs.currentImgRef;
    touchScreen.swipedetect(el, (swipedir) => {
      // swipedir contains either "none", "left", "right", "top", or "down"
      if (swipedir === "left") {
        this.goToNextImage("right");
      } else if (swipedir === "right") {
        this.goToNextImage("left");
      }
    });
    this.innerWindowWidth = window.innerWidth;
    window.addEventListener("resize", this.resize);
    this.resize();
  },
  watch: {
    capturedImagesFromVuex: {
      deep: true,
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal !== undefined && newVal.length > 0) {
          this.clickedImage = { ...newVal[0], array_index: 0 };
          // this.$emit('uploadFiles', this.clickedImage)
        } else {
          this.clickedImage = {};
        }
        // console.log("hereeeeeeeeeeeeeee ........ ", newVal);
        this.$emit("setUploadFiles", newVal);
      },
    },
  },
  methods: {
    ...mapMutations(["SET_CAPTURED_IMAGES_IN_VUEX"]),

    resize() {
      let windowAspectRatio = window.innerWidth / window.innerHeight;
      if (windowAspectRatio > this.aspectRatio) {
        this.canvasHeight = window.innerHeight;
        this.canvasWidth = this.canvasHeight * this.aspectRatio;
      } else if (windowAspectRatio < this.aspectRatio) {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerWidth / this.aspectRatio;
      } else {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
      }
    },

    goToNextImage(direction) {
      const { array_index } = this.clickedImage;
      if (direction === "left") {
        if (array_index !== 0) {
          const result = {
            ...this.capturedImagesFromVuex[array_index - 1],
            array_index: array_index - 1,
          };

          this.clickedImage = result;
        }
      } else if (direction === "right") {
        if (array_index !== this.capturedImagesFromVuex.length - 1) {
          const result = {
            ...this.capturedImagesFromVuex[array_index + 1],
            array_index: array_index + 1,
          };
          this.clickedImage = result;
        }
      }
    },

    deleteImage(img_index) {
      // console.log('%c img_index: ', 'color: yellowgreen; font-size: 20px', img_index)
      if (confirm("Are you sure to remove?")) {
        let nextImage = {};

        const filtered_images = this.capturedImagesFromVuex.filter(
          (obj, index) => {
            if (index === img_index) {
              if (img_index === this.capturedImagesFromVuex.length - 1) {
                nextImage = {
                  ...this.capturedImagesFromVuex[img_index - 1],
                  array_index: img_index - 1,
                };
              } else {
                nextImage = {
                  ...this.capturedImagesFromVuex[img_index + 1],
                  array_index: img_index,
                };
              }

              return false;
            }
            return true;
          }
        );
        console.log("nextImage: ", nextImage);
        this.clickedImage = nextImage;

        this.SET_CAPTURED_IMAGES_IN_VUEX([...filtered_images]);
        // this.local_files_to_upload = [ ...filtered_images ]
      }
    },
  },
};
</script>
