<template>
<PageForm contain noPadding>
    <v-tabs v-model="tab" grow>
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="item in items" :key="item">
            {{ item }}
        </v-tab>
    </v-tabs>
    <v-divider />
    <v-tabs-items v-model="tab">
        <v-tab-item :value="0" class="pa-8">
            <FormLogin email @submit="loginUser" icons forgotURL="/forgotPassword" width="300" />
        </v-tab-item>
        <v-tab-item :value="1" class="pa-8">
            <FormRegister @submit="registerUser" icons width="300" />
        </v-tab-item>
    </v-tabs-items>
</PageForm>
</template>

<script>
import PageForm from "@/components/paradym/PageForm";
import FormLogin from "@/components/paradym/forms/FormLogin";
import FormRegister from "@/components/paradym/forms/FormRegister";

export default {
    name: "pageLogin",
    layout: "loggedOut",
    auth: false,
    head() {
        return {
            title: "Login"
        };
    },
    components: {
        PageForm,
        FormLogin,
        FormRegister
    },
    data() {
        return {
            tab: 0,
            items: ["Sign In", "Sign Up"],
        };
    },
    methods: {
        async loginUser(credentials) {
            try {
                let response = await this.$auth.loginWith("local", {
                    data: credentials,
                });
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        },
        async registerUser(userInfo) {
            console.log("registering user");
            console.log(userInfo);
            try {
                let response = await this.$axios.$post("/api/auth/signup", userInfo);
                console.log("response is:");
                console.log(response);
            } catch (error) {
                console.log(error.response.data);
            }
        },
    },
};
</script>

<style lang="scss"></style>
