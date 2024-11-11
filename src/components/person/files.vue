<template>
    <div>
        <smallbutton toplabel="Add/View Files" @click="start()" class="alertlink" :buttonclass="buttonclass"/>
        <!-- ACCT NOTE MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <form >
                    <div class="history">
                            <label class="studentname" >Files</label>
                            <div v-if="pleaseWait"><label class="pleasewait">Please wait...</label></div>
                            <div >
                                <div class="docDiv">
                                    <div v-for="file in FileList" :key="file.id" :value="file.id" class="documentitems" >
                                        <a class="timetext" :href="file.filePath" target="_blank" >{{file.fileName }} </a>
     
                                    </div>
                                </div>
                                <smallbutton toplabel="Add File" @Click="addfile"/>
                                <imagealldoc ref="imgdoc" fileAccept="*.*"  :allowFileSelect="allowFileSelect" :allowCapture="allowCapture" @saveimg="saveimg_document"  :showImage='showImagesInCapture' />
                                
                            </div>
       
                    </div>
                    <div>
                        <smallbutton  @click="$refs.mymodal.closeModal()" toplabel="Close"/>
                    </div>
                   
              </form>
            </template>
          </actionmodal>
        </div>
    </template>
    
    <script>
    import datamethods from '../../services/datamethods.js'
    import smallbutton from '../controls/button.vue'
    import actionmodal from '../controls/actionmodal.vue'
    import linkbutton from '../controls/linkbutton.vue'
    import format from '../../format.js'
    import imagealldoc from '../controls/ImageAll.vue'

    export default {
        name:'documentadmin',
        components:{
            smallbutton,
            actionmodal,
            linkbutton,
            imagealldoc,
            confirm
        },
        props:{
            personId:{
                type:Number,
                
            },
            buttonclass:{
                type:String,
                default:'button buttonprimary'
            }
        },
        mixins:[datamethods, format],
        data(){
            return{
                imageBasePath:'',
                FileList:[],
                showImagesInCapture:false,
                allowFileSelectIfNoCapture:true,
                allowCapture:false,
                allowFileSelect:true,
                trueParam:true,
                falseParam:false,
                pleaseWait:false,
                pleaseWaitSign:false,
                docIdToDeactivate:0
            }
        },
        computed:{
            
           
        },
        methods:{
            start(){
                this.GetFiles()
                this.$refs.mymodal.openModal()
            },
            addfile(){
               // this.$refs.imgdoc.allowFileSelect=true
                //this.$refs.imgdoc.allowCapture=true
                this.$refs.imgdoc.openModal() 
            },
            async GetFiles(){
                if(this.listenersConnected){this.listenersConnected=false}
                this.pleaseWait=true
                var basepath = this.imageBasePath 
                let req = {
                    person:{
                        id:this.personId,
                    }
                    
                }
    
  

                    var response= await this.callAPI(req,'personfiles')
               
                //handle response
                if(response.Successful){
                    this.FileList=response.EmployeeFileList
                    if(this.FileList.length>0){
                        this.FileList.forEach(myFunction2)
                    
                        function myFunction2(item, index, arr) {
                            let acct=arr[index]
                            if(acct.fileName!=null){
                                let newpath = basepath + acct.fileName
                                acct.filePath = newpath
                            }

                        } 
                    }
                    
                    
                }else{
                    this.responseMessage = response.Message
                }
                this.pleaseWait=false
            },
            
            saveimg_document(file,url,typeId){
                this.storeDocument("doc", file, file.name,typeId)
            },
            
            async storeDocument(filename,file, name,typeId){
                 var pId=this.personId
                var postParams = new FormData();
    
                postParams.append(filename,file,name);
                postParams.append('personId',pId);

    
                var response = await this.callAPI(postParams,'savefile')
                //handle response
                if(response.Successful){
                    //if we have a doc to deactivate then ask, else get docs
                    
                        this.GetFiles();
                    
                      
                }else{
                    this.responseMessage = response.Message
                }
                 
            },
            
          
           
            async getDocumentImageBasePath(){
                //call api
                var response = await this.callAPI(null,'imagepath')
                //handle response
                if(response.Successful){
                    this.imageBasePath = response.StringResponse
                }else{
                    this.responseMessage = response.Message
                }
            },
    
    
            
            
        },
        mounted(){
          this.getDocumentImageBasePath()
          
        }
    }
    </script>
    
    <style>
    .history{
        margin-top:15px;
        display:flex;
        flex-direction: column;
        align-items: center;
    }
    form{
        font-size:large;
    }
    .entryCheckLabel{
        margin:0px 0px 0px 5px;
        font-size:medium;
        text-align: left;  
        max-width: 420px;
    }
    .entryCheckLabelbold{
        margin:0px 0px 0px 5px;
        font-size:medium;
        text-align: left;  
        max-width: 420px;
        font-weight:bold;
    }
    .rightjustify{
        text-align: right;
        
    }
    .nomargin{
        margin:0px;
    }
    .alertlink{
        font-size:large;
    }
    .logitem{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        font-size:medium;
        border:1px solid darkgray;
        margin:5px;
        padding:2px;
    }
    
    .docDiv{
        overflow-x:auto;
        overflow-y:scroll;
        height:370px;
    }
    .documentitems{
        display:grid;
        grid-template-columns:1fr 3fr 1fr;
        text-align:left;
        font-size:medium;
        margin:10px;
    }
    .doctitle{
        font-weight:bold;
    
    }
    .doctitlesigned{
        font-weight:bold;
        color:green;
    }
    .docbutton{
        height:20px;
        width:30px;
        border:none;
        background-color:transparent;
    }
    .docimg{
        width:20px;
        background-color:transparent;
        margin:0px;
    }
    .docimg2{
        width:20px;
        background-color:transparent;
        
    }
    .col2{
        grid-column: 2;
    }
    .col3{
        grid-column:3;
        padding-right:10px;
       
    }
    .required{
        color:red;
    }
    .signaturebox{
        height:200px;
        width:500px;
        margin:auto;
        background-color:white;
        border:1px solid black;
    }
    .signlink{
        margin-top:10px;
    }
    .signlinkrequired{
        margin-top:10px;
        color:red;
    }
    .pleasewaitdoc{
        color:orangered;
        font-size:large;
    }
    </style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    