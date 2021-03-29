import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAbbD4N_pPzGPSPY_PyLy8GD5YND-hG_rQ",
    libraries: "places",
  },
});
