<!-- Paradym Component
  Name:     TimeInput
  Version:  0.1
-->

<template>
  <v-menu
    v-model="menuTime"
    offset-y
    min-width="auto"
    :close-on-content-click="false"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        :label="label"
        v-bind="attrs"
        v-on="on"
        type="time"
        :disabled="disabled"
        clearable
        outlined
        dense
        hide-details="auto"
        class="mb-4"
        :rules="required ? [rules.required] : []"
        validate-on-blur
      />
    </template>
    <v-time-picker v-model="time" scrollable />
  </v-menu>
</template>

<script>
export default {
  name: "TimeInput",
  props: {
    value: String,
    label: String,
    disabled: Boolean,
    required: Boolean,
  },
  data() {
    return {
      time: this.value,
      menuTime: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  watch: {
    value(newValue) {
      this.time = newValue;
    },
    time(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style type="scss">
input::-webkit-calendar-picker-indicator {
  display: none;
}
input[type="time"]::-webkit-input-placeholder {
  visibility: hidden !important;
}
</style>
