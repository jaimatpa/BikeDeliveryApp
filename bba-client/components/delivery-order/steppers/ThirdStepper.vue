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
			<v-btn block depressed color="secondary" class="mt-5" @click="open_camera_module = !open_camera_module">
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
	<CameraModal 
      v-if="open_camera_module"
      :show="open_camera_module"
      @cancel="open_camera_module = false"
      @captured-camera-images="saveCameraImages"
      :multipleUpload="true"
    />
</div>    
</template>

<script>
import emptyPhoto from "@/assets/images/empty.jpg";
import CameraModal from '../photo-capture/CameraModal'
export default {
    name: 'ThirdStepper',
	components: {
		CameraModal,

	},
	data() {
		return {
			emptyPhoto: emptyPhoto, 

			open_camera_module: false, 

			local_files_to_upload: [
				// {
				//   local_blob_url: "", 
				//   originalName: "", 
				//   mimetype: ""
				// }
			], // As we have work with multiple photo upload. 
			
		}
	},
	methods: {
		saveCameraImages( images ) {

			const blob_urls = this.local_files_to_upload.map(o => o.local_blob_url)
			const result = [...this.local_files_to_upload]
			for (let i=0; i<images.length; i++) {
			let obj = images[i]
			if ( !blob_urls.includes(obj.local_blob_url) ) {
				result.push(obj)
			}

			}
			this.local_files_to_upload = result

			console.log('saveCameraImages result ==========> ', result)
		

		},
	}
}
</script>