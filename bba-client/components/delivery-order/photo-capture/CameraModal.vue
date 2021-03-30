<template>
  <v-dialog class="qf-modal qf-modal-capture-photo"  content-class="custom-class-photo-cap-modal" :value="show" @click:outside="$emit('cancel', {cross_btn_clicked: true})" light>
    <OverlayLoading :active="loading || !cameraReady" :message="loadingMessage">
      <CapturePhoto 
        v-if="cameraMode === 'capture'" 
        ref="camera" autoplay selectFirstDevice 
        :images="capturedImages" 
        @change-camera-mode="handleChangeCameraMode" 
        @started="cameraReady = true" 
        @onCapture="savePhoto($event)"  
        v-on="$listeners"

      />
      <v-btn v-if="cameraMode==='capture'" absolute small dark color="rgba(0,0,0,0.50)" class="elevation-0" style="top: 2px; left: 2px;" @click="exit()">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </OverlayLoading>
    
    <!-- <v-btn dark text :disabled="!capturedImage" @click="upload()">Upload</v-btn> -->
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import CapturePhoto from './CapturePhoto'
import OverlayLoading from '../../../components/OverlayLoading.vue'

export default {
  name: 'DynamicFormCameraModal',
  components: {
    CapturePhoto,
    OverlayLoading
  },
  props: {
    'show': Boolean,
    'customer': Number,
    'project': Number,
    'bid': Number,
    'task': Number, 
    multipleUpload: {
      type: Boolean, 
      default: false
    }, 
    capturedImagesFromVuex: {
      type: Array, 
      default() {
          return []
      } 
    }, 

    camModuleObj: {
      type: Object, 
      default() {
        return {
            clicked_img: { }, 
            retake_img_obj: { }, 
            camera_mode: ''
        }
      }
    }, 

  },
  watch: {

  }, 
  async created() {
    this.loading = true
    this.loading = false
  },
  data() {
    return {
      cameraMode: 'capture', //another one is: 'approve'
      loading: true,
      uploading: false,
      cameraReady: false,
      capturedImage: null,
      caption: '',
      loadingMessage: 'Loading camera',
      customerId: null,
      projectId: null,
      bidId: null,
      taskId: null,
      lockCustomer: false,
      lockProject: false,
      lockBid: false,
      lockTask: false,
      capturedImages: [],

      imageCounter: 0, 

    }
  },
  computed: {
    ...mapState({

    }),
  },
  methods: {
    ...mapActions(['uploadImage']),
    ...mapActions(['getProjectCustomer', 'getBidCustomer']),

    ...mapMutations('logbookFrontend', { 
      PUSH_CAPTURED_IMAGE: 'PUSH_CAPTURED_IMAGE',

    }),

    exit() {
      console.log('exit clickeddddddddd ')
      this.$emit('cancel', {cross_btn_clicked: true})
    }, 

    savePhoto(canvas) {

         canvas.toBlob((blob) => {
          console.log("blobbbbbbb ===== ", blob  )

          const originalName = `${Date.now()}-${this.imageCounter+1}`
          const savedfileObj = new File([blob], originalName, { type: blob.type });
          const local_blob_url = URL.createObjectURL( savedfileObj ); // To release an object URL, call revokeObjectURL().
          const obj = { local_blob_url, originalName, mimetype: blob.type}
          
         // this.PUSH_CAPTURED_IMAGE( obj )
          this.capturedImages.push( obj )
          this.$emit('captured-camera-images', this.capturedImages)

          if (this.multipleUpload === false) {
            //this.$emit('cancel')
            this.$emit('cancel', {cross_btn_clicked: false})

          }

         }, 'image/jpeg', 1); // use .95 to get JPEG at 95% quality

        // console.log('this.capturedImages ------------>>>>> ', canvas, this.capturedImages)
    },
    handleChangeCameraMode(value) {
      this.cameraMode = value
      if (value === "") {
        const camModuleObj = {
          clicked_img: {}, 
          retake_img_obj: {}, 
          camera_mode: ''
        }
        this.$emit('goto-camera-module', camModuleObj)  
        // this.$emit('cancel')
        this.$emit('cancel', {cross_btn_clicked: false})

      }

    }, 
  }
};
</script>

<style lang="scss" >
.v-btn--fab.v-size--small {
    height: 20px; 
    width: 20px;
    background: red; 
}

// Don't know, may be used later if we see any modal alignment problem later. 
// .v-dialog--active {
//   //margin: 0!important;
// }

// We just replaced ".v-dialog" by "custom-class-photo-cap-modal" 
.custom-class-photo-cap-modal, .custom-class-photo-cap-modal > form {
    margin: 0!important;
    display: flex;
    align-self: flex-end;
}
.custom-class-photo-cap-modal:not(.custom-class-photo-cap-modal--fullscreen) {
    max-height: 100%;
}

</style>