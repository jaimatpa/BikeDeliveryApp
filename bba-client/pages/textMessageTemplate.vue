<template lang="html">
  <Page>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="12" xl="12">
        <div class="text-message-template-box px-2 py-2">
          <p class="text-uppercase primary--text mb-0">Message</p>
          <p class="subtitle-2 secondary--text mb-0">
            Hello <span class="primary--text">[customer-name]</span>! Your bike
            is now available at <span class="primary--text">[geo-lat]</span>
            <span class="primary--text">[geo-long]</span>. Your deliver number
            is <span class="primary--text">[delivery-number]</span>
          </p>
          <p class="secondary--text primary--text mb-0">Thank You.</p>
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
        class="mt-5"
        justify="center"
      >
        <div :class="[isMobile ? 'text-center' : '']">
          <p class="headline text-uppercase primary--text mb-1">
            Available Tags
          </p>
          <v-divider :class="[isMobile ? 'mobile-divider' : '']"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" xs="12" sm="12" md="12" xl="12">
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[customer-name]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[pictures]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[lock-combo]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[geo-lat]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[geo-long]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[delivery-number]</span
        >
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
  name: "textMessageTemplate",
  auth: true,
  head() {
    return {
      title: "Text Message Template",
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
    };
  },
};
</script>

<style lang="scss">
.text-message-template-box {
  height: 200px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.mobile-divider {
  max-width: 50%;
  margin: 0 auto;
}
</style>
