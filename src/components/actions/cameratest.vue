<template>
    <div class="camera">
      <div class="wrapper">
        <button @click="this.$parent.showCamera = false" class="button-close">x</button>
         <button class="button" @click="toggleCamera()">
          <span v-if="!isCameraOpen">Open Camera</span>
          <span v-else>Close Camera</span>
        </button>
         <div class="video-container">
          <video class="camera-video" ref="camera" :width="450" :height="337" autoplay playsinline ></video>
          <canvas id="photoTaken" v-show="isPhotoTaken" class="canvas-photo" ref="canvas" :width="450" :height="337"></canvas>
        </div>
         <button class="button" @click="takePhoto">
          <span>Snap!</span>
        </button>
        <button class="camera-download">
          <a id="downloadPhoto" download="VueRocksPhoto.jpg" class="button" role="button" @click="downloadImage">
            Download
          </a>
        </button>
  
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Camera',
    data() {
    return {
      isCameraOpen: false,
      isPhotoTaken: false

    }
  },
  methods: {
    createCameraElement () {
      const constraints = (window.constraints = {
        audio: false,
        video: true
      })

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.$refs.camera.srcObject = stream
        })
        .catch(error => {
          alert(error, "May the browser didn't support or there is some errors.")
        })
    },
    stopCameraStream () {
      const tracks = this.$refs.camera.srcObject.getTracks()

      tracks.forEach(track => {
        track.stop()
      })
      console.log('CameraClosed')
    },
    toggleCamera () {
      if (this.isCameraOpen) {
        this.isCameraOpen = false
        this.isPhotoTaken = false
        this.stopCameraStream()
        console.log('closed');
      } else {
        this.isCameraOpen = true
        this.createCameraElement()
        console.log('open');
      }
    },
    takePhoto () {
      this.isPhotoTaken = !this.isPhotoTaken

      const context = this.$refs.canvas.getContext('2d')
      const photoFromVideo = this.$refs.camera

      context.drawImage(photoFromVideo, 0, 0, 450, 337)
    },
    downloadImage() {
    const download = document.getElementById("downloadPhoto");
    const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
      .replace("image/jpeg", "image/octet-stream");
    download.setAttribute("href", canvas);
    }
  }
}
</script>
  
  <style>
  .camera {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 50%;
    height: 90%;
    background-color: white;
    border: solid 2px rgb(223, 114, 250);
  }
  
  button {
    border: solid 1px rgb(223, 114, 250);
    font-size: 25px;
    cursor: pointer;
  }
  
  .button-close {
    position: absolute;
    top: 50px;
    right: 50px;
    width: 25px;
    height: 30px;
  }
  
  .button {
    width: 140px;
    height: 40px;
  }
  
  .video-container {
    display: flex;
    flex-direction: column;
  }
  </style>