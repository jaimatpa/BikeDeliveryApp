<template lang="html">
  <Page>
    <!-- Order Search Field -->
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search by Order#"
      single-line
      hide-details
      outlined
      dense
      clearable
      class="mb-5"
    ></v-text-field>

    <v-data-table
      :headers="headers"
      :items="resends"
      :options.sync="options"
      :server-items-length="totalResend"
      :loading="loading"
      :search="search"
      class="elevation-1"
      :mobile-breakpoint="0"
    >
      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="resend-icon"
          small
          color="white"
          @click.stop="handleData(item)"
        >
          mdi-share
        </v-icon>
      </template>
    </v-data-table>

    <!-- Resend Dialog -->
    <v-dialog
      v-model="resendDialog"
      transition="dialog-bottom-transition"
      max-width="350"
      content-class="resend-dialog"
    >
      <v-card>
        <v-toolbar dense color="primary" dark elevation="0">
          <v-toolbar-title>Resend</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="resendDialog = false">
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
              @click="resendDialog = false"
            >
              Cancel
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
      <v-overlay :value="loader">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </Page>
</template>

<script>
import { mapActions } from "vuex";
import Page from "@/components/paradym/Page";
import resendMockData from "@/webHooks/RESEND_MOCK_DATA.json";

export default {
  name: "resend",
  auth: true,
  head() {
    return {
      title: "Resend",
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
      totalResend: 0,
      resendDialog: false,
      search: "",
      resends: [],
      loading: true,
      options: {},
      headers: [
        {
          text: "Date",
          align: "start",
          value: "date",
        },
        { text: "Name", value: "name", sortable: false },
        { text: "Location", value: "location", sortable: false },
        { text: "Order", value: "order" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
      loader:false,
      dataToSent : {},
      smsObject : {
         to : "+8801745476473", 
        message: ""
      }
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
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
   async sendNotification() {
      this.resendDialog = false;
      // this.showSuccess("Notification Sent.");
      this.loader = true;
      
     
      console.log('delivery information', this.dataToSent)
      let dataToAdd = this.dataToSent;
     
      let message = `Hello ${dataToAdd.name}! Your bike is now available at ${dataToAdd.location}.  Your Order number is ${dataToAdd.order}. Thank You.`
      this.smsObject.message = message;
        try {
        let response = await this.$axios.$post(
          "api/user/sendSMS", this.smsObject
        
        );
        console.log('respones', response.message);
         this.loader = false;
        this.showSuccess(response.message);
        //  this.$router.go(-1);
       
      } catch (err) {
        console.log('errror', err.response);
        this.loader = false;
      }
    },
    async getDataFromApi() {
      this.loading = true;
      this.apiCall().then((data) => {
        this.resends = data.items;
        this.totalResend = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        let items = resendMockData;
        const total = resendMockData.length;

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
    handleData(item) {
      console.log('Data to send sms', item)
      this.resendDialog = true;
      this.dataToSent = item
    }
  },
};
</script>

<style lang="scss">
.resend-dialog {
  box-shadow: none !important;

  .sure-title {
    font-size: 1rem !important;
    line-height: 1.2rem !important;
  }
}

.resend-icon {
  background: #4c9a2a;
  padding: 5px;
  border-radius: 5px;
}
</style>
