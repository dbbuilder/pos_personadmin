<template>
    <div>
      <div class="actions">
        <!-- selected image -->
        <div v-if="showImage">
          <img alt="selfie image"  :src="imageUrl" :class="selectedImageClass" v-if="imageAvailable" @click="startImageCapture()"/>
        </div>
        
  
        <!-- Please wait -->
        <div>
          <label v-if="pleaseWait">{{pleaseWaitMessage}}</label>
        </div>
        
  
        <!-- file button -->
        <div class="horizFlex">
        <label :class="buttonClass" v-if="useFileSelect"  > 
            <div class="captureButtonDiv" >
                <input ref="fileInput"  type="file" :accept="fileAccept"  @change="captureImageFromInput"  style="display:none;" >
                <p :class="buttonLabelClass">{{fileSelectText}}</p>
            </div>
        </label>
        </div>
  
        <!-- apple capture button v-if="allowCapture && isApple"-->
        <div class="horizFlex">
          <label :class="buttonClass" v-if="useInputCapture"> 
          <div class="captureButtonDiv" >
              <input ref="captureInput" id="inputToGetImageFile" type="file" accept="image/*" :capture="captureWhichCamera" @change="captureImageFromInput"  style="display:none;" >
              <p :class="buttonLabelClass">{{captureText}}</p>
          </div>
        </label>
        </div>
        
  
  
        <div v-if="!useFileSelect && !useInputCapture && !useWebCamCapture">
          This device does not support image capture.
        </div>
  
         <!-- media style button v-if="allowCapture && !isApple" -->
         
           <div v-if="useWebCamCapture" class="vertFlex" > 
             <div class="horizFlex">
              <label ref="captureWebcam"  v-if="!capturingFromWebcam" :class="buttonClass" @click="onStart">
                <div class="captureButtonDiv" >
                  <p :class="buttonLabelClass">{{captureText}}</p>
                </div>
              </label>
            </div>
              
            <div class="video-container" >
                <video class="camera-video" ref="webcam"  autoplay playsinline :class="webcamClass"></video>
                <canvas id="photoTaken" v-show="isPhotoTaken" class="canvas-photo" ref="canvas" :width="450" :height="337"></canvas>
            </div>
      
              <div class="horizFlex">
                <label  v-if="!pleaseWait && capturingFromWebcam" :class="buttonClass" @click="onCapture" >
                  <div class="captureButtonDiv" >
                      <p :class="buttonLabelClass">{{webCamCaptureText}}</p>
                  </div>
                </label>
              </div>
           
         </div>
  
         
  
         <!-- for troubleshooting -->
          <div v-if="showDeviceInfo">
            
            <p class="info">is Apple: {{isApple}}</p>
            <p class="info">is Mobile: {{isMobile}}</p>
            <p class="info">is Android: {{isAndroid}}</p>
            <p class="info">has Camera: {{hasCamera}}</p>
            <p class="info">use Input: {{useInputCapture}}</p>
            <p class="info">use Webcam: {{useWebCamCapture}}</p>
          </div>
          
      </div>
    </div>
  </template>
  
  <script>
  import camera from "../../services/camera.js";
  import { find, head } from "lodash";
  export default {
    name:'imagecapture2',
    components:{
     
    },
    props: {
          allowFileSelect:{
            type:Boolean,
            default:false
          },
          allowFileSelectIfNoCapture:{
            type:Boolean,
            default:false
          },
          allowCapture:{
              type:Boolean,
              default:true
          },
          useRearCamera:{
              type:Boolean,
              default:false
          },
          selectedImageClass:{
            type:String,
            default:'selectedImage'
          },
          buttonClass:{
            type:String,
            default:'captureButton'
          },
          buttonLabelClass:{
            type:String,
            default:'buttonlabel'
          },
          pleaseWaitMessage:{
            type:String,
            default:'Please Wait...'
          },
          fileSelectText:{
            type:String,
            default:'Upload File'
          },
          captureText:{
            type:String,
            default:'Take Picture'
          },
          webCamCaptureText:{
            type:String,
            default:'Capture Photo'
          },
          showDeviceInfo:{
            type:Boolean,
            default:false
          },
          showImage:{
            type:Boolean,
            default:true
          },
          fileAccept:{
            type:String,
            default:'image/*'
          },
          resizeImages:{
            type:Boolean,
            default:true
          }
      },
    
      data() {
          return {
            
            isApple:false,
            hasCamera:false,
            isMobile:false,
            isAndroid:false,
            
            imageBlob:null,
            imageUrl:null,
            responsemessage:'',
  
            camera:null,
            deviceId:null,
            devices:[],
  
            capturingFromWebcam:false,
            pleaseWait:false,
  
          };
      },
      created() {
          
      },
      async mounted() {
        //find out what our options are
          await camera.GetDeviceInfo()
          this.isApple=camera.isApple
          this.isMobile=camera.isMobile
          this.isAndroid=camera.isAndroid
          this.hasCamera = await camera.DeviceHasCamera()
          
      },
      beforeDestroy() {
        //clean up
          
      },
      
      computed:{
        imageAvailable(){
          return this.fileSelectIsImage && this.imageUrl!=null
        },
        fileSelectIsImage(){
          return this.fileAccept=='image/*'
        },
        captureWhichCamera(){
          if(this.useRearCamera){ return "environment"}
          else{return "user"};
        },
        useFileSelect(){
          if(this.allowFileSelect) {return true}
          if(this.allowFileSelectIfNoCapture && !this.useInputCapture && !this.useWebCamCapture){return true}
          return false
        },
        useInputCapture(){
          return this.allowCapture &&  this.isMobile
        },
        useWebCamCapture(){
          return this.allowCapture  && !this.useInputCapture && this.hasCamera
        },
        webcamClass(){
          if(this.capturingFromWebcam==true){return "showWebCamClass"}
          else{return "hideWebCamClass"}
        },
        device() {
           return find(this.devices, n => n.deviceId == this.deviceId);
        },
      },
      watch: {
        camera: function(id) {
          this.deviceId = id;
        },
        devices: function() {
          // Once we have a list select the first one
          let first = head(this.devices);
          if (first) {
            this.camera = first.deviceId;
            this.deviceId = first.deviceId;
          }
        }
      },
      methods: {
        startImageCapture(){
          if (this.useFileSelect){
            this.$refs.fileInput.click()
          }else if(this.useInputCapture){
            this.$refs.captureInput.click()
          }else if(this.useWebCamCapture){
            this.$refs.captureWebcam.click()
          }
        },
        createCameraElement () {
            const constraints = (window.constraints = {
                audio: false,
                video: true
            })

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                this.$refs.webcam.srcObject = stream
                this.pleaseWait=false
                })
                .catch(error => {
                alert(error, "May the browser didn't support or there is some errors.")
                })
            },
        async onCapture() {
            
            const context = this.$refs.canvas.getContext('2d')
            const photoFromVideo = this.$refs.webcam

            context.drawImage(photoFromVideo, 0, 0, 450, 337)


          this.imageUrl = this.$refs.canvas.toDataURL()
          this.imageBlob = await fetch(this.imageUrl).then(r=>r.blob())
          this.$emit('gotimage',this.imageBlob,this.imageUrl)
          this.onStop()
        },
        
        onStop() {
            const tracks = this.$refs.webcam.srcObject.getTracks()

            tracks.forEach(track => {
                track.stop()
            })
            this.capturingFromWebcam=false
            console.log('CameraClosed')
        },
        onStart() {
          this.pleaseWait=true
          this.capturingFromWebcam=true
          this.$emit('startingcapture')
          this.createCameraElement()
        },
        onError(error) {
          console.log("On Error Event", error);
        },


        onCameras(cameras) {
          this.devices = cameras;
          //console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
          this.deviceId = deviceId;
          this.camera = deviceId;
          //console.log("On Camera Change Event", deviceId);
        },
        
        async captureImageFromInput(event){
          
          //input style capture  
          this.imageBlob = event.target.files[0];
          if(this.fileSelectIsImage && this.resizeImages){
             var fileblob = await camera.resizeImage(this.imageBlob,540)
            this.imageBlob=fileblob
          }
          
          
          this.imageUrl = URL.createObjectURL(this.imageBlob);
          console.log('gotimg' + this.imageUrl )
          this.$emit('gotimage',this.imageBlob,this.imageUrl)
      },
      },
  };
  </script>
  
  <style scoped>
  .info{
    margin:0px;
  }
  .buttonlabel{
    margin:auto;
    margin:15px 5px 15px 5px;
    word-wrap: break-word;
  }
  .showWebCamClass{
    height:200px;
    width:300px;
    text-align: left;
  }
  .hideWebCamClass{
    height:0px;
  }
  .button{
    width:150px;
    margin:10px;
    
  }
  .captureButton{
      /* background-color:rgb(82, 82, 231);; */
      color:black;
      border: none;
      border-radius:10px;
      min-width:120px;
      height:25px;
      padding:10px;
      font-size: large;
      margin-top:10px;
  }
  .captureButton:hover{
  cursor:pointer;
  }
  .captureButtonDiv{
     display: flex;
      flex-direction: column;
      align-items: center;
  }
  .selectedImage{
      width:100px;
  
  }
  
  
  .actions {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  
  
  .horizFlex{
    display:flex;
    flex-direction: row;
    justify-content: center;
  }
  .vertFlex{
    display:flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  .video-container {
    display: flex;
    flex-direction: column;
  }
  </style>
  
  