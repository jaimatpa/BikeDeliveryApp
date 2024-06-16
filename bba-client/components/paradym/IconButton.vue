<!-- Paradym Component
  Name:     IconButton
  Version:  0.1
-->

<template>
  <div>
    <v-tooltip v-if="tooltip" bottom color="#555555">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          class="mr-2"
          v-bind="attrs"
          v-on="on"
          :to="to"
          @click="click"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
    <v-btn v-else icon class="mr-2" :to="to" @click="click">
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "iconButton",
  props: {
    tooltip: String,
    icon: String,
    to: String,
  },
  computed: {
    hasClickListener() {
      return !!(this.$listeners && this.$listeners.click);
    },
  },
  methods: {
    click() {
      if (this.hasClickListener) this.$emit("click");
    },
  },
};
</script>

<style lang="scss"></style>
