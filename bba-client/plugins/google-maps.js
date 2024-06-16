import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAHRmARgxzw11yFWM8RFFElkXCO0I2xGV0",
    libraries: "places",
  },
});
