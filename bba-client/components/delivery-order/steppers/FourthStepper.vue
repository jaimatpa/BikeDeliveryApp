<template>
    <div> 
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" xl="12">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Date:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.date
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Name:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.name
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Location:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.location
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Order#:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.order
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Color:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.color
                  }}</span>
                </p>
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Combination:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.combination
                  }}</span>
                </p>
              </div>

              <div class="d-flex justify-space-between align-center flex-wrap">
                <p class="secondary--text mb-0">
                  <span class="font-weight-bold">Bike Rack:</span>
                  <span class="font-weight-regular">{{
                    deliveryOrderData.rack
                  }}</span>
                </p>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="12"
              xl="12"
              class="d-flex flex-column justify-center align-center"
            >
              <v-img max-height="180" max-width="220" :src="cyclePhoto"></v-img>
            </v-col>
          </v-row>
          <!-- Fourth Stepper Button -->
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                color="primary"
                @click.stop="$emit('set-delivery-order-dialog', true)"
              >
                Complete
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                outlined
                color="accent"
                @click.stop="$emit('set-delivery-stepper', 3)"
              >
                Back
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4" xl="4">
              <v-btn
                block
                depressed
                outlined
                color="error"
                @click.stop="$router.go(-1)"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>

    </div>
</template>
<script>
export default {
    name: 'FourthStepper',
    props: {
        deliveryOrderData: {
            type: Object, 
            default: { }
        },
        cyclePhoto: {
            type: String, 
            default: ''
        }
    }

}
</script>