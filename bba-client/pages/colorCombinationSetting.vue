<template lang="html">
<Page>
    <v-data-table :headers="headers" :items="locks" :hide-default-footer="true" disable-pagination dense>
        <template v-slot:item.color="props">
            <v-edit-dialog :return-value.sync="props.item.color" @save="save(props.item)" persistent>
                {{props.item.color}}
                <template v-slot:input>
                    <v-text-field v-model="props.item.color" :rules="rules.max25chars" label="Edit" single-line counter>
                    </v-text-field>
                </template>
            </v-edit-dialog>
        </template>

        <template v-slot:item.combination="props">
            <v-edit-dialog :return-value.sync="props.item.combination" @save="save(props.item)">
                {{props.item.combination}}
                <template v-slot:input>
                    <v-text-field v-model="props.item.combination" :rules="rules.max25chars" label="Edit" single-line counter>
                    </v-text-field>
                </template>
            </v-edit-dialog>
        </template>

        <template v-slot:item.colorvalue="props">
                <!-- {{props.item.colorvalue}} -->
                <template>
                    <v-color-picker hide-canvas hide-inputs swatches-max-height="75"  v-model="props.item.colorvalue" label="Edit"></v-color-picker>
                </template>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-icon small @click="deleteItem(item)">
                mdi-delete
            </v-icon>
        </template>
    </v-data-table>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{snackText}}
        <template v-slot:action="{ attrs }">
            <v-btn v-bind="attrs" text @click="snack = false"> Close
            </v-btn>
        </template>
    </v-snackbar>

    <FloatingButton @click="addRow()" color="primary" />

    <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

    <v-btn block color="primary" class="mt-5" @click="saveColorCombinationData()">
        Save
    </v-btn>
</Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import FloatingButton from "./../components/paradym/FloatingButton";
import {
    mapActions
} from "vuex";

export default {
    name: "colorCombination",
    auth: true,
    head() {
        return {
            title: "Color Combination",
        };
    },
    components: {
        Page,
        FloatingButton
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
        getLockingData() {
            return this.lockingData;
        },
    },
    data() {
        return {
            snack: false,
            snackColor: '',
            snackText: '',
            dialog: false,
            dialogDelete: false,
            editedIndex: 0,
            editedItem: {},
            breakpoint: 640,
            lockingData: [],
            color: "",
            combination: "",
            max25chars: v => v.length <= 25 || 'Input too long!',
            rules: {
                required: (value) => !!value || "Required.",
            },
            headers: [{
                    text: "COLOR KEY",
                    align: "start",
                    value: "color",
                },
                {
                    text: "COMBINATION",
                    value: "combination",
                },
                {
                    text: "COLOR",
                    value: "colorvalue",
                },
                {
                    text: "ACTIONS",
                    value: "actions",
                    sortable: false
                }
            ],
            locks: [],
        };
    },
    created() {
        this.initialize();
    },
    methods: {
        initialize() {
            this.getLockingDetails();
            // this.locks = this.lockingData;
            // console.log(this.locks);
        },
        ...mapActions("snackbar", {
            showSuccess: "success",
            showError: "error"
        }),
        addRow() {
            this.lockingData.push({
                color: this.color,
                combination: this.combination,
            });
        },
        deleteItem(item) {
            this.editedIndex = this.locks.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
        })
        },
        async deleteItemConfirm() {
            await this.$axios.$delete("/api/user/locking", {data: {id: this.editedItem.id}}).then((result) => {
                    this.locks.splice(this.editedIndex, 1)
                    this.snack = true
                    this.snackColor = 'success'
                    this.snackText = 'Color Combination has been deleted.'
            });
            this.closeDelete();
        },
        async getLockingDetails() {
            const lockingDataResponse = await this.$axios.$get("/api/user/locking");
            this.lockingData = lockingDataResponse;
            this.locks = lockingDataResponse;
            this.locks.forEach(lock => {
                console.log(lock);
                // lock.colorvalue.hex = lock.ColorValue;
            });
            console.log(this.locks);
        },
        async deleteColorCombination() {

        },
        save(item) {
            console.log(item);
            const saveResponse = this.$axios.$put("/api/user/locking", item).then((result) => {
                if (result) {
                    this.snack = true
                    this.snackColor = 'success'
                    this.snackText = 'Data saved'
                }
            })
        },
        cancel() {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = 'Canceled'
        },
        open() {
            this.snack = true
            this.snackColor = 'info'
            this.snackText = 'Dialog opened'
        },
        close() {
            console.log('Dialog closed')
        },
        saveColorCombinationData() {
            this.lockingData.forEach(lock => {
                lock.ColorValue = lock.colorvalue.hex;
                console.log(lock);
            });
            const res = this.$axios
                .$post("/api/user/locking", this.lockingData)
                .then((result) => {
                    if (result) {
                        this.dialog = false;
                        this.getLockingDetails();
                        this.showSuccess("Color Combination Successfully Updated.");
                    }
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.color-combination-mapping-table {
    tbody {
        tr td {
            .v-input {
                height: 50% !important;
            }
        }
    }
}
</style>
