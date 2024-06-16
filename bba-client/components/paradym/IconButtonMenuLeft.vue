<!-- Paradym Component
  Name:     IconButtonMenuLeft
  Version:  0.1
-->

<template>
  <v-menu
    open-on-click
    bottom
    :left="left"
    offset-y
    transition="slide-y-transition"
    :content-class="isMobile ? 'mobile-menu' : ''"
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

    <v-list class="pa-0" v-for="(item, index) in items" :key="index">
      <template>
        <v-list-item
          :link="!item.hasOwnProperty('action')"
          :to="item.hasOwnProperty('action') ? undefined : item.to"
          @click="runAction(item)"
        >
          <v-list-item-action>
            <v-img
              v-if="item.iconImage"
              max-height="20"
              max-width="20"
              :src="item.iconImage"
            ></v-img>
            <v-icon v-else color="#E4E4E4">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
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
    breakpoint: {
      type: Number,
      default: 640,
    },
    icon: String,
    left: Boolean,
    iconImage: String,
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
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

<style lang="scss" scoped>
.mobile-menu {
  min-width: 100% !important;
  top: 56px !important;
  left: 0px !important;
  transform-origin: left top !important;
  z-index: 8 !important;

  border-bottom-color: #4c9a2a;
  border-bottom-style: solid;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;

  .v-list {
    background-color: #444444 !important;

    .v-list-item__content {
      .v-list-item__title {
        color: #ffffff !important;
      }
    }
  }
}
</style>
