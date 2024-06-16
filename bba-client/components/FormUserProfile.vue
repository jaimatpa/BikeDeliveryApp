<template>
  <Form
    class="form-user-profile"
    :width="width"
    :title="title"
    :busy="busy"
    :error="error"
    :disabled="disabled"
    buttonText="Save Changes"
    @submit="onSubmit"
  >
    <!-- Slot: Default -->
    <slot></slot>

    <!-- Slot: BeforeSubmit -->
    <template v-slot:beforeSubmit>
      <slot name="beforeSubmit"></slot>
    </template>

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

    <!-- Slot: Footer -->
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </Form>
</template>

<script>
import Form from "./paradym/forms/Form";

export default {
  name: "FormUserProfile",
  components: { Form },
  props: {
    icons: Boolean,
    // Base Form
    title: String,
    width: [Number, String],
    disabled: Boolean,
    busy: Boolean,
    error: String,
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
  methods: {
    onSubmit() {
      if (this.email) this.$emit("submit", this.email);
      else this.$emit("submit", this.email);
    },
  },
};
</script>
