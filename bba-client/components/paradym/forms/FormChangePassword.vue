<!-- Paradym Component
  Name:     FormChangePassword
  Version:  0.12
-->

<template>
  <Form
    :outlined="outlined"
    :title="title"
    :text="text"
    :elevated="elevated"
    :width="width"
    :logo="logo"
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

    <!-- Current Password -->
    <v-text-field
      v-if="isShowCurrentPassword"
      v-model="currentPassword"
      label="Current Password"
      outlined
      validate-on-blur
      dense
      autocomplete="off"
      :type="showCurrentPassword ? 'text' : 'password'"
      :rules="[rules.required]"
      hide-details="auto"
      class="mb-4"
      :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showCurrentPassword = !showCurrentPassword"
    />

    <!-- New Password -->
    <v-text-field
      ref="pw"
      v-model="newPassword"
      label="New Password"
      autocomplete="off"
      outlined
      validate-on-blur
      dense
      :type="showNewPassword ? 'text' : 'password'"
      :rules="[rules.required, rules.minLength, rules.passwordsMatch]"
      @blur="$refs.pw2.validate()"
      hide-details="auto"
      class="mb-4"
      :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showNewPassword = !showNewPassword"
    />

    <!-- Confirm New Password -->
    <v-text-field
      ref="pw2"
      v-model="confirmNewPassword"
      label="Confirm New Password"
      autocomplete="off"
      outlined
      validate-on-blur
      dense
      :type="showNConfirmNewPassword ? 'text' : 'password'"
      :rules="[rules.required, rules.minLength, rules.passwordsMatch]"
      @blur="$refs.pw.validate()"
      hide-details="auto"
      class="mb-4"
      :append-icon="showNConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showNConfirmNewPassword = !showNConfirmNewPassword"
    />

    <!-- Slot: BeforeSubmit -->
    <template v-slot:beforeSubmit>
      <slot name="beforeSubmit"></slot>
    </template>

    <!-- Slot: Buttons -->
    <template v-slot:buttons>
      <slot name="buttons"></slot>
    </template>

    <!-- Slot: Footer -->
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </Form>
</template>

<script>
import Form from "./Form";

export default {
  name: "FormChangePassword",
  components: { Form },
  props: {
    minLength: {
      type: Number,
      default: 6,
    },
    // Base Form
    title: String,
    text: String,
    logo: String,
    outlined: Boolean,
    elevated: Boolean,
    width: [Number, String],
    buttonText: {
      type: String,
      default: "Change Password",
    },
    error: String,
    disabled: Boolean,
    busy: Boolean,
    isShowCurrentPassword: Boolean,
  },
  data() {        
    return {
      // Form fields
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      // Options
      showCurrentPassword: false,
      showNewPassword: false,
      showNConfirmNewPassword: false,
      // Rules
      rules: {
        required: (value) => !!value || "Required.",
        minLength: (v) =>
          v.length >= this.minLength || "Min " + this.minLength + " characters",
        passwordsMatch: (value) =>
          this.confirmNewPassword == "" ||
          this.newPassword == this.confirmNewPassword ||
          "Password doesn't match",
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
        password: this.currentPassword,
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword,
      });
    },
    clearPassword() {
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmNewPassword = "";
    },
  },
};
</script>
