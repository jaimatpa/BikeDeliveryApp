export const state = () => ({
  hideNav: false,
});
export const mutations = {
  showNav(state) {
    state.hideNav = false;
  },
  hideNav(state) {
    state.hideNav = true;
  },
};
