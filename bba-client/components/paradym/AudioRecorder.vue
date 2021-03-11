<!--
  The AudioRecorder component is used to record an audio clip.  Initially, it simply
  displays a "Start Recording" button.  Once started, a visual of the recording
  is displayed as well as 2 buttons (Stop & Pause).  If paused, the pause button
  becomes a resume button and another button (Play/Pause) is shown to listen to
  the currently recorded audio.  When stopping, a confirmation dialog is displayed.

  Events:
    done(Blob) - fires when the recording has finished.  Contains the recorded data as a Blob object

  Example:
    <AudioRecorder />
-->

<template>
  <div class="audioRecorder">
    <!-- Loading -->
    <div v-if="loading">
      Loading audio... Please wait
    </div>

    <!-- Waveform -->
    <div
      v-show="inputStream || this.chunks.length"
      :id="'ws-' + this.id"
      class="mb-2"
      style="position: relative;"
    />

    <!-- Buttons -->
    <div
      v-if="!hideButtons"
      v-show="!loading"
      class="d-flex align-center justify-center"
    >
      <!-- Button: Start Recording -->
      <template v-if="!inputStream && !load">
        <slot name="startButton" :on="{ click: startRecording }">
          <v-btn large depressed @click="startRecording">
            <v-icon class="mr-1">mdi-microphone</v-icon> Start Recording
          </v-btn>
        </slot>
      </template>

      <template v-else>
        <!-- Button: Delete -->
        <v-tooltip bottom v-show="chunks.length && state == 'inactive'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="chunks.length && state == 'inactive'"
              @click="confirmDelete ? (showConfirmDelete = true) : startOver()"
              fab
              small
              dark
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>
          <span>Delete &amp; Start Over</span>
        </v-tooltip>

        <!-- Button: Stop -->
        <v-tooltip bottom v-show="state != 'inactive'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="state != 'inactive'"
              :color="playing ? 'primary' : 'secondary'"
              dark
              @click="
                confirmStop
                  ? (showConfirmStopRecording = true)
                  : stopRecording()
              "
              fab
              :small="state != 'recording'"
              class="mr-2"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>
          </template>
          <span>Stop Recording</span>
        </v-tooltip>

        <!-- Button: Record/Pause -->
        <v-tooltip bottom v-show="audioBlobURL ? resumeFinished : true">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="audioBlobURL ? resumeFinished : true"
              :color="state == 'recording' ? '' : 'secondary'"
              @click="pauseResumeRecording"
              class="mr-2"
              fab
              :small="!!audioBlobURL || state == 'recording'"
              v-bind="attrs"
              v-on="on"
            >
              <template v-if="state != 'recording'"
                ><v-icon>mdi-microphone</v-icon></template
              >
              <template v-else><v-icon>mdi-pause</v-icon></template>
            </v-btn>
          </template>
          <span v-if="state != 'recording' && !chunks.length"
            >Start Recording</span
          >
          <span v-else-if="state != 'recording'">Resume Recording</span>
          <span v-else>Pause Recording</span>
        </v-tooltip>

        <!-- Button: Play/Pause -->
        <v-tooltip bottom v-show="chunks.length && state != 'recording'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="chunks.length && state != 'recording'"
              @click="playPause"
              fab
              :small="!audioBlobURL && state != 'recording'"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-play-pause</v-icon>
            </v-btn>
          </template>
          <span>Play/Pause</span>
        </v-tooltip>
      </template>
    </div>

    <!-- Oscilloscope -->
    <AudioOscilloscope
      v-if="showInput && inputStream"
      v-show="state == 'recording'"
      :stream="inputStream"
      height="64"
      width="256"
    />

    <!-- Modals -->
    <ModalConfirm
      v-model="showConfirmStopRecording"
      @confirm="stopRecording"
      title="Finish Recording?"
      message="Are you sure you want to <strong>stop recording</strong> the meeting now?"
      confirmText="Yes"
      cancelText="No"
    />
    <ModalConfirm
      v-model="showConfirmDelete"
      @confirm="startOver"
      title="Delete Recording?"
      message="Are you sure you want to <strong>delete this recording</strong> and start over?"
      confirmText="Yes"
      cancelText="No"
    />
  </div>
</template>

<script>
import AudioOscilloscope from "./AudioOscilloscope";
import ModalConfirm from "./modals/ModalConfirm";

let WaveSurfer, CursorPlugin;
if (process.client) {
  WaveSurfer = require("wavesurfer.js");
  CursorPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.cursor.js");
}
export default {
  name: "AudioRecorder",
  components: { AudioOscilloscope, ModalConfirm },
  props: {
    id: {
      type: String,
      default: "audioRecorder",
    },
    load: String,
    initialize: Boolean,
    hideButtons: Boolean,
    autoStart: Boolean,
    confirmStop: Boolean,
    confirmDelete: Boolean,
    showInput: Boolean,
    resumeFinished: Boolean,
  },
  async mounted() {
    if (process.client) {
      this.setupWavesurfer();
      if (this.load) await this.loadURL(this.load);
    }
  },
  created() {
    if (process.client) {
      if (this.autoStart) this.startRecording();
      else if (this.initialize) this.setupRecording();
    }
  },
  beforeDestroy() {
    this.stopAudio();
    this.wavesurfer.destroy();
  },
  data() {
    return {
      wavesurfer: null, // the WaveSurfer object created in mounted()
      inputStream: null, // the MediaStream object created from calling setupRecording()
      mediaRecorder: null, // the MediaRecorder object created after calling setupRecording()
      chunks: [], // array of audio Blobs from onRecordDataAvailable() or loadURL()
      isInteractive: true, // if the WaveSurfer object has mouse interaction enabled
      audioBlob: null, // temporarily stores the recorded audio Blob created after recording has stopped.  Used when emitting the done() event
      audioBlobURL: null, // an object URL to the recorded audio Blob
      // Statuses
      state: "inactive", // the current state of the MediaRecorder object ('inactive', 'recording', or 'paused')
      playing: false, // if the WaveSurfer object is playing audio
      loading: false, // if loading audio from a URL via loadURL()
      // Dialogs
      showConfirmStopRecording: false,
      showConfirmDelete: false,
    };
  },
  methods: {
    toggleInteraction() {
      this.wavesurfer.toggleInteraction();
      this.isInteractive = !this.isInteractive;
    },

    // =============
    // Setting State
    // =============
    setState(state) {
      this.state = state;
      this.$emit("state", state);
    },

    // =============
    // Loading Audio
    // =============
    async loadURL(url) {
      this.loading = true;
      await this.$axios
        .get(url, { responseType: "blob", timeout: 30000 })
        .then((response) => {
          this.chunks.push(response.data);
          this.loadChunks();
        })
        .catch((err) => {
          console.log("Error loading audio: " + err.message, { err });
        });
      this.loading = false;
    },
    loadChunks() {
      this.wavesurfer.loadBlob(
        new Blob(this.chunks, { type: "audio/ogg; codecs=opus" })
      );
    },

    // ===========
    // Setup Media
    // ===========
    async setupRecording() {
      // Check for media support & get permission
      if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true };
        await navigator.mediaDevices
          .getUserMedia(constraints)
          .then(this.onGetInputStream)
          .catch((err) => {
            console.log("Error accessing recording device: " + err.message);
          });
      }
    },
    onGetInputStream(stream) {
      this.inputStream = stream;
      this.mediaRecorder = new MediaRecorder(this.inputStream);
      this.mediaRecorder.ondataavailable = this.onRecordDataAvailable;
      this.mediaRecorder.onstart = this.onRecordStart;
      this.mediaRecorder.onstop = this.onRecordStop;
      this.mediaRecorder.onpause = this.onRecordPause;
      this.mediaRecorder.onresume = this.onRecordResume;
      this.mediaRecorder.onerror = this.onRecordError;
    },
    setupWavesurfer() {
      this.wavesurfer = WaveSurfer.create({
        container: "#ws-" + this.id,
        height: 64,
        waveColor: "#DC3545",
        progressColor: "#0E4D80",
        responsive: true,
        hideScrollbar: true,
        pixelRatio: 1, // set to 1 for faster rendering
        //barWidth: 2,
        cursorWidth: 0,
        plugins: [
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              "background-color": "#000",
              color: "#fff",
              padding: "2px",
              "font-size": "10px",
            },
          }),
        ],
      });
      this.wavesurfer.on("ready", this.onWavesurferReady);
      this.wavesurfer.on("play", this.onWavesurferPlay);
      this.wavesurfer.on("pause", this.onWavesurferPause);
      this.wavesurfer.on("finish", this.onWavesurferFinish);
      this.wavesurfer.on("error", this.onWavesurferError);
    },
    stopAudio() {
      if (this.inputStream)
        this.inputStream.getTracks().forEach((track) => track.stop());
    },
    startOver() {
      this.chunks = [];
      this.showConfirmDelete = false;
      this.stopAudio();
      this.mediaRecorder = null;
      this.inputStream = null;
      this.audioBlobURL = null;
      this.wavesurfer.empty();
      this.$emit("delete");
    },

    // ===============
    // Primary methods
    // ===============
    playPause() {
      this.wavesurfer.playPause();
    },
    async startRecording() {
      if (!this.inputStream || !this.mediaRecorder) await this.setupRecording();
      this.mediaRecorder.start(1000);
    },
    pauseResumeRecording() {
      if (!this.inputStream || !this.mediaRecorder) this.startRecording();
      else {
        if (this.state == "recording") this.mediaRecorder.pause();
        else if (this.state == "paused") this.mediaRecorder.resume();
        else this.mediaRecorder.start(1000);
        this.setState(this.mediaRecorder.state);
      }
    },
    stopRecording() {
      this.showConfirmStopRecording = false;
      if (this.mediaRecorder && this.mediaRecorder.state != "inactive")
        this.mediaRecorder.stop();
      this.setState(this.mediaRecorder.state);
    },

    // ====================
    // MediaRecorder Events
    // ====================
    onRecordDataAvailable(e) {
      if (e.data.size > 0) this.chunks.push(e.data);
      this.loadChunks();
    },
    onRecordStart(e) {
      this.setState("recording");
      if (this.isInteractive) this.toggleInteraction();
    },
    onRecordStop(e) {
      if (!this.isInteractive) this.toggleInteraction();
      this.audioBlob = new Blob(this.chunks, {
        type: "audio/ogg; codecs=opus",
      });
      this.audioBlobURL = window.URL.createObjectURL(this.audioBlob);
      this.wavesurfer.load(this.audioBlobURL);
      if (!this.resumeFinished) this.stopAudio();
      this.setState(this.mediaRecorder.state);
    },
    onRecordPause() {
      this.setState("paused");
      if (!this.isInteractive) this.toggleInteraction();
    },
    onRecordResume() {
      this.setState("recording");
      if (this.isInteractive) this.toggleInteraction();
    },
    onRecordError(err) {
      console.log(
        "Error with MediaRecorder: " + err.name + " - " + err.message
      );
    },

    // =================
    // Wavesurfer Events
    // =================
    onWavesurferReady() {
      if (this.audioBlob) {
        this.$emit("done", {
          blob: this.audioBlob,
          duration: this.wavesurfer.getDuration(),
        });
        this.audioBlob = null;
      }
    },
    onWavesurferPlay() {
      this.playing = true;
    },
    onWavesurferPause() {
      this.playing = false;
    },
    onWavesurferFinish() {
      this.playing = false;
    },
    onWavesurferError(err) {
      console.log("Error with Wavesurfer: " + err);
    },
  },
};
</script>

<style lang="scss">
.audioRecorder {
  width: 100%;
}
</style>
