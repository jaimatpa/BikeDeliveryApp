import themes from "@/themes.json";
import Vue from "vue";

export const state = () => ({
  dark: false,
  theme: null,
  themes: themes,
});

export const mutations = {
  initialize(state, vuetifyThemes) {
    vuetifyThemes.name = "Default";
    state.themes = [vuetifyThemes, ...themes];
    let saved = JSON.parse(localStorage.getItem("theme"));
    if (saved) {
      state.theme = saved.theme || "Default";
      state.dark = saved.dark || false;
    }
  },
  setTheme(state, value) {
    state.theme = value;
  },
  setDark(state, value) {
    state.dark = value;
  },
  toggleDark(state, value) {
    state.dark = !state.dark;
  },
};
