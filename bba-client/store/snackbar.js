import themes from "@/themes.json";
import Vue from "vue";

export const state = () => ({
  busy: false,
  message: "Loading...",
  timeout: 5000,
  color: "",
  canClose: false,
});

export const mutations = {
  resetState(state) {
    state.busy = false;
    state.message = "Loading...";
    state.timeout = 5000;
    state.color = "";
    state.canClose = false;
  },
  setBusy(state, value) {
    state.busy = value;
  },
  setMessage(state, value) {
    state.message = value;
  },
  setTimeout(state, value) {
    state.timeout = value;
  },
  setColor(state, value) {    
    state.color = value;
  },
  setCanClose(state, value) {
    state.canClose = value;
  },
};

export const actions = {
  // Settings
  async busy({ commit }, value) {    
    // Reset State
    await commit("resetState");

    // Set Timeout
    if (value.timeout) commit("setTimeout", parseInt(value.timeout));
    else if (value.canClose) commit("setTimeout", 5000);

    // Set Color
    if (value.color) commit("setColor", value.color);
    else if (value.canClose) commit("setColor", "primary");

    // Set CanClose
    if (value.canClose) commit("setCanClose", value.canClose);

    // Set Message
    if (value.message) commit("setMessage", value.message);

    // Make Busy
    commit("setBusy", true);
  },

  async error({ commit, dispatch }, message) {
    dispatch("busy", {
      timeout: -1,
      color: "error",
      canClose: true,
      message: message,
    });
  },

  async success({ commit, dispatch }, message) {
    dispatch("busy", {
      timeout: 2000,
      color: "success",
      canClose: false,
      message: message,
    });
  },
};
