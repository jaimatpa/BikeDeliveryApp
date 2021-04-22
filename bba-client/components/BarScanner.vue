<template>
  <div class="">

    <div class="scan-container">
      <div>
      <stream-barcode-reader
            @decode="(a, b, c) => onDecode(a, b, c)"
            @loaded="() => onLoaded()"
          ></stream-barcode-reader>
      </div>
      
    </div>

    <div class="text-center white--text" >
       Align the Bar Code within the frame to scan
    </div>
     
   
  
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
.scan-container {
    display: flex;
    justify-content: center;
    padding-top: 40%;
  
}
@media (min-width: 767.98px){
 .scan-container {
   
    padding-top: 10%;
  
}
}
</style>
