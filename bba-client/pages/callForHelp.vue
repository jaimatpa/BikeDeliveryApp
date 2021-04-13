script<template lang="html">
  <Page>
    <p class="title text-center primary--text font-weight-bold">
      Your bike has been delivered!
    </p>

      <v-card
        elevation="2"
        max-width="100%"
        class="mx-auto"
      >
      <v-carousel
        :continuous="true"
        :cycle="cycle"
        :show-arrows="false"
        hide-delimiter-background
        delimiter-icon="mdi-minus"
        height="200"
      >
        <v-carousel-item
         v-for="(slide, i) in uploadFilesData"
        :key="i"
        >
          <v-img max-height="200" max-width="100%" :src="slide.filepath"></v-img>
        </v-carousel-item>
        </v-carousel>
      </v-card>

    <p class="title text-center secondary--text font-weight-bold mt-5 mb-0">
      Your Lock Combination
    </p>
    <p class="title text-center primary--text">{{deliveryOrderData.combination}}</p>
    <p class="title text-center secondary--text font-weight-bold mt-5 mb-0">
      Pick-up Location
    </p>
    <p class="body-2 text-center secondary--text">
      {{deliveryOrderData.location}}
    </p>

    <div class="mb-10 mt-1">
      <GmapMap
        :center="{ lat: 10, lng: 10 }"
        :zoom="10"
        map-type-id="terrain"
        style="width: 100%; height: 200px"
      >
      </GmapMap>
    </div>

    <v-btn block depressed color="primary" class="mb-5">
      Call For Help
    </v-btn>
  </Page>
</template>

<script>
import moment from "moment";
import Page from "@/components/paradym/Page";
import cyclePhoto from "@/assets/images/cycle@2x.png";

export default {
  name: "callForHelp",
  auth: true,
  head() {
    return {
      title: "Call For Help",
    };
  },
  components: { Page },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    }
  },
  created() {
    this.getUploadDetails();
    this.getOrderDetails();
  },
  data() {
    return {
      breakpoint: 640,
      cyclePhoto: cyclePhoto,
      cycle: false,
      markers: [],
      uploadFilesData: [],
      deliveryOrderData: {},
    };
  },
  methods: {
    async getUploadDetails() {
      try {
        let response = await this.$axios.$get("/api/user/upload", {
          params: {
            orderid: this.$route.query.orderid,
          },
        });

        this.uploadFilesData = response;
      } catch (error) {
        console.log("errror", err.response);
      }
    },
    async getOrderDetails() {
      try {
        let response = await this.$axios.$get("/api/user/deliveryOrder", {
          params: {
            search: this.$route.query.orderid,
          },
        });

        const responseData = _.omit(response[0], "date");
        this.deliveryOrderData = responseData;
        this.deliveryOrderData.date = moment(response[0].date).format(
          "MM/DD/YYYY"
        );

        console.log("this.deliveryOrderData", this.deliveryOrderData);

        //  this.$router.go(-1);
      } catch (err) {
        console.log("errror", err.response);
      }
    },
  },
  mounted() {
    this.getOrderDetails();
  },
};
</script>

<style lang="scss">
.help-bike-photo-col {
  .v-image {
    border-radius: 20px !important;
  }
}
</style>
