<template>
  <div class="lookupdetail">
      <div class="lookup">
          <form  ref="lookupform" v-on:keyup.enter="LookupPerson">
              <div class="vertFlexLeft">
                  <div class="lookupHeader">
                      <label class="titlelabel bottom10">{{lookupPromptText}} {{personTypeText}}</label>
                      <linkbutton toplabel="Clear" @click="clearLookup()" class="clearlink"/>
                  </div>
                

                <formentrystacked  label="First Name" v-model="employeeFilter.lookupFirst" minlength="3" placeholder="minimum 3 characters" />
                <formentrystacked  label="Last Name" v-model="employeeFilter.lookupLast" minlength="3" placeholder="minimum 3 characters"  />
                <formentrystacked  label="Email" v-model="employeeFilter.lookupEmail"    />
                <formentrystacked  label="Employee #" v-model="employeeFilter.lookupBadge"    />
                <div class="" v-if="canAccess('View All Locations')" >
                    <div class="">
                        <label class="entryLabel" for="">Location</label>
                    </div>
                    <div class="">
                    <select name="" id="" class='entrySelect' v-model="employeeFilter.locationId"   required >
                        <option v-for="l in filterLocationList" :key="l.id" :value="l.id" >
                            {{l.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="horizFlex ">
                    <input class="entryCheckbox" type="checkbox" v-model="employeeFilter.showInactive" >
                    <label class="mediumtext">Show Inactive</label>
                </div>
                <div class="lookupHeader">
                    <updateperson :isAdd="trueParam" :inperson="newPerson" @refreshnew="refreshnew" :personTypeText="personTypeText" buttonclass="buttonprimary button smallerlookup" />
                    
                    <smallbutton @click="LookupPerson()" toplabel="Go" class="buttonprimary button smallerlookup"/>

                </div>
                
              </div>
              </form>

              <div v-if="pleaseWait">
                  <label class="pleasewaitlabel">{{pleaseWaitText}}</label>
              </div> 
              <div>
                <label class="responsemessage">{{responseMessage}}</label>
              </div>
               <div class="resultsdiv" v-if="employeelookupresults.length>0">
                <div v-for="result in employeelookupresults" :key="result.personId" :value="result.personId" >
                    <lookupresult :topLeft="result.name"  bottomLeft=""    @click="selectPerson(result)"
                        :selected="result.personId==employeeselectedResultID" :inactive="!result.isActive">
                   
                    </lookupresult>  
                </div>
              </div>


      </div>

      
       
        <div v-if="employeeselectedResultID>0" class="pad10">
            <div class="bordered">
                <div class="horizFlexStretch">
                    <div class="horizFlex">
                        <label class="titlelabel bold right10">{{employeecurrentPerson.Name}} </label>
                        <updateperson :inperson="employeecurrentPerson" @refresh="refresh"  :personTypeText="personTypeText"/>
                    </div>
                    <linkbutton toplabel="Refresh" @click="refresh()" class="clearlink"/>
                </div>
                <div class="splitDiv ">
                    <!-- left col -->
                    <div class="leftjustified vertFlex padright">
                        
                        
                        <div class="dataitem" v-if="isVisible('ID')">
                            <p >Employee #:</p>
                            <p >{{employeecurrentPerson.StudentID}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Location')">
                            <p >Location:</p>
                            <p >{{employeecurrentPerson.LocationName}}</p>
                        </div>
                        <div class="dataitem" v-if="isVisible('PersonRole')">
                            <p >Role:</p>
                            <p >{{employeecurrentPerson.PersonRoleName}}</p>
                        </div>
                        <div class="dataitem" v-if="isVisible('Pin')">
                            <p >Pin:</p>
                            <p >{{employeecurrentPerson.Pin}}</p>
                        </div>
                        <hr/>
                        <div class="dataitem"  v-if="isVisible('Birthdate')">
                            <p >Birthdate:</p>
                            <p >{{employeecurrentPerson.Birthdate}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('DL')">
                            <p >DL:</p>
                            <p >{{employeecurrentPerson.InternalID}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('SSN')">
                            <p >SSN:</p>
                            <p >{{employeecurrentPerson.fId}}</p>
                        </div>
                        <hr/>
                        <div class="dataitem"  v-if="isVisible('Course')">
                            <p >Course:</p>
                            <p >{{employeecurrentPerson.ProductString}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('TuitionPaymentType')">
                            <p >Sponsor: </p>
                            <p >{{employeecurrentPerson.TuitionPaymentTypeName}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('ReferredBy')">
                            <p >Recruiter:</p>
                            <p >{{employeecurrentPerson.referredBy}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Mealplan')">
                            <p >Meal Plan:</p>
                            <p >{{employeecurrentPerson.MealPlan}}</p>
                        </div>
                        <hr/>

                        <div v-if="showLocationsEmployee" class="vertFlex">
                            <label class="  right10">Locations:</label>
                            <div v-for="pl in sortedLocationList" :key="pl.LocationID" :value="pl.LocationID" >
                                <div class="locationdiv2">
                                    <img src="@/assets/check.png" class="locationcheck2" v-if="pl.IsActive" />
                                    <p v-if="!pl.IsActive"></p>
                                    <p class="margin5">{{pl.Name}}</p>
                                </div>
                                
                            </div>
                        </div>

                        <hr/>
                        <label v-if="isVisible('Pictures')">Photos</label>
                        <div class="horizFlex" v-if="isVisible('Pictures')">
                            
                               <div class="vertFlex imageAndCaption">
                                    <div>
                                        <img :src="getImage(imagePathPerson)"  alt="" :class="recordImageClass('person')" @click="toggleImageSize(image,$event.currentTarget,'person')">
                                    </div>
                                    
                                    <p class="imageCaption">
                                       Person
                                    </p>
                                    <div>
                                        <button v-if="personImageEnlarged" @click="$refs.imgedit.openModal()" class="photobutton">Edit</button>
                                        <button v-if="personImageEnlarged" @click="$refs.imgall.openModal()" class="photobutton">Replace</button>
                                    </div>
                                    
                                </div>
                                <div class="vertFlex imageAndCaption">
                                    <div>
                                        <img :src="getImage(imagePathDLFront)"  alt="" :class="recordImageClass('front')" @click="toggleImageSize(image,$event.currentTarget,'front')">
                                    </div>
                                    <p class="imageCaption">
                                       Front
                                    </p>
                                    <div>
                                        <button v-if="frontImageEnlarged" @click="$refs.imgedit.openModal()" class="photobutton">Edit</button>
                                        <button v-if="frontImageEnlarged" @click="$refs.imgall.openModal()" class="photobutton">Replace</button>
                                    </div>
                                    
                                </div>
                                <div class="vertFlex imageAndCaption">
                                    <div>
                                        <img :src="getImage(imagePathDLBack)"   alt="" :class="recordImageClass('back')" @click="toggleImageSize(image,$event.currentTarget,'back')">
                                    </div>
                                    <p class="imageCaption">
                                       Back
                                    </p>
                                    <div>
                                        <button v-if="backImageEnlarged"  @click="$refs.imgedit.openModal()" class="photobutton">Edit</button>
                                        <button v-if="backImageEnlarged" @click="$refs.imgall.openModal()" class="photobutton">Replace</button>
                                    </div>
                                </div>
                           
                        </div>
                    </div>

                    <!-- right col -->
                    <div class="leftjustified vertFlex ">
                        
                        <div class="dataitemwithcheck"  v-if="isVisible('Email')">
                            <p >Email:</p>
                            <p >{{employeecurrentPerson.EmailAddress}} </p>

                            <input class="entryCheckbox" type="checkbox" :checked="employeecurrentPerson.optInForEmail"  disabled=true >
                            <label class="mediumtext">Accept Emails</label>
                            
                        </div>
                        <div class="dataitemwithcheck"  v-if="isVisible('Phone')">
                            <p >Phone:</p>
                            <p >{{employeecurrentPerson.PhoneNumber1}}</p>
                        
                            <input class="entryCheckbox" type="checkbox"  :checked="employeecurrentPerson.optInForText" disabled=true >
                            <label class="mediumtext">Accept Texts</label>
                            
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >Address:</p>
                            <p >{{employeecurrentPerson.AddressLine1}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >Address 2:</p>
                            <p >{{employeecurrentPerson.AddressLine2}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >City/ST/Zip:</p>
                            <p >{{employeecurrentPerson.City}}, {{employeecurrentPerson.StateName}} {{employeecurrentPerson.ZipCode}}</p>
                        </div>
                        <hr>
                        
                        
                        <div class="horizFlexStretch" v-if="showPayInfo">
                            <div>
                                <div class="dataitem"  v-if="isVisible('Due')">
                                    <p >Due:</p>
                                    <p class="redtext" >{{toCurrency(employeecurrentPerson.accountDue)}}</p>
                                </div>
                                <div class="dataitem"  v-if="isVisible('Balance')">
                                    <p >Balance:</p>
                                    <p class="greentext">{{toCurrency(employeecurrentPerson.accountBalance)}}</p>
                                </div>
                            </div>
                            <linkbutton toplabel="Take Payment" class="innerbutton"  @click="gotopayment" v-if="!showPayNoFA"/>
                            <addadmintrans :showButton="paramFalse" :accountId="employeecurrentPerson.accountID"  
                                buttonclass="buttonprimary button innerbutton" @refresh="refresh()"/>
                        </div>
        
                        <hr v-if="showPayInfo"/>

                        <!-- status -->
                        <div class="horizFlexStretch">
                            <div>
                                
                                <div class="dataitem"  v-if="isVisible('Status')">
                                    <p >Current Status:</p>
                                    <p  >{{employeecurrentPerson.statusName}}</p>
                                </div>
                                
                            </div>  
                            <linkbutton toplabel="Change Status" class="innerbutton" @click="showStatus=true"/>
                        
                            
                        </div>
                        <div v-if="showStatus" class="statusdiv">
                                <div class="entry" >
                                    <div class="entryTextDivNarrow">
                                        <label class="entryLabel" for="">Select New Status</label>
                                    </div>
                                    <div class="entryTextDivNarrow">
                                        <select name="" id="" class='entrySelect' @change="selectStatus()" v-model="employeecurrentPerson.statusID" >
                                            <option v-for="status in statusList" :key="status.ID" :value="status.ID" >
                                                {{status.Name}}
                                            </option>
                                        </select>
                                    </div>
                                    
                                </div>
                                <div class="entry" v-if="newStatusName=='Graduated'">
                                    <div class="entryTextDivNarrow">
                                        <label class="entryLabel" for="">Graduation Date</label>
                                    </div>
                                    <div class="entryTextDivNarrow">
                                <input type="date" class='entrySelect' v-model="gradDate"/>
                                    </div>
                                </div>
                            
                                <smallbutton toplabel="Save" class="innerbutton" @click="saveStatus()"/>
                                <smallbutton toplabel="Cancel" class="innerbutton" @click="cancelStatus()"/>
                        </div>
                        <hr/>

                        <smallbutton toplabel="Send Reset Password Email" class="innerbutton" @click="resetpassword"/>
                        <label>{{resetMsg}}</label>
                    </div>
                </div>
                
            </div>

        </div>
      
        <!-- ACTIONS -->
        <imageeditor ref="imgedit" :img="selectedImageURL" @save="saveedits"/>
        <imageall ref="imgall" :img="selectedImageURL" @saveimg="saveedits" :allowFileSelect="paramTrue" :showImage="paramFalse"/>
        <modalmessage ref="modalmessage" title="RESET PASSWORD" body="Please check your email for your password reset link. It may be delivered to your Spam/Junk folder."/>
  </div>
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
import updateperson from '../actions/updateperson.vue'
import formentrycheck from '../controls/entrycheck.vue'
import imageeditor from '../controls/ImageEditor.vue'
import imageall from '../controls/ImageAll.vue'
import addadmintrans from './addadmintrans.vue'
import securityhelper from '../../services/securityhelper.js'
import modalmessage  from '../controls/modalmessage.vue'
export default {
    name:'employee',
    mixins:[datamethods, format,securityhelper],
    components:{
        smallbutton,
        formentrystacked,
        entrySelect,
        lookupresult,
        linkbutton,
        updateperson,
        formentrycheck,
        imageeditor,
        imageall,
        addadmintrans,
        modalmessage
 
    },
    data(){
        return{
            showStatus:false,
            newStatusName:null,
            newStatusActive:true,
            
            selectedImageURL:null,
            personImageEnlarged:false,
            frontImageEnlarged:false,
            backImageEnlarged:false,
            selectedImageType:'',
            paramTrue:true,
            paramFalse:false,   
            
            lookupPromptText:"Lookup",
            responseMessage:'',
            
            listenersConnected:true,
            trueParam:true,
            

            newPerson:{
                ID:-1,
                FirstName:null,
                LastName:null,
                LocationID:-1
            },
            resetMsg:'',
            filterLocationList:[],
        }
    },
    computed:{
        showLocationsEmployee(){
            
            if(window.SHOW_LOCATIONS_EMPLOYEE==undefined){return false}
            else{return window.SHOW_LOCATIONS_EMPLOYEE}
        },
        showPayInfo(){
            if(window.SHOW_PAY_INFO==undefined){
                return true
            }else{return window.SHOW_PAY_INFO}
        },
        
        autoResetPasswordNew(){
            if(window.AUTO_RESET_PASSWORD_NEW_EMPLOYEE==undefined){
                return false
            }else{return window.AUTO_RESET_PASSWORD_NEW_EMPLOYEE}
        },
        showPayNoFA(){
            if(window.SHOW_PAY_NO_FA==undefined){
                return true
            }else{return window.SHOW_PAY_NO_FA}
        },
        //image
        imagePathPerson(){

            var path = this.employeecurrentPerson.personImageFileName;
            if(path==''){return}
            return path
            /* console.log(this.imageBasePath + path)
            return this.imageBasePath + path; */
        },
        imagePathDLFront(){

            var path = this.employeecurrentPerson.licenseFrontFileName;
            if(path==''){return}
            return path
            /* console.log(this.imageBasePath + path)
            return this.imageBasePath + path; */
        },
        imagePathDLBack(){

            var path = this.employeecurrentPerson.licenseBackFileName;
            if(path==''){return}
            return path
            /* console.log(this.imageBasePath + path)
            return this.imageBasePath + path; */
        },
        isEmployee(){
            return this.personTypeText == 'Employee'
        },
        isStudent(){
            return this.personTypeText == 'Student'
        },
        addText(){
            return "Add " + this.personTypeText
        },
        ...mapFields([
            
            'loggedInUser.isAdmin',
            'loggedInUser',
            'pleaseWait',
            'pleaseWaitText',
            'lastRefreshDateTime_Wallet',
            'disableAddFunds',
            'imagepath',
            'statusList',
            'employeeFilter',
           'employeelookupresults',
           'employeecurrentPerson',
           'employeeselectedResultID',
           'imageBasePath',
           'locationList'
        ]),
        sortedLocationList(){
            function compare(a,b){
                if (a.Name < b.Name)
                    return -1
                if(a.Name > b.Name)
                    return 1
                return 0
            }
            return this.employeecurrentPerson.locationList.sort(compare)
        }
  
    },
    props:{
        personTypeText:{
            type:String,
            default:'Employee'
        },
        
        
    },
    methods:{
        clearLookup(){
            this.$store.dispatch('clear_employeefilter');     
        },
        async saveStatus(){
           
           this.showStatus=false

           let req = {
               person:this.employeecurrentPerson,
               isActive:this.newStatusActive,
               status:this.employeecurrentPerson.statusID,
               TermDate:this.gradDate

           }
           this.$store.dispatch('beforeAPI');
           var response = await this.callAPI(req,'updatestatus')
           //handle response
           if(response.Successful){
                //if we deactivated, reset the check
                //rerun lookup 
                if(!this.newStatusActive){this.employeeFilter.showInactive=true}
                this.LookupPerson()
                this.getPerson(this.employeeselectedResultID)
           }else{
               this.responseMessage = response.Message
           }
           this.pleaseWait=false;  

       },
       cancelStatus(){
           this.showStatus=false
            this.getPerson(this.employeeselectedResultID)
       },
       selectStatus(){
           var currentID = this.employeecurrentPerson.statusID
           var newStatus
           this.statusList.forEach(myFunction2)
               function myFunction2(item, index, arr) {
                   let a=arr[index]
                   if(a.ID==currentID){
                       newStatus=a
                   }
               }
           if(newStatus!=undefined){
                this.newStatusName=newStatus.Name
                this.newStatusActive=newStatus.IsActive
            }
       },
        //image
        getImage(image){
            return this.imageBasePath + image
        },
        recordImageClass(name){
            var rclass ="recordImage"
            switch (name) {
                case 'person':
                    if(this.personImageEnlarged){rclass= "recordImageEnlarged"}
                    break;
                case 'front':
                    if(this.frontImageEnlarged){rclass= "recordImageEnlarged"}
                    break;
                case 'back':
                    if(this.backImageEnlarged){rclass= "recordImageEnlarged"}
                    break;
                default:
                    break;
            }
            


            
            return rclass

        },
        toggleImageSize(image,img,item){
           // console.log('el ' + img)
            var enlarged = false
             switch (item) {
                case 'person':
                    this.personImageEnlarged = !this.personImageEnlarged
                    enlarged=true
                    break;
                case 'front':
                    this.frontImageEnlarged = !this.frontImageEnlarged
                    enlarged=true
                    break;
                case 'back':
                    this.backImageEnlarged = !this.backImageEnlarged
                    enlarged=true
                    break;
                default:
                    break;
            }
            if(enlarged){
                this.selectImage(image,img,item)
            }
        },
        selectImage(image,img,item){
            //this.selectedRecord=item
            this.selectedImage=image
            //this.selectedImageTypeID=image.badgeImageTypeId
            this.selectedImageURL= img.src
            this.selectedImageType=item
            //this.selectedImageBadgeID = item.badgeId
        },
        saveedits(file, url){
          //  console.log('saveedits')
            this.selectedImageURL=url
        
            this.storeImage("", file, file.name)
        },
       async storeImage(filename,file, name){
            var bId=this.selectedImageBadgeID
            var postParams = new FormData();

            postParams.append(filename,file,name);
            
            postParams.append('badgeId',this.employeecurrentPerson.badgeId);
            postParams.append('type',this.selectedImageType);

            var response = await this.callAPI_Image(postParams,'saveimage')
            //handle response
            if(response.Successful){
                this.getPerson(this.employeeselectedResultID)
            }else{
                this.responseMessagemessage = response.Message
            }
        },

        //msg
        gotopayment(){
          //  console.log(this.employeecurrentPerson.walletID)
            const message = JSON.stringify({
                to:'FundingAdmin',
                id:this.employeecurrentPerson.walletID
            })
            window.parent.postMessage(message, '*')
        },
        isVisible(field){
            switch (field) {
                case 'ID':
                    return window.SHOW_ID
                    break;
                case 'DL':
                    return window.SHOW_DL && this.isStudent
                    break;
                case 'SSN':
                    return window.SHOW_SSN && this.isStudent
                    break;
                case 'Course':
                    return window.SHOW_COURSE && this.isStudent
                    break;
                case 'TuitionPaymentType':
                    return window.SHOW_TUITIONPAYMENTTYPE && this.isStudent
                    break;
                case 'ReferredBy':
                    return window.SHOW_REFERREDBY && this.isStudent
                    break;
                case 'Mealplan':
                    return window.SHOW_MEALPLAN
                    break;
                case 'Address':
                    return window.SHOW_ADDRESS 
                    break;
                case 'Due':
                    return window.SHOW_ACCOUNT_DUE
                    break;
                case 'Balance':
                    return window.SHOW_ACCOUNT_BALANCE
                    break;
                case 'Birthdate':
                    return window.SHOW_BIRTHDATE
                    break; 
                case 'Pin':
                    return window.SHOW_PIN
                    break;
                default:
                    return true
                    break;
            }
        },
        toCurrency(value){
            return "$" + Number(value).toFixed(2);
        },
        formatData(){
            this.employeecurrentPerson.Birthdate=this.$options.filters.formatDate(this.employeecurrentPerson.Birthdate);
            this.employeecurrentPerson.PhoneNumber1=this.$options.filters.formatPhone(this.employeecurrentPerson.PhoneNumber1);

            let mythis = this

            //add locations if we are doing taht
            if(this.showLocationsEmployee){
                var empid=this.employeecurrentPerson.ID
                this.locationList.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    let a=arr[index]
                    var id = a.id
                    var found=false
                    var newname =a.name
                    //look to see if htis is in our list
                    mythis.employeecurrentPerson.locationList.forEach(myFunction2)
                    function myFunction2(item, index, arr) {
                        let a=arr[index]
                        if(a.LocationID==id){
                            found=true
                           
                        }
                    }
                    if(!found){
                        let newone={LocationID:id, PersonID:empid, IsActive:false, isDirty:false, Name:newname}
                        mythis.employeecurrentPerson.locationList.push(newone)
                    }
                }
            }

        },
        async LookupPerson(){
            this.responseMessage=""
            //validate
            let req = {
                lookup:{
                    FirstName:this.employeeFilter.lookupFirst,
                    LastName:this.employeeFilter.lookupLast,
                    EmailAddress:this.employeeFilter.lookupEmail,
                    BadgeNumber:this.employeeFilter.lookupBadge,
                    showInactive:this.employeeFilter.showInactive,
                    restrictToEmployees:this.isEmployee,
                    locationId:this.employeeFilter.locationId
                }
            }
            this.$store.dispatch('beforeAPI');
            
            var response = await this.callAPI(req,'personlookup')
            //handle response
            if(response.Successful){
                 this.employeelookupresults =response.ResultList;
                 this.$store.dispatch('setCurrentDateTime');
                if(this.employeelookupresults.length==0){this.responseMessage="No " + this.personTypeText + " found. Please try again."}
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;    
           
        },
        selectPerson(result){
            console.log('select')
            this.employeeselectedResultID=result.personId
            this.getPerson(result.personId)
        },
        async getPerson(id,autoreset=false){
            //let prev = this.employeecurrentPerson.personId
            let req = {
                person:{ID:id}
            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'getperson')
            //handle response
            if(response.Successful){
                 this.employeecurrentPerson =response.Person;
                 this.formatData()
                 if(autoreset){
                   // console.log('should we reset because its new?')
                    if(this.autoResetPasswordNew){
                        this.resetpassword()
                    }
                 }
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;  

        },
        refresh(){
            console.log('refresh')
            this.getPerson(this.employeeselectedResultID)
        },
        refreshnew(id){
            this.LookupPerson()
            this.employeeselectedResultID=id
            this.getPerson(this.employeeselectedResultID,true)
        },
        async resetpassword(){
            console.log('reset')
            //validate
            
            let req = {
                email:this.employeecurrentPerson.EmailAddress,
                appUrl:window.RESET_PASSWORD_URL_EMPLOYEE
            }
            this.pleaseWait=true;
            this.responseMessage='';
            var response = await this.callAPI(req,'forgotpass_appurl')
            //handle response
            if(response.Successful){
                 this.resetMsg = "Please ask the person you added to check their email for the password reset link. It may be delivered to their Spam/Junk folder."
                 this.$refs.modalmessage.show()
            }else{
                this.resetMsg = response.Message
            }
            this.pleaseWait=false; 
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
                this.employeeFilter.locationId = this.loggedInUser.LocationId
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
            },
    },
    mounted(){
        this.getLocationList()
    }
}
</script>

<style>
.locationcheck2{
    height:15px;
    margin-top:5px;
    margin-right:5px;
}
.locationdiv2{
    display:grid;
    grid-template-columns: 1fr 8fr;
}
</style>