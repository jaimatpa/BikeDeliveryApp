<!-- Paradym Component
  Name:     FormEmail
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

    <!-- Email Address -->
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
  name: "FormEmail",
  components: { Form },
  props: {
    icons: Boolean,
    // Base Form
    title: String,
    text: String,
    logo: String,
    outlined: Boolean,
    elevated: Boolean,
    width: [Number, String],
    buttonText: String,
    error: String,
    disabled: Boolean,
    busy: Boolean,
  },
  data() {
    return {
      // Form fields
      email: "",
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
  methods: {
    onSubmit() {
      if (this.email) this.$emit("submit", this.email);
      else this.$emit("submit", this.email);
    },
  },
};
</script>
