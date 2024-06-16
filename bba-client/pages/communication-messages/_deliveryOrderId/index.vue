<template lang="html">
    <Page :title="!isMobile ? `Messages For Order# ${this.$route.params.deliveryOrderId}` : ''">
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <div ref="messageContainer" style="height: 550px; overflow-y: auto;">
                        <v-card v-for="message in messages" :key="message.id" class="message-card mt-2" outlined
                            elevation="2" shaped>
                            <v-card-subtitle class="text-right">
                                <small> {{ message.Sent }} </small>
                            </v-card-subtitle>

                            <v-card-text>
                                {{ message.MessageText }}
                            </v-card-text>
                        </v-card>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <v-container class="d-flex align-center">
            <v-row>
                <v-col cols="11">
                    <v-text-field v-model="newMessage" label="Message" @keydown.enter="sendMessage" outlined></v-text-field>
                </v-col>
                <v-col cols="1">
                    <v-btn elevation="2" outlined raised x-large color="primary" @click="sendMessage">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </Page>
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
    name: "Communication-Message",
    auth: true,
    head() {
        return {
            title: "Communication Message",
        };
    },
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
            messages: [],
            newMessage: "",
            intervalId: null,
        };
    },
    async created() {
        await this.getMessagesForADeliveryOrder();
        this.scrollToBottom();

        // Uncomment the line below if we want to enable polling 
        // this.startFetchingMessages();
    },
    beforeUnmount() {
        this.stopFetchingMessages();
    },
    methods: {
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                container.scrollTop = container.scrollHeight;
            });
        },
        startFetchingMessages() {
            this.intervalId = setInterval(() => {
                this.getMessagesForADeliveryOrder();
            }, 2000);
        },
        stopFetchingMessages() {
            clearInterval(this.intervalId);
        },
        async getMessagesForADeliveryOrder() {
            const response = await this.$axios.$get(`/api/user/communication-message/${this.$route.params.deliveryOrderId}`);

            this.messages = response;
        },
        async sendMessage() {
            const user = JSON.parse(localStorage.getItem("auth.user")).user;

            const messageBody = this.newMessage.concat(` — ${user.email}`)

            const response = await this.$axios.$post(`/api/user/communication-message`, {
                DeliveryId: this.$route.params.deliveryOrderId,
                MessageText: messageBody
            });

            this.messages = [...this.messages, response];
            this.newMessage = "";
            this.scrollToBottom();
        }
    }
}
</script>