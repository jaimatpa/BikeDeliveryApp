export default ({ store, app, $vuetify }) => {
  function updateVuetifyTheme() {
    $vuetify.theme.isDark = store.state.theme.dark;
    $vuetify.theme.theme = store.state.theme.theme;

    let allThemes = store.state.theme.themes;
    allThemes.forEach((theme) => {
      if (theme.name == store.state.theme.theme) {
        console.log(`Applying theme '${theme.name}'`);
        $vuetify.theme.themes.dark = {};
        $vuetify.theme.themes.light = {};
        if (theme.hasOwnProperty("dark"))
          $vuetify.theme.themes.dark = theme.dark;
        if (theme.hasOwnProperty("light"))
          $vuetify.theme.themes.light = theme.light;
        if (theme.hasOwnProperty("theme")) {
          $vuetify.theme.themes.dark = theme.theme;
          $vuetify.theme.themes.light = theme.theme;
        }
      }
    });
  }

  app.mounted = async () => {
    // Initialize theme
    await store.commit(
      "theme/initialize",
      Object.assign({}, $vuetify.theme.themes)
    ); // Load saved values from local storage into state
    updateVuetifyTheme();
    // Watch for state changes & update theme
    store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case "theme/setDark":
        case "theme/setTheme":
          localStorage.setItem(
            "theme",
            JSON.stringify({
              dark: state.theme.dark,
              theme: state.theme.theme,
            })
          );
          updateVuetifyTheme();
      }
    });
  };
};
