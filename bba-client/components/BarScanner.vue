<template>
  <div class="">
     
    <stream-barcode-reader
      @decode="(a, b, c) => onDecode(a, b, c)"
      @loaded="() => onLoaded()"
    ></stream-barcode-reader>
    Input Value: {{ text  }}
  </div>
</template>

<script>
// import { StreamBarcodeReader } from "vue-barcode-reader";
// let StreamBarcodeReader;
// if (process.browser) {
//   ocnsole.log('helllllo browersssssss')
// const StreamBarcodeReader = require("vue-barcode-reader");
// }
// import StreamBarcodeReader from '@/plugins/barCode'

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
      console.log(a, b, c);
      this.text = a;
      this.$emit('code', a)
    //   if (this.id) clearTimeout(this.id);
    //   this.id = setTimeout(() => {
    //     if (this.text === a) {
    //       this.text = "";
    //     }
    //   }, 5000);
    },
    onLoaded() {
      console.log("load");
    },
  },
};
</script>
<style scoped>
</style>
