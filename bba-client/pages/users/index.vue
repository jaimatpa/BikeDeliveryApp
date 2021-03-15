<template>
  <PageResource
    name="Users"
    title="Users"
    :fields="fields"
    endpoint="/api/users"
  />
</template>

<script>
import PageResource from "@/components/paradym/PageResource";

export default {
  name: "pageUsers",
  auth: true,
  head() {
    return { title: "Users" };
  },
  components: { PageResource },
  data() {
    return {
      fields: {
        email: {
          type: String,
          required: true,
          email: true
        },
        name: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
          minLength: true,
        },
      },
    };
  },
};
</script>
