<template>
  <div class="pa-3">
    <!-- Light/Dark -->
    <v-btn-toggle
      v-model="dark"
      borderless
      mandatory
      rounded
      color="primary"
      class="mb-4"
      style="width: 100%;"
    >
      <v-btn :value="false" class="flex-grow-1">
        <span class="hidden-sm-and-down">Light</span>
        <v-icon right>
          mdi-weather-sunny
        </v-icon>
      </v-btn>
      <v-btn :value="true" color="" class="flex-grow-1">
        <span class="hidden-sm-and-down">Dark</span>
        <v-icon right>
          mdi-weather-night
        </v-icon>
      </v-btn>
    </v-btn-toggle>

    <!-- Theme -->
    <v-select
      v-model="selectedTheme"
      label="Theme"
      :items="themeList"
      dense
      outlined
    />

    <!-- Theme Colors -->
    <v-card
      flat
      :light="dark"
      :dark="!dark"
      :color="value"
      v-for="(value, name) in themeColors"
      :key="name"
      class="rounded-0"
    >
      <v-card-text>
        <v-row>
          <v-col cols="6" class="pa-1">
            <span>{{ name }}</span>
          </v-col>
          <v-col cols="6" class="pa-1">
            <span>{{ value }}</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "ThemeSettings",
  computed: {
    ...mapState(["theme"]),
    dark: {
      set(dark) {
        this.setDark(dark);
      },
      get() {
        return this.theme.dark;
      },
    },
    selectedTheme: {
      set(theme) {
        this.setTheme(theme);
      },
      get() {
        return this.theme.theme;
      },
    },
    themeList() {
      let result = [];
      this.theme.themes.forEach((t) => {
        result.push({
          text: t.name,
          value: t.name,
        });
      });
      return result;
    },
    themeColors() {
      let foundTheme = null;
      this.theme.themes.forEach((t) => {
        if (t.name == this.theme.theme) foundTheme = t;
      });
      if (foundTheme) {
        if (foundTheme.theme) return foundTheme.theme;
        else if (this.theme.dark && foundTheme.dark) return foundTheme.dark;
        else if (!this.theme.dark && foundTheme.light) return foundTheme.light;
      }
    },
  },
  methods: {
    ...mapMutations({
      setTheme: "theme/setTheme",
      setDark: "theme/setDark",
    }),
  },
};
</script>

<style lang="scss" scoped>
.v-btn-toggle .v-btn .v-icon {
  color: unset !important;
}
</style>
