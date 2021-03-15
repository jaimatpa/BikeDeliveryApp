<!-- Paradym Component
  Name:     FormGenerator
  Version:  0.1
-->

<template>
  <Form
    class="form-generator"
    :outlined="outlined"
    :title="title"
    :width="width"
    :logo="logo"
    :busy="busy"
    :error="error"
    :disabled="disabled"
    :buttonText="buttonText"
    @submit="onSubmit"
    v-on="
      hasCancelListener
        ? {
            cancel: () => {
              $emit('cancel');
            },
          }
        : {}
    "
  >
    <!-- Slot: Default -->
    <slot></slot>

    <!-- Slot: BeforeSubmit -->
    <template v-slot:beforeSubmit>
      <slot name="beforeSubmit"></slot>
    </template>

    <div v-for="(field, index) in fieldsAsArray" :key="index">
      <!-- Strings -->
      <v-text-field
        v-if="field.type == String"
        v-model="inputData[field.name]"
        :maxlength="field.maxLength"
        :rules="getRules(field)"
        validate-on-blur
        :label="getLabel(field)"
        autocomplete="off"
        class="mb-4"
        outlined
        dense
        hide-details="auto"
      />
      <!-- Numbers -->
      <v-text-field
        v-if="field.type == Number || field.type == 'integer'"
        v-model="inputData[field.name]"
        :rules="getRules(field)"
        :label="getLabel(field)"
        autocomplete="off"
        class="mb-4"
        outlined
        dense
        hide-details="auto"
        validate-on-blur
        type="number"
        min="0"
        @keypress="isNumberKey($event, field.type == 'integer')"
      />
      <!-- Booleans -->
      <v-radio-group
        v-if="field.type == Boolean"
        v-model="inputData[field.name]"
        row
        :rules="getRules(field)"
      >
        <template v-slot:label>
          <div>{{ getLabel(field) }}</div>
        </template>
        <v-radio label="Yes" :value="true" />
        <v-radio label="No" :value="false" />
      </v-radio-group>
      <!-- Dates -->
      <DateInput
        v-if="field.type == Date"
        v-model="inputData[field.name]"
        :label="getLabel(field)"
        :required="field.required"
      />
      <!-- Text -->
      <v-textarea
        v-if="field.type == 'text'"
        v-model="inputData[field.name]"
        :label="getLabel(field)"
        :rules="getRules(field)"
        class="mb-4"
        outlined
        hide-details="auto"
        no-resize
        validate-on-blur
      />
      <!-- Time -->
      <!-- <TimeInput v-if="field.type == 'time'" v-model="inputData[index]" :label="field.name" /> -->
      <v-text-field
        v-if="field.type == 'time'"
        v-model="inputData[field.name]"
        :label="getLabel(field)"
        type="time"
        :rules="getRules(field)"
        outlined
        dense
        hide-details="auto"
        class="mb-4"
        clearable
        validate-on-blur
      />
    </div>

    <!-- Email Address -->
    <!-- <v-text-field v-model="email" label="Email address" autocomplete="off"
      class="mb-4" color="primary" validate-on-blur
      outlined dense hide-details="auto" :prepend-inner-icon="icons ? 'mdi-email' : ''"
      :rules="[rules.required, rules.email]" /> -->

    <!-- Slot: Footer -->
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </Form>
</template>

<script>
import Form from "./forms/Form";
import DateInput from "./DateInput";

export default {
  name: "FormGenerator",
  components: { Form, DateInput },
  props: {
    fields: [Array, Object],
    values: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // Base Form
    disabled: Boolean,
    busy: Boolean,
    title: String,
    logo: String,
    outlined: Boolean,
    width: [Number, String],
    buttonText: {
      type: String,
      default: "Submit",
    },
    error: String,
  },
  created() {},
  data() {
    return {
      inputData: this.values
        ? JSON.parse(JSON.stringify(this.values))
        : this.defaultInputData(),
      menuDate: false,
      // Rules
      rules: {
        required: (value) => value == false || !!value || "Required.",
        minLength: (value) =>
          (value && value.length >= 8) || "Min Length 8 Required.",
        email: (value) => {
          if (value == "" || value == null) return true;
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  watch: {
    values(newValue) {
      if (newValue) this.inputData = JSON.parse(JSON.stringify(newValue));
      else this.inputData = this.defaultInputData();
    },
  },
  computed: {
    hasCancelListener() {
      return !!(this.$listeners && this.$listeners.cancel);
    },
    fieldsAsArray() {
      if (Array.isArray(this.fields)) return this.fields;
      else {
        let result = [];
        for (let key in this.fields) {
          if (typeof this.fields[key] == "object") {
            let i = this.fields[key];
            i.name = key;
            result.push(i);
          } else result.push({ name: key, type: this.fields[key] });
        }
        return result;
      }
    },
  },
  methods: {
    defaultInputData() {
      let defaultData = {};

      // Fields as Array
      if (Array.isArray(this.fields)) {
        this.fields.forEach((field) => {
          defaultData[field.name] = field.default || null;
        });
        // Fields as Object
      } else {
        for (let key in this.fields) {
          defaultData[key] = this.fields[key].default || null;
        }
      }

      return defaultData;
    },
    getLabel(field) {
      return field.label ? field.label : field.name;
    },
    getRules(field) {
      let result = [];
      if (field.required) result.push(this.rules.required);
      if (field.minLength) result.push(this.rules.minLength);
      if (field.email) result.push(this.rules.email);
      return result;
    },
    onSubmit() {
      this.$emit("submit", this.generateOutputData());
    },
    generateOutputData() {
      let outputData = this.inputData || {};
      this.fieldsAsArray.forEach((field, index) => {
        if (field.type == "double")
          outputData[field.name] = parseFloat(outputData[field.name]);
        else if (field.type == Number)
          outputData[field.name] = parseFloat(outputData[field.name]);
        else if (field.type == "integer")
          outputData[field.name] = parseInt(outputData[field.name]);
      });
      return outputData;
    },
    isNumberKey(value, integerOnly) {
      let charCode = value.keyCode;
      if (integerOnly)
        if (!(charCode >= 48 && charCode <= 57)) {
          value.preventDefault();
        }
      if (charCode == 46 || charCode == 44) return true;
      if (charCode > 31 && (charCode < 48 || charCode > 57))
        value.preventDefault();
      return true;
    },
  },
};
</script>
