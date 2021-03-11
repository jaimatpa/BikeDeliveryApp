<template>
  <Page title="Upload">
    <FileUploader endpoint="/api/upload" :maxAtOnce="3" />
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import FileUploader from "@/components/paradym/FileUploader";

export default {
  name: "pageUpload",
  auth: true,
  head() {
    return {
      title: "Upload",
    };
  },
  components: { Page, FileUploader },
};
</script>
