<template lang="html">
  <Page title="Resend"> </Page>
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
  name: "pageTest",
  auth: true,
  head() {
    return {
      title: "Test",
    };
  },
  components: { Page },
  data() {
    return {};
  },
};
</script>