<!-- Paradym Component
  Name:     IconButtonMenu
  Version:  0.1
-->

<template>
  <v-menu
    open-on-click
    bottom
    :left="left"
    offset-y
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        icon
        v-bind="attrs"
        v-on="on"
        class="mx-0"
        style="left: -4px;"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-list class="pa-0">
      <template v-for="(item, index) in items">
        <v-list-item
          :link="!item.hasOwnProperty('action')"
          :to="item.hasOwnProperty('action') ? undefined : item.to"
          @click="runAction(item)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon v-text="item.icon" />
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="index < items.length - 1" />
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "iconButtonMenu",
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    icon: String,
    left: Boolean,
  },
  methods: {
    runAction(item) {
      if (item.hasOwnProperty("action")) {
        item.action();
      }
    },
  },
};
</script>
