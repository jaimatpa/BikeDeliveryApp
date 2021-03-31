<template lang="html">
  <Page>
    <!-- Lock Scan Button  -->
    <v-btn
      v-if="isMobile"
      @click="showQrScanner = true"
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
    <div class="qr-code mb-5" v-if="isMobile && showQrScanner">
      <qrcode-stream @decode="onDecode"></qrcode-stream>
    </div>

    <!-- Lock Select Box -->
    <v-select :items="colors" label="Color" dense outlined>
      <template v-slot:selection="{ item, index }">
        <div class="d-flex align-center">
          <div :style="lockSelectValueColor(item)"></div>
          <span class="accent--text ml-1">{{ item }}</span>
        </div>
      </template>
    </v-select>

    <v-data-table
      :headers="headers"
      :items="locks"
      :options.sync="options"
      :server-items-length="totalLock"
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
              path: `/locking/${item.delivery}`,
            })
          "
        >
          mdi-page-next
        </v-icon>
      </template>
    </v-data-table>
  </Page>
</template>

<script>
import _ from "lodash";
import Page from "@/components/paradym/Page";
import lockMockData from "@/webHooks/LOCK_MOCK_DATA.json";

export default {
  name: "lock",
  auth: true,
  head() {
    return {
      title: "Lock",
    };
  },
  components: { Page },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      totalLock: 0,
      showQrScanner: false,
      decodedResult: "",
      search: "",
      locks: [],
      loading: true,
      options: {},
      colors: lockMockData.length > 0 ? _.map(lockMockData, "color") : [],
      headers: [
        {
          text: "Lock",
          align: "start",
          value: "lock",
        },
        { text: "Color", value: "color", sortable: false },
        { text: "Combination", value: "combination", sortable: false },
        { text: "Delivery", value: "delivery", sortable: false },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    lockSelectValueColor(color) {
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
    async getDataFromApi() {
      this.loading = true;
      this.apiCall().then((data) => {
        this.locks = data.items;
        this.totalLock = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        let items = lockMockData;
        const total = lockMockData.length;

        if (sortBy.length === 1 && sortDesc.length === 1) {
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
