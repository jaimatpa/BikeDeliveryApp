<!-- Paradym Component
  Name:     Snackbar
  Version:  0.1
-->

<template>
  <v-snackbar :value="busy" :timeout="timeout" :color="color" top right>
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
      default: 5000,
    },
    color: String,
    message: String,
    canClose: Boolean,
  }
};
</script>
