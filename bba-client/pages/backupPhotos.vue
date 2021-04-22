<template lang="html">
  <Page>
    <p class="secondary--text">
      To Get all the Backup Photos? Please Click below the Button.
    </p>
    <v-btn color="primary" class="white--text" @click="downloadBackupPhotos()">
      Download
      <v-icon right dark>
        mdi-cloud-download
      </v-icon>
    </v-btn>
  </Page>
</template>

<script>
import moment from "moment";
import Page from "@/components/paradym/Page";

export default {
  name: "backupPhotos",
  auth: true,
  head() {
    return {
      title: "Backup Photos",
    };
  },
  components: { Page },
  data() {
    return {};
  },
  methods: {
    async downloadBackupPhotos() {
      const data = await this.$axios.$get("/api/user/downloadBackUpPhotos", {
        responseType: "blob",
      });

      console.log('data: ', data);
      
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${moment(new Date()).format("MM/DD/YYYY")}-files` + ".zip"
      );
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>
