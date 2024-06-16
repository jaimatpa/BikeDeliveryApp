<template>
  <PageSetting title="Name">
    <Form
      :outlined="$vuetify.breakpoint.smAndUp"
      :busy="busy"
      :error="error"
      buttonText="Save"
      @submit="changeName"
      @cancel="$router.go(-1)"
    >
      <p v-if="!$vuetify.breakpoint.xsOnly" class="text-overline">
        Change Name
      </p>

      <!-- Name -->
      <v-text-field
        v-model="name"
        label="Name"
        outlined
        validate-on-blur
        dense
        autocomplete="off"
        :rules="[rules.required]"
        hide-details="auto"
        class="mb-8"
      />
    </Form>
  </PageSetting>
</template>

<script>
import { mapActions } from "vuex";

import PageSetting from "@/components/PageSetting";
import Form from "@/components/paradym/forms/Form";

export default {
  name: "pageAccountName",
  components: { PageSetting, Form },
  data() {
    return {
      name: this.$auth.$state.user.name,
      busy: false,
      finished: false,
      error: "",
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    async changeName() {
      try {
        this.busy = true;
        this.finished = false;
        this.error = "";
        let response = await this.$axios.$put("/api/user/updateUser", {
          name: this.name,
        });
        
        if (response.success) {
          this.$auth.setUser(response.user);
          this.$auth.$storage.setLocalStorage("user", response.user);
          this.showSuccess("User name updated.");
          this.finished = true;
          if (this.$nuxt.context.from == "/account") this.$router.go(-1);
          else this.$router.push("/account");
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
        this.showError(this.error);
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
