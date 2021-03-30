export const state = () => ({
  hideNav: false,
  capturedImages: []
});
export const mutations = {
  SET_CAPTURED_IMAGES_IN_VUEX(state, images) {
    state.capturedImages = images
  },
  showNav(state) {
    state.hideNav = false;
  },
  hideNav(state) {
    state.hideNav = true;
  },
};
