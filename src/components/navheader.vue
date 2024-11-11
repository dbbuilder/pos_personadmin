<template>
  <header>
        <div class="logoArea">
            <img alt="school logo" :src="schoolLogoFilePath"  class="logo" v-if="showHeader">
        </div>

        <div class="navArea" v-if="loggedIn">
            <button :class="navButtonClass('employee')" @click="selectNav('employee')">
                Employees
            </button>
            <button :class="navButtonClass('student')" @click="selectNav('student')">
                Students
            </button>
            <button :class="navButtonClass('security')" @click="selectNav('security')" v-if="canAccess('Security')">
                Security
            </button>
            <uploadfile buttonclass="unselectedNav" v-if="showImport" />
        </div>  
        
        <div class="userArea vertFlex rightjustified" v-if="loggedIn && showHeader">
            <p class="userlabel bold">{{loggedInUser.name}}</p>     
            <linkbutton @click="logout()" toplabel="Logout" />
            <!-- <updatepassword :isAdminChangePassword="false"   :username="username" /> --> 
        </div>
        
    </header>
</template>

<script>
import {mapFields} from 'vuex-map-fields'
import linkbutton from './controls/linkbutton.vue'
// import updatepassword from './actions/updatepassword.vue'
import datamethods from '../services/datamethods'
import securityhelper from '../services/securityhelper.js'
import uploadfile from './actions/uploadfile.vue'
export default {
    name: "navheader",
    components:{
        linkbutton,
        uploadfile
       
    },
    mixins:[datamethods,securityhelper],
    data() {
        return {
            // schoolLogoFilePath:'./../' + window.SCHOOL_LOGO,
            schoolname:window.SCHOOL_NAME,
        };
    },
    computed:{
        ...mapFields([
            'currentNav',
            'loggedIn',
            'loggedInUser',
            'lastRefreshDateTime',
            'username',
            'oldpassword',
            'logoOverride',
            'imageBasePath',
            'showHeader'
        ]),
        schoolLogoFilePath(){
            
                return './../' + window.SCHOOL_LOGO
            

        },
        showOpenClose(){
            if(window.SHOW_OPEN_CLOSE==undefined){return true}
            else{return window.SHOW_OPEN_CLOSE}
        },
        showImport(){
            if(window.SHOW_IMPORT==undefined){return false}
            else{return window.SHOW_IMPORT}
        }
    },
    methods:{
        selectNav(name){
            this.currentNav=name;
           
        },
        navButtonClass(name){
            if(this.currentNav==name){
                return "selectedNav"
            }else{
                return "unselectedNav"
            }
        },
        logout(){
            this.currentNav=''
            this.$store.dispatch('clear_security');     
            this.loggedIn=false;
        },
        /* async getImageBasePath(){
            //call api
            var response = await this.callAPI_Image(null,'imagepath')
            //handle response
            if(response.Successful){
                this.imageBasePath = response.StringResponse
            }else{
                this.responseMessage = response.Message
            }
        }, */
    },
    mounted(){
        //this.getImageBasePath();
    }
}
</script>

<style>
header{

    padding:10px 20px 10px 10px;
    display:grid;
    grid-template-columns:2fr 4fr 2fr;
    grid-template-rows:auto;
    grid-template-areas: 
        "logo nav user";
    font-size:medium;
    background-color:var(--header-color);
 
}
.logo{
    max-width: 100%;
    max-height:75px;
}
.navArea{
    padding:0px;
    margin:0px;
    display:flex;
    flex-direction: row;
}
.selectedNav{
    color:var(--light-text-color);
    background-color:var(--button-color);
    border: 4px solid var(--highlight-button-color);
    border-radius:2px;
    width:130px;
    height:50px;
    padding:0px;
    font-size: medium;
     margin:10px;

}
.unselectedNav{
    color:var(--light-text-color);
    background-color:var(--button-color);
    border: none;
    border-radius:2px;
    width:130px;
    height:50px;
    padding:0px;
    font-size: medium;
    margin:10px;
}
.schoolname{
    font-size:large;
    text-align: center;
    margin:0px 0px 0px 20px;
}
.userlabel{
   
    margin:0px 0px 10px 0px;
    
}
.userArea{
  grid-area:user;
}
.modeImage{
    height:25px;
    margin:5px;
}
.buttoninside{
  display:flex;
  flex-direction: column;
  margin:0px;
    padding:0px;
}
.buttonlabel{
    margin:0px;
}
</style>