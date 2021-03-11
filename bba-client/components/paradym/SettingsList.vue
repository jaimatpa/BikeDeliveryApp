<template>
  <v-sheet
    outlined
    rounded
    max-width="840"
    class="mx-auto"
    style="width: 100%;"
  >
    <v-list class="pa-0">
      <template v-for="(item, index) in items">
        <v-list-item :to="item.to ? item.to : undefined">
          <v-list-item-content>
            <div class="d-flex align-center">
              <span class="overline" style="flex-basis: 150px;">{{
                item.label
              }}</span>
              <span class="flex-grow-1">{{ item.value }}</span>
              <v-icon v-if="item.to">mdi-chevron-right</v-icon>
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index != items.length - 1" />
      </template>
    </v-list>
  </v-sheet>
</template>

<script>
export default {
  name: "SettingsList",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
