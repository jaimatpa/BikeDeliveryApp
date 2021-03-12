<template>
  <PageForm :contain="busy || finished">
    <!-- Not Loading -->
    <template v-if="!busy">
      <!-- Not Finished -->
      <template v-if="!finished">
        <!-- Email Form -->
        <FormEmail
          title="Forgot your password?"
          width="340"
          icons
          outlined
          text="Enter your email address and <br>we'll send you a link to reset it."
          :busy="busy"
          :error="error"
          buttonText="Reset Password"
          @submit="resetPW"
        >
          <!-- Form Footer -->
          <template v-slot:footer>
            <div class="text-center">
              <p class="text--secondary mb-0">Just remembered?</p>
              <v-btn text color="primary" to="/login">Sign In</v-btn>
            </div>
          </template>
        </FormEmail>
      </template>

      <!-- Finished -->
      <template v-else>
        <p>
          An email has been sent to:
        </p>
        <h2 class="mb-4">{{ email }}</h2>
        <p class="caption" style="margin: 0 -16px 8px -16px;">
          Follow the instructions in the email to reset your password.
        </p>
      </template>
    </template>

    <!-- Loading -->
    <template v-else>
      <p>We are sending you a password reset email.</p>
      <v-progress-linear class="mb-4" indeterminate color="primary" />
    </template>
  </PageForm>
</template>

<script>
import PageForm from "@/components/paradym/PageForm";
import FormEmail from "@/components/paradym/forms/FormEmail";

export default {
  name: "pageForgotPassword",
  auth: false,
  layout: "loggedOut",
  head() {
    return { title: "Forgot Password" };
  },
  components: { PageForm, FormEmail },
  data() {
    return {
      busy: false,
      error: "",
      finished: false,
      email: ""
    };
  },
  methods: {
    async resetPW(email) {
      try {
        this.busy = true;
        let response = await this.$axios.$post("/api/user/forgotPassword", {
          email: email,
        });
        if (response.success) {
          this.finished = true;
          this.email = email;
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
    },
  },
};
</script>

<style lang="scss" scoped></style>
