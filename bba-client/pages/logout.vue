<template>
  <Page />
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
  name: "pageLogout",
  auth: true,
  head() {
    return { title: "Logout" };
  },
  components: { Page },
  created() {
    this.$auth.$storage.removeLocalStorage("user");
    this.$auth.logout();
  },
};
</script>
