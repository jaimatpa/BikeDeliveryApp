<template>
<div class="qf-photo-capture" style="background:#262627;">
    <figure>
        <video ref="video" :width="width" :height="height" :src="source" :autoplay="autoplay" :playsinline="playsinline" />
    </figure>
    <v-btn v-if="cameras.length > 1" fab absolute bottom small dark color="rgba(0,0,0,0.25)" class="elevation-0" style="top: 16px; right: 16px;" @click="switchDevice()">
        <v-icon>mdi-camera-switch</v-icon>
    </v-btn>

    <div style="width: 100%; display:flex; justify-content:center;">
        <v-btn :style="'bottom: ' + iBottom + 'px;'" fab absolute bottom light class="elevation-0" @click="capture()">
            <v-icon>mdi-camera</v-icon>
        </v-btn>
    </div>

    <span @click="openFlash" id="open-flash" style="cursor:pointer; padding: 5px; position:absolute; bottom: 50%; right: 2%;" absolute bottom light class="elevation-0">
        <v-icon large color="white" v-if="flashIsOn === false">mdi-lightning-bolt-outline</v-icon>
        <v-icon large color="white" v-else>mdi-lightning-bolt</v-icon>
    </span>

    <v-btn color="primary" v-if="images.length > 0" absolute small class="elevation-0" style="bottom: 25px; right: 16px;" @click="handleArrowBtnClick">
        Next <v-icon>mdi-arrow-right</v-icon>
    </v-btn>

    <div style="top: 16px; position:absolute; width: 100%; display:flex; justify-content:center;">
        <span v-if="images.length > 0" class="white--text">
            <span> Photos Taken {{ images.length }} </span>
        </span>
    </div>
</div>
</template>

<script>
export default {
    name: "DynamicFormCapturePhoto",
    props: {
        images: {
            type: Array,
            default: [],
        },
        width: {
            type: [Number, String],
            default: "100%",
        },
        autoplay: {
            type: Boolean,
            default: true,
        },
        screenshotFormat: {
            type: String,
            default: "image/jpeg",
        },
        selectFirstDevice: {
            type: Boolean,
            default: false,
        },
        playsinline: {
            type: Boolean,
            default: true,
        },
        resolution: {
            type: Object,
            default: null,
            validator: (value) => {
                return value.height && value.width;
            },
        },
    },
    data() {
        return {
            height: "100%",

            flashIsOn: false,
            iBottom: 16,
            source: null,
            deviceId: null,
            canvas: null,
            camerasListEmitted: false,
            cameras: [],

            firstVideoTrack: null,
        };
    },
    watch: {
        deviceId: function (id) {
            this.changeCamera(id);
        },
    },
    mounted() {
        let agent = window.navigator.userAgent;
        if (agent.includes("iPhone") || agent.includes("Mac")) {
            this.iBottom = 60;
        } else if (
            agent.includes("Chrome") ||
            agent.includes("OPR") ||
            agent.includes("Firefox")
        ) {
            this.iBottom = 16;
        } else if (agent.includes("Safari")) {
            this.iBottom = 60;
        }
        this.setupMedia();
    },
    beforeDestroy() {
        this.stop();
    },
    methods: {
        handleArrowBtnClick() {
            this.$emit("cancel", {
                cross_btn_clicked: false,
                save_backup: true
            }); // another one is, 'capture'
        },
        /**
         * get user media
         */
        legacyGetUserMediaSupport() {
            return (constraints) => {
                // First get ahold of the legacy getUserMedia, if present
                let getUserMedia =
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia ||
                    navigator.oGetUserMedia;
                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(
                        new Error("getUserMedia is not implemented in this browser")
                    );
                }
                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        },
        /**
         * setup media
         */
        setupMedia() {
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
                //console.log('navigator.mediaDevices not found')
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
                //console.log('navigator.mediaDevices.getUserMedia not found.')
                navigator.mediaDevices.getUserMedia = this.legacyGetUserMediaSupport();
            }
            this.testMediaAccess();
            console.log("window.innerheight -----> ", window.innerHeight);
            this.height = window.innerHeight;
        },
        /**
         * load available cameras
         */
        loadCameras() {
            //console.log('Loading cameras')
            navigator.mediaDevices
                .enumerateDevices()
                .then((deviceInfos) => {
                    //console.log('deviceInfos length: ' + deviceInfos.length)
                    for (let i = 0; i !== deviceInfos.length; ++i) {
                        let deviceInfo = deviceInfos[i];
                        if (deviceInfo.kind === "videoinput") {
                            //console.log('Adding camera: ' + deviceInfo)
                            this.cameras.push(deviceInfo);
                        }
                    }
                })
                .then(() => {
                    //console.log('.then(()) => {')
                    if (!this.camerasListEmitted) {
                        if (this.selectFirstDevice && this.cameras.length > 0) {
                            this.deviceId = this.cameras[0].deviceId;
                        }
                        if (this.selectFirstDevice && this.cameras.length > 1) {
                            this.deviceId = this.cameras[1].deviceId;
                        }
                        //console.log('emitting cameras loaded event:')
                        //console.log(this.cameras)
                        this.$emit("cameras", this.cameras);
                        this.camerasListEmitted = true;
                    }
                })
                .catch((error) => this.$emit("notsupported", error));
        },
        /**
         * change to a different camera stream, like front and back camera on phones
         */
        changeCamera(deviceId) {
            this.stop();
            this.$emit("camera-change", deviceId);
            this.loadCamera(deviceId);
        },
        /**
         * load the stream to the
         */
        loadSrcStream(stream) {
            if ("srcObject" in this.$refs.video) {
                // new browsers api
                this.$refs.video.srcObject = stream;
            } else {
                // old broswers
                this.source = window.HTMLMediaElement.srcObject(stream);
            }

            // Emit video start/live event
            this.$refs.video.onloadedmetadata = () => {
                this.$emit("video-live", stream);
            };

            this.$emit("started", stream);
            this.firstVideoTrack = stream.getVideoTracks()[0];
            this.applyFlash(this.flashIsOn);
        },
        /**
         * stop the selected streamed video to change camera
         */
        stopStreamedVideo(videoElem) {
            let stream = videoElem.srcObject;
            let tracks = stream.getTracks();
            tracks.forEach((track) => {
                // stops the video track
                track.stop();
                this.$emit("stopped", stream);
                this.$refs.video.srcObject = null;
                this.source = null;
            });
        },
        // stop the video
        stop() {
            if (this.$refs.video !== null && this.$refs.video.srcObject) {
                this.stopStreamedVideo(this.$refs.video);
            }
        },
        // start the video
        start() {
            if (this.deviceId) {
                this.loadCamera(this.deviceId);
            }
        },
        // pause the video
        pause() {
            if (this.$refs.video !== null && this.$refs.video.srcObject) {
                this.$refs.video.pause();
            }
        },
        // resume the video
        resume() {
            if (this.$refs.video !== null && this.$refs.video.srcObject) {
                this.$refs.video.play();
            }
        },
        /**
         * test access
         */
        testMediaAccess() {
            //console.log('Testing media access.')
            let constraints = {
                video: true,
            };
            if (this.resolution) {
                constraints.video = {};
                constraints.video.height = this.resolution.height;
                constraints.video.width = this.resolution.width;
            }
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    //Make sure to stop this MediaStream
                    //console.log('Stopping tracks')
                    let tracks = stream.getTracks();
                    tracks.forEach((track) => {
                        track.stop();
                    });

                    this.loadCameras();
                })
                .catch((error) => this.$emit("error", error));
        },
        /**
         * load the camera passed as index!
         */
        loadCamera(device) {
            let constraints = {
                video: {
                    deviceId: {
                        exact: device,
                    },
                },
            };
            if (this.resolution) {
                constraints.video.height = this.resolution.height;
                constraints.video.width = this.resolution.width;
            }
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => this.loadSrcStream(stream))
                .catch((error) => this.$emit("error", error));
        },
        /**
         * capture screenshot
         */
        capture() {
            let canvas = this.getCanvas();
            this.$emit("onCapture", canvas);
        },

        async applyFlash(flash_is_on) {
            if (this.firstVideoTrack !== null) {
                const constraints = {
                    advanced: [{
                        torch: flash_is_on
                    }],
                };
                await this.firstVideoTrack.applyConstraints(constraints);
            } else {
                alert("First video track is null. \nLoading...");
            }
        },

        async openFlash() {
            this.flashIsOn = !this.flashIsOn;
            this.applyFlash(this.flashIsOn);
        },

        /**
         * get canvas
         */
        getCanvas() {
            let video = this.$refs.video;
            if (!this.ctx) {
                let canvas = document.createElement("canvas");
                //console.log('video width & height: ' + video.videoWidth + 'x' +video.videoHeight)
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                this.canvas = canvas;
                this.ctx = canvas.getContext("2d");
            }
            const {
                ctx,
                canvas
            } = this;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas;
        },
        switchDevice() {
            if (
                this.cameras[this.cameras.length - 1] &&
                this.deviceId != this.cameras[this.cameras.length - 1].deviceId
            ) {
                this.deviceId = this.cameras[this.cameras.length - 1].deviceId;
            } else if (this.cameras[1] && this.deviceId != this.cameras[1].deviceId) {
                this.deviceId = this.cameras[1].deviceId;
            } else if (this.cameras[0]) {
                this.deviceId = this.cameras[0].deviceId;
            }
        },
    },
};
</script>
