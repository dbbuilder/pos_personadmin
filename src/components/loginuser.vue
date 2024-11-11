<template>
  <div class="loginDiv">
        <div >
        <form ref="loginform" v-on:keyup.enter="login">
            <formentrystacked inputid="user" label="email" v-model="username" />
            <formentrystacked inputid="pass" inputtype="password" label="password" v-model="password" />
            <smallbutton @click="login()" toplabel="Login"/>
            
            <div v-if="pleaseWait">
                <label for="" class="pleasewaitlabel">Please Wait...</label>
            </div> 
        </form>
        </div>
  
        <div>
            <label class="responsemessage">{{responseMessage}}</label>
        </div>
        <!-- <div class="margin10">
            <linkbutton @click="forgotpassword()" toplabel="forgot password"/>
        </div> -->
       

      <updatepassword ref="changepass" v-show="ischangepassword" :username="username" :oldpassword="oldpassword"></updatepassword>
    </div>

        
</template>

<script>
import {mapFields} from 'vuex-map-fields'
import datamethods from '../services/datamethods.js'
import formentrystacked from './controls/entry-stacked.vue'
import linkbutton from './controls/linkbutton.vue'
import smallbutton from './controls/button.vue'
import modal from './controls/modal.vue'
import updatepassword from './actions/updatepassword.vue'
import securityhelper from '../services/securityhelper'
export default {
    name:'loginuser',
    mixins:[datamethods,securityhelper],
    components:{
        formentrystacked,
        linkbutton,
        smallbutton,
        modal,
        updatepassword
        
    },
    computed:{
        ...mapFields([
            'pleaseWaitText',
            'loggedInUser',
            'loggedIn',
            'username',
            'oldpassword',
            'currentNav',
            'password'

        ]),
        useAppSecurity(){
            if(window.USE_APP_SECURITY==undefined){return false}
            else{return window.USE_APP_SECURITY}
        }
    },
    data(){
        return{
            newUserURL:window.NEW_USER_URL,
            newUserText:'Click here to create a new Account',

            pleaseWait:false,
            responseMessage:'',

            ischangepassword:false,
        }
    },
    methods:{
        changepassword(){
            this.ischangepassword=true
            this.$refs.changepass.ChangePassword();
        },
        async forgotpassword(){
            
            //validate
            if(this.username==""){
                return this.getFailureResponse("Please enter your email address and click forgot password")
              }
            let req = {
                email:this.username,
            }
            this.pleaseWait=true;
            this.responseMessage='';
            var response = await this.callAPI(req,'walletforgotpass')
            //handle response
            if(response.Successful){
                 this.responseMessage = "Please check your email for your password reset link"
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;    
        },
        async login(){
            if(this.useAppSecurity){
                this.securitylogin()
                return;
            }
            //this.username = 'admin@test.com'
            //this.password = '11111111'
            console.log('login')
            //validate
            if(this.username=="" || this.password==""){return}
            let req = {
                email:this.username,
                password:this.password
            }
            this.pleaseWait=true;
            console.log('login2')
            var response = await this.callAPI(req,'walletloginuser')
            //handle response
            if(response.Successful){

                this.loggedInUser=response.user; //store user
                this.AddUserToAPI(this.loggedInUser)
  
                this.loggedIn=true;
               
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;
  
        },
       async post_login(token){
        if(this.useAppSecurity){
                this.securitypost_login(token)
                return;
            }
            //add to api
            this.AddTokenToAPI(token)
            
            this.pleaseWait=true;
            var response = await this.callAPI(null,'walletloginuser')
            //handle response
            if(response.Successful){

                this.loggedInUser=response.user; //store user
                this.AddUserToAPI(this.loggedInUser)

                this.loggedIn=true;
                
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;
  
        },
    }
}
</script>

<style>
.loginDiv{
  margin-top:60px;
  grid-area: center;
  display:flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size:large;
}
.margin10{
    margin:10px;
}
</style>


 <!-- ADMIN MODAL -->
      <!-- <modal ref="adminModal">
        <template v-slot:header>
          <div class="horizFlex">
            <p class="subtitlebold">Admin</p>
          </div>
          
        </template>

        <template v-slot:body>
          <p class="subtitle">Do you want to view wallets as an Admin or your own Wallet? </p>
        </template>
        
        <template v-slot:footer>
          <div>
            <smallbutton toplabel="View as Admin" @click="goToAdminLookup"/>
            <smallbutton toplabel="View my Wallet" @click="goToMyWallet"/>
          </div>
        </template>
      </modal> -->

       /* goToAdminLookup(){
            this.$refs.adminModal.closeModal()
            this.isAdminWallet=false
            this.currentNav="wallet"
            this.loggedIn=true;
        },
        goToMyWallet(){
            this.$refs.adminModal.closeModal()
            this.isAdminWallet=true
            this.currentNav="wallet"
            this.loggedIn=true;
        }, */