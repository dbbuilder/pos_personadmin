<template>
  <div class="outerDiv" :style="configStyle">
        <navheader/>

        <div class="mainDivAdmin">
            <loginuser ref="loginuser" v-if="!loggedIn"/>
            <div v-if="loggedIn">
                <!-- <person v-if="currentNav=='employee'" personTypeText="Employee" :personcurrentPerson="employeecurrentPerson" 
                    :personFilter="employeeFilter" :personlookupresults="employeelookupresults" :personselectedResultID="employeeselectedResultID" />
                <person v-if="currentNav=='student'" personTypeText="Student" :personcurrentPerson="studentcurrentPerson" 
                    :personFilter="studentFilter" :personlookupresults="studentlookupresults" :personselectedResultID="studentselectedResultID" /> -->
                <employee v-if="currentNav=='employee'" personTypeText="Employee" ref="employeeview"/>
                <student v-if="currentNav=='student'" personTypeText="Student" ref="studentview"/>
                <security v-if="currentNav=='security'" ref="securityview"/>
                
            </div>
        </div>

        <!-- <spfooter/>   -->
        
  </div>
</template>

<script>
import {mapFields} from 'vuex-map-fields'
import style from '../style.js'
import format from '../format.js'
import datamethods from '../services/datamethods.js'
import spfooter from './footer.vue'
import navheader from './navheader.vue'
import loginuser from './loginuser.vue'
import employee from './person/employee.vue'
import student from './person/student.vue'
import security from './person/security.vue'
import person from './person/person.vue'

export default {
    components:{
        spfooter,
        navheader,
        loginuser,
        employee,
        student,
        security,
        person,
        
    
    },
    mixins:[datamethods, format,style],
    computed:{
        ...mapFields([
            'loggedIn',
            'currentNav',
            'username',
            'oldpassword',
            'loggedInUser.isAdmin',
            'logoOverride',
           'showHeader',
           'imageBasePath',
           'statusList',
           'mealplanList',
           'locationList',
           'tuitionPaymentTypeList',
           'referredByList',
           'states',
           'employeeFilter',
           'employeelookupresults',
           'employeecurrentPerson',
           'employeeselectedResultID',
           'studentFilter',
           'studentlookupresults',
           'studentcurrentPerson',
           'studentselectedResultID',
           'newPersonRequiredFieldsList'

  

        ]),
        
       
    },
    methods:{
        async getImageBasePath(){
            //call api
            var response = await this.callAPI(null,'imagepath_api')
            //handle response
            if(response.Successful){
                
                this.imageBasePath = window.VUE_CONFIG_API + response.StringResponse
               // console.log(this.imageBasePath)
            }else{
                this.responseMessagemessage = response.Message
            }
        },
        async getStatusList(){

            
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(null,'employeestatus')

            //handle response
            if(response.Successful){
                this.statusList = response.ValueList
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        
        async getStatusRequiredFieldsList(){

            if(window.OVERRIDE_REQUIRED_BY_GROUP==undefined){return}
            if(window.OVERRIDE_REQUIRED_BY_GROUP==false){return}

            //call api
            let req = {
                id:-1
            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'studentgrouprequiredfields')

            //handle response
            if(response.Successful){
                this.newPersonRequiredFieldsList = response.NewPersonRequiredFieldsList
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
            },
       async getstates(){
            this.message = ''
            var response = await this.callAPI(null,'states')    
            if(response.Successful){
                this.states=response.stateList
            }else{
                this.message = response.Message
            }

        },
        async getReferredByList(){
            
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(null,'referredby')

            //handle response
            if(response.Successful){
                this.referredByList = response.PersonList
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        async getTuitionPaymentTypeList(){
            
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(null,'gettuitionpaymenttype')

            //handle response
            if(response.Successful){
                this.tuitionPaymentTypeList = response.TuitionPaymentTypeList
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        async getLocations(){
            
            this.$store.dispatch('beforeAPI');;
            var response = await this.callAPI(null,'locations')

            //handle response
            if(response.Successful){
                this.locationList= response.locationList
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        
        },
        async getMealPlanList(){
            //console.log('getMealPlans')
            
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(null,'mealplanlist')

            //handle response
            if(response.Successful){
                this.mealplanList = response.MealPlanList
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        refreshCurrentView(){
            switch (this.currentNav) {
                case 'employee':
                    this.$refs.employeeview.refresh()
                    break;
                case 'student':
                    this.$refs.studentview.refresh()
                    break;
                case 'security':
                    this.$refs.securityview.refresh()
                default:
                    break;
            }
        },
        receiveMessage(event){
            try{
                var msg =  JSON.parse(event.data)
            }
            catch(err){
                return
            }
            
            var action = msg.action
            if(action !=undefined){
            
               // console.log("PA Receive Msg: " + action)
                switch (action) {
                    case 'refresh':
                        this.refreshCurrentView()
                        break;
                    case 'appupdate':
                        location.reload(true);
                    default:
                        break;
                }
                
            }
        }
    },
    mounted(){
        //to receive msgs
        window.addEventListener('message', this.receiveMessage)

        this.setColors();
         this.getImageBasePath();
         this.getStatusList();
         this.getStatusRequiredFieldsList();
         this.getLocations()
        this.getstates()
        this.getReferredByList()
        this.getTuitionPaymentTypeList()
        this.getMealPlanList()
        let urlParams = new URLSearchParams(window.location.search)
        let tmp = urlParams.get('email')
        if(tmp!=null){
            this.username = tmp;
        }

        let tmp2 = urlParams.get('temp')
        if(tmp2!=null){
            this.oldpassword = tmp2;
            this.$nextTick(()=>{
            //this.changepass()
            this.$refs.loginuser.changepassword();
            });
        }

    
        let tmp4 = urlParams.get('config')
        if(tmp4!=null){this.configOverride=tmp4 }

        

        //console.log("inmount")
        window.onbeforeunload= function(event){
            event.preventDefault()
        }

        tmp = urlParams.get('header')
        if(tmp!=null){this.showHeader=tmp=='true'; }

        tmp = urlParams.get('token')
        if(tmp!=null){
            console.log('sso!')
            this.$refs.loginuser.post_login(tmp)
         }
         
    }
}
</script>

<style lang="scss">
@import "@/assets/stylebase.scss";

body{
  height:100vh; 
  height: -webkit-fill-available;
  width:100vw;
  padding:0px;
  margin:0px;
  font-size:medium;
  color:var(--text-color);
}
.outerDiv{
  margin:0px;
  padding:0px;
    height:95vh;
    display:grid;
    grid-template-rows:90px auto;

}

.mainDivAdmin{
  
     grid-row:2;

    background-color:var(--background-color);
    padding:20px;

     
}

.bordered{
    background-color: var(--frame-color);
    border-radius:5px;
    margin:10px 0px 10px 0px;
    padding:20px;
}
.lookupdetail{
     margin:0px;
    display:grid;
    grid-template-columns:1fr 4fr;
    grid-template-rows:auto;
    grid-template-areas: 
    "lookup detail"
}
.splitDiv{
    border-radius:5px;
    margin:20px 0px 0px 0px;
    padding:0px;
    display:grid;
    grid-template-columns:1fr 1fr;
    text-align: left;
}
.lookupHeader{
  display:flex;
  padding:0px;
  flex-direction: row;
  margin:0px 0px 0px 0px ;
  justify-content:space-between;
  width:100%;
}
.dataitem{
    display:grid;
    grid-template-columns: 130px auto;
    margin:0px;
    padding:0px;
}
.dataitemwithcheck{
    display:grid;
    grid-template-columns: 100px auto 25px 150px;
    margin:0px;
    padding:0px;
}
.dataitem p{
    margin:3px;
}
.dataitemwithcheck p{
    margin:3px;
}
.innerbutton{
    height:40px;
    border-radius: 5px;
}
.resultsdiv{

    height:310px;
    overflow-x:hidden;
    overflow-y:scroll;
}
hr{
    border:solid 1px lightgray;
    width:95%;  
    margin-top:20px;
    margin-bottom:20px;
}
.recordImage{
  width:70px;
  transition: height 1s;
}
.recordImageEnlarged{
  width:100px;
}
.recordImage:hover{
  width:100px;
}
.imageAndCaption{
    padding:10px;
    display:grid;
    grid-template-rows:auto 40px;
    text-align: center;
}
.redtext{
    color:red;
}
.greentext{
    color:green;
}
.entryTextDiv{
    display:flex;
    flex-direction: row;
    min-width: 250px;
}
.entryTextDivNarrow{
    display:flex;
    flex-direction: row;
    min-width: 200px;
}
.entry{
    width: 100%;
    display:flex;

    justify-content: space-between;
}
.entryLabel{
    margin:5px;
    font-size:medium;
    text-align: left;   
}
.statusdiv{
    width:400px;
}
.photobutton{
    height:20px;
    width:68px;
    border-radius: 5px;
    border:none;
    background-color:var(--button-color);
    color:var(--light-text-color);
    margin-right:3px;
    font-size:medium;
}
</style>