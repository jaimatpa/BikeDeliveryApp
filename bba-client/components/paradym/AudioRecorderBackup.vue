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
    <div v-if="loading">
      Loading audio... Please wait
    </div>

    <!-- Waveform -->
    <div id="waveform" class="mb-2" style="position: relative;" />

    <!-- Buttons -->
    <div
      v-if="!hideButtons && !loading"
      class="d-flex align-center justify-center"
      :class="{ 'mt-4': !startedRecording }"
    >
      <!-- Button: Start Recording -->
      <v-btn large v-if="!startedRecording" depressed @click="startRecording">
        <v-icon class="mr-1">mdi-microphone</v-icon> Start Recording
      </v-btn>

      <template v-if="startedRecording">
        <!-- Button: Delete -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="finishedRecording"
              @click="showConfirmDeleteDialog"
              fab
              small
              color="secondary"
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
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="!finishedRecording"
              :color="!isPaused ? 'primary' : ''"
              @click="showConfirmStopRecording = true"
              fab
              :small="isPaused"
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
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="!finishedRecording"
              :color="isPaused ? 'secondary' : ''"
              @click="pauseResumeRecording"
              class="mr-2"
              fab
              :small="!isPaused"
              v-bind="attrs"
              v-on="on"
            >
              <template v-if="isPaused"
                ><v-icon v-if="isPaused">mdi-record</v-icon></template
              >
              <template v-else><v-icon>mdi-pause</v-icon></template>
            </v-btn>
          </template>
          <span v-if="isPaused">Resume Recording</span>
          <span v-else="isPaused">Pause Recording</span>
        </v-tooltip>

        <!-- Button: Play/Pause -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="finishedRecording || isPaused"
              @click="playPause"
              fab
              :small="!finishedRecording"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-play-pause</v-icon>
            </v-btn>
          </template>
          <span>Play/Pause</span>
        </v-tooltip>

        <!-- Button: Resume Finished -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="finishedRecording"
              color="secondary"
              @click="resumeFinishedRecording"
              class="ml-2"
              fab
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-record</v-icon>
            </v-btn>
          </template>
          <span>Resume Recording</span>
        </v-tooltip>
      </template>
    </div>

    <!-- Oscilloscope -->
    <AudioOscilloscope
      v-show="startedRecording && !finishedRecording && !isPaused"
      v-if="inputStream"
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

//import { mapMutations } from 'vuex'
let WaveSurfer, CursorPlugin;

if (process.browser) {
  WaveSurfer = require("wavesurfer.js");
  CursorPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.cursor.js");
}
export default {
  name: "AudioRecorder",
  components: { AudioOscilloscope, ModalConfirm },
  props: {
    load: String,
    hideButtons: Boolean,
  },
  async mounted() {
    this.setupWavesurfer();
    if (this.load) await this.loadURL(this.load);
  },
  beforeDestroy() {
    if (this.mediaRecorder && this.mediaRecorder.state != "inactive")
      this.mediaRecorder.stop();
    if (this.inputStream) {
      this.inputStream.getTracks().forEach((track) => track.stop());
    }
    this.wavesurfer.destroy();
  },
  data() {
    return {
      state: "inactive", // ['inactive', 'recording', 'paused']
      playing: false,
      wavesurfer: null,
      mediaRecorder: null,
      inputStream: null,
      chunks: [],
      audioURL: null,
      completedBlob: null,
      // Dialogs
      showConfirmStopRecording: false,
      showConfirmDelete: false,
      // Statuses
      startedRecording: false,
      finishedRecording: false,
      isPaused: false,
      isInteractive: true,
      loading: false,
    };
  },
  computed: {
    isRecording() {
      if (this.startedRecording && !this.finishedRecording && !this.isPaused)
        return true;
      else return false;
    },
  },
  methods: {
    setState(state) {
      this.state = state;
      this.$emit("state", state);
    },
    async loadURL(url) {
      this.loading = true;
      let response = await this.$axios
        .get(url, {
          responseType: "blob",
          timeout: 30000,
        })
        .then((response) => {
          this.startedRecording = true;
          this.finishedRecording = true;
          this.chunks.push(response.data);
          const blob = new Blob(this.chunks, {
            type: "audio/ogg; codecs=opus",
          });
          this.wavesurfer.loadBlob(blob);
        })
        .catch((err) => {});
      this.loading = false;
    },
    async setupRecording() {
      // Check for media support & get permission
      if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true };
        await navigator.mediaDevices
          .getUserMedia(constraints)
          .then(this.onGetInputStream)
          .catch((err) => {
            console.log(err.name + ": " + err.message);
          });
      }
    },
    setupWavesurfer() {
      this.wavesurfer = WaveSurfer.create({
        container: "#waveform",
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
      this.wavesurfer.on("finish", this.onWavesurferFinish);
      this.wavesurfer.on("pause", this.onWavesurferPause);
    },
    showConfirmDeleteDialog() {
      this.showConfirmDelete = true;
    },
    toggleInteraction() {
      this.wavesurfer.toggleInteraction();
      this.isInteractive = !this.isInteractive;
    },
    getCurrentTime() {
      return this.wavesurfer.getDuration();
    },
    seekTo(seconds) {
      if (this.finishedRecording || this.isPaused) {
        this.wavesurfer.setCurrentTime(seconds);
        if (!this.isPaused) this.wavesurfer.playPause();
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

    // Button methods
    startOver() {
      this.chunks = [];
      this.showConfirmDelete = false;
      this.startedRecording = false;
      this.finishedRecording = false;
      this.isPaused = false;
      this.wavesurfer.empty();
      this.$emit("delete");
    },
    playPause() {
      this.wavesurfer.playPause();
    },
    async startRecording() {
      await this.setupRecording();
      this.mediaRecorder.start(1000);
    },
    pauseResumeRecording() {
      if (this.state == "recording") this.mediaRecorder.pause();
      else this.mediaRecorder.resume();
      this.setState(this.mediaRecorder.state);
    },
    stopRecording() {
      const tracks = this.inputStream.getAudioTracks();
      tracks[0].stop();
      this.showConfirmStopRecording = false;
      if (this.mediaRecorder.state != "inactive") this.mediaRecorder.stop();
      this.setState(this.mediaRecorder.state);
    },
    resumeFinishedRecording() {
      this.finishedRecording = false;
      this.startRecording();
    },

    // MediaRecorder Events
    onRecordDataAvailable(e) {
      if (e.data.size > 0) this.chunks.push(e.data);
      const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
      this.wavesurfer.loadBlob(blob);
    },
    onRecordStart(e) {
      this.startedRecording = true;
      this.setState("recording");
      if (this.isInteractive) this.toggleInteraction();
    },
    onRecordStop(e) {
      if (!this.isInteractive) this.toggleInteraction();
      this.isPaused = false;
      this.finishedRecording = true;
      //this.setState('inactive')
      this.completedBlob = new Blob(this.chunks, {
        type: "audio/ogg; codecs=opus",
      });
      this.audioURL = window.URL.createObjectURL(this.completedBlob);
      this.wavesurfer.load(this.audioURL);
      this.setState(this.mediaRecorder.state);
    },
    onRecordPause() {
      this.isPaused = true;
      //this.setState('paused')
      if (!this.isInteractive) this.toggleInteraction();
    },
    onRecordResume() {
      this.isPaused = false;
      //this.setState('recording')
      if (this.isInteractive) this.toggleInteraction();
    },
    onRecordError(e) {
      console.log("MediaRecorder Error: ", { e });
    },

    // Wavesurfer Events
    onWavesurferReady() {
      if (this.completedBlob) {
        this.$emit("done", {
          blob: this.completedBlob,
          duration: this.wavesurfer.getDuration(),
        });
        this.completedBlob = null;
      }
    },
    onWavesurferPlay() {
      this.playing = true;
    },
    onWavesurferFinish() {
      this.playing = false;
    },
    onWavesurferPause() {
      this.playing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#startRecordMessage {
  height: 64px;
  line-height: 64px;
  margin-bottom: 8px;
  text-align: center;
  font-size: 12px;
}
</style>
