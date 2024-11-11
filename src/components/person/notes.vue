<template>
    <div>
        <linkbutton toplabel="Add/View Notes" @click="start()" v-if="!showButton"/>
        <smallbutton toplabel="Add/View Notes" @click="start()" class="alertlink" :buttonclass="buttonclass" v-if="showButton"/>
        <!-- ACCT NOTE MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <form >
                    <div class="history">
                            <label class="studentname" >Notes</label>
                            <div v-if="pleaseWait"><label class="pleasewait">Please wait...</label></div>
                            
                                <div class="docDiv">
                                    <div v-for="file in noteList" :key="file.note" :value="file.note" class="documentitems" >
                                        <p class="timetext" >{{formatDate(file.noteDate) }} </p>
                                        <p class="timetext" >{{file.enteredByName }} </p>
                                        <p class="timetext" >{{file.note }} </p>
     
                                    </div>
                                </div>
                                <smallbutton toplabel="Add Note" @Click="addfile" v-if="!showNew"/>
                               
                                <div v-if="showNew" class="vertFlex">
                                    <textarea rows="4" v-model="newNote" placeholder="enter note"/>
                                    <div class="horizFlex">
                                        <smallbutton toplabel="Save" @click="savenote"/>
                                        <smallbutton toplabel="Cancel" @click="cancelnote"/>
                                    </div>
                                    
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
    import {mapFields} from 'vuex-map-fields'
    import datamethods from '../../services/datamethods.js'
    import smallbutton from '../controls/button.vue'
    import actionmodal from '../controls/actionmodal.vue'
    import linkbutton from '../controls/linkbutton.vue'
    import format from '../../format.js'

    export default {
        name:'notes',
        components:{
            smallbutton,
            actionmodal,
            linkbutton,
            confirm
        },
        props:{
            personId:{
                type:Number,
                
            },
            buttonclass:{
                type:String,
                default:'button buttonprimary'
            },
            showButton:{
                type:Boolean,
                default:false
             },
             noteList:{
                type:Array,
             }
        },
        mixins:[datamethods, format],
        data(){
            return{
                showNew:false,
                newNote:null,

             
                
                trueParam:true,
                falseParam:false,
                pleaseWait:false,
                docIdToDeactivate:0
            }
        },
        computed:{
            ...mapFields([
            
            'loggedInUser'
            ])
           
        },
        methods:{
            formatDate(dt)
            {
                return this.$options.filters.formatDateTime(dt)
            },
            start(){
                //this.GetFiles()
                this.newNote=null
                this.$refs.mymodal.openModal()
            },
            addfile(){
               this.showNew=true
               this.newNote=null
            },
            async savenote(){
                this.pleaseWait=true
               
                let req = {
                    Note:{
                        personId:this.personId,
                        note:this.newNote,
                        enteredById:this.loggedInUser.user_personId
                    }
                        
                }
                    var response= await this.callAPI(req,'addnote')
               
                //handle response
                if(response.Successful){
                    this.showNew=false
                    this.$emit('refresh')
         
                }else{
                    this.responseMessage = response.Message
                }
                this.pleaseWait=false
            },
            cancelnote(){
                this.showNew=false
                this.newNote=null
            },
           
            
            
            
            
        },
        mounted(){
          
        }
    }
    </script>
    
    <style>
    .history{
        margin-top:15px;
        display:flex;
        flex-direction: column;
        /* align-items: center; */
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

    
    .docDiv{
        width:95%;
        overflow-x:auto;
        overflow-y:auto;
        height:370px;
    }
    .documentitems{
        width:95%;
        display:grid;
        grid-template-columns:3fr 3fr 5fr;
        text-align:left;
        font-size:medium;
        margin:10px;
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
    
    .pleasewaitdoc{
        color:orangered;
        font-size:large;
    }
    </style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    