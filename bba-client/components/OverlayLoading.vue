<template>
  <div style="position: relative; width: 100%; height: 100%;" :class="[top ? 'loading-top' : '']" >
    <div v-show="active" class="loading-cover" :class="{'bg-white': !transparent && !this.$nuxt.$vuetify.theme.dark, 'bg-dark': !transparent && this.$nuxt.$vuetify.theme.dark }" :style="{ 'z-index': zIndex ? zIndex : 999 }">
      <p v-if="message" v-text="message"> </p>
      <v-progress-circular :size="40" indeterminate color="#F15D22"></v-progress-circular>
    </div>
    <slot></slot>
  </div>
</template>
<script>

export default {
  name: 'overlayLoading',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    message: String,
    transparent: Boolean,
    top: Boolean,
    zIndex: String
  },
}
</script>
