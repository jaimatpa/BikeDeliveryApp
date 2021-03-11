<!-- Paradym Component
  Name:     FileUploader
  Version:  0.1
-->

<template>
  <div>
    <!-- Dropzone -->
    <Dropzone :files.sync="files" multiple />

    <!-- Uploads in progress -->
    <h2 class="text-overline" v-if="uploads.length">Uploading</h2>
    <v-slide-x-transition group tag="div">
      <FileUploadProgress
        v-for="(upload, index) in uploads"
        :key="upload.key"
        class="mb-1"
        :filename="upload.file.name"
        :progress="upload.progress"
        :total="upload.total"
        :loaded="upload.loaded"
        :timeRemaining="timeRemaining(upload)"
        @remove="cancelUpload(upload)"
      />
    </v-slide-x-transition>
    <!-- Uploads in queue -->
    <h2 class="text-overline" v-if="files.length">Queued</h2>
    <v-slide-x-transition group tag="div">
      <FileUploadProgress
        v-for="(file, index) in files"
        :key="file.name + file.size"
        class="mb-1"
        :filename="file.name"
        :progress="0"
        :total="file.size"
        :loaded="0"
        @remove="removeFile(file)"
      />
    </v-slide-x-transition>
    <h2 class="text-overline" v-if="completed.length">Completed</h2>
    <!-- Uploads completed -->
    <v-slide-x-transition group tag="div">
      <FileUploadProgress
        v-for="(upload, index) in completed"
        :key="upload.key"
        class="mb-1"
        :filename="upload.file.name"
        :progress="100"
        :total="upload.total"
        :loaded="upload.loaded"
        @complete="completed.splice(index, 1)"
      />
    </v-slide-x-transition>
    <h2 class="text-overline" v-if="errored.length">Errored</h2>
    <!-- Uploads errored -->
    <v-slide-x-transition group tag="div">
      <FileUploadProgress
        v-for="(upload, index) in errored"
        :key="upload.key"
        class="mb-1"
        :filename="upload.file.name"
        :progress="upload.progress"
        :total="upload.total"
        @remove="removeErrored(index)"
        :loaded="upload.loaded"
        :error="upload.error || 'Unknown error'"
        @retry="retry(upload)"
      />
    </v-slide-x-transition>
  </div>
</template>

<script>
import Dropzone from "./Dropzone";
import FileUploadProgress from "./FileUploadProgress";

export default {
  name: "FileUploader",
  components: { Dropzone, FileUploadProgress },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    maxAtOnce: {
      type: Number,
      default: 3,
    },
  },
  mounted() {
    this.uploadTimer = setInterval(this.doUploads, 200);
  },
  beforeDestroy() {
    clearInterval(this.uploadTimer);
  },
  data() {
    return {
      files: [],
      uploads: [],
      completed: [],
      errored: [],
      uploadTimer: null,
    };
  },
  methods: {
    // Called continuously -> Moves files from "files" array to "uploads" array
    createUpload(file) {
      return {
        file: file,
        progress: -1,
        loaded: 0,
        total: file.size,
        cancel: undefined,
        progressEvents: [],
        key:
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15),
      };
    },
    doUploads() {
      while (this.files.length && this.uploads.length < this.maxAtOnce) {
        let splicedFile = this.files.splice(0, 1);
        let queueIndex = this.uploads.push(this.createUpload(splicedFile[0]));
        this.uploadFiles();
      }
    },
    // Uploads all files in "uploads" that are not already uploading
    async uploadFiles() {
      this.uploads.forEach((upload) => {
        if (upload.progress == -1) this.upload(upload);
      });
    },
    // Uploads an upload from the queue
    async upload(upload) {
      if (upload.progress == -1) upload.progress = 0;
      let formData = new FormData();
      formData.append("file", upload.file);
      upload.cancel = this.$axios.CancelToken.source();
      try {
        let result = await this.$axios.$post(this.endpoint, formData, {
          cancelToken: upload.cancel.token,
          onUploadProgress: function(progressEvent) {
            // Store the last 10 progress events
            upload.progressEvents.push({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              time: Date.now(),
            });
            upload.progressEvents = upload.progressEvents.splice(
              Math.max(upload.progressEvents.length - 10, 0)
            );

            upload.loaded = progressEvent.loaded;
            upload.total = progressEvent.total;
            upload.progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        });
        if (result.success) {
          upload.progress = 100;
          this.completed.push(upload);
          this.uploads.splice(this.uploads.indexOf(upload), 1);
        } else {
          this.errored.push(upload);
          this.uploads.splice(this.uploads.indexOf(upload), 1);
        }
      } catch (err) {
        upload.error = err.hasOwnProperty("response")
          ? err.response.data.message
          : err;
        this.errored.push(upload);
        this.uploads.splice(this.uploads.indexOf(upload), 1);
      }
    },
    // Cancels a running upload
    cancelUpload(upload) {
      upload.cancel.cancel("Upload canceled.");
      //this.uploads.splice(this.uploads.indexOf(upload), 1)
    },
    retry(upload) {
      if (this.uploads.length < this.maxAtOnce) {
        let queueIndex = this.uploads.push(this.createUpload(upload.file));
        this.uploadFiles();
      } else this.files.push(upload.file);
      this.errored.splice(this.errored.indexOf(upload), 1);
    },
    removeFile(file) {
      const arr = this.files;
      arr.splice(arr.indexOf(file), 1);
    },
    removeErrored(index) {
      this.errored.splice(index, 1);
    },
    timeRemaining(upload) {
      let steps = upload.progressEvents;
      if (steps.length > 1) {
        let totalLoaded = steps[steps.length - 1].loaded - steps[0].loaded;
        let timeElapsed = steps[steps.length - 1].time - steps[0].time;
        let uploadSpeed = totalLoaded / (timeElapsed / 1000);
        let timeRemaining = Math.round(
          (upload.total - upload.loaded) / uploadSpeed
        );
        let hours = Math.floor(timeRemaining / 60 / 60);
        let minutes = Math.floor(timeRemaining / 60) - hours * 60;
        let seconds = timeRemaining % 60;
        let finalTime = [];
        if (hours) finalTime.push(`${hours} hours`);
        if (minutes) finalTime.push(`${minutes} minutes`);
        if (seconds) finalTime.push(`${seconds} seconds`);
        return finalTime.join(", ");
        //return this.formatBytes(uploadSpeed, 0) + 'ps'
      }
    },
    formatBytes(bytes, decimals = 2, noType) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return (
        parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
        (noType ? "" : " " + sizes[i])
      );
    },
  },
};
</script>
