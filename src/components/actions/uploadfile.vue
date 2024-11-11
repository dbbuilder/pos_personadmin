<template>
    <div>
      <smallbutton :buttonclass="buttonclass" toplabel="Import File" @click="Add()"/>
      <!-- ACCT NOTE MODAL -->
        <actionmodal ref="mymodal"> 
          <template v-slot:body>
              <label class="titlelabel">Import File</label>
     
              <imagecapture buttonClass="button buttonprimary importButton" v-if="!pleaseWait" ref="img" :allowFileSelect='allowFileSelect' :showImage="showImage" :fileAccept="fileAccept" :allowCapture="allowCapture" @gotimage="gotImage_file" fileSelectText="Click to Select File" />
  
              <div v-if="pleaseWait">
                  <label class="pleasewait">Import in progress. This may take a while. You may close this window. A detailed import log will be emailed to you when the import completes. DO NOT import another file until you receive the log.</label>
              </div>
              <div>
                  <smallbutton  @click="close()" toplabel="Close" />
              </div>
              
              <div>
                  <label class="responsemessage">{{responseMessage}}</label>
              </div>
            
          </template>
        </actionmodal>
      </div>
  </template>
  
  <script>
  import {mapFields} from 'vuex-map-fields'
  
  import imagecapture from '../controls/ImageCapture.vue'
  import datamethods from '../../services/datamethods.js'
  import actionmodal from '../controls/actionmodal.vue'
  import smallbutton from '../controls/button.vue'
  export default {
      name:'uploadfile',
      components:{
          imagecapture,
          actionmodal,
          smallbutton
      },
      mixins:[ datamethods],
      props:{
       
            
            buttonclass:{
                type:String,
                default:'updatebutton'
            },
          
        },
      data(){
          return{
              allowFileSelect:true,
              allowCapture:false,
              capturedFile:null,
              capturedFileURL:null,
              fileNameText:'',
              fileAccept:'*',
              showImage:false,
              message:'',

              responseMessage:'',
              pleaseWait:false
          }
      },
      computed:{
          ...mapFields([
        
              'username',
              'loggedInUser'
            
          ]),
          
      },
      methods:{
          Add(){
              this.responseMessage=''
              this.$refs.mymodal.openModal()
          },
          gotImage_file(file,url){
            this.responseMessage=null
              console.log('gotimg' + url)
              this.capturedFile=file
              this.capturedFileURL=url
              
              this.storeImage("file", file, file.name,"file")
          },
          async storeImage(filename,file, name,type){
  
              var postParams = new FormData();
  
              postParams.append(filename,file,name);
              
              postParams.append('filename',name);
              postParams.append('sendLogToEmail',this.username)
              postParams.append('locationId',this.loggedInUser.LocationId)
              this.pleaseWait=true
              var response = await this.callAPI(postParams,'importfile')
              //handle response
              if(response.Successful){
                  //this.getBadgeDetail(); 
                  this.responseMessage="Uploaded " + name + '. Please check your email for detailed import results.'
                  this.pleaseWait=false
              }else{
                if (response.Message == "Network Error"){
                    this.responseMessage = 'Please DO NOT import another file until you receive the import log.'
                }else{
                    this.responseMessage = response.Message
                }
                 
                  this.pleaseWait=false
              }
               
          },
          close(){
              this.$emit('refresh')
              this.$refs.mymodal.closeModal()
          },
      }
  }
  </script>
  
  <style>
  .importButton{
    height:40px;
    
  }  
  </style>