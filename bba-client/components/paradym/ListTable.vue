<!--
  The ListTable component displays a list of items in a table and allows the
  user to add & remove items.  The table is displayed with a title and an
  Add button before it.  Each table item displays a button to delete the item.

  Required Properties:
    value: The array of items to display
    headers: An array of objects that determine the fields to display in the table

  Optional Properties:
    title: A string for the list title
    defaultItem: An object that contains a new item's default properties & values
    linkToUser: True/False - adds the user field
    linkToMultiple: True/False - adds the users field

  Events:
    create() - fires when a new item was created (first field input)
    update() - fires when an item's data is updated
    delete() - fires when the user clicks the delete button for an item

  How it works:
    The component takes the `value` prop and maps it internally to `items`
    Any time `value` changes, `items` is updated to reflect those changes

    When an item is added, updated, or deleted, the component updates `items`
    and then fires the relative event with event data.
-->
<template>
<div>
    <div class="d-flex align-center">
        <h3 v-text="title" class="mr-1" />
        <v-btn v-if="!disabled" small icon color="primary" @click="addItem">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </div>

    <v-data-table v-if="items.length" :headers="computedHeaders" :items="items" hide-default-footer dense disable-pagination :mobile-breakpoint='0'>
        <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
            <template v-if="disabled">
                <template v-if="header.text == 'Users'">
                    {{ showUsers(item[header.value]) }}
                </template>
                <template v-else>
                    {{ item[header.value] }}
                </template>
            </template>
            <v-edit-dialog v-else:return-value.sync="item[header.value]" @save="save(header.value, item)">
                <template v-if="header.text == 'Users'">
                    {{ showUsers(item[header.value]) }}
                </template>
                <template v-else>
                    {{ item[header.value] }}
                </template>
                <template v-slot:input v-if="header.text == 'Users'">
                    <TextUsers v-model="item[header.value]" />
                </template>
                <template v-slot:input v-else>
                    <v-text-field v-model="item[header.value]" :label="header.value" single-line counter></v-text-field>
                </template>
            </v-edit-dialog>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom v-if="!disabled">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small color="primary" @click="confirmDeleteItem(item)" v-bind="attrs" v-on="on">
                        mdi-close
                    </v-icon>
                </template>
                Remove
            </v-tooltip>
        </template>
    </v-data-table>

    <ModalConfirm :show.sync="showConfirmDialog" @confirm="deleteItem()" />
</div>
</template>

<script>
import {
    mapState
} from "vuex";

import ModalConfirm from "./modals/ModalConfirm";

export default {
    name: "ListTable",
    components: {
        ModalConfirm
    },
    props: {
        title: {
            type: String,
            default: "Items",
        },
        value: {
            type: Array,
            default: function () {
                return [];
            },
        },
        headers: {
            type: Array,
            default: function () {
                return [];
            },
        },
        defaultItem: {
            type: Object,
            default: function () {
                return {};
            },
        },
        linkToUser: Boolean,
        linkToMultiple: Boolean,
        disabled: Boolean,
    },
    created() {
        this.items = JSON.parse(JSON.stringify(this.value));
    },
    data() {
        return {
            items: [],
            testHeaders: [],
            showConfirmDialog: false,
            itemToDelete: null,
        };
    },
    computed: {
        ...mapState({
            users: (state) => state.users.list,
        }),
        computedHeaders() {
            let result = this.headers;
            if (this.linkToMultiple) {
                result.push({
                    text: "Users",
                    value: "users",
                });
            } else if (this.linkToUser) {
                result.push({
                    text: "User",
                    value: "user",
                });
            }
            result.push({
                text: "",
                value: "actions",
                sortable: false,
                width: "50px",
            });

            return result;
        },
    },
    watch: {
        value(val) {
            this.items = JSON.parse(JSON.stringify(val));
        },
    },
    methods: {
        addItem() {
            this.items.push(this.defaultItem);
        },
        save(name, value) {
            if (value.hasOwnProperty("id") && value.id != null) {
                let update = {
                    id: value.id
                };
                update[name] = value[name];
                this.$emit("update", update);
            } else this.$emit("create", value);
        },
        confirmDeleteItem(item) {
            // If the item doesn't actually exist yet, just remove it
            if (!item.hasOwnProperty("id"))
                this.items.splice(this.items.indexOf(item), 1);
            // Otherwise, show a confirmation dialog
            else {
                this.itemToDelete = item;
                this.showConfirmDialog = true;
            }
        },
        deleteItem() {
            this.showConfirmDialog = false;
            this.$emit("delete", this.itemToDelete);
            this.items.splice(this.itemToDelete, 1);
            this.itemToDelete = null;
        },
        showUsers(ids) {
            if (!ids) return "";
            let users = [];
            ids.forEach((id) => {
                let user = this.users.find((user) => user.id == id);
                if (user) {
                    if (user.name) users.push(user.name);
                    else users.push(user.email);
                }
            });
            return users.join(", ");
        },
    },
};
</script>
