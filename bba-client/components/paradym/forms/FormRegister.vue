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

    <!-- Email -->
    <v-text-field
      v-model="email"
      label="Email address"
      autocomplete="off"
      class="mb-4"
      color="primary"
      validate-on-blur
      outlined
      dense
      hide-details="auto"
      :prepend-inner-icon="icons ? 'mdi-email' : ''"
      :rules="[rules.required, rules.email]"
    />

    <!-- Password -->
    <v-text-field
      ref="pw"
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
      :rules="
        confirm ? [rules.required, rules.passwordsMatch] : [rules.required]
      "
      @click:append="showPassword = !showPassword"
      @blur="confirm ? $refs.pw2.validate() : ''"
    />

    <!-- Confirm Password -->
    <v-text-field
      ref="pw2"
      v-if="confirm"
      v-model="passwordConfirm"
      label="Confirm Password"
      autocomplete="off"
      class="mb-4"
      color="primary"
      validate-on-blur
      outlined
      dense
      hide-details="auto"
      :prepend-inner-icon="icons ? 'mdi-lock' : ''"
      :type="showPasswordConfirm ? 'text' : 'password'"
      :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.passwordsMatch]"
      @click:append="showPasswordConfirm = !showPasswordConfirm"
      @blur="$refs.pw.validate()"
    />

    <!-- Name -->
    <v-text-field
      v-model="name"
      label="Name"
      class="mb-4"
      color="primary"
      outlined
      dense
      hide-details="auto"
      :prepend-inner-icon="icons ? 'mdi-account' : ''"
    />

    <!-- User Type Select -->
    <v-select
      v-model="userType"
      :items="userTypeItems"
      label="User Type"
      class="mb-4"
      color="primary"
      hide-details="auto"
      item-text="userType"
      item-value="userTypeVal"
      return-object
      dense
      outlined
    ></v-select>

    <!-- Slot: BeforeSubmit -->
    <template v-slot:beforeSubmit>
      <slot name="beforeSubmit"></slot>
    </template>

    <!-- Slot: Buttons -->
    <template v-slot:buttons>
      <slot name="buttons"></slot>
    </template>

    <!-- Footer -->
    <template v-slot:footer>
      <div class="text-center" v-if="loginURL">
        <p class="text--secondary mb-0">Already registered?</p>
        <v-btn text type="submit" color="primary" :to="loginURL">Sign In</v-btn>
      </div>
      <slot name="footer"></slot>
    </template>
  </Form>
</template>

<script>
import Form from "./Form";
import {
  CLIENT,
  DELVERY_DRIVER,
  CLIENT_NUMBER,
  DELVERY_DRIVER_NUMBER,
} from "@/constants";

export default {
  name: "formRegister",
  components: { Form },
  props: {
    confirm: Boolean,
    loginURL: String,
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
      default: "Sign Up",
    },
    error: String,
    disabled: Boolean,
    busy: Boolean,
  },
  data() {
    return {
      // Form fields
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      userType: { userType: CLIENT, userTypeVal: CLIENT_NUMBER },
      // Options
      showPassword: false,
      showPasswordConfirm: false,
      // User Type Items
      userTypeItems: [
        { userType: CLIENT, userTypeVal: CLIENT_NUMBER },
        { userType: DELVERY_DRIVER, userTypeVal: DELVERY_DRIVER_NUMBER },
      ],
      // Rules
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          if (value == "" || value == null) return true;
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
        passwordsMatch: (value) =>
          this.password == this.passwordConfirm || "Password doesn't match",
      },
    };
  },
  computed: {
    hasCancelListener() {
      return !!(this.$listeners && this.$listeners.cancel);
    },
  },
  methods: {
    onSubmit() {
      this.$emit("submit", {
        email: this.email,
        password: this.password,
        name: this.name,
        userType: this.userType,
      });
    },
  },
};
</script>
