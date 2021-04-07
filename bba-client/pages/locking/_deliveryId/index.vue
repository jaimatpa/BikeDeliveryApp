<template lang="html">
  <Page :title="!isMobile ? 'Lock Details' : ''">
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="lockData.lock"
          label="Lock"
          placeholder="Lock"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="lockData.color"
          label="Color"
          placeholder="Color"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-text-field
          v-model="lockData.combination"
          label="Combination"
          placeholder="Combination"
          readonly
          dense
          outlined
        >
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Notification Send Button -->
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" xl="6">
        <v-btn block depressed color="primary" @click.stop="$router.go(-1)">
          Save
        </v-btn>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import _ from "lodash";

import Page from "@/components/paradym/Page";

export default {
  name: "lockDetails",
  auth: true,
  head() {
    return {
      title: "Lock Details",
    };
  },
  components: { Page },
  created() {
    this.getOrderDetails()
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      lockData: {},
    };
  },
  methods: {
    async getOrderDetails() {

       try {
        let response = await this.$axios.$get(
          "/api/user/deliveryOrder",
          {
            params: {
              search : this.$route.params.orderId
            },
          }
        );
        console.log('respones', response);
        this.lockData = response[0]
      
        //  this.$router.go(-1);
       
      } catch (err) {
        console.log('errror', err.response);
       
      }

    },
  }
};
</script>

<style lang="scss"></style>
