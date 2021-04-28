<template lang="html">
  <Page>
    <!-- Lock Scan Button  -->
    <v-btn
      @click.stop="
        dialog = true;
        cameraRender += 1;
      "
      block
      depressed
      color="primary"
      class="mb-5"
    >
      <v-icon left medium color="white" class="mr-2">
        mdi-barcode-scan
      </v-icon>
      Scan Barcode
    </v-btn>

    <!-- QRCode Scanner Reader -->
    <!-- <div class="qr-code mb-5" v-if="isMobile && showQrScanner">
      <qrcode-stream @decode="onDecode"></qrcode-stream>
    </div> -->

    <!-- Lock Select Box -->
    <v-select
      v-model="selectColor"
      :items="colors"
      label="Color"
      dense
      outlined
      clearable
    >
      <template v-slot:selection="{ item, index }">
        <div class="d-flex align-center">
          <div :style="delivarieselectValueColor(item)"></div>
          <span class="accent--text ml-1">{{ item }}</span>
        </div>
      </template>
    </v-select>

    <v-data-table
      :headers="headers"
      :items="delivaries"
      :options.sync="options"
      :server-items-length="totalOrderDelivery"
      :loading="loading"
      :search="search"
      class="elevation-1"
      :mobile-breakpoint="0"
    >
      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <v-icon
          medium
          color="primary"
          @click.stop="
            $router.push({
              path: `/locking/${item.orderid}`,
            })
          "
        >
          mdi-page-next
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" fullscreen>
      <div class="custom-locking-bar-scanner">
        <BarScanner @code="code" :key="cameraRender" />

        <div class="scan-close-button">
          <v-btn
            :block="isMobile"
            depressed
            color="primary"
            class="mb-5"
            @click.stop="closeScanner"
          >
            Close
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </Page>
</template>

<script>
import _ from "lodash";
import { mapActions } from "vuex";

import Page from "@/components/paradym/Page";
import BarScanner from "@/components/BarScanner";

export default {
  name: "lock",
  auth: true,
  head() {
    return {
      title: "Lock",
    };
  },
  components: { Page, BarScanner },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      totalOrderDelivery: 0,
      showQrScanner: false,
      decodedResult: "",
      search: "",
      delivaries: [],
      loading: true,
      initialRender: true,
      options: {},
      selectColor: "",
      colors: [],
      headers: [
        {
          text: "LOCK",
          align: "start",
          value: "lock",
          sortable: false,
        },
        { text: "COLOR", value: "color", sortable: false },
        { text: "COMBINATION", value: "combination", sortable: false },
        { text: "ORDER#", value: "orderid", sortable: false },
        { text: "ACTION", value: "actions", sortable: false, align: "center" },
      ],
      searchByBarcode: "",
      dialog: false,
      cameraRender: 0,
    };
  },
  created() {
    this.getDataFromApi();
    this.initialRender = false;
    this.getColors();
  },
  watch: {
    selectColor: function(newValue) {
      this.getDataFromApi();
    },
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    delivarieselectValueColor(color) {
      return {
        width: "20px",
        height: "20px",
        "background-color": color,
      };
    },
    onDecode(decodedString) {
      console.log("decodedString", decodedString);
      if (decodedString) {
        this.decodedResult = decodedString;
        this.search = decodedString;
        this.showQrScanner = false;
      }
    },
    onClearClicked() {
      if (this.search !== "" || this.searchByBarcode !== "") {
        this.search = "";
        this.searchByBarcode = "";
      }
      this.getDataFromApi();
    },
    async code(value) {
      this.search = value;
      this.closeScanner();

      const data = await this.apiCall();
      try {
        if (data && data.items.length) {
          this.$router.push(`/deliveryOrder/${value}`);
        } else {
          this.showError("Order Id is not found");
        }
      } catch (error) {
        console.log("error=> ", error);
      }
    },

    onKeyUp(event) {
      // console.log('key uppppppp ', typeof event.target.value,  `${event.target.value}`.length)
      if (event.key === "Enter") {
        this.getDataFromApi();
      } else if (`${event.target.value}`.length === 0) {
        // if someone clears the input field.
        this.getDataFromApi();
      }
    },
    async getColors() {
      const orderData = await this.$axios.$get("/api/user/deliveryOrder");
      this.colors = orderData.length ? _.map(orderData, "color") : [];
    },
    async getDataFromApi() {
      this.loading = true;
      this.apiCall().then((data) => {
        this.delivaries = data.items;
        this.totalOrderDelivery = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        const orderDeliveryMockData = await this.$axios.$get(
          "/api/user/deliveryOrder",
          {
            params: {
              search: this.selectColor,
            },
          }
        );

        let items = orderDeliveryMockData;
        let total = orderDeliveryMockData?.length;

        if (sortBy?.length === 1 && sortDesc?.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]];
            const sortB = b[sortBy[0]];

            if (sortDesc[0]) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }

        if (itemsPerPage > 0) {
          items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        }

        setTimeout(() => {
          resolve({
            items,
            total,
          });
        }, 1000);
      });
    },
    closeScanner() {
      this.dialog = false;

      const video = document.querySelector("video");

      // A video's MediaStream object is available through its srcObject attribute
      const mediaStream = video.srcObject;

      // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
      const tracks = mediaStream.getTracks();

      // Tracks are returned as an array, so if you know you only have one, you can stop it with:
      // tracks[0].stop();

      // Or stop all like so:
      tracks.forEach((track) => track.stop());
    },
  },
};
</script>

<style lang="scss">
.custom-locking-bar-scanner {
  height: 100%;
  background-color: hsla(0, 0%, 13%, 0.95);
  padding: 0 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  .scan-container {
    padding: 0 !important;

    .scanner-container {
      .overlay-element {
        border: 0.1rem solid rgba(75, 152, 42, 0.2);
      }

      .overlay-element::before,
      .overlay-element::after {
        content: "";
        display: block;
        position: absolute;
        width: 10vw;
        height: 10vw;

        border: 0.2rem solid transparent;

        bottom: 0;
        border-bottom-color: #4c9a2a;
      }

      .overlay-element::before {
        left: 0;
        border-left-color: #4c9a2a;
      }

      .overlay-element::after {
        right: 0;
        border-right-color: #4c9a2a;
      }
    }

    .scanner-container::after,
    .scanner-container::before {
      content: "";
      display: block;
      position: absolute;
      width: 10vw;
      height: 10vw;

      border: 0.2rem solid transparent;

      top: 0;
      border-top-color: #4c9a2a;
    }

    .scanner-container::after {
      right: 0;
      border-right-color: #4c9a2a;
    }
    .scanner-container::before {
      left: 0;
      border-left-color: #4c9a2a;
    }
  }

  .scan-close-button {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    padding: 10px 20px;
  }
}
</style>
