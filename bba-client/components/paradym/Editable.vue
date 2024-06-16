<!-- Paradym Component
  Name:     Editable
  Version:  0.1
-->

<template>
  <component
    ref="editable"
    :is="type"
    :contenteditable="!disabled"
    class="editable"
    :class="{
      'editable-placeholder': !isFocused && !text,
      'editable-is-focused': isFocused,
      'editable-outlined': outlined,
      'editable-underlined': underlined,
    }"
    :style="styles"
    v-html="
      isFocused || text ? (multiline ? multilineText : text) : placeholder
    "
    @focus="onFocus"
    @blur="onBlur"
    @keydown.enter="onEnter"
  />
</template>

<script>
export default {
  name: "Editable",
  props: {
    type: {
      type: String,
      default: "p",
    },
    value: String,
    placeholder: String,
    editColor: String,
    width: [Number, String],
    "max-width": [Number, String],
    multiline: Boolean,
    disabled: Boolean,
    outlined: Boolean,
    underlined: Boolean,
  },
  created() {
    this.text = this.value;
  },
  data() {
    return {
      text: "",
      isFocused: false,
    };
  },
  computed: {
    styles() {
      let result = {
        color: this.isFocused ? this.editColor + " !important" : "",
        width: this.computedWidth,
        maxWidth: this.computedMaxWidth,
      };
      return result;
    },
    multilineText() {
      if (this.text) return this.text.replace(/\n/g, "<br>");
      else return "";
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
  watch: {
    value(newValue) {
      this.text = newValue;
    },
  },
  methods: {
    /* Events */
    onFocus(e) {
      this.isFocused = true;
      this.$emit("focus");
    },
    onBlur(e) {
      this.updateText(e.target.innerText);
      this.isFocused = false;
      this.$emit("blur");
    },
    /* Methods */
    updateText(text) {
      this.text = text;
      this.$emit("input", text);
    },
    onEnter(e) {
      if (!this.multiline || e.shiftKey) this.$refs.editable.blur();
    },
  },
};
</script>

<style lang="scss">
.editable {
  display: block;
  width: 100%;
  margin-bottom: 0;
  overflow: hidden;
  border-color: rgba(0, 0, 0, 0.38);
  &:focus {
    outline: none;
  }
}
.editable-placeholder {
  font-style: italic;
  padding-right: 1px;
  color: rgba(0, 0, 0, 0.35);
}
.editable-outlined {
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  padding: 8px 12px;
}
.editable-underlined {
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.theme--dark .editable {
  border-color: hsla(0, 0%, 100%, 0.7);
}
.theme--dark .editable-placeholder {
  color: hsla(0, 0%, 100%, 0.55);
}
</style>
