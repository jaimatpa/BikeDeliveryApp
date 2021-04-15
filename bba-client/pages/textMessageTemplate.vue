<template lang="html">
  <Page>
    <div class="d-flex flex-column justify-space-between" style="height: 100%">
        <div>
          <v-row>
      <v-col cols="12" xs="12" sm="12" md="12" xl="12">
        <v-textarea
          outlined
          v-model="templateMsg"
          name="textMessageTemplate"
          label="Message"
           auto-grow
        ></v-textarea>


       
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        xl="12"
        class="mt-5"
        justify="center"
      >
        <div :class="[isMobile ? 'text-center' : '']">
          <p class="headline text-uppercase primary--text mb-1">
            Available Tags
          </p>
          <v-divider :class="[isMobile ? 'mobile-divider' : '']"></v-divider>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" xs="12" sm="12" md="12" xl="12">
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[customer-name]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[pictures]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[lock-combo]</span
        >
        <!-- <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[geo-lat]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[geo-long]</span
        > -->
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[location]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[delivery-number]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[color]</span
        >
        <span class="subtitle-2 primary--text font-weight-bold text-lowercase"
          >[rack]</span
        >
      </v-col>
    </v-row>
        </div>

        <div>
          <v-btn @click="save()" block depressed color="primary" class="mt-15">
      Update
    </v-btn>
        </div>
    </div>
    

    
  </Page>
</template>

<script>
import Page from "@/components/paradym/Page";

export default {
  name: "textMessageTemplate",
  auth: true,
  head() {
    return {
      title: "Text Message Template",
    };
  },
  components: { Page },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < this.breakpoint;
    },
  },
  created() {
    this.getMsg()
  },
  data() {
    return {
      breakpoint: 640,
      templateMsg: "Hello [customer-name]! Your bike is now available at [geo-lat] [geo-long] Your deliver number is [delivery-number] Thank You.",
    };
  },
  methods: {
   async save() {
      console.log('Te saved data', this.templateMsg)

       try {
        let response = await this.$axios.$post(
          "api/user/template",{
            template : this.templateMsg
          }
        
        );
       
        alert('Template Updated')
        // this.loader = false;
        // this.showSuccess(response.message);
        //  this.$router.go(-1);
       
      } catch (err) {
        console.log('errror', err.response);
        // this.loader = false;
      }
    },
   async getMsg() {
       try {
        let response = await this.$axios.$get(
          "api/user/template"
        
        );
        console.log('respones', response);
        this.templateMsg = response.body
       
      } catch (err) {
        console.log('errror', err.response);
       
      }
    }
    
  },
};
</script>

<style lang="scss">
.text-message-template-box {
  height: 200px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.mobile-divider {
  max-width: 50%;
  margin: 0 auto;
}
</style>
