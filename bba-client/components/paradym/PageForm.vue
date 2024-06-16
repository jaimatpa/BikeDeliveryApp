<template>
  <div class="page-form" :style="{ 'background-color': bgColor }">
    <v-row
      no-gutters
      :class="{ 'page-form-bg': bg }"
      :style="bg ? 'background-image: url(\'' + bg + '\');' : ''"
    >
      <v-col cols="12" class="text-center" style="width: 100%;">
        <div class="form-container mx-4" style="max-width: 100%;">
          <template v-if="contain">
            <v-card
              :class="noPadding ? '' : 'pa-8 pb-6'"
              style="max-width: 100%;"
            >
              <slot></slot>
            </v-card>
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "pageForm",
  props: {
    bg: String,
    contain: Boolean,
    noPadding: Boolean,
    bgColor: String,
  },
};
</script>

<style lang="scss">
.page-form {
  min-height: 100vh;
  & > .row {
    min-height: 100vh;
  }
  //border-left: 1px solid rgba(0,0,0,0.1);
}
.page-form-bg {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.form-container {
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .v-input.v-input--has-state {
    margin-bottom: 4px !important;
  }
}
</style>
