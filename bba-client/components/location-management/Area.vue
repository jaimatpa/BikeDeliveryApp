<template>
    <section class="mt-4">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Area..." single-line hide-details outlined
            dense clearable class="mb-5 order-search-text-field" @keyup="onSearchKeyUp"
            @click:clear="onClearClicked"></v-text-field>
        <v-btn block depressed color="primary" class="mb-5" @click="addNewAreaItem()" :disabled="newItemAddAllowed">
            <v-icon left medium color="white" class="mr-2">
                mdi-plus
            </v-icon>
            Create New Area
        </v-btn>

        <v-data-table :headers="headers" :items="areas" :loading="loading" item-value="key" class="elevation-1">
            <!-- Name Editable Cell -->
            <template v-slot:item.name="{ item }">
                <div v-if="item.editable">
                    <v-text-field v-model="item.name" @blur="saveItem(item)" @keydown.esc="cancelEditing(item)"
                        @keydown.enter="saveItem(item)" single-line></v-text-field>
                </div>
                <div @click="item.editable = !editingLocked" v-else>{{ item.name }}</div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                    <v-icon v-if="item.id" medium color="danger" @click.stop="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </div>
            </template>
        </v-data-table>

        <v-snackbar v-model="snackbar" :timeout="5000" elevation="24" color="primary" :top="true" :right="true"
            :center="isMobile" vertical>
            <template v-slot:default>
                <h4 class="text-black">Cannot delete Area if it is associated with a Villa</h4>
            </template>

            <template v-slot:action="{ attrs }">
                <v-btn variant="text" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </section>
</template>

<script>
import Snackbar from "@/components/paradym/Snackbar";

export default {
    name: "Area",
    async mounted() {
        await this.getAllAreas();
    },
    props: ["cancelEdit"],
    components: {
        Snackbar
    },
    data() {
        return {
            loading: false,
            snackbar: false,
            errorMessage: "",
            headers: [
                {
                    text: "Id #",
                    align: "start",
                    sortable: true,
                    value: "id",
                },
                {
                    text: "Name",
                    align: "start",
                    sortable: false,
                    value: "name",
                },
                {
                    text: "Action",
                    align: "middle",
                    sortable: false,
                    value: "actions",
                }
            ],
            areas: [],
            search: ""
        };
    },
    computed: {
        newItemAddAllowed() {
            return !!this.areas.find(area => area.id === null);
        },
        editingLocked() {
            return !!this.areas.find(area => area.editable);
        },
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        }
    },
    watch: {
        cancelEdit(newVal) {
            if (newVal) {
                this.cancelEditing();
            }
        }
    },
    methods: {
        async getAllAreas(searchQuery = false) {
            this.loading = !this.loading;
            let URL = "/api/user/locations/areas"

            if (searchQuery) {
                URL = URL.concat(`?search=${this.search}`)
            }

            const response = await this.$axios.$get(URL);

            this.areas = response;
            this.areas = this.areas.map(area => ({ ...area, editable: false }));
            this.loading = !this.loading;
        },
        editItem(item) {
            item.editable = true;
            console.log("Editing item:", item);
        },
        cancelEditing(item) {
            if (!item) {
                this.areas = this.areas.map(area => ({ ...area, editable: false }));
                this.$emit("editingCanceled");
            } else {
                item.editable = false;
            }
            this.areas = this.areas.filter(area => area.id !== null);
        },
        async saveItem(item) {
            item.editable = false;
            console.log("Saving item:", item);
            const payload = { ...item };
            delete payload.editable;

            if (!item.id) {
                // Create a new area
                const response = await this.$axios.$post(`/api/user/locations/areas`, payload);
                this.areas.splice(0, 1, { ...response, editable: false });
            } else {
                // Just update
                await this.$axios.$put(`/api/user/locations/areas/${item.id}`, payload);
            }

        },
        async deleteItem(item) {
            console.log("Deleting item:", item);
            try {
                await this.$axios.$delete(`/api/user/locations/areas/${item.id}`);
                this.areas = this.areas.filter(area => area.id !== item.id);
            } catch (error) {
                this.snackbar = true;
            }

        },
        addNewAreaItem() {
            this.areas = [
                {
                    id: null,
                    name: "",
                    editable: true
                },
                ...this.areas
            ];
        },
        onSearchKeyUp(event) {
            if (event.key === "Enter") {
                this.getAllAreas(true);
            } else if (`${event.target.value}`.length === 0) {
                // if someone clears the input field.
                this.getAllAreas();
            }
        },
        onClearClicked() {
            if (this.search !== "") {
                this.search = "";
            }
            this.getAllAreas();
        },
    }
}
</script>