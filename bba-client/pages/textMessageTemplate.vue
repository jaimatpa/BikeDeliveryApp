<template lang="html">
  <Page>
    <v-textarea
      clearable
      clear-icon="mdi-close-circle"
      label="Message"
      value="This is clearable text."
      outlined
    ></v-textarea>
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
  name: "textMessageTemplate",
  auth: true,
  head() {
    return {
      title: "Text Message Template",
    };
  },
  components: { Page },
  data() {
    return {};
  },
};
</script>
