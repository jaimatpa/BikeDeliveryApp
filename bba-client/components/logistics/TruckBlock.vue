<template>
<v-card hover color="blue" height="100" class="mx-auto my-12 card-outter" @click="click">
    <v-card-text></v-card-text>
</v-card>
</template>

<script>
export default {
    methods: {
        click() {
            console.log("Clicked a truck");
        },
    }
}
</script>

<style>

</style>
