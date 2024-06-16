<template>
    <Page :title="!isMobile ? `After Hour Message` : ''">
        <v-container>

            <v-row justify="center">
                <v-col cols="12" sm="6">
                    <v-text-field v-model="afterHourMessage" append-icon="mdi-message" label="After Hours Message"
                        single-line hide-details outlined dense clearable class="mb-5"></v-text-field>
                </v-col>
            </v-row>


            <v-row justify="center">
                <v-col cols="12" sm="6">
                    <v-menu v-model="mfStartOfDayMenu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="mfStartOfDay" label="M-F Start of Day"
                                prepend-icon="mdi-clock-time-four-outline" readonly v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-model="mfStartOfDay"></v-time-picker>
                        <!-- <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text @click="mfStartOfDayMenu = false">Cancel</v-btn>
                            <v-btn color="primary" text @click="saveTime">OK</v-btn>
                        </v-card-actions> -->
                    </v-menu>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12" sm="6">
                    <v-menu v-model="mfEndOfDayMenu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="mfEndOfDay" label="M-F End of Day"
                                prepend-icon="mdi-clock-time-four-outline" readonly v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-model="mfEndOfDay"></v-time-picker>
                    </v-menu>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12" sm="6">
                    <v-menu v-model="weekendStartOfDayMenu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="weekendStartOfDay" label="Weekend Start of Day"
                                prepend-icon="mdi-clock-time-four-outline" readonly v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-model="weekendStartOfDay"></v-time-picker>
                    </v-menu>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12" sm="6">
                    <v-menu v-model="weekendEndOfDayMenu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="weekendEndOfDay" label="Weekend Start of Day"
                                prepend-icon="mdi-clock-time-four-outline" readonly v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-model="weekendEndOfDay"></v-time-picker>
                    </v-menu>
                </v-col>
            </v-row>
            <v-col cols="12" class="text-right">
                <v-btn depressed color="primary">
                    Save
                </v-btn>
            </v-col>
        </v-container>
    </Page>
</template>
  
<script>
import Page from "@/components/paradym/Page";
export default {
    name: "After-Hour-Message",
    auth: true,
    components: {
        Page
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    data() {
        return {
            afterHourMessage: "",
            mfStartOfDayMenu: false,
            mfStartOfDay: null,
            mfEndOfDayMenu: false,
            mfEndOfDay: null,
            weekendStartOfDayMenu: false,
            weekendStartOfDay: null,
            weekendEndOfDayMenu: false,
            weekendEndOfDay: null,
        };
    },
    methods: {
        saveTime() {
            // Handle the selected time
            console.log('Selected Time:', this.mfStartOfDay);
            this.mfStartOfDayMenu = false;
        },
    },
};
</script>
  