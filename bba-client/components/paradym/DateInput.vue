<!-- Paradym Component
  Name:     DateInput
  Version:  0.1
-->

<template>
  <v-menu
    v-model="menuDate"
    offset-y
    min-width="auto"
    :close-on-content-click="false"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="label"
        v-bind="attrs"
        v-on="on"
        type="date"
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
    <v-date-picker v-model="date" no-title scrollable />
  </v-menu>
</template>

<script>
export default {
  name: "DateInput",
  props: {
    value: String,
    label: String,
    disabled: Boolean,
    required: Boolean,
  },
  data() {
    return {
      date: this.value,
      menuDate: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  watch: {
    value(newValue) {
      this.date = newValue;
    },
    date(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style type="scss">
input::-webkit-calendar-picker-indicator {
  display: none;
}
input[type="date"]::-webkit-input-placeholder {
  visibility: hidden !important;
}
</style>
