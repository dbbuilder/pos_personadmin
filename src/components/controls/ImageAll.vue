<template>
  <actionmodal ref="mymodal"> 
        <template v-slot:body>
            <div class="vertFlex">
                <div class="imagediv" >
                    <img alt="selfie image"  :src="capturedImageURL" class="image" v-if="capturedImageURL!=null"/>
                    <div class="editdiv">
                        <smallbutton toplabel="Edit" buttonclass="editbutton" @click="$refs.imgedit.openModal()" v-if="havePic"/>
                    </div>
                </div>

                <div >
                    <imagecapture2 ref="imgcapture" :allowCapture="allowCapture" :fileAccept="fileAccept" buttonClass="pbutton" :allowFileSelect="allowFileSelect" :allowFileSelectIfNoCapture='allowFileSelectIfNoCapture' @gotimage="gotImage"  :showImage='showImage'  />
                </div>
                <div >
                    <smallbutton toplabel="Save" @click="savepic()"/>
                    <smallbutton toplabel="Cancel" @click="$refs.mymodal.closeModal()"/>
                </div>
            </div>
            <imageeditor ref="imgedit" :img="capturedImageURL" @save="saveedits"/>
            
            <div v-if="photoRequirements!=null">
              <hr>
              <label class="titlelabel">Picture Requirements</label>
              <br>
              <label v-html="photoRequirements" class="photoreq" />
          </div> 
        </template>
      </actionmodal>
</template>

<script>
import actionmodal from '../controls/actionmodal.vue'
import smallbutton from './button.vue'
import imagecapture2 from '../controls/ImageCapture2.vue'
import imageeditor from '../controls/ImageEditor.vue'
import datamethods from '../../services/datamethods'
export default {
    name:'imageall',
    mixins:[datamethods],
    components:{
        actionmodal,
        smallbutton,
        imagecapture2,
        imageeditor
    },
    props: {
        allowCrop:{
            type:Boolean,
            default:true
        },
        allowRotate:{
            type:Boolean,
            default:true
        },
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
        },
        referenceID:{
            type:Number,
            default:-1
        }
    },
    data() {
		return {

            capturedImage:null,
            capturedImageURL:null,
            havePic:false,
            photoRequirements:null
		};
	},
    computed:{
        
    },
    methods: {
        
        openModal(){
            this.capturedImageURL=require('@/assets/WM_personimage.png')
            this.$refs.mymodal.openModal()
        },
        gotImage(file,url){
            this.capturedImage=file
            this.capturedImageURL=url
            this.havePic=true
        },

		saveedits(file, url){
            this.capturedImage=file
            this.capturedImageURL=url
        },
        savepic(){
            this.$emit('saveimg',this.capturedImage, this.capturedImageURL, this.referenceID)
            this.$refs.mymodal.closeModal();
        },
        async getPhotoReq(){
            let req = {
                locationId:-1
            }
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'photoreq')

            //handle response
            if(response.Successful){
                this.photoRequirements = response.StringResponse
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
	},
    mounted(){
        //this.getPhotoReq()
    }
}
</script>

<style>

.pbutton{
    background-color:var(--button-color);
    color:var(--light-text-color);
    border: none;
    padding-top:0px;
    padding-bottom:20px;
    min-width:120px;
    height:25px;
    
    font-size: medium;
    margin:10px;

    text-decoration: none;

}

@media screen and (min-width: 812px) {
    .image{
      margin:10px;
      max-width:90%; 
      height:auto;
    }
}
/* phone */
@media screen and (max-width: 812px) {
   .image{
      margin:10px;
      width:auto; 
      max-height: 250px;
    }
    
}
</style>