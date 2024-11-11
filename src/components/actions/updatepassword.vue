<template>
<div>
    <linkbutton :toplabel="title" @click="ChangePassword()"/>
    <!-- ACCT NOTE MODAL -->
      <actionmodal ref="mymodal"> 
        <template v-slot:body>
            <div >
                <form ref="changepassform" v-on:keyup.enter="SaveNewPassword">
                <label class="titlelabel">{{title}}</label>
                <div v-if="!isAdminChangePassword">
                    <formentrystacked inputid="old" inputtype="password" label="Old password" v-model="oldp"  isrequired="true" />
                </div>
                
                <formentrystacked  inputid="new" inputtype="password" label="New password" v-model="newpassword" minlength="8" isrequired="true" placeholder="minimum 8 characters"/>
                <formentrystacked inputid="confirm" inputtype="password" label="Confirm New password" v-model="confirmpassword" minlength="8" isrequired="true" placeholder="minimum 8 characters"/>
                <smallbutton @click="SaveNewPassword()" toplabel="Save"/>
                <smallbutton @click="$refs.mymodal.closeModal()" toplabel='Close' buttonclass="button buttonhighlight" />
                <div v-if="pleaseWait">
                    <label for="" class="pleasewaitlabel">Please Wait...</label>
                </div> 
                </form>
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
import datamethods from '../../services/datamethods.js'
import format from '../../format.js'
import smallbutton from '../controls/button.vue'
import actionmodal from '../controls/actionmodal.vue'
import formentrystacked from '../controls/entry-stacked.vue'
import linkbutton from '../controls/linkbutton.vue'
export default {
    name:'updateparent',
    components:{
        smallbutton,
        actionmodal,
        formentrystacked,
        linkbutton
    },
    props:{
        title:{
            type:String,
            default:'Change Password'
        },
        isAdminChangePassword:{
            type:Boolean,
            default:false
        },
        username:{
            type:String,
        },
        oldpassword:{
            type:String
        }
    },
    mixins:[datamethods, format],
    data(){
        return{
            responseMessage:'',
            newpassword:'',
            confirmpassword:'',
            pleaseWait:false,

        }
    },
    computed:{
         ...mapFields([
            
        ]),
        oldp(){
            return this.oldpassword;
        }
    },
    methods:{
        ChangePassword(){
            console.log('inchpass in uppass')
            this.$refs.mymodal.openModal();
        },
        async SaveNewPassword(){
            if(this.$refs.changepassform.checkValidity()==false){return}
            if(this.newpassword!=this.confirmpassword){
                this.responseMessage = "Your passwords do not match. Please try again."
                return
            }
            let req = {
                email:this.username,
                oldpassword:this.oldpassword,
                newpassword:this.newpassword,
            }
            this.pleaseWait=true
            this.responseMessage=''
            var response = await this.callAPI(req,'walletchangepass')

            if(response.Successful){
                if(this.isAdminChangePassword){
                    this.responseMessage="The password was changed succesfully."
                   
                }else{
                    this.responseMessage="Your password was changed succesfully."
                }
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;
        },
        
    
    }
}
</script>

<style>
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
</style>

































       