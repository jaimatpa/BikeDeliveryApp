<template>
  <PageResource
    name="User"
    :title="!isMobile ? 'List of Users' : ''"
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
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  data() {
    return {
      breakpoint: 640,
      fields: {
        email: {
          type: String,
          required: true,
          email: true,
        },
        name: {
          type: String,
          required: true,
        },
        password: {
          type: "Password",
        },
        userType: {
          type: "UserType",
        },
      },
    };
  },
};
</script>