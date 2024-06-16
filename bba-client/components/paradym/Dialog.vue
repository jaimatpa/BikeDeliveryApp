<!-- Paradym Component
  Name:     Dialog
  Version:  0.1
-->

<template>
  <v-dialog
    v-model="dialog"
    :dark="dark"
    :fullscreen="!maxWidth"
    :hide-overlay="!maxWidth"
    transition="dialog-bottom-transition"
    :max-width="computedMaxWidth"
    class="ma-0"
    scrollable
  >
    <v-card>
      <v-toolbar
        dense
        color="primary"
        dark
        :class="{ 'mb-4': !noPadding }"
        elevation="0"
      >
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text :class="{ 'pa-0': noPadding }">
        <slot></slot>
      </v-card-text>
      <v-divider />
      <v-card-actions v-if="!hideButtons" class="justify-end">
        <slot name="actions">
          <v-btn text @click="dialog = false">Close</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    title: String,
    "max-width": [Number, String],
    value: Boolean,
    noPadding: Boolean,
    hideButtons: Boolean,
    dark: Boolean,
  },
  created() {
    this.dialog = this.value;
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    computedMaxWidth() {
      if (!isNaN(this.maxWidth)) return this.maxWidth + "px";
      else return this.maxWidth;
    },
  },
  watch: {
    value(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style lang="scss">
.v-dialog {
  .v-card header {
    flex-grow: 0;
  }
}
</style>
