export const state = () => ({
  hideNav: false,
  capturedImages: [],
  capturedPickupImages: []
});
export const mutations = {
  SET_CAPTURED_IMAGES_IN_VUEX(state, images) {
    state.capturedImages = images
  },
  SET_CAPTURED_PICKUP_IMAGES_IN_VUEX(state, images) {
    state.capturedPickupImages = images
  },
  showNav(state) {
    state.hideNav = false;
  },
  hideNav(state) {
    state.hideNav = true;
  },
};
