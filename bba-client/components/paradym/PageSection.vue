<template>
  <section class="page-section" :id="slug">
    <component
      :is="sub ? 'h3' : 'h2'"
      class="v-heading"
      :class="sub ? 'text-h6 mb-2' : 'text-h5 mb-3'"
    >
      <a
        v-if="slug"
        :href="`#${slug}`"
        class="text-decoration-none text-right text-md-left"
      >
        #
      </a>
      {{ title }}
    </component>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: "PageSection",
  props: {
    title: String,
    sub: Boolean,
  },
  computed: {
    slug() {
      if (this.title) return this.title.replace(/\s+/g, "-").toLowerCase();
      else return null;
    },
  },
};
</script>

<style lang="scss">
.page-section {
  margin-bottom: 3rem;
}
.v-heading {
  display: inline-block;
  position: relative;
}
.v-heading > a {
  bottom: 0;
  display: inline-block;
  left: 0;
  margin: 0 -0.7em;
  position: absolute;
  right: 0;
  top: 0;
}
.v-heading > a:not(:hover):not(:focus) {
  opacity: 0;
}
</style>
