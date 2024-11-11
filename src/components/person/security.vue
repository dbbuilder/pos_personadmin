<template>

  <div class="lookupdetail" v-if="!showReport">
      <div class="lookup">
          <form  ref="lookupform" v-on:keyup.enter="LookupPerson">
              <div class="vertFlexLeft">
                  <div class="lookupHeader">
                      <label class="titlelabel bottom10">{{lookupPromptText}} {{personTypeText}}</label>
                      <linkbutton toplabel="Clear" @click="clearLookup()" class="clearlink"/>
                  </div>
                

                <formentrystacked  label="First Name" v-model="securityFilter.lookupFirst" minlength="3" placeholder="minimum 3 characters" />
                <formentrystacked  label="Last Name" v-model="securityFilter.lookupLast" minlength="3" placeholder="minimum 3 characters"  />
                <formentrystacked  label="Email" v-model="securityFilter.lookupEmail"    />
                <formentrystacked  label="Employee #" v-model="securityFilter.lookupBadge"    />
                <div class="" v-if="canAccess('View All Locations')" >
                    <div class="">
                        <label class="entryLabel" for="">Location</label>
                    </div>
                    <div class="">
                    <select name="" id="" class='entrySelect' v-model="securityFilter.locationId"   required >
                        <option v-for="l in filterLocationList" :key="l.id" :value="l.id" >
                            {{l.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="horizFlex " v-if="showStudentsOnSecurity">
                    <input class="entryCheckbox" type="checkbox" v-model="includeStudents"  >
                    <label class="mediumtext">Set Student Worker Security</label>
                </div>
                <div class="" v-if="includeStudents" >
                    <div class="">
                    <select name="" id="" class='entrySelect' v-model="securityFilter.roleId"   required >
                        <option v-for="s in filterroleList" :key="s.id" :value="s.id" >
                            {{s.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="horizFlex ">
                    <input class="entryCheckbox" type="checkbox" v-model="securityFilter.showInactive"  >
                    <label class="mediumtext">Show Inactive</label>
                </div>
                <div class="lookupHeader">
                    
                    
                    <smallbutton @click="LookupPerson()" toplabel="Go" class="buttonprimary button smallerlookup"/>
                    <smallbutton @click="goToReport" toplabel="Security Report" class="buttonprimary button smallerlookup"/>
                </div>
                
              </div>
              </form>

              <div v-if="pleaseWait">
                  <label class="pleasewaitlabel">{{pleaseWaitText}}</label>
              </div> 
              <div>
                <label class="responsemessage">{{responseMessage}}</label>
              </div>
               <div class="resultsdiv" v-if="securitylookupresults.length>0">
                <div v-for="result in securitylookupresults" :key="result.personId" :value="result.personId" >
                    <lookupresult :topLeft="result.name"  bottomLeft=""    @click="selectPerson(result)"
                        :selected="result.personId==securityselectedResultID" :inactive="!result.isActive">
                   
                    </lookupresult>  
                </div>
              </div>
              
              
      </div>

      
       
        <div v-if="securityselectedResultID>0" class="pad10">
            <div class="bordered">
                <div class="horizFlexStretch">
                    <div class="horizFlex">
                        <label class="titlelabel bold right10">{{securityselectedResultName}} </label>
                        <updatesecurity  @refresh="refresh"  />
                    </div>
                    

                </div>
                
                <div class="vertFlex">
                        <div v-for="sa in securityList" :key="sa.id" :value="sa.id" class="leftjustified">
                            <label class=" bold ">{{getName(sa)}} </label>
                            <div v-for="sai in sa.itemList" :key="sai.id" :value="sai.id" class="horizFlex margin5">
                                <img :src="checkImage"  class="checkimage" v-if="sai.selected">
                                <div class="checkimage" v-if="!sai.selected">

                                </div>
                                 <!-- <input type="checkbox" v-model="sai.selected" :disabled="paramTrue"/>  -->
                                <label>{{getName(sai)}} </label>
                            </div>
                            <br>
                        </div>
                    </div>
                    
                
            </div>

        </div>
      
      
  </div>
  <securityreport ref="securityreport" @close="showReport=false" v-if="showReport"/>
</template>

<script>
import {mapFields} from 'vuex-map-fields'
import datamethods from '../../services/datamethods.js'
import format from '../../format.js'
import smallbutton from '../controls/button.vue'
import formentrystacked from '../controls/entry-stacked.vue'
import entrySelect from '../controls/entry-select.vue'
import lookupresult from '../controls/lookupresult.vue'
import linkbutton from '../controls/linkbutton'
import formentrycheck from '../controls/entrycheck.vue'
import addadmintrans from './addadmintrans.vue'
import securityhelper from '../../services/securityhelper.js'
import updatesecurity from '../actions/updatesecurity.vue'
import securityreport from '../actions/securityreport.vue'
export default {
    name:'security',
    mixins:[datamethods, format,securityhelper],
    components:{
        smallbutton,
        formentrystacked,
        entrySelect,
        lookupresult,
        linkbutton,
        formentrycheck,
        updatesecurity,
        addadmintrans,
        securityreport
 
    },
    data(){
        return{
     
            paramTrue:true,
            paramFalse:false,   
            
            lookupPromptText:"Lookup",
            responseMessage:'',
            
            listenersConnected:true,
            trueParam:true,
            
            resetMsg:'',
            filterLocationList:[],
            filterroleList:[],
            includeStudents:false,
            showReport:false
        }
    },
    computed:{
        checkImage(){
            return require("@/assets/check.png")
        },
        ...mapFields([
            
            'loggedInUser.isAdmin',
            'loggedInUser',
            'pleaseWait',
            'pleaseWaitText',
            'securityFilter',
           'securitylookupresults',
           'securitycurrentPerson',
           'securityselectedResultID',
           'selectedEmployeeSecurityItems',
           'securityList',
           'securityselectedResultName'

        ]),
        showStudentsOnSecurity(){
           
            if(window.SHOW_STUDENTS_ON_SECURITY==undefined){
                return false
            }else{return window.SHOW_STUDENTS_ON_SECURITY}
       
        }
  
    },
    props:{
        personTypeText:{
            type:String,
            default:'Employee'
        },
        
        
    },
    methods:{
        goToReport(){
            this.showReport=true
            this.$nextTick(()=>{
                this.$refs.securityreport.Update()
            })
        },
        getName(s){
            if(s.displayName!=null){
                return s.displayName
            }else{return s.name}
        },
        async getRoles(){
            let req = {
                locationId:-1,
                employeeOnly:false,
                studentOnly:true
            }
            //this.beforeAPI();
            var response = await this.callAPI(req,'rolelist')

            //handle response
            if(response.Successful){
            this.filterroleList = response.PersonRoleList
    
                var all = {
                    id:-1,
                    name:'Any Role'
                }
                this.filterroleList.unshift(all)
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
       
        clearLookup(){
            this.$store.dispatch('clear_securityFilter');     
        },
       
        async LookupPerson(){
            this.responseMessage=""

            if(this.includeStudents && this.securityFilter.roleId==-1){
                this.responseMessage="Please select a Role when looking up students"
                return
            }

            if(!this.includeStudents){this.securityFilter.roleId=-1}

            //validate
            let req = {
                lookup:{
                    FirstName:this.securityFilter.lookupFirst,
                    LastName:this.securityFilter.lookupLast,
                    EmailAddress:this.securityFilter.lookupEmail,
                    BadgeNumber:this.securityFilter.lookupBadge,
                    showInactive:this.securityFilter.showInactive,
                    restrictToEmployees:!this.includeStudents,
                    restrictToStudents:this.includeStudents,
                    locationId:this.securityFilter.locationId,
                    roleId:this.securityFilter.roleId
                }
            }
            this.$store.dispatch('beforeAPI');
            
            var response = await this.callAPI(req,'personlookup')
            //handle response
            if(response.Successful){
                 this.securitylookupresults =response.ResultList;
                 this.$store.dispatch('setCurrentDateTime');
                if(this.securitylookupresults.length==0){this.responseMessage="No " + this.personTypeText + " found. Please try again."}
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;    
           
        },
        selectPerson(result){
            this.securityselectedResultID=result.personId
            this.securityselectedResultName = result.name
            //this.getPerson(result.personId)
            this.getSecurityAppItemList()
        },
        async getSecurityAppItemList(){
            if(this.securityselectedResultID<=0){return}
            let req = {
                employeeId:this.securityselectedResultID,
                appName:null
            }
            //call api
            var response = await this.callAPI(req,'securityappitems')
            //handle response
            if(response.Successful){
              this.selectedEmployeeSecurityItems=response.SecurityAppItemList
                this.updateSecurityList()
               
            }else{
              this.responseMessage = response.Message
            }
           
        },
        updateSecurityList(){
            var sList = this.securityList

            //first reset
            sList.forEach(myFunction5)
                        function myFunction5(item, index, arr) {
                            var saiList = arr[index].itemList
                            saiList.forEach(myFunction6)
                                function myFunction6(item, index, arr) {
                                    let sai=arr[index]
                                    
                                        sai.selected=false
                                        sai.dirty=false
                                     
                                }
                            
                        }


            this.selectedEmployeeSecurityItems.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    let a=arr[index]
                    var id = a.id
                    var canAccess = a.canAccess
                    sList.forEach(myFunction3)
                        function myFunction3(item, index, arr) {
                            var saiList = arr[index].itemList
                            saiList.forEach(myFunction4)
                                function myFunction4(item, index, arr) {
                                    let sai=arr[index]
                                   // console.log(id + ' ' + sai.id)
                                    if(id==sai.id){
                                        sai.selected=canAccess
                                     }
                                }
                            
                        }

                }

        },
        async getPerson(id,autoreset=false){
            console.log('refresh')
            //let prev = this.securitycurrentPerson.personId
            let req = {
                person:{ID:id}
            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'getperson')
            //handle response
            if(response.Successful){
                console.log('got sec items')
                 this.securitycurrentPerson =response.Person;
                 
                 
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;  

        },
        refresh(){
            this.getSecurityAppItemList()
            //this.getPerson(this.securityselectedResultID)
        },
        refreshnew(id){
            this.LookupPerson()
            this.securityselectedResultID=id
            this.getPerson(this.securityselectedResultID,true)
        },
       
        async getLocationList(){

                        
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(null,'locations')

            //handle response
            if(response.Successful){
                this.filterLocationList = response.locationList
                var all = {
                    id:-1,
                    name:'Any Location'
                }
                this.filterLocationList.unshift(all)
                this.securityFilter.locationId = this.loggedInUser.LocationId
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
            },

            async getSecurityList(){

                        
                //call api
                this.$store.dispatch('beforeAPI');
                var response = await this.callAPI(null,'securitylist')

                //handle response
                if(response.Successful){
                    this.securityList = response.appList
            
                }else{
                    this.message = response.Message
                }
                this.pleaseWait=false;
                },
    },
    mounted(){
        this.getLocationList()
        this.getSecurityList()
        this.securityselectedResultID=0
       this.getRoles()
    }
}
</script>

<style>
.checkimage{
    width:18px;
}
</style>