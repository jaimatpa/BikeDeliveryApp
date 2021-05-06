<template>
<div class="d-flex flex-column justify-space-between" style="height: 100%">
    <div>
        <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" xl="12" class="d-flex flex-column justify-center align-center">
                <v-img v-if="local_files_to_upload.length === 0" max-height="180" max-width="220" :src="emptyPhoto"></v-img>
                <div v-else>
                    <div class="slider-img-container py-0 my-0" style="display: flex">
                        <img style="align-self: flex-end" ref="currentImgRef" :src="clickedImage.local_blob_url" :width="innerWindowWidth > 800 ? 600 : 300" />
                        <span class="img-cross-btn" @click="deleteImage(clickedImage.array_index)">
                            <v-icon color="black" style="font-size: 20px; cursor: pointer">
                                mdi-close
                            </v-icon>
                        </span>
                        <span class="img-left-btn" @click="goToNextImage('left')">
                            <v-icon class="white--text">mdi-arrow-left-bold</v-icon>
                        </span>
                        <span class="img-right-btn" @click="goToNextImage('right')">
                            <v-icon class="white--text">mdi-arrow-right-bold</v-icon>
                        </span>
                    </div>
                    <div style="text-align: center; margin-top: 5px">
                        Photo {{ clickedImage.array_index + 1 }} of
                        {{ local_files_to_upload.length }}
                    </div>
                </div>

                <v-btn block depressed color="secondary" class="mt-5" @click="open_camera_module = !open_camera_module">
                    {{ local_files_to_upload.length ? "Add" : "Take" }}
                    Photo
                </v-btn>
                <p class="primary--text mt-5 mb-0">LOCATION</p>
                <p class="body-2 secondary--text text-center">
                    {{
              userPosition !== null && deliveryOrderData !== null
                ? `Your Location is: ${deliveryOrderData &&
                    deliveryOrderData.location}. Your Position is lat: ${userPosition &&
                    userPosition.lat} lng: ${userPosition && userPosition.lng}`
                : "No Location Found"
            }}
                </p>
            </v-col>
        </v-row>
    </div>

    <div>
        <!-- Third Stepper Button -->
        <v-row>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                <v-btn block depressed color="accent" @click.stop="$emit('set-delivery-stepper', 1)">
                    <v-icon dark>
                        mdi-chevron-left
                    </v-icon>
                    Back
                </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                <v-btn block depressed color="error" @click.stop="deliveryCancelOrderDialog = true">
                    Cancel
                </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                <v-btn block depressed color="primary" @click.stop="handleGoToNextStepper">
                    Next
                    <v-icon dark>
                        mdi-chevron-right
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </div>
    <CameraModal v-if="open_camera_module" :deliveryNumber="this.deliveryOrderData.barcode" :show="open_camera_module" @cancel="handleCancel" @captured-camera-images="saveCameraImages" :multipleUpload="true" />

    <!-- Delivery Cancel Dialog -->
    <v-dialog v-model="deliveryCancelOrderDialog" transition="dialog-bottom-transition" max-width="350" content-class="order-details-dialog">
        <v-card>
            <v-toolbar dense color="error" dark elevation="0">
                <v-toolbar-title>Cancel Delivery</v-toolbar-title>
                <v-spacer />
                <v-btn icon dark @click.stop="deliveryCancelOrderDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="my-5 text-center">
                <p class="title mb-3 secondary--text sure-title">
                    Are you sure you want to cancel this delivery order?
                </p>

                <div class="d-flex flex-column">
                    <v-btn class="ma-2" color="primary" @click.stop="$router.go(-1)">
                        Yes
                    </v-btn>
                    <v-btn class="ma-2" outlined color="error" @click.stop="deliveryCancelOrderDialog = false">
                        No
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import touchScreen from "../../../service/touchScreen";
import emptyPhoto from "@/assets/images/empty.jpg";
import CameraModal from "../photo-capture/CameraModal";
import {
    mapState,
    mapMutations
} from "vuex";
export default {
    name: "ThirdStepper",
    props: {
        deliveryOrderData: {
            type: Object,
            default: {},
        },
        userPosition: {
            type: Object,
            default: {},
        },
    },
    components: {
        CameraModal,
    },
    data() {
        return {
            deliveryCancelOrderDialog: false,
            emptyPhoto: emptyPhoto,
            open_camera_module: false,
            local_files_to_upload: [],
            local_files_to_upload_copy: [],

            canvasHeight: 480,
            canvasWidth: 640,
            aspectRatio: null,
            reviewPhoto: false,

            innerWindowWidth: 0,
            clickedImage: {
                local_blob_url: null,
                originalName: "",
                mimetype: "",

                array_index: null,
                caption: "",
                tags: "",
                id: "",
                isDirty: false,
                isRetake: false,
            },
        };
    },
    mounted() {
        var el = this.$refs.currentImgRef;
        touchScreen.swipedetect(el, (swipedir) => {
            // swipedir contains either "none", "left", "right", "top", or "down"
            if (swipedir === "left") {
                this.goToNextImage("right");
            } else if (swipedir === "right") {
                this.goToNextImage("left");
            }
        });
        this.innerWindowWidth = window.innerWidth;
        window.addEventListener("resize", this.resize);
        this.resize();
        console.log(this.deliveryOrderData);
    },

    watch: {
        capturedImagesFromVuex: {
            deep: true,
            immediate: true,
            handler: function (newVal, oldVal) {
                if (newVal.length > 0) {
                    this.local_files_to_upload = [...newVal];
                    this.clickedImage = {
                        ...this.local_files_to_upload[0],
                        array_index: 0,
                    };
                } else {
                    this.clickedImage = {};
                }
                console.log("hereeeeeeeeeeeeeee ........ ");
            },
        },
    },

    computed: {
        ...mapState({
            capturedImagesFromVuex: (state) => state.capturedImages,
        }),
    },
    methods: {
        ...mapMutations(["SET_CAPTURED_IMAGES_IN_VUEX"]),

        handleGoToNextStepper() {
            this.SET_CAPTURED_IMAGES_IN_VUEX(this.local_files_to_upload);
            this.$emit("set-delivery-stepper", 4);
        },

        handleCancel(obj) {
            // console.log('handleCancel this.local_files_to_upload ===> ', this.local_files_to_upload)
            if (obj !== undefined && obj.save_backup === true) {
                this.local_files_to_upload_copy = JSON.parse(
                    JSON.stringify(this.local_files_to_upload)
                );
            }

            if (obj !== undefined && obj.cross_btn_clicked === true) {
                this.local_files_to_upload = this.local_files_to_upload_copy;
            }
            this.open_camera_module = false;
        },

        deleteImage(img_index) {
            // console.log('%c img_index: ', 'color: yellowgreen; font-size: 20px', img_index)
            if (confirm("Are you sure to remove?")) {
                let nextImage = {};

                const filtered_images = this.local_files_to_upload.filter(
                    (obj, index) => {
                        if (index === img_index) {
                            if (img_index === this.local_files_to_upload.length - 1) {
                                nextImage = {
                                    ...this.local_files_to_upload[img_index - 1],
                                    array_index: img_index - 1,
                                };
                            } else {
                                nextImage = {
                                    ...this.local_files_to_upload[img_index + 1],
                                    array_index: img_index,
                                };
                            }

                            return false;
                        }
                        return true;
                    }
                );
                console.log("nextImage: ", nextImage);
                this.clickedImage = nextImage;
                this.local_files_to_upload = [...filtered_images];
            }
        },

        saveCameraImages(images) {
            console.log("================= images", images);

            const blob_urls = this.local_files_to_upload.map((o) => o.local_blob_url);
            const result = [...this.local_files_to_upload];
            for (let i = 0; i < images.length; i++) {
                let obj = images[i];
                if (!blob_urls.includes(obj.local_blob_url)) {
                    result.push(obj);
                }
            }
            this.local_files_to_upload = result;

            if (result.length > 0) {
                this.clickedImage = {
                    ...result[0],
                    array_index: 0
                };
            }

            console.log("saveCameraImages result ==========> ", result);
        },

        resize() {
            let windowAspectRatio = window.innerWidth / window.innerHeight;
            if (windowAspectRatio > this.aspectRatio) {
                this.canvasHeight = window.innerHeight;
                this.canvasWidth = this.canvasHeight * this.aspectRatio;
            } else if (windowAspectRatio < this.aspectRatio) {
                this.canvasWidth = window.innerWidth;
                this.canvasHeight = window.innerWidth / this.aspectRatio;
            } else {
                this.canvasWidth = window.innerWidth;
                this.canvasHeight = window.innerHeight;
            }
        },

        goToNextImage(direction) {
            const {
                array_index
            } = this.clickedImage;
            if (direction === "left") {
                if (array_index !== 0) {
                    const result = {
                        ...this.local_files_to_upload[array_index - 1],
                        array_index: array_index - 1,
                    };

                    this.clickedImage = result;
                }
            } else if (direction === "right") {
                if (array_index !== this.local_files_to_upload.length - 1) {
                    const result = {
                        ...this.local_files_to_upload[array_index + 1],
                        array_index: array_index + 1,
                    };
                    this.clickedImage = result;
                }
            }
        },
    },
};
</script>

<style>
.slider-img-container {
    display: inline-block;
    position: relative;
}

/* 

.img-container {

display: inline-block; 

position: relative;

}

.cpation-tags-overlay {

position: absolute; 

bottom: 0%;   

background: rgba(29, 29, 29, 0.5);  

padding-top: 2px;

padding-bottom: 2px;

padding-left: 5px;

padding-right: 5px;

width: 100%;

color: white;

} 
*/

.img-cross-btn {
    font-size: 5px;
    position: absolute;
    top: 10px;
    right: 15px;
    padding: 2px;
    background: rgba(192, 192, 192, 0.2);
    border-radius: 50%;
}

.img-right-btn {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 5px;
    padding: 2px;
    background: rgba(192, 192, 192, 0.2);
    border-radius: 50%;
}

.img-left-btn {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 5px;
    padding: 2px;
    background: rgba(192, 192, 192, 0.2);
    border-radius: 50%;
}
</style>
