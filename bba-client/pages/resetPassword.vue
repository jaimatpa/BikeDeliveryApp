<template lang="html">
  <PageForm v-if="tokenAndEmailExists">
    <!-- Not finished -->
    <template v-if="!finished">
      <!-- Not Busy -->
      <FormChangePassword
        v-if="!busy"
        title="Reset your password"
        :logo="bikeLogo"
        logoWidth="155"
        logoHeight="98"
        width="340"
        outlined
        :busy="busy"
        :error="error"
        @submit="resetPW"
        reset
      />

      <!-- Busy -->
      <template v-else>
        <p>Attempting to reset your password...</p>
        <v-progress-linear class="mb-4" indeterminate color="primary" />
      </template>
    </template>

    <!-- Finished -->
    <template v-else>
      <p class="mb-6">
        Your password was reset. <n-link to="/login">Sign in now</n-link>.
      </p>
    </template>
  </PageForm>
</template>

<script>
import PageForm from "@/components/paradym/PageForm";
import FormChangePassword from "@/components/paradym/forms/FormChangePassword";
import bikeLogo from "@/assets/images/bike_logo.svg";

export default {
  name: "pageResetPassword",
  layout: "loggedOut",
  auth: false,
  created() {
    if (process.client && !this.tokenAndEmailExists)
      this.$router.push("/login");
  },
  head() {
    return { title: "Reset your password" };
  },
  components: { PageForm, FormChangePassword },
  data() {
    return {
      busy: false,
      error: "",
      finished: false,
      bikeLogo: bikeLogo,
    };
  },
  computed: {
    tokenAndEmailExists() {
      return this.$route.query.token && this.$route.query.email;
    },
  },
  methods: {
    async resetPW(data) {
      if (this.tokenAndEmailExists) {
        try {
          this.busy = true;
          this.finished = false;
          this.error = "";
          data.token = this.$route.query.token;
          data.email = this.$route.query.email;
          data.password = data.newPassword;
          data.confirmPassword = data.confirmNewPassword;
          delete data.confirmNewPassword;
          let response = await this.$axios.$post(
            "/api/user/resetPassword",
            data
          );
          if (response.success) {
            this.finished = true;
          }
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
      }
    },
  },
};
</script>
