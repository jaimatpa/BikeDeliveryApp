<!-- Paradym Component
  Name:     Snackbar
  Version:  0.1
-->

<template>
  <v-snackbar
    :value="busy"
    :timeout="timeout"
    :color="color"
    :top="!isMobile"
    :right="!isMobile"
    :bottom="isMobile"
    :center="isMobile"
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn v-if="canClose" v-bind="attrs" text @click="$emit('close')"
        >Close</v-btn
      >
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackBar",
  props: {
    busy: Boolean,
    timeout: {
      type: Number,
      default: 2000,
    },
    breakpoint: {
      type: Number,
      default: 640,
    },
    color: String,
    message: String,
    canClose: Boolean,
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
};
</script>
