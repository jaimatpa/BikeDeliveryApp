<template>
    <section class="mt-4">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Street Addresses..." single-line hide-details
            outlined dense clearable class="mb-5 order-search-text-field" @keyup="onSearchKeyUp"
            @click:clear="onClearClicked"></v-text-field>
        <v-btn block depressed color="primary" class="mb-5" @click="addNewStreetAddressItem()"
            :disabled="newItemAddAllowed">
            <v-icon left medium color="white" class="mr-2">
                mdi-plus
            </v-icon>
            Create New Street Address
        </v-btn>

        <v-data-table :headers="headers" :items="streetAddresses" :loading="loading" item-value="key" class="elevation-1">
            <!-- Name Editable Cell -->
            <template v-slot:item.name="{ item }">
                <div v-if="item.editable">
                    <v-text-field v-model="item.name" @blur="saveItem(item)" @keydown.esc="cancelEditing(item)"
                        @keydown.enter="saveItem(item)" single-line autofocus></v-text-field>
                </div>
                <div @click="item.editable = !editingLocked" v-else>{{ item.name }}</div>
            </template>

            <template v-slot:item.priority="{ item }">
                <div v-if="item.rack_editable">
                    <v-text-field v-model="item.bikeRack" @blur="saveItem(item)" @keydown.esc="cancelEditing(item)"
                        @keydown.enter="saveItem(item)" single-line></v-text-field>
                </div>
                <div @click="item.rack_editable = !editingLocked" v-else>{{ item.bikeRack }}</div>
            </template>


            <!-- Area Editable -->
            <template v-slot:item.Villa="{ item }">
                <div v-if="item.villa_editable">
                    <v-combobox label="Villa" v-model="item.Villa" :items="villas" item-text="name" @blur="saveItem(item)"
                        @keydown.esc="cancelEditing(item)" @keydown.enter="saveItem(item)"></v-combobox>
                    <!-- <v-text-field v-model="item.name" @blur="saveItem(item)" @keydown.esc="cancelEditing(item)"
                        @keydown.enter="saveItem(item)" single-line></v-text-field> -->
                </div>
                <div @click="item.villa_editable = !editingLocked" v-else>{{ item.Villa.name }}</div>
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
    </section>
</template>

<script>
export default {
    name: "StreetAddress",
    async mounted() {
        await this.getAllStreetAddresses();
        const villasResponse = await this.$axios.$get("/api/user/locations/areas/villas");
        this.villas = villasResponse;
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
                    text: "Bike Rack",
                    align: "start",
                    sortable: false,
                    value: "priority",
                },
                {
                    text: "Villa",
                    align: "start",
                    sortable: false,
                    value: "Villa",
                },
                {
                    text: "Action",
                    align: "middle",
                    sortable: false,
                    value: "actions",
                }
            ],
            villas: [],
            streetAddresses: [],
            search: ""
        };
    },
    computed: {
        newItemAddAllowed() {
            return !!this.streetAddresses.find(streetAddress => streetAddress.id === null);
        },
        editingLocked() {
            return !!this.streetAddresses.find( streetAddress => streetAddress.editable || streetAddress.rack_editable || streetAddress.villa_editable );
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
        async getAllStreetAddresses(searchQuery = false) {
            this.loading = !this.loading;
            let URL = "/api/user/locations/areas/villas/street-addresses"

            if (searchQuery) {
                URL = URL.concat(`?search=${this.search}`)
            }

            const response = await this.$axios.$get(URL);

            this.streetAddresses = response;
            this.streetAddresses = this.streetAddresses.map(streetAddress => ({ ...streetAddress, editable: false, villa_editable: false, rack_editable: false}));

            console.log()

            this.loading = !this.loading;
        },
        editItem(item) {
            //item.editable = true;
            //item.rack_editable = true;
            //item.villa_editable = true;
            console.log("Editing item:", item);
        },
        cancelEditing(item) {
            if (!item) {
                this.villas = this.villas.map(area => ({ ...area, editable: false, villa_editable: false, rack_editable: false }));
                this.$emit("editingCanceled");
            } else {
                alert('cancel');
                item.editable = false;
                item.rack_editable = false;
                item.villa_editable = false;
            }
            this.villas = this.villas.filter(area => area.id !== null);
        },
        async saveItem(item) {
            // Resolve the enter and blur bug
            if(item.loading==true) return;

            if (item.id === null && (!item.name || !item.Villa)) {
                return;
            }

            item.loading=true;
            item.editable = false;
            item.rack_editable = false;
            item.villa_editable = false;
            console.log("Saving item:", item);

            const payload = { ...item, parent: item.Villa.id };

            delete payload.id;
            delete payload.Villa;
            delete payload.editable;
            delete payload.rack_editable;
            delete payload.villa_editable;
            

            if (!item.id) {
                // Create a new area
                console.log(payload)
                const response = await this.$axios.$post(`/api/user/locations/areas/villas/${item.Villa.id}/street-addresses`, payload);
                this.streetAddresses.splice(0, 1, { ...response, editable: false, rack_editable: false, villa_editable: false });
            } else {
                // Just update
                await this.$axios.$put(`/api/user/locations/areas/villas/street-addresses/${item.id}`, payload);
            }
            item.loading = false;

        },
        async deleteItem(item) {
            console.log("Deleting item:", item);
            try {
                await this.$axios.$delete(`/api/user/locations/areas/villas/street-addresses/${item.id}`);
                this.streetAddresses = this.streetAddresses.filter(streetAddress => streetAddress.id !== item.id);
            } catch (error) {
                this.snackbar = true;
            }
        },
        addNewStreetAddressItem() {
            this.streetAddresses = [
                {
                    id: null,
                    name: "",
                    bikeRack: "",
                    editable: true,
                    rack_editable: true, 
                    villa_editable: true,
                    Villa: null
                },
                ...this.streetAddresses
            ];
        },
        onSearchKeyUp(event) {
            if (event.key === "Enter") {
                this.getAllStreetAddresses(true);
            } else if (`${event.target.value}`.length === 0) {
                // if someone clears the input field.
                this.getAllStreetAddresses();
            }
        },
        onClearClicked() {
            if (this.search !== "") {
                this.search = "";
            }
            this.getAllStreetAddresses();
        },
    }
}
</script>