<template lang="html">
  <Page>
    <p class="title text-center primary--text font-weight-bold">
      Your bike has been delivered!
    </p>
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        xl="12"
        class="d-flex flex-column justify-center align-center help-bike-photo-col"
      >
        <v-img max-height="200" max-width="240" :src="cyclePhoto"></v-img>
      </v-col>
    </v-row>

    <p class="title text-center secondary--text font-weight-bold mt-5 mb-0">
      Your Lock Combination
    </p>
    <p class="title text-center primary--text">1238</p>
    <p class="title text-center secondary--text font-weight-bold mt-5 mb-0">
      Pick-up Location
    </p>
    <p class="body-2 text-center secondary--text">
      39 S Forest Beach Dr <br />
      Hilton Head Island, SC 29928
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
    },
  },
  data() {
    return {
      breakpoint: 640,
      cyclePhoto: cyclePhoto,
      markers: [],
    };
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
