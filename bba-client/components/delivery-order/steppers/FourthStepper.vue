<template>
<div class="d-flex flex-column justify-space-between" style="height: 100%">
    <div>
        <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
                <div class="d-flex justify-space-between align-center flex-wrap">
                    <p class="font-weight-black text--secondary mb-0">
                        <span class="font-weight-bold">DATE:</span>
                        <span class="font-weight-regular">{{
                deliveryOrderData.date
              }}</span>
                    </p>
                    <p class="font-weight-black text--secondary mb-0">
                        <span class="font-weight-bold">NAME:</span>
                        <span class="font-weight-regular">{{
                deliveryOrderData.name
              }}</span>
                    </p>
                </div>

                <div class="d-flex justify-space-between align-center flex-wrap">
                    <p class="font-weight-black text--secondary mb-0">
                        <span class="font-weight-bold">LOCATION:</span>
                        <span class="font-weight-regular">{{
                deliveryOrderData.location
              }}</span>
                    </p>
                    <p class="font-weight-black text--secondary mb-0">
                        <span class="font-weight-bold">ORDER#:</span>
                        <span class="font-weight-regular">{{
                deliveryOrderData.orderid
              }}</span>
                    </p>
                </div>

                <div class="d-flex justify-space-between align-center flex-wrap">
                    <p class="font-weight-black text--secondary mb-0">
                        <span class="font-weight-bold">COLOR:</span>
                        <span class="font-weight-regular">{{
                deliveryOrderData.color
              }}</span>
                    </p>
                    <p class="font-weight-black text--secondary mb-0">
                        <span class="font-weight-bold">COMBINATION:</span>
                        <span class="font-weight-regular">{{
                deliveryOrderData.combination
              }}</span>
                    </p>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
                <v-checkbox label="Unable to deliver all items" v-model="deliveryOrderData.unableToDeliverItems" v-ripple></v-checkbox>
                <v-textarea label="Reason why you can't deliver all items"
                            visible
                            v-model="deliveryOrderData.note"
                            :disabled="!deliveryOrderData.unableToDeliverItems"
                            :v-show="deliveryOrderData.unableToDeliverItems"
                            hide-details
                            ></v-textarea>
            </v-col>
            
        </v-row>
            
        <v-row>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                <v-btn block depressed color="accent" @click.stop="$emit('set-delivery-stepper', 3)">
                    Back
                </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                <v-btn block depressed color="error" @click.stop="$router.go(-1)">
                    Cancel
                </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
                <v-btn block depressed color="primary" @click.stop="$emit('set-delivery-order-dialog', true)">
                    Complete
                </v-btn>
            </v-col>
        </v-row>
    </div>

    <v-dialog v-model="scanDialogVisible" fullscreen>
        <v-card>
            <v-card-title class="title primary--text">
                <!-- Scanning Barcode -->
            </v-card-title>

            <v-card-text>
                <BarScanner @code="code" :key="cameraRender" />
                <v-btn  depressed color="primary" class="mb-5" @click.stop="closeScanner">
                    Close
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from "vuex";
import touchScreen from "../../../service/touchScreen";

export default {
    name: "FourthStepper",
    props: {
        deliveryOrderData: {
            type: Object,
            default: {},
        },
        cyclePhoto: {
            type: String,
            default: "",
        },
    },
    created() {
        this.getOrderItems();
    },
    data() {
        return {
            clickedImage: {},
            innerWindowWidth: 0,
            canvasHeight: 480,
            canvasWidth: 640,
            scanDialogVisible: false,
            currentItem: {},
            cameraRender: 0,
            aspectRatio: null,
            reviewPhoto: false,
            allImages: undefined,
            deliveryCancelOrderDialog: false,
            headers: [{
                    text: "ITEM",
                    align: "start",
                    value: "item",
                },
                {
                    text: "BARCODE",
                    value: "serialbarcode",
                },
                {
                    text: "DELIVERED",
                    value: "checkedDelievery",
                },
                {
                    text: "ACTION",
                    value: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
            equipment: [],
        };
    },
    computed: {
        ...mapState({
            capturedImagesFromVuex: (state) => state.capturedImages,
        }),
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
    },
    watch: {
        capturedImagesFromVuex: {
            deep: true,
            immediate: true,
            handler: function (newVal, oldVal) {
                if (newVal !== undefined && newVal.length > 0) {
                    this.clickedImage = {
                        ...newVal[0],
                        array_index: 0
                    };
                    // this.$emit('uploadFiles', this.clickedImage)
                } else {
                    this.clickedImage = {};
                }
                console.log(newVal);
                console.log("Hellooooo");
                this.$emit("setUploadFiles", newVal);
            },
        },
        deliveryOrderData: {
            handler: function() {
                this.getOrderItems()
            }
        },
    },
    methods: {
        ...mapMutations(["SET_CAPTURED_IMAGES_IN_VUEX"]),

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

        async code(value) {
            console.log("CURRENTITEM", this.currentItem);
            this.currentItem.serialbarcode = value;
            this.saveUpdate(this.currentItem);
        },
        async saveUpdate(item) {
            console.log("ITEM", item);
            let response = await this.$axios.$put("/api/user/deliveryItem", item);
            console.log("RESPONSE", response);
            this.closeScanner();
        },

        closeScanner() {
            this.scanDialogVisible = false;

            const video = document.querySelector("video");

            // A video's MediaStream object is available through its srcObject attribute
            const mediaStream = video.srcObject;

            // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
            const tracks = mediaStream.getTracks();

            // Tracks are returned as an array, so if you know you only have one, you can stop it with:
            // tracks[0].stop();

            // Or stop all like so:
            tracks.forEach((track) => track.stop());

        },

        async getOrderItems() {
            try {
                console.log("IN ORDER ITEMS", this.deliveryOrderData);
                let response = await this.$axios.$get("/api/user/deliveryItem", {
                    params: {
                        deliveryID: this.deliveryOrderData.id,
                    },
                });

                this.equipment = response;

                //  this.$router.go(-1);
            } catch (err) {
                console.log("Issue in getOrderItems", err.response);
            }
        },

        goToNextImage(direction) {
            const {
                array_index
            } = this.clickedImage;
            if (direction === "left") {
                if (array_index !== 0) {
                    const result = {
                        ...this.capturedImagesFromVuex[array_index - 1],
                        array_index: array_index - 1,
                    };

                    this.clickedImage = result;
                }
            } else if (direction === "right") {
                if (array_index !== this.capturedImagesFromVuex.length - 1) {
                    const result = {
                        ...this.capturedImagesFromVuex[array_index + 1],
                        array_index: array_index + 1,
                    };
                    this.clickedImage = result;
                }
            }
        },
        close() {

        },
        save() {
            alert('Save button has been clicked');
        },
        deleteImage(img_index) {
            // console.log('%c img_index: ', 'color: yellowgreen; font-size: 20px', img_index)
            if (confirm("Are you sure to remove?")) {
                let nextImage = {};

                const filtered_images = this.capturedImagesFromVuex.filter(
                    (obj, index) => {
                        if (index === img_index) {
                            if (img_index === this.capturedImagesFromVuex.length - 1) {
                                nextImage = {
                                    ...this.capturedImagesFromVuex[img_index - 1],
                                    array_index: img_index - 1,
                                };
                            } else {
                                nextImage = {
                                    ...this.capturedImagesFromVuex[img_index + 1],
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

                this.SET_CAPTURED_IMAGES_IN_VUEX([...filtered_images]);
            }
        },
    },
};
</script>
