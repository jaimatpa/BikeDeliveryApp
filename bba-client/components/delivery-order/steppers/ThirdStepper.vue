<template>
<div>
	<v-row>
		<v-col
			cols="12"
			xs="12"
			sm="12"
			md="12"
			xl="12"
			class="d-flex flex-column justify-center align-center"
		>
			<v-img max-height="180" max-width="220" :src="emptyPhoto"></v-img>
			<v-btn block depressed color="secondary" class="mt-5">
				Take Photo
			</v-btn>
			<p class="primary--text mt-5 mb-0">Location</p>
			<p class="body-2 secondary--text">No Location Found</p>
		</v-col>
	</v-row>

	<!-- Third Stepper Button -->
	<v-row>
		<v-col cols="12" xs="12" sm="12" md="4" xl="4">
			<v-btn
				block
				depressed
				outlined
				color="primary"
				@click.stop="$emit('set-delivery-stepper', 4)"
			>
				Next
			</v-btn>
		</v-col>
		<v-col cols="12" xs="12" sm="12" md="4" xl="4">
			<v-btn
				block
				depressed
				outlined
				color="accent"
				@click.stop="$emit('set-delivery-stepper', 4)"
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
import emptyPhoto from "@/assets/images/empty.jpg";

export default {
    name: 'ThirdStepper',
		data() {
			return {
				emptyPhoto: emptyPhoto, 
				
			}
		}
}
</script>