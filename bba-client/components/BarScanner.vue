<template>
<div class="">

    <div class="scan-container">
        <div>
            <stream-barcode-reader @decode="(a, b, c) => onDecode(a, b, c)" @loaded="() => onLoaded()"></stream-barcode-reader>
        </div>

    </div>

    <div class="text-center white--text">
        Align the Bar Code within the frame to scan
    </div>

</div>
</template>

<script>
export default {
    name: "HelloWorld",
    components: {
        //    StreamBarcodeReader
    },
    data() {
        return {
            text: "",
            id: null,
        };
    },
    props: {
        msg: String,
    },
    methods: {
        onDecode(a, b, c) {
            if (a.charAt(0) === '-' || a.charAt(0) === '#') {
                a = a.substring(1);
            }
            if (a.charAt(0) === '-' || a.charAt(0) === '#') {
                a = a.substring(1);
            }
            console.log(a);
            this.text = a;
            this.$emit('code', a)
        },
        onLoaded() {
            console.log("load");
        },
    },
};
</script>

<style scoped>
.scan-container {
    display: flex;
    justify-content: center;
    padding-top: 40%;

}

@media (min-width: 767.98px) {
    .scan-container {

        padding-top: 10%;

    }
}
</style>
