<template>
  <Page
    :maxWidth="maxWidth"
    :noPadding="noPadding"
    :center="center"
    :fluid="fluid"
  >
    <template v-slot:toolbar>
      <header
        class="mx-auto d-flex align-center py-2 px-4"
        :style="{ 'max-width': computedMaxWidth }"
      >
        <v-icon class="mr-2" @click="$router.go(-1)">mdi-arrow-left</v-icon>
        <h1 v-html="title" class="text-h5" />
      </header>
      <v-divider
        :style="{ visibility: $vuetify.breakpoint.smAndDown ? 'hidden' : '' }"
        class="mb-4"
      />
      <p
        v-if="desc"
        v-text="desc"
        :style="{ 'max-width': computedMaxWidth }"
        class="mx-auto px-4 mb-0"
      />
    </template>
    <slot></slot>
  </Page>
</template>
<script>
import { mapState, mapMutations } from "vuex";

import Page from "./paradym/Page";

export default {
  name: "PageSetting",
  components: { Page },
  mounted() {
    this.hideNav();
  },
  beforeDestroy() {
    this.showNav();
  },
  props: {
    title: String,
    desc: String,
    maxWidth: {
      type: [Number, String],
      default: 870,
    },
    noPadding: Boolean,
    fluid: Boolean,
    center: Boolean,
  },
  methods: {
    ...mapMutations(["hideNav", "showNav"]),
  },
  computed: {
    computedMaxWidth() {
      if (!isNaN(this.maxWidth)) return this.maxWidth + "px";
      else return this.maxWidth;
    },
  },
};
</script>
