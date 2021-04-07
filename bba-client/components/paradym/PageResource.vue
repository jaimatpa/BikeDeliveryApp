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

    <v-simple-table>
      <template v-slot:default>
        <thead class="mb-2">
          <tr>
            <th class="text-left">Table KEY</th>
            <th class="text-left">JSON KEY</th>
          </tr>
        </thead>
        <tbody class="mt-2">
          <tr>
            <td>
              <v-text-field
                label="date"
                outlined
                dense
                readonly
                v-model="date"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 1"
                outlined
                dense
                v-model="jsonKey1"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Name"
                outlined
                dense
                readonly
                v-model="tableKeyName"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 2"
                outlined
                dense
                v-model="jsonKey2"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Location"
                outlined
                dense
                readonly
                v-model="location"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 3"
                outlined
                dense
                v-model="jsonKey3"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="OrderId"
                outlined
                dense
                readonly
                v-model="orderid"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 4"
                outlined
                dense
                v-model="jsonKey4"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Rack"
                outlined
                dense
                readonly
                v-model="rack"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 5"
                outlined
                dense
                v-model="jsonKey5"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Color"
                outlined
                dense
                readonly
                v-model="color"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 6"
                outlined
                dense
                v-model="jsonKey6"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Combination"
                outlined
                dense
                readonly
                v-model="combination"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 7"
                outlined
                dense
                v-model="jsonKey7"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Lock"
                outlined
                dense
                readonly
                v-model="lock"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 8"
                outlined
                dense
                v-model="jsonKey8"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Mobile No"
                outlined
                dense
                readonly
                v-model="mobileNo"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 9"
                outlined
                dense
                v-model="jsonKey9"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Barcode"
                outlined
                dense
                readonly
                v-model="barcode"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                label="Key 10"
                outlined
                dense
                v-model="jsonKey10"
              ></v-text-field>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-btn block color="primary" @click="sendWebHookMapData()"> Update </v-btn>

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
      date: "date",
      jsonKey1: "",
      tableKeyName: "name",
      jsonKey2: "",
      location: "location",
      jsonKey3: "",
      orderid: "orderid",
      jsonKey4: "",
      rack: "rack",
      jsonKey5: "",
      color: "color",
      jsonKey6: "",
      combination: "combination",
      jsonKey7: "",
      lock: "lock",
      jsonKey8: "",
      mobileNo: "mobileNo",
      jsonKey9: "",
      barcode: "barcode",
      jsonKey10: ""
    };
  },
  computed: {
    addText() {
      if (typeof this.itemToEdit === "object") {
        if (this.itemToEdit !== null && Object.keys(this.itemToEdit).length > 0)
          return this.name ? "Update " + this.name : "Update Item";
        else return this.name ? "Add " + this.name : "Add Item";
      } else return this.name ? "Add " + this.name : "Add Item";
    },
  },
  methods: {
    ...mapActions("snackbar", { showSuccess: "success", showError: "error" }),
    async sendWebHookMapData() {
      const webHookMapDataTable = [
        {
          table_key: this.date,
          json_key: this.jsonKey1,
        },
        {
          table_key: this.tableKeyName,
          json_key: this.jsonKey2,
        },
        {
          table_key: this.location,
          json_key: this.jsonKey3,
        },
        {
          table_key: this.orderid,
          json_key: this.jsonKey4,
        },
        {
          table_key: this.rack,
          json_key: this.jsonKey5,
        },
        {
          table_key: this.color,
          json_key: this.jsonKey6,
        },
        {
          table_key: this.combination,
          json_key: this.jsonKey7,
        },
        {
          table_key: this.lock,
          json_key: this.jsonKey8,
        },
        {
          table_key: this.mobileNo,
          json_key: this.jsonKey9,
        },
        {
          table_key: this.barcode,
          json_key: this.jsonKey10,
        },
      ]
      console.log('this.webHookMapDataTable', webHookMapDataTable)

       await this.$axios.$post("/api/user/webhookmap", webHookMapDataTable);
    },
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
            this.showSuccess(`${this.name} Updated Successfully Done!!!`);
          }
        } else {
          const response = await this.$axios.$post(this.endpoint, sendData);

          if (response) {
            this.showSuccess(`${this.name} Created Successfully Done!!!`);
            this.itemToEdit = {};
          }
        }

        this.$refs.serverDataTable.$fetch();
      } catch (err) {
        this.showError(err?.response?.data?.errors[NUMBER_0].message);
      }
    },
  },
};
</script>
