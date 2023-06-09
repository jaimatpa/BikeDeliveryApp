<template>
  <div>
    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search by Order #, Name, Location" single-line
      hide-details outlined dense clearable class="ma-1 order-search-text-field"
      @click:clear="onClearClicked"></v-text-field>
    <v-data-table :headers="headers" :items="messages" :search="search" :items-per-page="100" dense
      class="elevation-1 ma-1">
      <!-- Date -->
      <!-- <template v-slot:item.dateSent="{ item }">
        {{ getDateFormat(item.dateSent) }}
      </template> -->

      <template v-slot:item.direction="{ item }">
        {{ getSentReceived(item.direction) }}
      </template>

      <template v-slot:item.from="{ item }">
        {{ formatPhoneNumber(item.from) }}
      </template>

      <template v-slot:item.to="{ item }">
        <div class="d-flex align-center">
          <span class="mr-2">{{ formatPhoneNumber(item.to) }}</span>
          <!-- Remove the +1 from the phone number since database does not have store mobile numbers with +1 intl code -->
          <v-icon v-if="item.to" medium color="primary"
            @click.stop="$router.push({ path: `/searchHistory/${item.to.replace(/^\+1/g, '')}` })">
            mdi-page-next
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      search: "Received",
      headers: [
        {
          text: "DATE SENT",
          value: "dateSent",
          width: "200",
        },
        {
          text: "MESSAGE",
          value: "body",
          sortable: false,
        },
        {
          text: "SENT/RECEIVED",
          value: "direction",
          sortable: false,
          width: "150",
        },
        {
          text: "FROM #",
          value: "from",
          width: "150",
          sortable: false,
        },
        {
          text: "TO #",
          value: "to",
          width: "250",
          sortable: false,
        },
        {
          text: "Photo #",
          value: "numMedia",
          align: "center",
        },
      ],
      messages: [],
    };
  },
  async created() {
    console.log("IN CREATED");
    //   console.log("CALLING TWILIO", await this.$axios.$get("/api/user/twilio/"));
    this.messages = await this.$axios.$get("/api/user/twilio/");
  },
  methods: {
    getDateFormat(date) {
      return moment(date)
        .add(4, "hours")
        .format("MM/DD/YYYY hh:mm A");
    },
    getSentReceived(direction) {
      console.log(direction);
      if (direction === "outbound-api") {
        return "Sent";
      } else if (direction === "outbound-reply") {
        return "Automatic Reply";
      } else {
        return "Received";
      }
    },
    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = match[1] ? "+1 " : "";
        return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
      }
      return null;
    },
    async onKeyUp(event) {
      let searchParam = {
        search: this.search,
      };
      this.messages = await this.$axios.$get("/api/user/twilio/", { params: searchParam });
    },
    onClearClicked() { },
  },
};
</script>

<style></style>
