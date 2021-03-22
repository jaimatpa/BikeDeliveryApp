<template lang="html">
  <Page title="Resend"> </Page>
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
  name: "resend",
  auth: true,
  head() {
    return {
      title: "Resend",
    };
  },
  components: { Page },
  data() {
    return {};
  },
};
</script>