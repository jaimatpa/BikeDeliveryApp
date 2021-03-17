<template>
  <PageForm :contain="registrationCompleteEmail != ''">
    <!-- Registration Form -->
    <FormRegister
      v-if="!registrationCompleteEmail"
      confirm
      title="bike delivery app"
      :logo="bikeLogo"
      width="340"
      logoWidth="155"
      logoHeight="98"
      outlined
      :busy="busy"
      :error="error"
      loginURL="/login"
      @submit="registerUser"
    />

    <!-- Account Created Message -->
    <template v-else>
      <p>
        Your account has been created!
        <br />
        A verification email has been sent to:
      </p>
      <h2 class="mb-4">{{ registrationCompleteEmail }}</h2>
      <p class="caption" style="margin: 0 -16px 8px -16px;">
        Follow the instructions in the email to activate your account.
      </p>
    </template>
  </PageForm>
</template>

<script>
import PageForm from "@/components/paradym/PageForm";
import FormRegister from "@/components/paradym/forms/FormRegister";
import bikeLogo from '@/assets/images/bike_logo.svg'

export default {
  name: "pageRegister",
  layout: "loggedOut",
  auth: false,
  head() {
    return { title: "Register" };
  },
  components: { PageForm, FormRegister },
  data() {
    return {
      busy: false,
      registrationCompleteEmail: "",
      error: "",
      bikeLogo: bikeLogo,
    };
  },
  methods: {
    async registerUser(userInfo) {            
      try {
        this.error = "";
        this.busy = true;
        let response = await this.$axios.$post("/api/user/register", userInfo);
        if (response.success) this.registrationCompleteEmail = response.email;
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
