<!-- Paradym Component
  Name:     Field
  Version:  0.1
-->

<template>
  <div
    class="field"
    :class="{ 'is-clickable': hasSlotContent }"
    @click="$emit('click')"
    :style="{
      cursor: cursor,
      width: computedWidth,
      maxWidth: computedMaxWidth,
    }"
  >
    <div class="d-flex align-start justify-space-between">
      <h3 class="overline mr-4" v-if="label" v-html="label" />
      <slot v-if="hasSlotContent"></slot>
      <p
        v-else
        v-html="value ? value : placeholder"
        :class="{ placeholder: !value }"
      />
    </div>
    <v-divider />
  </div>
</template>

<script>
export default {
  name: "Field",
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: String,
    label: String,
    cursor: {
      type: String,
      default: "inherit",
    },
    width: [Number, String],
    "max-width": [Number, String],
  },
  computed: {
    hasSlotContent() {
      return !!this.$slots.default;
    },
    multilineText() {
      return this.value.replace(/\n/g, "<br>");
    },
    computedWidth() {
      if (!isNaN(this.width)) return this.width + "px";
      else return this.width;
    },
    computedMaxWidth() {
      if (!isNaN(this.maxWidth)) return this.maxWidth + "px";
      else return this.maxWidth;
    },
  },
};
</script>

<style lang="scss">
.field {
  h3.overline {
    color: #666;
    font-size: 0.6875rem !important;
    letter-spacing: 0.07272727em !important;
    line-height: 1.5;
  }
  p {
    font-size: 0.875rem;
    margin-bottom: 0;
  }
}
.field {
  & > div {
    padding: 6px 0;
  }
  h3.overline {
    cursor: default;
    color: #666;
    font-size: 0.6875rem !important;
    letter-spacing: 0.07272727em !important;
    line-height: 17.5px;
    margin-bottom: -2px;
    margin-right: 8px;
  }
  p {
    font-size: 0.875rem;
    line-height: 1.25;
  }
}
.field {
  p {
    text-align: right;
  }
  .v-text-field__slot input {
    padding: 0;
    line-height: 1;
  }
  .v-text-field .v-input__append-inner {
    margin-top: 0;
  }
  .v-input__icon {
    width: 16px;
    height: 16px;
    min-width: 16px;
  }
  .v-icon.v-icon {
    font-size: 16px;
  }
  input {
    text-align: right;
  }
  .v-input,
  p {
    font-size: 0.875rem !important;
  }
  .v-select__selections input {
    padding: 0;
    line-height: 1.25;
  }
  .v-select__selection {
    margin: 0;
    text-align: right;
    width: 100%;
    position: relative;
    right: -10px;
    line-height: 1.25;
  }
  .v-text-field .v-input__append-inner {
    display: none;
  }
}

.field.is-clickable:hover {
  p.editable:not(:focus),
  a,
  input {
    color: blue !important;
  }
}
</style>
