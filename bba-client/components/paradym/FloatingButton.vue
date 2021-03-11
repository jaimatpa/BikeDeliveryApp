<!-- Paradym Component
  Name:     FloatingButton
  Version:  0.1
-->

<template>
  <div>
    <v-tooltip
      v-if="tooltip"
      left
      color="#333333"
      style="z-index: 5 !important;"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition appear>
          <v-btn
            :color="color"
            fixed
            bottom
            right
            fab
            class="mr-4 mb-4"
            @click="$emit('click')"
            v-bind="attrs"
            v-on="on"
            style="z-index: 5 !important;"
          >
            <v-icon large>{{ icon }}</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
    <v-btn
      v-else
      :color="color"
      fixed
      bottom
      right
      fab
      class="mr-4 mb-4"
      @click="$emit('click')"
      style="z-index: 5 !important;"
    >
      <v-icon large>{{ icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "FloatingButton",
  props: {
    tooltip: String,
    icon: {
      type: String,
      default: "mdi-plus",
    },
    color: String,
  },
};
</script>
