<template>
  <v-app v-if="$auth.loggedIn">
    <!-- App Bar -->
    <AppBar
      app
      :title="$config.appName"
      @menuClick="drawer = !drawer"
      :color="$vuetify.theme.dark ? '' : '#444444'"
      :dark="true"
      :isMobileBreakPoint="isMobile"
    >
      <!-- <IconButton
        @click="settings = true"
        icon="mdi-cog-outline"
        tooltip="Settings"
      /> -->
      <IconButtonMenu
        :items="userItems"
        :icon="
          $nuxt.$route.path === '/account'
            ? 'mdi-account-cog'
            : 'mdi-account-cog-outline'
        "
      />
    </AppBar>

    <!-- Navigation -->
    <Navigation
      v-model="drawer"
      v-if="!hideNav"
      :items="items"
      color="primary"
    />

    <!-- Main Content Container -->
    <v-main>
      <nuxt />
      <!-- <nuxt keep-alive :keep-alive-props="{ max: 10, exclude: ['pageAccount'] }" /> -->
    </v-main>

    <!-- Sidebar: Settings -->
    <Sidebar v-model="settings" title="Settings">
      <ThemeSettings />
    </Sidebar>

    <!-- Snackbar -->
    <Snackbar
      :busy="snackbar.busy"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      :message="snackbar.message"
      :canClose="snackbar.canClose"
      @close="setBusy(false)"
    />
  </v-app>
  <v-app v-else>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import AppBar from "@/components/paradym/AppBar";
import Navigation from "@/components/paradym/Navigation";
import Sidebar from "@/components/paradym/Sidebar";
import Snackbar from "@/components/paradym/Snackbar";
import ThemeSettings from "@/components/ThemeSettings";
import IconButton from "@/components/paradym/IconButton";
import IconButtonMenu from "@/components/paradym/IconButtonMenu";

export default {
  name: "LayoutDefault",
  async created() {
    // Restore logged in user data from local storage if need be
    if (process.client && !this.$auth.user.hasOwnProperty("id")) {
      let user = this.$auth.$storage.getLocalStorage("user");
      if (user) this.$auth.setUser(user);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawer = this.$vuetify.breakpoint.width > 640;
    });
  },
  components: {
    AppBar,
    Navigation,
    Sidebar,
    Snackbar,
    ThemeSettings,
    IconButton,
    IconButtonMenu,
  },
  data() {
    return {
      drawer: false,
      settings: false,
      breakpoint: 640,
      items: [
        {
          title: "DASHBOARD",
          icon: "mdi-view-dashboard-outline",
          iconSelected: "mdi-view-dashboard",
          to: "/",
        },
        {
          title: "SEARCH HISTORY",
          icon: "mdi-card-search-outline",
          iconSelected: "mdi-card-search",
          to: "/search",
        },
        {
          title: "DELIVERY ORDER",
          icon: "mdi-bike",
          iconSelected: "mdi-bike-fast",
          to: "/deliveryOrder",
        },
        {
          title: "LOCKING",
          icon: "mdi-lock-outline",
          iconSelected: "mdi-lock",
          to: "/locking",
        },
        {
          title: "RESEND",
          icon: "mdi-share-outline",
          iconSelected: "mdi-share",
          to: "/resend",
        },
        {
          title: "All Users",
          icon: "mdi-account-group-outline",
          iconSelected: "mdi-account-group",
          to: "/users/allUsers",
        },
      ],
      userItems: [
        {
          title: "WEB HOOK SETTINGS",
          to: "/webHookSetting",
        },
        {
          title: "USER MANAGEMENT",
          to: "/users",
        },
        {
          title: "TEXT MESSAGE TEMPLATE",
          to: "/textMessageTemplate",
        },
        {
          title: "BACKUP DATABASE",
          to: "/backupDatabase",
          iconImage: require("./../assets/images/download.svg"),
          downArrowIcon: require("./../assets/images/down_arrow.svg"),
        },
        {
          title: "BACKUP PHOTOS",
          to: "/backupPhotos",
          iconImage: require("./../assets/images/download.svg"),
          downArrowIcon: require("./../assets/images/down_arrow.svg"),
        },
        {
          title: "MY ACCOUNT",
          to: "/account",
          icon: "mdi-account-circle",
        },
        {
          title: "LOGOUT",
          to: "/logout",
          icon: "mdi-logout",
          /*
        action: () => {
          this.$auth.$storage.removeLocalStorage('user')
          this.$auth.logout()
        }
        */
        },
      ],
    };
  },
  computed: {
    ...mapState(["hideNav"]),
    ...mapState({
      snackbar: (state) => state.snackbar,
    }),
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  methods: {
    ...mapMutations("snackbar", ["setBusy"]),
  },
};
</script>

<style lang="scss"></style>
