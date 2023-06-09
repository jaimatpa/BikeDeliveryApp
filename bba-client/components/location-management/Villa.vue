<template>
    <section class="mt-4">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Villa..." single-line hide-details outlined
            dense clearable class="mb-5 order-search-text-field" @keyup="onSearchKeyUp"
            @click:clear="onClearClicked"></v-text-field>
        <v-btn block depressed color="primary" class="mb-5" @click="addNewVillaItem()" :disabled="newItemAddAllowed">
            <v-icon left medium color="white" class="mr-2">
                mdi-plus
            </v-icon>
            Create New Villa
        </v-btn>

        <v-data-table :headers="headers" :items="villas" :loading="loading" item-value="key" class="elevation-1">
            <!-- Name Editable Cell -->
            <template v-slot:item.name="{ item }">
                <div v-if="item.editable">
                    <v-text-field v-model="item.name" @blur="saveItem(item)" @keydown.esc="cancelEditing(item)"
                        @keydown.enter="saveItem(item)" single-line></v-text-field>
                </div>
                <div @click="item.editable = !editingLocked" v-else>{{ item.name }}</div>
            </template>

            <!-- Area Editable -->
            <template v-slot:item.Area="{ item }">
                <div v-if="item.editable">
                    <v-combobox label="Area" v-model="item.Area" :items="areas" item-text="name" @blur="saveItem(item)"
                        @keydown.esc="cancelEditing(item)" @keydown.enter="saveItem(item)"></v-combobox>
                    <!-- <v-text-field v-model="item.name" @blur="saveItem(item)" @keydown.esc="cancelEditing(item)"
                        @keydown.enter="saveItem(item)" single-line></v-text-field> -->
                </div>
                <div @click="item.editable = !editingLocked" v-else>{{ item.Area.name }}</div>
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
                <h4 class="text-black">Cannot delete Villa if it is associated with a Street Address</h4>
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
export default {
    name: "Villa",
    async mounted() {
        await this.getAllVillas();
        const areasResponse = await this.$axios.$get("/api/user/locations/areas");
        this.areas = areasResponse;
    },
    props: ["cancelEdit"],
    data() {
        return {
            loading: false,
            snackbar: false,
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
                    text: "Area",
                    align: "start",
                    sortable: false,
                    value: "Area",
                },
                {
                    text: "Action",
                    align: "middle",
                    sortable: false,
                    value: "actions",
                }
            ],
            villas: [],
            areas: [],
            search: ""
        };
    },
    computed: {
        newItemAddAllowed() {
            return !!this.villas.find(villa => villa.id === null);
        },
        editingLocked() {
            return !!this.villas.find(villa => villa.editable);
        },
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    watch: {
        cancelEdit(newVal) {
            if (newVal) {
                this.cancelEditing();
            }
        }
    },
    methods: {
        async getAllVillas(searchQuery = false) {
            this.loading = !this.loading;
            let URL = "/api/user/locations/areas/villas"

            if (searchQuery) {
                URL = URL.concat(`?search=${this.search}`)
            }

            const response = await this.$axios.$get(URL);

            this.villas = response;
            this.villas = this.villas.map(villa => ({ ...villa, editable: false }));
            this.loading = !this.loading;
        },
        editItem(item) {
            item.editable = true;
            console.log("Editing item:", item);
        },
        cancelEditing(item) {
            if (!item) {
                this.villas = this.villas.map(area => ({ ...area, editable: false }));
                this.$emit("editingCanceled");
            } else {
                item.editable = false;
            }
            this.villas = this.villas.filter(area => area.id !== null);
        },
        async saveItem(item) {
            if (item.id === null && (!item.name || !item.Area)) {
                return;
            }

            item.editable = false;
            console.log("Saving item:", item);

            const payload = { ...item, parent: item.Area.id };

            delete payload.id;
            delete payload.Area;
            delete payload.editable;

            if (!item.id) {
                // Create a new area
                console.log(payload)
                const response = await this.$axios.$post(`/api/user/locations/areas/${item.Area.id}/villas`, payload);
                this.villas.splice(0, 1, { ...response, editable: false });
            } else {
                // Just update
                await this.$axios.$put(`/api/user/locations/areas/villas/${item.id}`, payload);
            }

        },
        async deleteItem(item) {
            console.log("Deleting item:", item);
            try {
                await this.$axios.$delete(`/api/user/locations/areas/villas/${item.id}`);
                this.villas = this.villas.filter(villa => villa.id !== item.id);
            } catch (error) {
                this.snackbar = true;
            }
        },
        addNewVillaItem() {
            this.villas = [
                {
                    id: null,
                    name: "",
                    editable: true,
                    Area: null
                },
                ...this.villas
            ];
        },
        onSearchKeyUp(event) {
            if (event.key === "Enter") {
                this.getAllVillas(true);
            } else if (`${event.target.value}`.length === 0) {
                // if someone clears the input field.
                this.getAllVillas();
            }
        },
        onClearClicked() {
            if (this.search !== "") {
                this.search = "";
            }
            this.getAllVillas();
        },
    }
}
</script>