<template>
    <div> 
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Date:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.date
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Name:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.name
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Location:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.location
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Order#:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.order
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Color:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.color
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Combination:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.combination
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Bike Rack:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.rack
                  }}</span>
                </p>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="12"
              xl="12"
              class="d-flex flex-column justify-center align-center"
            >
              
                <div v-if="Object.keys(clickedImage).length > 0">
                    <div class="slider-img-container py-0 my-0" style="display:flex;">
                        <img style="align-self: flex-end;" ref="currentImgRef" :src="clickedImage.local_blob_url" :width="innerWindowWidth > 800 ? 600 : 300" />
                        <span class="img-cross-btn" v-if="false"   @click="deleteImage( clickedImage.array_index )">
                            <v-icon class="black--tex" style="font-size: 20px; color: black;"> mdi-close </v-icon>  
                        </span> 
                        <span class="img-left-btn"   @click="goToNextImage('left')">
                            <v-icon class="white--text">mdi-arrow-left-bold</v-icon>  
                        </span> 
                        <span class="img-right-btn"   @click="goToNextImage('right')">
                            <v-icon class="white--text">mdi-arrow-right-bold</v-icon>  
                        </span> 
                    </div> 
                    <div style="text-align:center; margin-top: 5px;"> Photo {{ clickedImage.array_index + 1}} of {{ capturedImagesFromVuex.length }}</div>

                </div>



              <v-img v-else max-height="180" max-width="220" :src="cyclePhoto"></v-img>


            </v-col>
          </v-row>
          <!-- Fourth Stepper Button -->
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                color="primary"
                @click.stop="$emit('set-delivery-order-dialog', true)"
              >
                Complete
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                outlined
                color="accent"
                @click.stop="$emit('set-delivery-stepper', 3)"
              >
                Back
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                outlined
                color="error"
                @click.stop="$router.go(-1)"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>

    </div>
</template>
<script>
import { mapState, mapMutations, } from 'vuex'
import touchScreen from '../../../service/touchScreen'

export default {
    name: 'FourthStepper',
    props: {
        deliveryOrderData: {
            type: Object, 
            default: { }
        },
        cyclePhoto: {
            type: String, 
            default: ''
        }
    }, 
    data() {
        return {
            clickedImage: { }, 

            innerWindowWidth: 0, 

                  canvasHeight: 480,
      canvasWidth: 640,
      aspectRatio: null,
      reviewPhoto: false,

        }
    }, 
    computed: {
        ...mapState({
            capturedImagesFromVuex: state => state.capturedImages,

        }),
    },

	mounted() {
    var el = this.$refs.currentImgRef
    touchScreen.swipedetect(el, (swipedir) => {
        // swipedir contains either "none", "left", "right", "top", or "down"
        if (swipedir ==='left'){ 
          this.goToNextImage('right')
        } else if (swipedir ==='right') {
          this.goToNextImage('left')
        }

    })
    this.innerWindowWidth = window.innerWidth
    window.addEventListener('resize', this.resize)
    this.resize()
  },
    watch: {
        capturedImagesFromVuex: {
            deep: true, 
            immediate: true, 
            handler: function (newVal, oldVal) {

                if (newVal!==undefined &&  newVal.length > 0) {
                    this.clickedImage = {...newVal[0], array_index: 0}
                } else {
                    this.clickedImage = { }
                }
                console.log('hereeeeeeeeeeeeeee ........ ', newVal)
            }
        }
    }, 
    methods: {
        resize() {
            let windowAspectRatio = window.innerWidth / window.innerHeight
            if (windowAspectRatio > this.aspectRatio) {
                this.canvasHeight = window.innerHeight
                this.canvasWidth = this.canvasHeight * this.aspectRatio
            } else if (windowAspectRatio < this.aspectRatio){
                this.canvasWidth = window.innerWidth
                this.canvasHeight = window.innerWidth / this.aspectRatio
            } else {
                this.canvasWidth = window.innerWidth
                this.canvasHeight = window.innerHeight
            }
        },

        goToNextImage(direction) {
            const {array_index} = this.clickedImage
            if (direction === 'left') {
                if(array_index !== 0) {
                const result = {...this.capturedImagesFromVuex[array_index - 1], array_index: array_index - 1}

                this.clickedImage = result
                }
            } else if (direction === 'right') {
                if (array_index !== this.capturedImagesFromVuex.length - 1) {
                const result = {...this.capturedImagesFromVuex[array_index + 1], array_index: array_index + 1}
                this.clickedImage = result
                }
            }

        }, 

    }

}
</script>