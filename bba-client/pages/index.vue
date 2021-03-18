<template>
  <Page title="Dashboard" desc="This is the index page.">
    <PageSection title="Page Section">
      <p>This is a page section in the index page.</p>
      <PageSection sub title="Sub Section">
        <p>This is a sub page section in a page section.</p>
      </PageSection>
    </PageSection>
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";
import PageSection from "@/components/paradym/PageSection";

export default {
  name: "pageIndex",
  auth: true,
  head() {
    return { title: "Home" };
  },
  components: { Page, PageSection },
};
</script>
