const axios = require('axios');

export default ({ store, app, $vuetify }) => {
  const config = app.$config;

  const uploadPendingImages = async function() {
    const uploadQueue = JSON.parse(localStorage.getItem('uploadQueue')) || [];
    const successfulUploads = [];

    for (let i = 0; i < uploadQueue.length; i++) {
      const queueItem = uploadQueue[i];

      try {
        const result = await axios.post(config.baseURL+`/api/user/upload?orderid=${pictureName}`,
          formData
        );
        if (result.success) {
          console.log(`Photo upload was successful for ${queueItem.pictureName}`);
          successfulUploads.push(i);
        } else {
          console.log(`Failed to upload photo for ${queueItem.pictureName}`);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    successfulUploads.reverse().forEach((index) => {
      uploadQueue.splice(index, 1);
    });

    localStorage.setItem('uploadQueue', JSON.stringify(uploadQueue));
  };

  const handleNetworkChange = function() {
    if (navigator.onLine) {
      console.log('Internet connection restored!');
      uploadPendingImages();
    }
  };

  app.mounted = async () => {
    window.addEventListener('online', handleNetworkChange);
  }
}