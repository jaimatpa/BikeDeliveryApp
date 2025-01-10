<!--
  The ServerDataTable component displays a v-data-table that is pre-configured
  to work with server-side data.  By default, the table's columns will be
  generated automatically from the first result in the retrieved data.  These
  can also be explicitly defined using the headers prop.

  Required Properties:
    endpoint: A string that is the API endpoint (e.g, '/api/things')

  Optional Properties:
    name:
    headers:
    dataTypes:

  Events:
    edit() - fires when the edit action button is clicked on a row item
-->
<template>
    <div>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>

        <v-data-table :loading="loading" :headers="computedHeaders" :sort-by="sort" :items="computedItems" :options.sync="options"
            :search="search" :footer-props="{ 'items-per-page-options': [10, 25, 50, 100] }"
            :mobile-breakpoint="0">

            <!-- Show Custom User Type Column -->
            <template v-slot:[`item.userType`]="{ item }">
                <v-chip v-if="item.userType === 1" color="orange" dark>
                    Client
                </v-chip>
                <v-chip v-if="item.userType === 2" color="teal" dark>
                    Delivery Driver
                </v-chip>
                <v-chip v-if="item.userType === 3" color="green" dark>
                    System Admin
                </v-chip>
            </template>

            <!-- Show Custom isActive Column -->
            <template v-slot:[`item.isActive`]="{ item }">
                <v-chip v-if="item.isActive" color="primary" dark>
                    Yes
                </v-chip>
                <v-chip v-else color="error" dark>
                    No
                </v-chip>
            </template>

            <!-- Show Custom CreatedAt Column -->
            <template v-slot:[`item.createdAt`]="{ item }">
                {{ item.createdAt }}
            </template>

            <!-- Show Custom CreatedAt Column -->
            <template v-slot:[`item.TimeStamp`]="{ item }">
                {{ new Date(item.TimeStamp).toUTCString() }}
            </template>

            <!-- Actions -->
            <template v-slot:[`item.actions`]="{ item }">
                <a :href="`/stock-tracking/${item.id}`" target="_blank" v-show="name=='Equipment Type'">
                    <v-icon v-if="includeStockTrackingLink" small color="secondary" class="mr-2">
                        mdi-glasses
                    </v-icon>
                </a>
                <v-icon small color="primary" class="mr-2" @click="$emit('edit', item)">
                    mdi-pencil
                </v-icon>
                <v-icon small color="error" @click="confirmDelete(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>

        <ModalConfirm v-model="deleteDialog" :title="`Delete ${name}`" :message="
            itemToDelete
                ? `Are you sure you want to delete ${ name }  
                <strong>${ 
                    itemToDelete.TruckName ? itemToDelete.TruckName : 
                    itemToDelete.Label ? itemToDelete.Label : 
                    (itemToDelete && itemToDelete.name || itemToDelete.Name) ? itemToDelete.name || itemToDelete.Name :
                    (itemToDelete && itemToDelete.Title ? itemToDelete.Title : 
                    (itemToDelete && itemToDelete.Notes ? itemToDelete.Notes : itemToDelete.id))}

                                                                                                                                                            </strong>?`
                : `Delete ${name}`
        " confirmText="Yes" cancelText="No" @confirm="deleteItem" />
    </div>
</template>

<script>
import ModalConfirm from "./modals/ModalConfirm";
import moment from "moment";
export default {
    name: "serverDataTable",
    components: {
        ModalConfirm
    },
    props: {
        headers: Array,
        endpoint: String,
        dataTypes: Object,
        includeStockTrackingLink: false,
        name: {
            type: String,
            default: "item",
        }
    },
    // We have access to $fetchState.pending, $fetchState.error, and $fetchState.timestamp
    /*
    async asyncData({ $axios }) {
      let things = await $axios.$get('/api/things')
      return { things }
    }
    */
    activated() {
        // Call fetch again if last fetch more than 30 sec ago
        if (this.$fetchState.timestamp <= Date.now() - 30000) {
            this.$fetch();
        }
    },
    async fetch() {
        this.loading = true;
        let response = await this.$axios.get(this.getRequestUrl());
        this.loading = false;
        this.items = response.data;
        // if (response.headers) {
        //     console.log(response.headers["content-range"]);
        //     console.log(this.parseContentRange(
        //         response.headers["content-range"]
        //     ));
        //     if (response.headers.hasOwnProperty("content-range")) {
        //         // this.totalItems = this.parseContentRange(
        //         //     response.headers["content-range"]
        //         // ).length;

        //         // console.log(this.totalItems);
        //     } else {
        //         this.totalItems = 0;
        //     }
        // } else this.totalItems = 0;
    },
    data() {
        return {
            items: [],
            totalItems: 0,
            loading: false,
            options: {},
            search: "",
            sort: ['email'],
            timer: undefined,
            deleteDialog: false,
            itemToDelete: undefined,
        };
    },
    watch: {
        options: {
            handler() {
                this.$fetch();
            },
        },
    },
    computed: {
        computedItems() {
            if (!this.dataTypes) return this.items;
            let result = [];
            this.items.forEach((item) => {
                let newItem = item;
                for (let key in newItem) {
                    if (this.dataTypes.hasOwnProperty(key)) {
                        switch (this.dataTypes[key]) {
                            case Date:
                                newItem[key] = this.formatDate(newItem[key]);
                        }
                    }
                }
                result.push(newItem);
            });
            return result;
        },
        lastUpdated() {
            return new Date(this.$fetchState.timestamp);
        },
        computedHeaders() {
            let actionHeader = {
                text: "Actions",
                value: "actions",
                sortable: false,
                width: "120px",
            };

            if (this.headers && this.headers.length) {
                return [...this.headers, actionHeader];
            } else {
                return [...this.headersFromItems().map(obj => {
                    const splitName = obj.text.replace(/([a-z])([A-Z])/g, '$1 $2').replace("_", " ");

                    return { ...obj, text: splitName };
                }), actionHeader]
            }
        },
    },
    methods: {
        async updateSearch(val) {
            this.debounce(() => {
                this.$fetch();
                this.options.page = 1;
            }, 200);
        },
        confirmDelete(item) {
            console.log('confirmDelete', item);
            this.itemToDelete = item;
            this.deleteDialog = true;
        },
        async deleteItem() {
            this.deleteDialog = false;
            try {
                let response = await this.$axios.$delete(
                    this.endpoint + "/" + this.itemToDelete.id, { data: { itemID: this.itemToDelete.id } }
                );
                this.$fetch();
            } catch (err) {
                console.log(err);
            }
        },
        // Creates the request url
        getRequestUrl() {
            let requestUrl = this.endpoint;
            let paramsString = this.createParams();
            if (paramsString) requestUrl += "?" + paramsString;
            return requestUrl;
        },
        // Creates the url params string
        createParams() {
            let params = {
                offset: 0,
                count: 10
            };
            if (this.options) {
                if (this.options.page == 1) params.offset = 0;
                else
                    params.offset =
                        (this.options.page - 1) * this.options.itemsPerPage || 0;
                params.count = this.options.itemsPerPage || 10;
                if (params.offset == -1) delete params.offset;
                if (params.count == -1) delete params.count;
                if (this.options.sortBy) {
                    let sort = [];
                    this.options.sortBy.forEach((name, index) => {
                        if (this.options.sortDesc[index]) sort.push("-" + name);
                        else sort.push(name);
                    });
                    if (sort.length) params.sort = sort.join();
                }
            }
            if (this.search) params.q = encodeURI(this.search);
            return new URLSearchParams(params).toString();
        },
        // Creates the table headers based on the items property names
        headersFromItems() {
            let result = [];
            if (this.items && this.items.length) {
                let obj = this.items[0];
                for (const prop in obj) {
                    result.push({
                        text: prop.replace(/\b\w/g, l => l.toUpperCase()),
                        value: prop,
                    });
                }
            }
            return result;
        },
        // Parses the Content-Range header
        parseContentRange(str) {
            var matches;

            if (typeof str !== "string") return null;

            if ((matches = str.match(/^(\w+) (\d+)-(\d+)\/(\d+|\*)/)))
                return {
                    unit: matches[1],
                    first: +matches[2],
                    last: +matches[3],
                    length: matches[4] === "*" ? null : +matches[4],
                };

            if ((matches = str.match(/^(\w+) \*\/(\d+|\*)/)))
                return {
                    unit: matches[1],
                    first: null,
                    last: null,
                    length: matches[2] === "*" ? null : +matches[2],
                };

            return null;
        },
        formatDate(date) {
            let d = new Date(date);
            return moment(date)
                // .add(4, 'hours')
                .format('MM/DD/YYYY');
        },
        debounce(func, delay) {
            clearTimeout(this.timer);
            this.timer = setTimeout(func, delay);
        },
    },
};
</script>

<style lang="scss"></style>
