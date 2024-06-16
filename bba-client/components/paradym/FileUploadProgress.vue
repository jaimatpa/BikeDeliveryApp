<!-- Paradym Component
  Name:     FileUploadProgress
  Version:  0.1
-->

<template>
  <v-card
    class="file-upload-progress"
    flat
    outlined
    rounded
    :max-width="computedWidth"
  >
    <div
      class="d-flex pa-2"
      :style="
        `background: linear-gradient(90deg, #00000008 0 ${computedProgress}%, #00000000 ${computedProgress}% 100%) !important;`
      "
    >
      <!-- Icon -->
      <v-icon v-if="!hideIcon" size="64" class="mr-2">{{ icon }}</v-icon>

      <!-- Details -->
      <div class="flex-grow-1 d-flex flex-column justify-center">
        <div class="d-flex align-center">
          <!-- Filename -->
          <span class="font-weight-bold">{{ filename }}</span>
          <v-spacer />
          <!-- Status -->
          <div class="ml-4" style="line-height: 1.2;">
            <span
              v-if="error"
              class="error--text text-caption font-weight-bold"
              >{{ error }}</span
            >
            <span
              v-else-if="completed"
              class="success--text text-caption font-weight-bold"
              >Completed</span
            >
            <span v-else class="text-caption">{{ computedProgress }}%</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <v-progress-linear
          height="5"
          :color="error ? 'error' : uploading || completed ? 'primary' : 'grey'"
          rounded
          :value="computedProgress"
          class="mt-1 mb-2"
        />

        <!-- Bytes, Time Remaining -->
        <div
          v-if="uploading"
          class="d-flex text-caption"
          style="line-height: 1.2;"
        >
          <!-- Time Remaining -->
          <span v-if="timeRemaining">{{ timeRemaining }} remaining</span>
          <v-spacer />
          <span v-if="!completed && totalLoadedString" class="ml-4">{{
            totalLoadedString
          }}</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="d-flex align-center mx-2">
        <v-slide-y-transition leave-absolute>
          <v-btn
            v-if="error"
            fab
            elevation="0"
            x-small
            dark
            color="error"
            @click="$emit('retry')"
            class="ml-2"
            ><v-icon>mdi-reload</v-icon></v-btn
          >
        </v-slide-y-transition>
        <v-slide-y-transition leave-absolute>
          <v-btn
            v-if="completed"
            icon
            color="success"
            @click="$emit('complete')"
            class="ml-2"
            ><v-icon>mdi-check</v-icon></v-btn
          >
        </v-slide-y-transition>
        <v-slide-y-transition leave-absolute>
          <v-btn
            v-if="!completed"
            fab
            elevation="0"
            x-small
            @click="$emit('remove')"
            class="ml-2"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-slide-y-transition>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "FileUploadProgress",
  props: {
    filename: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: undefined,
    },
    total: {
      type: Number,
      required: true,
    },
    loaded: {
      type: Number,
      required: true,
    },
    error: {
      type: String,
      default: null,
    },
    timeRemaining: String,
    width: [Number, String],
    icon: {
      type: String,
      default: "mdi-file",
    },
    hideIcon: Boolean,
  },
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
  },
  computed: {
    computedWidth() {
      if (!isNaN(this.width)) return this.width + "px";
      else return this.width;
    },
    totalLoadedString() {
      if (this.loaded >= 0 && this.total > 0)
        return (
          this.formatBytes(this.loaded, 2) +
          " of " +
          this.formatBytes(this.total)
        );
      else return "";
    },
    computedProgress() {
      if (this.progress >= 0) return this.progress;
      else if (this.loaded >= 0 && this.total > 0)
        return Math.round((this.loaded * 100) / this.total);
    },
    completed() {
      if (
        !this.error &&
        ((this.total && this.loaded == this.total) ||
          (!this.total && this.progress == 100))
      )
        return true;
    },
    uploading() {
      if (
        !this.error &&
        !this.completed &&
        (this.loaded > 0 || this.progress > 0)
      )
        return true;
      else return false;
    },
  },
};
</script>

<style lang="scss">
.file-upload-progress {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}
</style>
