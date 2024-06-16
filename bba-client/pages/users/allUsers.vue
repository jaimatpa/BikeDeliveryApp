<template lang="html">
  <Page title="All Users">
    <v-data-table
      :headers="headers"
      :items="users"
      :options.sync="options"
      :server-items-length="totalUsers"
      :loading="loading"
      class="elevation-1"
      :mobile-breakpoint='0'
    >
      <!-- Show Custom User Type Column -->
      <template v-slot:item.userType="{ item }">
        <v-chip v-if="item.userType === 1" color="orange" dark>
          Client
        </v-chip>
        <v-chip v-if="item.userType === 2" color="teal" dark>
          Delivery Driver
        </v-chip>
        <v-chip v-if="item.userType === 3" color="green" dark>
          System Admin
        </v-chip>
      </template>
    </v-data-table>
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
  name: "allUsers",
  auth: true,
  head() {
    return {
      title: "All Users",
    };
  },
  components: { Page },
  data() {
    return {
      totalUsers: 0,
      users: [],
      loading: true,
      options: {},
      headers: [
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
        },
        { text: "Name", value: "name" },
        { text: "User Type", value: "userType" },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    async getDataFromApi() {
      this.loading = true;
      await this.apiCall().then((data) => {
        this.users = data.items;
        this.totalUsers = data.total;
        this.loading = false;
      });
    },
    apiCall() {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        const data = await this.$axios.$get("/api/user/allUsersx");
        console.log(data);

        let items = data.allUsers;
        const total = data.allUsers.length;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]];
            const sortB = b[sortBy[0]];

            if (sortDesc[0]) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }
      });
    },
  },
};
</script>
