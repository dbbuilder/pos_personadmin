<template>
  <actionmodal ref="mymodal"> 
        <template v-slot:body>
            <div class="">
                <img ref="myimage" :src="outImgUrl" v-if="!inCrop" class="currentimage"/>
                <cropper
		            :src="inImgUrl"
		            @change="change"  v-if="inCrop"/>
                
                <div v-if="!inEdit">
                    <smallbutton @click="crop()" toplabel='Crop' buttonclass="editbutton2" />
                    <smallbutton @click="rotate()" toplabel='Rotate'  buttonclass="editbutton2"/>
                    
                </div>
                <div>
                    <smallbutton @click="donecrop()" toplabel='Done Crop'  v-if="inCrop"/>
                </div>
                <hr>
                <div v-if="!inEdit">
                    <smallbutton @click="reset()" toplabel='Reset'  />
                    <smallbutton @click="done()" toplabel='Save' buttonclass="button buttonhighlight" />
                    <smallbutton @click="cancel()" toplabel='Cancel'  />
                </div>
                
            </div>

        </template>
      </actionmodal>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import actionmodal from './actionmodal.vue'
import smallbutton from './button.vue'
export default {
    name:'imageeditor',
    components:{
        Cropper,
        actionmodal,
        smallbutton
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
        img:{
            type:String,
            require:true
        }
    },
    data() {
		return {
            imgBlob:null,
            inImgUrl:null,
            outImgUrl:null,
            inCrop:false,
            rotateAngle:90,
            inRotate:false,
            imageReady:false
		};
	},
    computed:{
        imgpath(){
           
            return this.img
        
        },
        inEdit(){
            return this.inCrop
        }
    },
    methods: {
        openModal(){
            this.imageReady=false
            this.inImgUrl=this.img
            this.outImgUrl=this.img

            this.inCrop=true
            this.$refs.mymodal.openModal()
            
        },
		change({ coordinates, canvas }) {
			//console.log(coordinates, canvas);
            this.outImgUrl = canvas.toDataURL()
            if(this.imageReady==false){
                this.imageReady=true
                this.inCrop=false
                
            }
		},
        crop(){
            this.inCrop=true;
        },
        donecrop(){
            this.inCrop=false;
            this.inImgUrl=this.outImgUrl
        },
        rotate(){
            let myimage = this.$refs.myimage
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width=myimage.width
            canvas.height=myimage.height
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.rotate(Math.PI/2)
            ctx.drawImage(myimage,-myimage.width/2,-myimage.height/2)

            this.outImgUrl=canvas.toDataURL()
        },
        
        reset(){
            this.inImgUrl=this.img
            this.outImgUrl=this.img
        },
        async done(){
            this.imageBlob = await fetch(this.outImgUrl).then(r=>r.blob())
            this.$emit('save',this.imageBlob, this.outImgUrl)
            this.$refs.mymodal.closeModal()
        },
        cancel(){
            this.$refs.mymodal.closeModal()
        }
	},
}
</script>

<style>

.editbutton2{
  margin:5px;
  background-color:var(--button-color);
  color:white;
  border:none;
    padding:5px;
}
</style>