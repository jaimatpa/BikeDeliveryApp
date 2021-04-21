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

    <div>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search Key"
        single-line
        hide-details
        class="mb-5"
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="webHookMapDataTable"
        v-if="isShowWebHookMappingTable"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
        class="elevation-1 web-hook-mapping-table"
      >
        <template v-slot:item.json_key="props">
          <v-edit-dialog
            :return-value.sync="props.item.json_key"
            large
            persistent
            @save="change"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ props.item.json_key }}</div>
            <template v-slot:input>
              <div class="mt-4 title">
                Update Json Key
              </div>
              <v-text-field
                v-model="props.item.json_key"
                :label="props.item.table_key"
                autofocus
                :rules="[rules.required, rules.max25chars]"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Name"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Location"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="OrderId"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Rack"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Color"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Combination"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Lock"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Mobile No"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                label="Barcode"
                outlined
                dense
                filled
                disabled
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
                :rules="[rules.required]"
              ></v-text-field>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

      <v-snackbar
        v-model="snack"
        :timeout="3000"
        :color="snackColor"
      >
        {{ snackText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            v-bind="attrs"
            text
            @click="snack = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <v-btn
      block
      color="primary"
      @click="sendWebHookMapData()"
      v-if="isShowWebHookMappingTable"
      class="mt-4"
    >
      Update
    </v-btn>

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
import moment from "moment";

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
    isShowWebHookMappingTable: Boolean,
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
      jsonKey10: "",
      rules: {
        required: (value) => !!value || "Required.",
        max25chars: (value) => value.length <= 25 || 'Input too long!',
      },
      snack: false,
      snackColor: '',
      snackText: '',
      pagination: {},
      headers: [
        {
          text: 'TABLE KEY',
          value: 'table_key',
        },
        { 
          text: 'JSON KEY', 
          value: 'json_key',
        },
      ],
      search: '',
      loading: true,
      webHookMapDataTable: [],
      deliveryOrderDataTable: [],
    };
  },
  created() {
    this.getWebHookMapDataFromApi();
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
    async getWebHookMapDataFromApi() {
      const webHookMapData = await this.$axios.$get("/api/user/webhookmap");
      this.jsonKey1 = webHookMapData.length ? webHookMapData[0].json_key : "";
      this.jsonKey2 = webHookMapData.length ? webHookMapData[1].json_key : "";
      this.jsonKey3 = webHookMapData.length ? webHookMapData[2].json_key : "";
      this.jsonKey4 = webHookMapData.length ? webHookMapData[3].json_key : "";
      this.jsonKey5 = webHookMapData.length ? webHookMapData[4].json_key : "";
      this.jsonKey6 = webHookMapData.length ? webHookMapData[5].json_key : "";
      this.jsonKey7 = webHookMapData.length ? webHookMapData[6].json_key : "";
      this.jsonKey8 = webHookMapData.length ? webHookMapData[7].json_key : "";
      this.jsonKey9 = webHookMapData.length ? webHookMapData[8].json_key : "";
      this.jsonKey10 = webHookMapData.length ? webHookMapData[9].json_key : "";
      this.webHookMapDataTable = [
        {
          table_key: this.date,
          json_key: this.jsonKey1.replace(/\s/g, ""),
        },
        {
          table_key: this.tableKeyName,
          json_key: this.jsonKey2.replace(/\s/g, ""),
        },
        {
          table_key: this.location,
          json_key: this.jsonKey3.replace(/\s/g, ""),
        },
        {
          table_key: this.orderid,
          json_key: this.jsonKey4.replace(/\s/g, ""),
        },
        {
          table_key: this.rack,
          json_key: this.jsonKey5.replace(/\s/g, ""),
        },
        {
          table_key: this.color,
          json_key: this.jsonKey6.replace(/\s/g, ""),
        },
        {
          table_key: this.combination,
          json_key: this.jsonKey7.replace(/\s/g, ""),
        },
        {
          table_key: this.lock,
          json_key: this.jsonKey8.replace(/\s/g, ""),
        },
        {
          table_key: this.mobileNo,
          json_key: this.jsonKey9.replace(/\s/g, ""),
        },
        {
          table_key: this.barcode,
          json_key: this.jsonKey10.replace(/\s/g, ""),
        },
      ];
      this.loading = false;
    },
    async sendWebHookMapData() {
      try {
        const response = await this.$axios.$post(
          "/api/user/webhookmap",
          webHookMapDataTable
        );
        if (response) {
          this.showSuccess(`Updated Successfully Done!!!`);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        try {
          const response = await this.$axios.$get('/api/webHook/allWebHooks');
          const getWebHookUrls = response.allWebHooks;
          getWebHookUrls.forEach(async url => {
            try {
              const webHookUrl = url.webHookUrl;
              await this.$axios.$get(webHookUrl);
            } catch (error) {
              console.log("error", error);
            }
          });
          this.showSuccess(`Updated Successfully Done!!!`)
        } catch (error) {
          console.log("error", error);
        }
      }
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
    change () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data changed'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close () {
      console.log('Dialog closed')
    },
  },
};
</script>

<style lang="scss" scoped>
.web-hook-mapping-table {
  tbody {
    tr td {
      .v-input {
        height: 50% !important;
      }
    }
  }
}
</style>
