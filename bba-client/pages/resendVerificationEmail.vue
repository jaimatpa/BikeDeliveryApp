<template lang="html">
  <PageForm> </PageForm>
</template>

<script>
import PageForm from "@/components/paradym/PageForm";

export default {
  name: "pageResendVerificationEmail",
  layout: "loggedOut",
  auth: false,
  head() {
    return { title: "Resend Verification Email" };
  },
  components: { PageForm },
};
</script>

<style lang="css" scoped></style>
