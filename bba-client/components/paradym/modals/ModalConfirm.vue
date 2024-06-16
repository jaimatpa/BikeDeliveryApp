<template>
  <v-dialog
    v-model="show"
    :max-width="maxWidth"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <v-card-title class="text-h6 pb-2" v-html="title" />
      <v-card-text v-html="message" class="mb-0 pb-0" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!hideCancel && !error"
          text
          @click="$emit('input', false)"
          >{{ cancelText ? cancelText : "Cancel" }}</v-btn
        >
        <v-btn :color="confirmColor" text @click="$emit('confirm')">{{
          confirmText ? confirmText : "Confirm"
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "modalConfirm",
  props: {
    value: Boolean,
    title: {
      type: String,
      default: "Confirm",
    },
    message: {
      type: String,
      default: "Are you sure you want to complete this action?",
    },
    confirmText: {
      type: String,
      default: "Confirm",
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
    confirmColor: {
      type: String,
      default: "primary",
    },
    "max-width": {
      type: String,
      default: "290",
    },
    hideCancel: Boolean,
    error: Boolean,
  },
  created() {
    this.show = this.value;
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    value(newValue) {
      this.show = newValue;
    },
    show(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>
