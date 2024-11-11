<template>
    <div>
        <!-- <linkbutton toplabel="Update person" @click="UpdatePerson()"/> -->
        <smallbutton @click="start()" toplabel="Send Text" :class="buttonclass"/>
        <!-- ACCT NOTE MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <form ref="myform">
                    <label class="titlelabel">Send Text</label>
    
                   
                    <div class="horizFlex"  >
                        
                            <label class="entryLabel" for="">Message Type</label>
                       
                        
                            <select name="" id="" class='entrySelect2' v-model="messageTemplateId" required >
                                <option v-for="role in messageTemplateList" :key="role.id" :value="role.id" >
                                    {{role.name}}
                                </option>
                            </select>
                        
                    </div>
                    <div>
                        <textarea lines="3" v-model="msgText" v-if="messageTemplateId==-2" class="msg"></textarea>
                    </div>
                   
        
                    <smallbutton  @click="saveNewperson()" toplabel="Send" />
                    <smallbutton  @click="cancelupdate()" toplabel="Close"/>
                    <div>
                        <label class="responsemessage">{{message}}</label>
                   </div>
              </form>
            </template>
          </actionmodal>
        </div>
    </template>
    
    <script>
    import {mapFields} from 'vuex-map-fields'
    import datamethods from '../../services/datamethods.js'
    import format from '../../format.js'
    import smallbutton from '../controls/button.vue'
    import actionmodal from '../controls/actionmodal.vue'
    import formentry from '../controls/entry.vue'
    import linkbutton from '../controls/linkbutton.vue'
    import pencilbutton from '../controls/pencilbutton.vue'
    import securityhelper from '../../services/securityhelper.js'
    export default {
        name:'sendsms',
        components:{
            smallbutton,
            actionmodal,
            formentry,
            linkbutton,
            pencilbutton
        },
        props:{
            inperson:{
                type:Object,
                required:true
            },
            
            buttonclass:{
                type:String,
                default:'updatebutton'
            },
    
        },
        mixins:[datamethods,format,securityhelper],
        data(){
            return{
                messageTemplateId:-1,
                messageTemplateList:[],
                message:null
            }
        },
        computed:{
            ...mapFields([
 
               'loggedInUser'
            
    
            ]),
            allowCustomSMS(){
                if(window.ALLOW_CUSTOM_SMS==undefined){return false}
                else{return window.ALLOW_CUSTOM_SMS}
            },
        },
        methods:{
           start(){
            this.message=null
            this.messageTemplateId=-1
            this.msgText=null
            this.getTemplates()
            this.$refs.mymodal.openModal()
           },
            
            cancelupdate(){
                this.$refs.mymodal.closeModal()
                this.$emit('refresh')
                
            },
            async saveNewperson(){
                
                let req = {
                    person:this.inperson,
                    msgTemplateId:this.messageTemplateId,
                    msgText:this.msgText
                }
                this.$store.dispatch('beforeAPI');
                var response = await this.callAPI(req,'sendsms')
                if(response.Successful){
              
                    this.message = response.StringResponse
                    //console.log(response)
    
                   
                }else{
                    this.message = response.Message
                }
                this.pleaseWait=false;
            },
            
            async getTemplates(){
               
                //this.beforeAPI();
                var response = await this.callAPI(null,'templates_sms')
    
                //handle response
                if(response.Successful){
                    this.messageTemplateList = response.MessageTemplateList
        
                    if(this.allowCustomSMS){
                        var custom = {
                            id:-2,
                            name:'Custom Message'
                        }
                        this.messageTemplateList.unshift(custom)
                        this.messageTemplateId=-1
                    }
                    
                
                }else{
                    this.message = response.Message
                }
                this.pleaseWait=false;
            },
          
            
        }
    }
    </script>
    
    <style scoped>
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
    .updatebutton{
        height:30px;
        width:150px;
        border-radius: 5px;
        padding:3px;
        margin:0px 0px 10px 0px;
    }
    @media screen and (max-width: 812px) {
       
       .entry{
           flex-direction: column;
       }
    }
    .entry2{
       width: 80%;
       display:flex;
    
       /* justify-content: space-between; */
    }
    .entryLabel{
       margin:2px;
       font-size:medium;
       text-align: left;   
    }
    
    
    .entryCheckbox{
       margin-left:5px;
    }
    .entryText{
       margin:5px 0px 0px 0px;
       width:95%;
       font-size:medium;
     
    }
    .entrySelect2{
       margin:5px 20px 10px 20px;
       width:300px;
       font-size:medium;
    
    }
    .entryTextDiv{
       display:flex;
       flex-direction: row;
       min-width: 250px;
    }
    .entryLabelDiv{
       display:flex;
       flex-direction: row;
       min-width: 250px;
    }
    .msg{
        width:300px;
    }
    </style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    