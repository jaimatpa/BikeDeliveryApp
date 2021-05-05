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
      class="appBar-title"
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

    <!-- Topbar -->
    <div
      v-if="isMobile && $nuxt.$route.name !== 'index'"
      class="top-bar d-flex align-center px-6"
    >
      <v-icon medium color="white" class="mr-2">
        {{ getTopBarIcon($nuxt.$route.name) }}
      </v-icon>
      <p class="text-uppercase white--text mb-0">
        {{ getTopBarName($nuxt.$route.name) }}
      </p>
    </div>

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
    <!-- <Sidebar v-model="settings" title="Settings">
      <ThemeSettings />
    </Sidebar> -->

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
          icon: "mdi-magnify",
          iconSelected: "mdi-magnify",
          to: "/searchHistory",
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
          to: "/searchHistory",
        },
      ],
      userItems: [
        {
          title: "WEB HOOK SETTINGS",
          to: "/webHookSetting",
        },
        {
          title: "COLOR COMBINATION SETTINGS",
          to: "/colorCombinationSetting",
        },
        {
          title: "USER MANAGEMENT",
          to: "/users",
        },
        {
          title: "TEXT MSG TEMPLATE",
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
        // {
        //   title: "MY ACCOUNT",
        //   to: "/account",
        //   icon: "mdi-account-circle",
        // },
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
    getTopBarIcon(routeName) {
      switch (routeName) {
        case "searchHistory":
          return "mdi-magnify";
          break;
        case "deliveryOrder":
          return "mdi-bike";
          break;
        case "locking":
          return "mdi-lock";
          break;
        case "resend":
          return "mdi-share";
          break;
        case "webHookSetting":
          return "mdi-hook";
          break;
        case "colorCombinationSetting":
          return "mdi-format-color-fill";
          break;
        case "users":
          return "mdi-account-group";
          break;
        case "searchHistory-orderId":
          return "mdi-magnify";
          break;
        case "locking-deliveryId":
          return "mdi-lock";
          break;
        case "deliveryOrder-orderId":
          return "mdi-bike";
          break;
        case "textMessageTemplate":
          return "mdi-email-edit";
          break;
        case "account":
          return "mdi-account-box";
          break;
        case "account-password":
          return "mdi-account-key";
          break;
        case "account-name":
          return "mdi-account-edit";
          break;
        case "callForHelp":
          return "mdi-help-circle";
          break;
        case "backupPhotos":
          return "mdi-backup-restore";
          break;

        default:
          return "";
          break;
      }
    },
    getTopBarName(routeName) {
      switch (routeName) {
        case "searchHistory":
          return "Search History";
          break;
        case "deliveryOrder":
          return "Delivery Order";
          break;
        case "locking":
          return "Locking";
          break;
        case "resend":
          return "Resend";
          break;
        case "webHookSetting":
          return "Web Hook Settings";
          break;
        case "colorCombinationSetting":
          return "Color Combination Settings";
          break;
        case "users":
          return "User Management";
          break;
        case "searchHistory-orderId":
          return "Order Details";
          break;
        case "locking-deliveryId":
          return "Lock Details";
          break;
        case "deliveryOrder-orderId":
          return "Delivery Details";
          break;
        case "textMessageTemplate":
          return "Text Message Template";
          break;
        case "callForHelp":
          return "Call For Help";
          break;
        case "backupPhotos":
          return "Backup Photos";
          break;

        default:
          return routeName;
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.top-bar {
  position: relative;
  top: 56px;
  left: 0;
  background-color: #4c9a2a;
  height: 30px;
}
</style>
