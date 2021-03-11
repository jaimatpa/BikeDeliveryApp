<template>
  <div class="list-input">
    <!-- Title -->
    <h3
      v-if="title"
      v-text="title"
      class="text-h6"
      :class="{ 'mb-2': items.length, 'ml-7': numbered && items.length }"
    />

    <!-- Header -->
    <v-row v-if="!mobile && items.length" class="list-input-header">
      <v-col
        v-for="(value, key, index) in fieldsAsObject"
        class="py-0"
        :key="`h-${key}`"
        :cols="ifExists(fieldsAsObject[key].cols)"
        :class="{
          'mr-12': index + 1 == numFields,
          'ml-7': index == 0 && numbered,
        }"
      >
        <p class="mb-0 pb-1">{{ capitalize(key) }}</p>
      </v-col>
    </v-row>

    <div class="d-flex flex-column">
      <!-- Items -->
      <v-row
        v-for="(item, itemIndex) in items"
        :key="`it-${itemIndex}`"
        class="list-input-item list-input-item--outlined"
        :class="{ 'list-input-item-mobile': mobile }"
      >
        <span v-if="numbered" class="list-input-number ml-4">
          {{ itemIndex + 1 }}.
        </span>
        <v-col
          v-for="(field, key) in fieldsAsObject"
          class="py-0"
          :key="`f-${key}`"
          :cols="mobile ? '12' : ifExists(fieldsAsObject[key].cols)"
        >
          <slot
            v-if="fieldsAsObject[key].hasOwnProperty('customInputId')"
            :name="`input${fieldsAsObject[key].customInputId}`"
            :value="items[itemIndex][key]"
            :index="itemIndex"
            :setValue="setValue"
          />
          <v-text-field
            v-else
            v-model="items[itemIndex][key]"
            class="v-input--no-underline pt-1"
            hide-details
            dense
            :disabled="disabled"
            placeholder="…"
            :prefix="mobile ? capitalize(key) + ':' : undefined"
          />
        </v-col>
        <v-btn
          icon
          @click="deleteItem(itemIndex)"
          class="mr-3"
          :disabled="disabled"
          ><v-icon>{{ deleteIcon }}</v-icon></v-btn
        >
      </v-row>

      <!-- Input -->
      <v-form
        ref="form"
        v-model="valid"
        v-show="!disabled"
        @submit.prevent
        :class="{ 'order-first': inputsOnTop }"
      >
        <v-row class="list-input-inputs">
          <v-col
            v-for="(value, key, index) in fieldsAsObject"
            :key="`in-${key}`"
            class="py-0"
            style="position: relative;"
            :cols="mobile ? '12' : ifExists(fieldsAsObject[key].cols)"
            :class="{
              'mr-12':
                index + 1 == numFields &&
                items.length && (!inputHasData || !valid),
              'ml-7': index == 0 && numbered,
            }"
          >
            <slot
              :name="`input${value.customInputId}`"
              :value="value.items"
              :index="index"
              :addItem="addItem"
              :setValue="setValue"
            />
            <template v-if="!value.hasOwnProperty('customInputId')">
              <v-autocomplete
                v-if="Array.isArray(value.type())"
                v-model="inputs[index]"
                :class="{
                  'list-input-input--required': ifExists(
                    fieldsAsObject[key].required
                  ),
                }"
                :items="value.items"
                :ref="'input' + index"
                class="list-input-input pt-0"
                hide-details="auto"
                @keydown.enter="addItem(index)"
              />
              <v-text-field
                v-else-if="
                  value.type == Number ||
                    value.type == String ||
                    value.type == Date
                "
                v-model="inputs[index]"
                :ref="'input' + index"
                class="list-input-input pt-0"
                :class="{
                  'list-input-input--required': ifExists(
                    fieldsAsObject[key].required
                  ),
                }"
                hide-details="auto"
                validate-on-blur
                :disabled="disabled"
                :placeholder="items.length && !mobile ? '' : capitalize(key)"
                :type="
                  typeof value == 'object'
                    ? value.type == Number
                      ? 'number'
                      : ''
                    : value == Number
                    ? 'number'
                    : ''
                "
                :rules="
                  typeof value == 'object' &&
                  value.hasOwnProperty('required') &&
                  value.required
                    ? required
                    : undefined
                "
                @keydown.enter="addItem(index)"
                @blur="$refs.form.resetValidation()"
              />
            </template>
          </v-col>
          <v-btn
            icon
            v-if="inputHasData && valid"
            @click="addItem()"
            color="primary"
            class="mr-3"
            :disabled="disabled"
            ><v-icon>{{ addIcon }}</v-icon></v-btn
          >
        </v-row>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListInput",
  props: {
    title: {
      type: String,
      default: "",
    },
    fields: {
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    disabled: Boolean,
    numbered: Boolean,
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    deleteIcon: {
      type: String,
      default: "mdi-minus",
    },
    addIcon: {
      type: String,
      default: "mdi-check-bold",
    },
    breakpoint: [Number, String],
    inputsOnTop: Boolean,
    timestamp: Boolean,
  },
  mounted() {
    this.resetInput();
    if (
      Array.isArray(this.fields) &&
      this.fields.length == 0 &&
      this.value.length > 0
    ) {
      this.value.forEach((v) => {
        Object.keys(v).forEach((key) => {
          if (!this.fields.includes(key)) this.fields.push(key);
        });
      });
    }
    this.items = this.value;
  },
  data() {
    return {
      valid: false,
      inputs: [], // the values of each input
      items: [], // the added list items (an array of objects)
      required: [(v) => !!v || "Required"],
    };
  },
  watch: {
    value(newValue) {
      this.items = newValue;
    },
    items(newValue) {
      this.$emit("input", newValue);
    },
  },
  computed: {
    fieldsAsObject() {
      if (Array.isArray(this.fields)) {
        let fields = {};
        this.fields.forEach((field) => {
          fields[field] = { type: String };
        });
        return fields;
      } else if (typeof this.fields == "object") {
        let fields = {};
        Object.keys(this.fields).forEach((key) => {
          if (Array.isArray(this.fields[key])) {
            fields[key] = {
              type: Array,
              items: this.fields[key],
            };
          } else if (typeof this.fields[key] == "object")
            fields[key] = this.fields[key];
          else fields[key] = { type: this.fields[key] };
        });
        return fields;
      } else return {};
    },
    fieldsAsArray() {
      if (Array.isArray(this.fields)) return this.fields;
      else if (typeof this.fields == "object") {
        let fields = [];
        Object.keys(this.fields).forEach((key) => {
          fields.push(key);
        });
        return fields;
      } else return [];
    },
    numFields() {
      return this.fieldsAsArray.length;
    },
    mobile() {
      return this.$vuetify.breakpoint.xs;
    },
    inputHasData() {
      console.log("updating input has data");
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i] != "") return true;
      }
      return false;
    },
  },
  methods: {
    setValue(value, index) {
      this.inputs[index] = value;
    },
    ifExists(item) {
      return item ? item : undefined;
    },
    capitalize(text) {
      return text.charAt(0).toUpperCase() + text.substr(1);
    },
    isRequired(item) {
      if (item.hasOwnProperty("required") && item.required) return true;
      else return false;
    },
    resetInput() {
      let inputs = [];
      Object.keys(this.fieldsAsObject).forEach((key) => {
        if (this.fieldsAsObject[key].hasOwnProperty("default"))
          inputs.push(this.fieldsAsObject[key].default);
        else inputs.push("");
      });
      this.inputs = inputs;
      if (this.$refs.input0) this.$refs.input0[0].focus();
    },
    deleteItem(index) {
      this.items.splice(index, 1);
    },
    async addItem(index) {
      console.log("additem");
      console.log(index);
      await this.$refs.form.validate();
      if (this.valid) {
        console.log("valid");
        // Add the item
        let newItem = {};
        for (let i = 0; i < this.inputs.length; i++)
          newItem[this.fieldsAsArray[i]] = this.inputs[i];
        if (this.inputHasData) {
          console.log("input has data");
          this.items.push(newItem);
          this.resetInput();
          this.$refs.form.resetValidation();
        }
      } else {
        // Get the first missing required field and focus it
        let keys = Object.keys(this.fieldsAsObject);
        let isRequired = this.isRequired(this.fieldsAsObject[keys[index]]);
        if ((isRequired && this.inputs[index]) || !isRequired) {
          for (let i = 0; i < keys.length; i++) {
            if (
              this.isRequired(this.fieldsAsObject[keys[i]]) &&
              !this.inputs[i]
            ) {
              this.$refs["input" + index][0].blur();
              this.$refs["input" + i][0].focus();
              break;
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
/* List Header */
.list-input-header {
  p {
    border-bottom: 1px solid;
    border-bottom-color: rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.6);
  }
}
.theme--dark .list-input-header {
  border-bottom-color: rgba(255, 255, 255, 0.2);
  p {
    color: rgba(255, 255, 255, 0.6);
  }
}

/* Helper classes */
.v-input--no-underline {
  & > .v-input__control > .v-input__slot:before {
    content: none;
  }
}

/* Inputs */
.list-input-item .v-text-field__prefix {
  font-weight: 700;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 4px;
  text-align: right;
}
.list-input-item--mobile {
  border-bottom: 1px solid;
  padding-bottom: 8px;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
}
.list-input-item--outlined .col > * {
  border-bottom: thin dotted rgba(0, 0, 0, 0.12);
}

/* Required input indicator */
.list-input-input--required {
  &:not(.v-input--is-dirty) {
    &::after {
      position: absolute;
      top: 2px;
      right: 12px;

      content: "*";
      color: rgba(0, 0, 0, 0.5);
    }
  }
}

/* List numbers */
.list-input-number {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 500;
  padding-top: 12px;
}
.theme--dark .list-input-number {
  color: rgba(255, 255, 255, 0.6);
}
</style>
