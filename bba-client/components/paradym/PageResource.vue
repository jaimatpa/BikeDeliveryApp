<template>
    <Page :title="title">
        <ServerDataTable ref="serverDataTable" :endpoint="endpoint" :name="name"
            includeStockTrackingLink=this.includeStockTrackingLink
            :dataTypes="{ createdAt: Date, updatedAt: Date }" 
            @edit="editItem" 
            :headers="headers" />

        <FloatingButton @click="itemToEdit = null; dialog = true;" color="primary"/>

        <v-btn block color="primary" @click="sendWebHookMapData()" v-if="isShowWebHookMappingTable" class="mt-4">
            Update
        </v-btn>

        <Dialog v-model="dialog" :title="addText" max-width="800" hideButtons>
            <FormGenerator :fields="fields" :values="itemToEdit" :buttonText="addText" @cancel="dialog = false"
                @submit="addUpdateItem" />
        </Dialog>
    </Page>
</template>

<script>
import _ from "lodash";
import {
    mapActions
} from "vuex";

import Page from "./Page";
import ServerDataTable from "./ServerDataTable";
import FloatingButton from "./FloatingButton";
import Dialog from "./Dialog";
import FormGenerator from "./FormGenerator";
import {
    NUMBER_0
} from "@/constants";

export default {
    name: "pageResource",
    components: {
        Page,
        ServerDataTable,
        FloatingButton,
        Dialog,
        FormGenerator
    },
    props: {
        title: String,
        name: String,
        endpoint: String,
        isShowWebHookMappingTable: Boolean,
        fields: [Object, Array],                                                                                
        headers: Array,
        selectedItem: [],
        includeStockTrackingLink: false,
    },
    data() {
        return {
            dialog: false,
            itemToEdit: null,
            errorMessage: "",
            date: "date",
            jsonKey1: "test",
            tableKeyName: "name",
            jsonKey2: "test                                                                                                                                                                                                                             ",
            location: "location",
            jsonKey3: "",
            orderid: "orderid",
            jsonKey4: "test",
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
                required: (Zalue) => !!value || "Required.",
            },
        };
    },
    async created() {
        this.getWebHookMapDataFromApi();   

        if(this.$route.query.orderid != '') { 
        const response = await this.$axios.$get("/api/user/equipment-types");  
            response.forEach(x=> {
                if( x.BarcodePrefix.indexOf(this.$route.query.orderid) !== -1 ) {
                    this.editItem(x);
                } 
            });
        }
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
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
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

        },
        async sendWebHookMapData() {
            const webHookMapDataTable = [{
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

            try {
                const response = await this.$axios.$post(
                    "/api/user/webhookmap",
                    webHookMapDataTable
                );

                if (response) {
                    this.showSuccess(`Item has been updated.`);
                }
            } catch (error) {
                console.log("error", error);
            }
        },
        editItem(item) {
            console.log('editItem', item);
            this.itemToEdit = JSON.parse(JSON.stringify(item));
            console.log("itemToEdit", this.itemToEdit);
            this.dialog = true;
        },
        async addUpdateItem(data) {
            console.log("add/update item ", {
                data
            });
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
            let sendData = _.omit(data, "id", "userType", "itemID");
            sendData.userType = parseInt(data?.userType?.userTypeVal, 10);

            try {
                this.errorMessage = "";

                if (data?.id) {
                    sendData.itemID = data?.id;
                    const response = await this.$axios.$put(
                        this.endpoint + "/" + data?.id,
                        sendData
                    );

                    if (response) {
                        this.showSuccess(`${this.name} has been updated.`);
                    }
                } else {
                    const response = await this.$axios.$post(this.endpoint, sendData);

                    if (response) {
                        this.showSuccess(`${this.name} has been created.`);
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
