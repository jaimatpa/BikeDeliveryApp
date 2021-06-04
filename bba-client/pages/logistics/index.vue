<template>
<Page>
    <v-container>
        <v-btn block depressed color="primary" class="mb-5">
            <v-icon left medium color="white" class="mr-2">mdi-barcode-scan</v-icon>
            Scan Barcode
        </v-btn>
        <v-row>
            <v-col v-for="n in 6" :key="n" cols="12" sm="2">
                <truck-block></truck-block>
            </v-col>
        </v-row>
    </v-container>

</Page>
</template>

<script>
import Page from '../../components/paradym/Page'
import TruckBlock from '../../components/logistics/TruckBlock.vue'
export default {
    components: {
        Page,
        TruckBlock
    }
}
</script>

<style>

</style>
