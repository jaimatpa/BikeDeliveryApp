<template>
  <PageResource
    name="Thing"
    title="Things"
    :fields="fields"
    endpoint="/api/things"
  />
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
  name: "pageThings",
  auth: true,
  head() {
    return { title: "Things" };
  },
  components: { PageResource },
  data() {
    return {
      dialog: false,
      fields: {
        string: {
          type: String,
          required: true,
        },
        boolean: {
          type: Boolean,
          required: true,
        },
        integer: "integer",
        text: "text",
        char5: {
          type: String,
          default: "ok",
          maxLength: 5,
        },
        double: "double",
        dateOnly: {
          type: Date,
          required: true,
        },
      },
    };
  },
};
</script>
