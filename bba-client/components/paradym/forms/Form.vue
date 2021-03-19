<!-- Paradym Component
  Name:     Form
  Version:  0.2
-->

<template>
  <v-sheet
    class="form pa-4"
    rounded
    outlined
    :class="{
      'form-outlined': isMobile ? '' : outlined,
      'elevation-2': elevated,
    }"
    :style="{ width: computedWidth }"
  >
    <v-form
      ref="form"
      v-model="valid"
      :disabled="disabled"
      @submit.prevent="formAction"
    >
      <!-- Busy Indicator -->
      <v-progress-linear
        v-if="busy && outlined"
        indeterminate
        class="mt-n4 mx-n4 mb-4"
        :style="outlined ? 'width: calc(100% + 32px);' : ''"
      />

      <!-- Slot: Header -->
      <slot name="header">
        <div
          v-if="logo || title || text"
          class="mt-2"
          :class="{ 'mb-8': logo && !title, 'mb-12': title }"
        >
          <!-- Logo Left Line -->
          <div class="icon-line-1"></div>
          <div class="icon-line-2"></div>
          <div class="icon-line-3"></div>
          <div class="icon-line-4"></div>

          <!-- Logo -->
          <img
            v-if="logo"
            :src="logo"
            class="mx-auto"
            :class="{ 'mb-1': title }"
            :width="logoWidth"
            :height="logoHeight"
          />
          <!-- Title -->
          <h2 v-if="title" class="form-title" v-html="title" />
          <!-- Text -->
          <p v-if="text" class="form-text mt-4" v-html="text" />
        </div>
      </slot>

      <!-- Slot: Default -->
      <slot></slot>

      <!-- Error -->
      <v-alert v-if="error" type="error" dense text dismissible>
        {{ error }}
      </v-alert>

      <!-- Slot: BeforeSubmit -->
      <slot name="beforeSubmit"></slot>

      <!-- Slot: Buttons -->
      <slot name="buttons">
        <div
          class="d-flex justify-end"
          :class="{ 'mb-2': hasFooterContent }"
          style="max-width: 100%;"
        >
          <v-btn
            v-if="hasCancelListener"
            class="flex-grow-1 mr-2 mb-2"
            large
            depressed
            :disabled="disabled || busy"
            @click="$emit('cancel')"
            >Cancel</v-btn
          >
          <v-btn
            class="flex-grow-1 mb-2"
            :class="{ 'ml-2': hasCancelListener }"
            large
            depressed
            type="submit"
            color="primary"
            :disabled="disabled || busy"
            :loading="busy && !outlined"
            >{{ buttonText }}</v-btn
          >
        </div>
      </slot>

      <!-- Slot: Footer -->
      <slot name="footer"></slot>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
  name: "Form",
  props: {
    title: String,
    text: String,
    logo: String,
    outlined: Boolean,
    elevated: Boolean,
    width: [Number, String],
    logoWidth: [Number, String],
    logoHeight: [Number, String],
    buttonText: {
      type: String,
      default: "Submit",
    },
    breakpoint: {
      type: Number,
      default: 640,
    },
    error: String,
    disabled: Boolean,
    busy: Boolean,
  },
  mounted() {
    this.mounted = true;
  },
  data() {
    return {
      mounted: false,
      valid: false,
    };
  },
  computed: {
    computedWidth() {
      if (this.mounted && this.$vuetify.breakpoint.xsOnly) return "100%";
      else if (!isNaN(this.width)) return this.width + "px";
      else return this.width;
    },
    hasCancelListener() {
      return !!(this.$listeners && this.$listeners.cancel);
    },
    hasFooterContent() {
      return !!this.$slots.footer;
    },
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  methods: {
    async formAction() {
      await this.$refs.form.validate();
      if (this.valid) {
        this.$emit("submit");
      }
    },
  },
};
</script>

<style lang="scss">
.form {
  max-width: 100%;
  min-width: 200px;
  .v-alert {
    font-size: 15px;
  }
  .form-title {
    font-weight: 400;
    font-size: 26px;
    line-height: 1.2;
    margin-bottom: 8px;
    text-align: center;
    color: #4c9a2a;
  }
  .icon-line-1,
  .icon-line-2,
  .icon-line-3,
  .icon-line-4 {
    background-color: #4c9a2a;
    border-radius: 50px;
    height: 3px;
    position: relative;
  }
  .icon-line-1 {
    width: 40px;
    top: 55px;
    left: 35px;
  }
  .icon-line-2 {
    width: 45px;
    top: 68px;
    left: 23px;
  }
  .icon-line-3 {
    width: 62px;
    top: 80px;
    left: 8px;
  }
  .icon-line-4 {
    width: 40px;
    top: 94px;
    left: 35px;
  }
}
.form-outlined {
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  padding: 24px 24px 18px 24px;
}
</style>
