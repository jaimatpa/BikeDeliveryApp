<template>
  <PageSetting
    title="Password"
    desc="Choose a strong password and don't reuse it for other accounts."
    center
  >
    <FormChangePassword
      ref="formCP"
      :outlined="$vuetify.breakpoint.smAndUp"
      :busy="busy"
      :error="error"
      @submit="changePW"
    />
  </PageSetting>
</template>

<script>
import { mapActions } from "vuex";

import PageSetting from "@/components/PageSetting";
import Page from "@/components/paradym/Page";
import FormChangePassword from "@/components/paradym/forms/FormChangePassword";

export default {
  name: "pageAccountPassword",
  components: { PageSetting, FormChangePassword, Page },
  data() {
    return {
      busy: false,
      error: "",
      finished: false,
    };
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    async changePW(data) {
      try {
        this.busy = true;
        this.finished = false;
        this.error = "";
        let response = await this.$axios.$post(
          "/api/user/changePassword",
          data
        );
        if (response.success) {
          this.finished = true;
          this.showSuccess("Password updated.");
          this.$refs.formCP.clearPassword();
          document.activeElement.blur();
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
