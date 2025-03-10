<!-- Paradym Component
  Name:     FormGenerator
  Version:  0.1
-->

<template>
    <Form class="form-generator" :outlined="outlined" :title="title" :width="width" :logo="logo" :busy="busy" :error="error"
        :disabled="disabled" :buttonText="buttonText" @submit="onSubmit" v-on="
            hasCancelListener
                ? {
                    cancel: () => {
                        $emit('cancel');
                    },
                }
                : {}
        ">
        <!-- Slot: Default -->
        <slot></slot>

        <!-- Slot: BeforeSubmit -->
        <template v-slot:beforeSubmit>
            <slot name="beforeSubmit"></slot>
        </template>

        <div v-for="(field, index) in fieldsAsArray" :key="index">
            <!-- Strings -->
            <v-text-field v-if="field.type === String" v-model="inputData[field.name]" :maxlength="field.maxLength"
                :rules="getRules(field)" validate-on-blur :label="getLabel(field)" autocomplete="off" class="mb-4" outlined
                dense hide-details="auto" />

            <!-- Password -->
            <v-text-field v-if="field.type === 'Password' && isShowPasswordField" v-model="inputData[field.name]"
                :label="getLabel(field)" :rules="[rules.required, rules.minLength]" autocomplete="off" class="mb-4"
                color="primary" validate-on-blur outlined dense hide-details="auto"
                :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword" />

            <!-- User Type Select -->
            <v-select v-if="field.type === 'UserType'" v-model="userType" :items="userTypeItems" :label="getLabel(field)"
                :rules="[rules.required]" item-text="userTypeAttr" item-value="userTypeVal" class="mb-4" color="primary"
                validate-on-blur outlined dense hide-details="auto" return-object></v-select>

            <!-- Problem Status -->
            <v-select v-if="field.type === 'ProblemStatus'" v-model="problemStatus" :items="problemStatusItems"
                :label="field.type" :rules="[rules.required]" item-text="problemStatusTypeAttr"
                item-value="problemStatusTypeVal" class="mb-4" color="primary" validate-on-blur outlined dense
                hide-details="auto" return-object></v-select>

            <!-- Numbers -->
            <v-text-field v-if="field.type == Number || field.type == 'integer'" v-model="inputData[field.name]"
                :rules="getRules(field)" :label="getLabel(field)" autocomplete="off" class="mb-4" outlined dense
                hide-details="auto" validate-on-blur type="number" min="0"
                @keypress="isNumberKey($event, field.type == 'integer')" />

            <!-- Booleans -->
            <v-radio-group v-if="field.type === Boolean" v-model="inputData[field.name]" row :rules="getRules(field)">
                <template v-slot:label>
                    <div>{{ getLabel(field) }}</div>
                </template>
                <v-radio label="Yes" :value="true" />
                <v-radio label="No" :value="false" />
            </v-radio-group>

            <!-- Dates -->
            <DateInput v-if="field.type == Date" v-model="inputData[field.name]" :label="getLabel(field)"
                :required="field.required" />

            <!-- Text -->
            <v-textarea v-if="field.type == 'text'" v-model="inputData[field.name]" :label="getLabel(field)"
                :rules="getRules(field)" class="mb-4" outlined hide-details="auto" no-resize validate-on-blur />

            <!-- Time -->
            <!-- <TimeInput v-if="field.type == 'time'" v-model="inputData[index]" :label="field.name" /> -->

            <v-text-field v-if="field.type == 'time'" v-model="inputData[field.name]" :label="getLabel(field)" type="time"
            :rules="getRules(field)" outlined dense hide-details="auto" class="mb-4" clearable validate-on-blur />
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
import {
    CLIENT,
    DELVERY_DRIVER,
    SYSTEM_ADMIN,
    CLIENT_NUMBER,
    DELVERY_DRIVER_NUMBER,
    SYSTEM_ADMIN_NUMBER,
} from "@/constants";

export default {
    name: "FormGenerator",
    components: {
        Form,
        DateInput
    },
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
    created() { },
    data() {
        return {
            showPassword: false,
            isShowPasswordField: this.values ? false : true,
            // User Type Items
            userType: this.values ?
                this.getUserTypesVal(JSON.parse(JSON.stringify(this.values))) :
                this.getUserTypesVal(this.defaultInputData()),
            userTypeItems: [{
                userTypeAttr: CLIENT,
                userTypeVal: CLIENT_NUMBER
            },
            {
                userTypeAttr: DELVERY_DRIVER,
                userTypeVal: DELVERY_DRIVER_NUMBER
            },
            {
                userTypeAttr: SYSTEM_ADMIN,
                userTypeVal: SYSTEM_ADMIN_NUMBER
            },
            ],
            problemStatus: "Started",
            problemStatusItems: ["Started", "In Progress", "Closed "],
            // Input Data
            inputData: this.values ?
                JSON.parse(JSON.stringify(this.values)) :
                this.defaultInputData(),
            menuDate: false,
            // Rules
            rules: {
                required: (value) => value == false || !!value || "Required.",
                minLength: (value) =>
                    (value && value.length >= 8) || "Min 8 characters.",
                email: (value) => {
                    if (value == "" || value == null) return true;
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value) || "Invalid e-mail.";
                },
                isValidUrl: (value) => {
                    if (value == "" || value == null) return true;
                    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
                    return pattern.test(value) || "Invalid url.";
                },
            },
        };
    },
    watch: {
        values(newValue) {
            if (newValue) {
                this.inputData = JSON.parse(JSON.stringify(newValue));
                this.isShowPasswordField = false;
                this.userType = this.getUserTypesVal(
                    JSON.parse(JSON.stringify(newValue))
                );
            } else {
                this.inputData = this.defaultInputData();
                this.isShowPasswordField = true;
                this.userType = this.getUserTypesVal(this.defaultInputData());
            }
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
                    } else result.push({
                        name: key,
                        type: this.fields[key]
                    });
                }

                return result;
            }
        },
    },
    methods: {
        getUserTypesVal(userVal) {
            if (userVal?.userType === 1)
                return {
                    userTypeAttr: CLIENT,
                    userTypeVal: CLIENT_NUMBER
                };
            else if (userVal?.userType === 2)
                return {
                    userTypeAttr: DELVERY_DRIVER,
                    userTypeVal: DELVERY_DRIVER_NUMBER,
                };
            else if (userVal?.userType === 3)
                return {
                    userTypeAttr: SYSTEM_ADMIN,
                    userTypeVal: SYSTEM_ADMIN_NUMBER
                };
            else return {
                userTypeAttr: CLIENT,
                userTypeVal: CLIENT_NUMBER
            };
        },
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
        toTitleCase(str) {
            return str.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        },
        getLabel(field) {
            // return field.label ? toTitleCase(field.label) : toTitleCase(field.name);
            if (field.label) {
                var fieldText = field.label;
                var result = fieldText.replace(/([A-Z])/g, " $1");
                var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                finalResult = finalResult.replace("_", "");
                return finalResult;
            } else {
                var fieldText = field.name;
                var result = fieldText.replace(/([A-Z])/g, " $1");
                var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                finalResult = finalResult.replace("_", "");
                return finalResult;
            }
        },
        getRules(field) {
            let result = [];
            if (field.required) result.push(this.rules.required);
            if (field.minLength) result.push(this.rules.minLength);
            if (field.email) result.push(this.rules.email);
            if (field.isValidUrl) result.push(this.rules.isValidUrl);
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
                else if (field.type === "UserType") outputData.userType = this.userType;
                else if (field.type === "ProblemStatus") outputData.Status = this.problemStatus;
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
