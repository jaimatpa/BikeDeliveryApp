<!-- Paradym Component
  Name:     AppBar
  Version:  0.11
-->

<template>
  <v-app-bar :app="app" clipped-left flat :dark="dark" :color="color">
    <v-app-bar-nav-icon
      v-if="hasMenuClickHandler"
      @click.stop="$emit('menuClick')"
    />
    <v-toolbar-title v-if="title || logo" class="mx-1 pl-0">
      <n-link to="/">
        <div class="d-flex align-center">
          <img
            v-if="logo"
            :src="logo"
            :height="computedLogoHeight"
            :alt="title"
            class="mr-2"
          />
          <span v-if="title">{{ title }}</span>
        </div>
      </n-link>
    </v-toolbar-title>
    <v-spacer />
    <slot></slot>
  </v-app-bar>
</template>

<script>
export default {
  name: "appBar",
  props: {
    title: String,
    color: String,
    logo: String,
    logoHeight: {
      type: [Number, String],
      default: "36px",
    },
    dark: Boolean,
    app: Boolean,
  },
  computed: {
    hasMenuClickHandler() {
      return !!(this.$listeners && this.$listeners.menuClick);
    },
    computedLogoHeight() {
      if (!isNaN(this.logoHeight)) return this.logoHeight + "px";
      else return this.logoHeight;
    },
  },
};
</script>

<style lang="scss">
.v-toolbar__title a {
  text-decoration: none;
  color: unset !important;
}
</style>
