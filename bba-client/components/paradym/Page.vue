<template>
  <div class="page">
    <slot name="toolbar"></slot>
    <v-container
      :fluid="fluid"
      :class="{
        'px-8 py-6': !noPadding && $vuetify.breakpoint.smAndUp,
        'px-6 py-4': !noPadding && $vuetify.breakpoint.xsOnly,
        'pa-0': noPadding,
      }"
      :style="{ maxWidth: computedMaxWidth }"
    >
      <slot name="beforeHeader"></slot>
      <header
        v-if="title || desc"
        class="mb-8"
        :class="{ 'text-center': center }"
      >
        <h1 v-if="title" v-html="title" class="text-h4 mb-4" />
        <div class="page-desc">
          <slot name="desc">
            <p v-if="desc" v-html="desc" />
          </slot>
        </div>
      </header>
      <slot></slot>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "Page",
  props: {
    title: String,
    desc: String,
    maxWidth: [Number, String],
    noPadding: Boolean,
    fluid: Boolean,
    center: Boolean,
  },
  computed: {
    computedMaxWidth() {
      if (!isNaN(this.maxWidth)) return this.maxWidth + "px";
      else return this.maxWidth;
    },
  },
};
</script>

<style lang="scss">
.page {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .container {
    flex-grow: 1;
  }
}
.page-desc a {
  text-decoration: none;
  font-weight: 500;
}
</style>
