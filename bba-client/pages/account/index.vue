<template>
  <Page
    :title="!isMobile ? 'Account Settings' : ''"
    desc="Change your name, password, and more."
    center>
    <SettingsList :items="items" />
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import SettingsList from "@/components/paradym/SettingsList";

export default {
  name: "pageAccount",
  auth: true,
  head() {
    return { title: "Account" };
  },
  components: { Page, SettingsList },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      items: [
        {
          label: "Email",
          value: this.$auth.user.email,
        },
        {
          label: "Password",
          value: "**********",
          to: "/account/password",
        },
        {
          label: "Name",
          value: this.$auth.$state.user.name,
          to: "/account/name",
        },
      ],
    };
  },
};
</script>
