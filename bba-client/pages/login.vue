<template>
  <PageForm>
    <!-- Login Form -->
    <FormLogin
      title="Bike Delivery App"
      :logo="bikeLogo"
      logoWidth="155"
      logoHeight="98"
      width="340"
      email
      outlined
      :busy="busy"
      :error="error"
      registerURL="/register"
      forgotURL="/forgotPassword"
      @submit="loginUser"
      :user="user"
    >
      <template v-slot:beforeSubmit>
        <!-- Verification Error -->
        <v-alert
          v-model="verifyError"
          type="error"
          dense
          text
          dismissible
          icon="mdi-email-alert"
        >
          Your email address has not been verified.
          <a href="#" @click="sendVerifyEmail">Resend email</a>
        </v-alert>
        <v-alert
          v-model="verifyEmailSent"
          type="success"
          dense
          text
          dismissible
          icon="mdi-email-alert"
        >
          Message sent. Check your email and click the verification link.
        </v-alert>
      </template>
    </FormLogin>
  </PageForm>
</template>

<script>
import { mapActions } from "vuex";

import PageForm from "@/components/paradym/PageForm";
import FormLogin from "@/components/paradym/forms/FormLogin";
import bikeLogo from '@/assets/images/bike_logo.svg'

export default {
  name: "pageLogin",
  layout: "loggedOut",
  auth: false,
  head() {
    return { title: "Login" };
  },
  created() {
    this.user = this.$auth.$storage.getLocalStorage("rememberMe");
  },
  components: { PageForm, FormLogin },
  data() {
    return {
      busy: false,
      error: "",
      verifyError: false,
      verifyEmailSent: false,
      bikeLogo: bikeLogo,
      email: "", // Stores the email address when logging in
      user: "", // Stores the username (email) from local storage
    };
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    async loginUser(credentials) {
      try {
        this.error = "";
        this.verifyError = false;
        this.busy = true;
        this.email = credentials.email;
        let remember = credentials.remember;
        delete credentials.remember;
        const response = await this.$auth.loginWith("local", {
          data: credentials,
        });        
        
        if (response.status == 200) {
          this.$auth.setUser(response.data.user);
          this.$auth.$storage.setLocalStorage("user", response.data);
          if (remember)
            this.$auth.$storage.setLocalStorage("rememberMe", this.email);
          else this.$auth.$storage.removeLocalStorage("rememberMe");
          this.$router.push("/");
          this.showSuccess("Login Successfully Done!!!");
        }
      } catch (err) {
        console.log('err', err.response);
        
        try {
          let error = err.response.data.message;
          switch (err.response.data.type) {
            case "verification":
              this.verifyError = true;
              break;
            default:
              this.error = error;
          }
        } catch {
          this.error = err;
        }
      } finally {
        this.busy = false;
      }
    },
    async sendVerifyEmail() {
      let result = await this.$axios.$post("/api/user/sendEmailVerification", {
        email: this.email,
      });
      if (result.success) {
        this.verifyError = false;
        this.verifyEmailSent = true;
      }
    },
  },
};
</script>
