<template>
  <Page
    title="Account Settings"
    desc="Change your name, password, and more."
    center
  >
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
  data() {    
    return {
      items: [
        {
          label: "Email",
          value: this.$auth.$state.user.email,
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
