<!-- Paradym Component
  Name:     Dropzone
  Version:  0.1
-->

<template>
  <div>
    <div
      ref="dropzone"
      class="dropzone text-center pa-4 mb-2"
      @drop="drop"
      @dragover.prevent="active = true"
      @dragenter="active = true"
      @dragleave="active = false"
      :style="{
        'border-color': active ? primaryColor : '',
        'background-color': active ? `${primaryColor}10` : '',
      }"
    >
      <v-icon size="72" :color="active ? 'primary' : undefined"
        >mdi-folder-open-outline</v-icon
      >
      <h1 class="text-h6">{{ label }}</h1>
      <p class="mb-2">or</p>
      <!-- Upload Button -->
      <v-btn @click="$refs.fileinput.click()" color="secondary" class="mb-4">
        Browse files
      </v-btn>
    </div>
    <!-- Hidden File Input -->
    <input
      ref="fileinput"
      type="file"
      :multiple="multiple"
      @input="input"
      style="display: none;"
      :accept="accept"
    />
  </div>
</template>

<script>
export default {
  name: "Dropzone",
  props: {
    files: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: "Drag and drop your files here",
    },
    accept: String,
    multiple: Boolean,
  },
  data() {
    return {
      matchAnything: /.*/,
      active: false,
      filesAdded: [],
    };
  },
  watch: {
    filesAdded(newFiles) {
      this.$emit("update:files", newFiles);
    },
  },
  computed: {
    primaryColor() {
      return this.$vuetify.theme.dark
        ? this.$vuetify.theme.themes.dark.primary
        : this.$vuetify.theme.themes.light.primary;
    },
    validTypes() {
      if (this.validatedAccept) {
        return {
          extensions: this.validatedAccept.extensions
            .map((ext) => ext.replace(/(\W)/g, "\\$1")) // Escape all potential regex tokens
            .map((rgxstr) => new RegExp(`${rgxstr}$`, "i")), // Transform into regex to look for extension
          mimetypes: this.validatedAccept.mimetypes
            .map((mt) => mt.replace(/([\-\+\/])/g, "\\$1")) // Escape special characters
            .map((mt) => mt.replace(/\*/g, "(?:[A-Za-z0-9\\-\\+]*)*")) // Enable wildcards
            .map((rgxstr) => new RegExp(`^${rgxstr}$`)), // Transform into regex
        };
      } else {
        return {
          extensions: [this.matchAnything],
          mimetypes: [this.matchAnything],
        };
      }
    },
    validatedAccept() {
      if (this.accept) {
        return {
          extensions: this.accept
            .split(",")
            .filter((type) => type.match(/^\.(?!.*\/)/)), // Get only extension filters
          mimetypes: this.accept
            .split(",")
            .filter((type) =>
              type.match(
                /^(?:(?:[A-Za-z0-9\-\+]*)|\*)\/(?:(?:[A-Za-z0-9\-\+]*)|\*)$/
              )
            ), // Get only mimetype filters
        };
      } else {
        return null;
      }
    },
  },
  methods: {
    removeFilesWithName(name) {
      this.filesAdded
        .filter((currFile) => currFile.name === name) // find
        .forEach((fileToRemove) =>
          this.filesAdded.splice(this.filesAdded.indexOf(fileToRemove), 1)
        ); // remove
    },
    fileIsValid(file) {
      let isValid =
        this.validTypes.extensions.reduce(
          (prev, regex) => prev || !!file.name.match(regex),
          false
        ) ||
        this.validTypes.mimetypes.reduce(
          (prev, regex) => prev || !!file.type.match(regex),
          false
        );
      return isValid;
    },
    input() {
      const files = this.$refs.fileinput.files
        ? this.$refs.fileinput.files
        : [];
      for (let i = 0; i < files.length; i++) {
        if (this.fileIsValid(files[i])) {
          if (!this.multiple) this.filesAdded.splice(0, this.filesAdded.length); // clear files
          //else
          //  this.removeFilesWithName(files[i].name)
          this.filesAdded.push(files[i]);
          this.$emit("update:files", this.filesAdded);
        }
      }
      this.$refs.fileinput.value = "";
    },
    /** Validates and keeps track of dropped content */
    drop(e) {
      this.active = false;
      e.preventDefault(); // Keep from leaving the page
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === "file") {
            const file = e.dataTransfer.items[i].getAsFile();
            if (file && this.fileIsValid(file)) {
              if (!this.multiple)
                this.filesAdded.splice(0, this.filesAdded.length); // clear files
              this.filesAdded.push(file);
              this.$emit("update:files", this.filesAdded);
            } else continue;
          }
        }
      }
    },
    /** Removes attachment per user's request */
    remove(file) {
      const arr = this.filesAdded;
      arr.splice(arr.indexOf(file), 1);
      this.$emit("update", null);
    },
  },
  watch: {
    multiple(val) {
      if (!val) {
        this.filesAdded.splice(0, this.filesAdded.length - 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropzone {
  border-radius: 8px;
  * {
    pointer-events: none;
  }
  .v-btn {
    pointer-events: all;
  }
  &.dropzone-active {
    background-color: red;
  }
}
.theme--dark .dropzone {
  border: 2px dashed hsla(0, 0%, 100%, 0.2);
}
.theme--light .dropzone {
  border: 2px dashed hsla(0, 0%, 0%, 0.2);
}
</style>
