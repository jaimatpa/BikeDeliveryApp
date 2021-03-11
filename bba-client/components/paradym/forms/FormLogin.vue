<!-- Paradym Component
  Name:     FormLogin
  Version:  0.11
-->

<template>
  <Form
    :outlined="outlined"
    :title="title"
    :text="text"
    :elevated="elevated"
    :width="width"
    :logo="logo"
    :logoWidth="logoWidth"
    :logoHeight="logoHeight"
    :busy="busy"
    :error="error"
    :disabled="disabled"
    :buttonText="buttonText"
    @submit="onSubmit"
    v-on="
      hasCancelListener
        ? {
            cancel: () => {
              $emit('cancel');
            },
          }
        : {}
    "
  >
    <!-- Slot: Header -->
    <template v-slot:header>
      <slot name="header"></slot>
    </template>

    <!-- Slot: Default -->
    <slot></slot>

    <!-- Username -->
    <v-text-field
      v-model="username"
      :label="email ? 'Email' : 'Username'"
      autocomplete="off"
      class="mb-4"
      color="primary"
      validate-on-blur
      outlined
      dense
      hide-details="auto"
      :prepend-inner-icon="icons ? (email ? 'mdi-email' : 'mdi-account') : ''"
      :rules="email ? [rules.required, rules.email] : [rules.required]"
    />

    <!-- Password -->
    <v-text-field
      v-model="password"
      label="Password"
      autocomplete="off"
      class="mb-4"
      color="primary"
      validate-on-blur
      outlined
      dense
      hide-details="auto"
      :prepend-inner-icon="icons ? 'mdi-lock' : ''"
      :type="showPassword ? 'text' : 'password'"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required]"
      @click:append="showPassword = !showPassword"
    />

    <!-- Remember Me & Forgot Password -->
    <div class="form-login-options d-flex justify-space-between my-4 flex-wrap">
      <div class="mr-4">
        <v-checkbox
          dense
          v-model="remember"
          label="Remember Me"
          class="mt-0 pt-0"
          hide-details
        />
      </div>
      <n-link v-if="forgotURL" :to="forgotURL">Forgot Password</n-link>
    </div>

    <!-- Slot: BeforeSubmit -->
    <template v-slot:beforeSubmit>
      <slot name="beforeSubmit"></slot>
    </template>

    <!-- Slot: Buttons -->
    <template v-slot:buttons>
      <slot name="buttons"></slot>
    </template>

    <!-- Footer -->
    <template v-slot:footer v-if="registerURL">
      <div class="text-center">
        <p class="text--secondary mb-0">New User?</p>
        <v-btn text color="primary" :to="registerURL">Sign Up</v-btn>
      </div>
      <slot name="footer"></slot>
    </template>
  </Form>
</template>

<script>
import Form from "./Form";

export default {
  name: "FormLogin",
  components: { Form },
  props: {
    email: Boolean,
    registerURL: String,
    forgotURL: String,
    user: String,
    icons: Boolean,
    // Base Form
    title: String,
    text: String,
    logo: String,
    outlined: Boolean,
    elevated: Boolean,
    width: [Number, String],
    logoWidth: [Number, String],
    logoHeight: [Number, String],
    buttonText: {
      type: String,
      default: "Sign in",
    },
    error: String,
    disabled: Boolean,
    busy: Boolean,
  },
  created() {
    this.username = this.user;
  },
  data() {
    return {
      // Form fields
      username: "",
      password: "",
      remember: true,
      // Options
      showPassword: false,
      // Rules
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          if (value == "" || value == null) return true;
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  computed: {
    hasCancelListener() {
      return !!(this.$listeners && this.$listeners.cancel);
    },
  },
  watch: {
    user(newValue) {
      this.username = user;
    },
  },
  methods: {
    onSubmit() {
      if (this.email)
        this.$emit("submit", {
          email: this.username,
          password: this.password,
          remember: this.remember,
        });
      else
        this.$emit("submit", {
          username: this.username,
          password: this.password,
          remember: this.remember,
        });
    },
  },
};
</script>
<style lang="scss">
.form-login-options,
.form-login-options .v-input .v-label {
  font-size: 15px;
}
</style>
