<template lang="html">
  <Page>
    <!-- Lock Scan Button  -->
    <v-btn
      @click.stop="dialog = true;cameraRender += 1"
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
      <v-card>
        <v-card-title class="title primary--text">
          <!-- Scanning Barcode -->
        </v-card-title>

        <v-card-text>
      
          <!-- <v-text-field
            v-model="searchByBarcode"
            append-icon="mdi-magnify"
            label="Enter Barcode"
            single-line
            hide-details
            outlined
            dense
            clearable
            @click:clear="onClearClicked"
            @keyup="onKeyUp"
            class="mb-5"
          ></v-text-field> -->
          
          <BarScanner @code="code" :key="cameraRender" />
              <v-btn
            :block="isMobile"
            depressed
            color="primary"
            class="mb-5"
            @click.stop="closeScanner"
          >
            Close
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import _ from "lodash";
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
  components: { Page,BarScanner },
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
        { text: "DELIVERY#", value: "orderid", sortable: false },
        { text: "ACTION", value: "actions", sortable: false, align: "center" },
      ],
      searchByBarcode:"",
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
    code(value) {
     
      this.search = value;
      this.closeScanner()
      this.$router.push(`/deliveryOrder/${value}`);
      
      
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

<style lang="scss" scoped>
// .qr-code {
//   background: #4c9a2a;
//   color: #fff;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   height: 40px;
//   width: 100%;
//   border-radius: 10px;
// }
</style>
