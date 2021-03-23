<template lang="html">
  <PageResource
    name="Web Hook"
    title="List of Web Hooks"
    :fields="fields"
    endpoint="/api/webHooks"
  />
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
  name: "webHook",
  auth: true,
  head() {
    return {
      title: "Web Hook",
    };
  },
  components: { PageResource },
  data() {
    return {
      fields: {
        webHookUrl: {
          type: String,
          required: true,
          isValidUrl: true,
        },
        isActive: {
          type: Boolean,
          required: true,
        },
      },
    };
  },
};
</script>
