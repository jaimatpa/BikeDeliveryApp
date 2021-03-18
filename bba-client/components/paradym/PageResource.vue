<template>
  <Page :title="title">
    <ServerDataTable
      ref="serverDataTable"
      :endpoint="endpoint"
      :name="name"
      :dataTypes="{ createdAt: Date, updatedAt: Date }"
      @edit="editItem"
    />

    <FloatingButton
      @click="
        itemToEdit = null;
        dialog = true;
      "
      color="primary"
    />

    <Dialog v-model="dialog" :title="addText" max-width="800" hideButtons>
      <FormGenerator
        :fields="fields"
        :values="itemToEdit"
        :buttonText="addText"
        @cancel="dialog = false"
        @submit="addUpdateItem"
      />
    </Dialog>
  </Page>
</template>

<script>
import _ from "lodash";
import { mapActions } from "vuex";

import Page from "./Page";
import ServerDataTable from "./ServerDataTable";
import FloatingButton from "./FloatingButton";
import Dialog from "./Dialog";
import FormGenerator from "./FormGenerator";
import { NUMBER_0 } from "@/constants";

export default {
  name: "pageResource",
  components: { Page, ServerDataTable, FloatingButton, Dialog, FormGenerator },
  props: {
    title: String,
    name: String,
    endpoint: String,
    fields: [Object, Array],
  },
  data() {
    return {
      dialog: false,
      itemToEdit: null,
      errorMessage: "",
    };
  },
  computed: {
    addText() {
      if (typeof itemToEdit === "object") {
        if (Object.keys(this.itemToEdit).length > 0)
          return this.name ? "Update " + this.name : "Update Item";
        else return this.name ? "Add " + this.name : "Add Item";
      }
    },
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    editItem(item) {
      this.itemToEdit = JSON.parse(JSON.stringify(item));
      console.log("itemToEdit", this.itemToEdit);
      this.dialog = true;
    },
    async addUpdateItem(data) {
      console.log("add/update item ", { data });
      this.dialog = false;

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          console.log("found array");
          delete data[key];
        }
      });

      delete data.updatedAt;
      delete data.createdAt;

      // Processed to data add/update for new user
      let sendData = _.omit(data, "id", "userType");
      sendData.userType = parseInt(data?.userType?.userTypeVal, 10);

      try {
        this.errorMessage = "";

        if (data?.id) {
          const response = await this.$axios.$put(
            this.endpoint + "/" + data?.id,
            sendData
          );

          if (response) {
            this.showSuccess("User Updated Successfully Done!!!");
          }
        } else {
          const response = await this.$axios.$post(this.endpoint, sendData);

          if (response) {
            this.showSuccess("User Created Successfully Done!!!");
            this.itemToEdit = null;
          }
        }

        this.itemToEdit = null;
        this.$refs.serverDataTable.$fetch();
      } catch (err) {
        this.showError(err?.response?.data?.errors[NUMBER_0].message);
      }
    },
  },
};
</script>
