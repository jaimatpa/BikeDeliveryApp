<!--
  This page gets the "token" and "email" query parameters and sends them to the
  server in an attempt to verify the user's email address.
-->
<template>
  <PageForm bg="/bg.jpg" contain>
    <h1 class="text-h5 font-weight-bold text-center" v-if="busy">
      Email Verification
    </h1>
    <!-- Busy -->
    <p v-if="busy" class="mb-0">Verifying your email address...</p>
    <!-- Not Busy -->
    <template v-else>
      <template v-if="isVerified">
        <p style="margin-top: -8px;">
          <strong>Your account has been activated.</strong>
        </p>
        <v-btn color="primary" text to="/login">Sign In</v-btn>
      </template>
      <template v-else-if="error">
        <p class="secondary--text">Error: {{ error }}</p>
        <v-btn color="primary" text to="/login">Sign In</v-btn>
      </template>
    </template>
  </PageForm>
</template>

<script>
import PageForm from "@/components/paradym/PageForm";

export default {
  name: "pageVerifyEmail",
  layout: "loggedOut",
  auth: false,
  head() {
    return { title: "Email Verification" };
  },
  components: { PageForm },
  async created() {
    if (process.client) {
      let token = this.$route.query.token;
      let email = this.$route.query.email;
      if (token && email) {
        this.verifyEmail({ token: token, email: email });
      } // If there was no token or email provided
      else this.$router.push({ path: "/login" });
    }
  },
  data() {
    return {
      busy: true,
      isVerified: false,
      error: null,
    };
  },
  methods: {
    async verifyEmail(data) {
      try {
        this.busy = true;
        let result = await this.$axios.$post("/api/user/verifyEmail", {
          token: data.token,
          email: data.email,
        });
        if (result.success) this.isVerified = true;
      } catch (err) {
        try {
          try {
            this.error = err.response.data.message;
          } catch {
            this.error = err;
          }
        } catch {
          this.error = err;
        }
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
