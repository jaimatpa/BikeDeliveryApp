<template>
  <v-navigation-drawer v-model="drawer" fixed right temporary>
    <v-toolbar flat class="v-bar--underline">
      <v-toolbar-title v-if="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('input', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <slot></slot>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "sideBar",
  props: {
    value: Boolean,
    title: String,
  },
  created() {
    this.drawer = this.value;
  },
  data() {
    return {
      drawer: false,
    };
  },
  watch: {
    value(newValue) {
      this.drawer = newValue;
    },
    drawer(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style lang="scss">
.theme--dark,
.theme--light {
  .v-bar--underline {
    border-width: 0 0 thin;
    border-style: solid;
    &.theme--light {
      border-bottom-color: rgba(0, 0, 0, 0.12) !important;
    }
    &.theme--dark {
      border-bottom-color: hsla(0, 0%, 100%, 0.12) !important;
    }
  }
}
</style>
