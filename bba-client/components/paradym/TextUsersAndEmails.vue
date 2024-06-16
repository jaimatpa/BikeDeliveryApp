<!--
  Internal Operation:
    There are three arrays of items:
      items: Stores objects with an email property.  Used for autocomplete.
             Note: If an item is to be selected, it must exist in this array.
      selectedItems: Stores strings (emails). Used to identify the selected items in items
      originalItems: a copy of the items array as it was at creation
-->
<template>
  <div
    class="textUsersAndEmails"
    :style="{ width: computedWidth, maxWidth: computedMaxWidth }"
  >
    <v-autocomplete
      v-model="selectedItems"
      :items="items"
      item-text="email"
      item-value="email"
      hide-details
      hide-no-data
      hide-selected
      @keydown="onKeyDown"
      :label="label"
      :placeholder="placeholder"
      multiple
      :search-input.sync="inputText"
      @change="onChange"
      :filter="userFilter"
      :dense="dense"
      :filled="filled"
      :rounded="rounded"
      :solo="solo"
      :solo-inverted="soloInverted"
      :outlined="outlined"
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="removeItem(data.item)"
          outlined
          :class="{ 'pl-1': data.item.hasOwnProperty('id') }"
        >
          <v-icon
            v-if="data.item.hasOwnProperty('id')"
            color="primary"
            class="mr-1"
          >
            mdi-account-circle
          </v-icon>
          {{ data.item.email }}
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-avatar
          :color="item.id ? 'primary' : ''"
          class="headline font-weight-light white--text"
        >
          {{
            item.id
              ? item.name && item.name.length > 0
                ? item.name.charAt(0).toUpperCase()
                : item.email.charAt(0).toUpperCase()
              : ""
          }}
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            v-text="item.name ? item.name : item.email"
          ></v-list-item-title>
          <v-list-item-subtitle
            v-if="item.name"
            v-text="item.email"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "TextUsersAndEmails",
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      },
    },
    users: {
      type: Array,
      default: function() {
        return [];
      },
    },
    label: String,
    placeholder: String,
    dense: Boolean,
    filled: Boolean,
    rounded: Boolean,
    solo: Boolean,
    "solo-inverted": Boolean,
    outlined: Boolean,
    width: [Number, String],
    "max-width": [Number, String],
  },
  created() {
    // Create the items array - includes objects from users + those created by value
    this.items = [...this.users];
    this.value.forEach((v) => {
      if (this.items.findIndex((item) => item.email == v) === -1)
        this.items.push({ email: v });
    });
    // Create the other arrays
    this.selectedItems = this.value;
    this.originalItems = [...this.items];
  },
  data() {
    return {
      inputText: null,
      items: [],
      selectedItems: [],
      originalItems: [],
    };
  },
  computed: {
    computedWidth() {
      if (!isNaN(this.width)) return this.width + "px";
      else return this.width;
    },
    computedMaxWidth() {
      if (!isNaN(this.maxWidth)) return this.maxWidth + "px";
      else return this.maxWidth;
    },
  },
  watch: {
    value(newVal) {
      newVal.forEach((v) => {
        if (this.items.findIndex((item) => item.email == v) === -1)
          this.items.push({ email: v });
      });
      this.selectedItems = newVal;
    },
    selectedItems(newVal) {
      this.$emit("input", this.selectedItems);
    },
    inputText(newVal) {
      switch (newVal) {
        case ",":
        case ";":
        case " ":
          this.$nextTick(() => {
            this.inputText = "";
          });
          break;
        default:
          break;
      }
    },
  },
  methods: {
    /* Events */
    onKeyDown(e) {
      this.$emit("keydown", e);
      switch (e.key) {
        case ",":
        case ";":
        case "Enter":
        case "Tab":
        case " ":
          this.validateAndAddEmail();
          break;
        default:
          break;
      }
    },
    onChange(e) {
      this.inputText = "";
      this.$nextTick(this.filterItems());
    },
    /* Methods */
    filterItems() {
      console.log("Filtering Items!");
      // Remove items that are not selected and are not in the original list
      let result = this.items.filter(
        (item) =>
          this.selectedItems.includes(item.email) ||
          this.originalItems.findIndex(
            (original) => original.email == item.email
          ) !== -1
      );
      this.items = result;
    },
    validateAndAddEmail() {
      if (this.inputText) {
        let emails = this.inputText.split(" ");
        emails.forEach((email) => {
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (re.test(email)) {
            if (this.items.indexOf({ email: email }) === -1) {
              this.items.push({ email: email });
              if (this.selectedItems.indexOf(email) === -1)
                this.selectedItems.push(email);
            }
            this.$nextTick(() => {
              this.inputText = null;
            });
          }
        });
      }
    },
    removeItem(item) {
      let index = this.selectedItems.indexOf(item.email);
      //let index = this.selectedItems.indexOf(item.email)
      if (index >= 0) this.selectedItems.splice(index, 1);
      this.$nextTick(this.filterItems());
    },
    userFilter(item, queryText, itemText) {
      // Create an array of strings to search (email, name)
      let toSearch = [item.email.toLowerCase()];
      if (item.name) toSearch.push(item.name.toLowerCase());
      // Search the arrays, return true if found and false otherwise
      const searchText = queryText.toLowerCase();
      for (let i = 0; i < toSearch.length; i++) {
        if (toSearch[i].indexOf(searchText) > -1) return true;
      }
      return false;
    },
  },
};
</script>
