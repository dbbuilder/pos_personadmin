<template>
  <div class="lookupdetail">
      <div class="lookup">
          <form  ref="lookupform" v-on:keyup.enter="LookupPerson">
              <div class="vertFlexLeft">
                  <div class="lookupHeader">
                      <label class="titlelabel bottom10">{{lookupPromptText}} {{personTypeText}}</label>
                      <linkbutton toplabel="Clear" @click="clearLookup()" class="clearlink"/>
                  </div>
                

                <formentrystacked  label="First Name" v-model="personFilter.lookupFirst" minlength="3" placeholder="minimum 3 characters" />
                <formentrystacked  label="Last Name" v-model="personFilter.lookupLast" minlength="3" placeholder="minimum 3 characters"  />
                <formentrystacked  label="Email" v-model="personFilter.lookupEmail"   inputtype="email"  />
                <formentrystacked  label="Badge" v-model="personFilter.lookupBadge"    />
                <div class="horizFlex ">
                    <input class="entryCheckbox" type="checkbox" v-model="personFilter.showInactive" >
                    <label class="mediumtext">Show Inactive</label>
                </div>
                <div class="lookupHeader">
                    <updateperson :isAdd="trueParam" :inperson="newPerson" @refreshnew="refreshnew" :personTypeText="personTypeText" buttonclass="innerbutton" />
                    
                    <smallbutton @click="LookupPerson()" toplabel="Go" class="innerbutton"/>

                </div>
                
              </div>
              </form>

              <div v-if="pleaseWait">
                  <label class="pleasewaitlabel">{{pleaseWaitText}}</label>
              </div> 
              <div>
                <label class="responsemessage">{{responseMessage}}</label>
              </div>
               <div class="resultsdiv" v-if="personlookupresults.length>0">
                <div v-for="result in personlookupresults" :key="result.personId" :value="result.personId" >
                    <lookupresult :topLeft="result.name"  bottomLeft=""    @click="selectPerson(result)"
                        :selected="result.personId==personselectedResultID" :inactive="!result.isActive">
                   
                    </lookupresult>  
                </div>
              </div>


      </div>

      
       
        <div v-if="personselectedResultID>0" class="pad10">
            <div class="bordered">
                <div class="horizFlexStretch">
                    <div class="horizFlex">
                        <label class="titlelabel bold right10">{{personcurrentPerson.Name}} </label>
                        <updateperson :inperson="personcurrentPerson" @refresh="refresh" v-if="personcurrentPerson.IsActive" :personTypeText="personTypeText"/>
                    </div>
                    <linkbutton toplabel="Refresh" @click="refresh" class="clearlink"/>
                </div>
                <div class="splitDiv ">
                    <!-- left col -->
                    <div class="leftjustified vertFlex padright">
                        
                        
                        <div class="dataitem" v-if="isVisible('ID')">
                            <p >ID:</p>
                            <p >{{personcurrentPerson.StudentID}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Location')">
                            <p >Location:</p>
                            <p >{{personcurrentPerson.LocationName}}</p>
                        </div>
                        <div class="dataitem" v-if="isVisible('PersonRole')">
                            <p >Role:</p>
                            <p >{{personcurrentPerson.PersonRoleName}}</p>
                        </div>
                        <hr/>
                        <div class="dataitem"  v-if="isVisible('Birthdate')">
                            <p >Birthdate:</p>
                            <p >{{personcurrentPerson.Birthdate}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('DL')">
                            <p >DL:</p>
                            <p >{{personcurrentPerson.InternalID}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('SSN')">
                            <p >SSN:</p>
                            <p >{{personcurrentPerson.fId}}</p>
                        </div>
                        <hr/>
                        <div class="dataitem"  v-if="isVisible('Course')">
                            <p >Course:</p>
                            <p >{{personcurrentPerson.ProductString}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('TuitionPaymentType')">
                            <p >Sponsor: </p>
                            <p >{{personcurrentPerson.TuitionPaymentTypeName}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('ReferredBy')">
                            <p >Recruiter:</p>
                            <p >{{personcurrentPerson.referredBy}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Mealplan')">
                            <p >Meal Plan:</p>
                            <p >{{personcurrentPerson.MealPlan}}</p>
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
                            <p >{{personcurrentPerson.EmailAddress}} </p>

                            <input class="entryCheckbox" type="checkbox" :checked="personcurrentPerson.optInForEmail"  disabled=true >
                            <label class="mediumtext">Accept Emails</label>
                            
                        </div>
                        <div class="dataitemwithcheck"  v-if="isVisible('Phone')">
                            <p >Phone:</p>
                            <p >{{personcurrentPerson.PhoneNumber1}}</p>
                        
                            <input class="entryCheckbox" type="checkbox"  :checked="personcurrentPerson.optInForText" disabled=true >
                            <label class="mediumtext">Accept Texts</label>
                            
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >Address:</p>
                            <p >{{personcurrentPerson.AddressLine1}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >Address 2:</p>
                            <p >{{personcurrentPerson.AddressLine2}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >City/ST/Zip:</p>
                            <p >{{personcurrentPerson.City}}, {{personcurrentPerson.StateName}} {{personcurrentPerson.ZipCode}}</p>
                        </div>
                        <hr>
                        
                        
                        <div class="dataitem"  v-if="isVisible('Due')">
                            <p >Due:</p>
                            <p class="redtext" >{{toCurrency(personcurrentPerson.accountDue)}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Balance')">
                            <p >Balance:</p>
                            <p class="greentext">{{personcurrentPerson.accountBalance}}</p>
                        </div>
                        <smallbutton toplabel="Take Payment" class="innerbutton"  @click="gotopayment"/>

                        <hr/>
                        
                        <!-- status -->
                        <div class="dataitem"  v-if="isVisible('Status')">
                            <p >Current Status:</p>
                            <p  >{{personcurrentPerson.statusName}}</p>
                        </div>
                        <smallbutton toplabel="Change Status" class="innerbutton" @click="showStatus=true"/>
                        <div v-if="showStatus" class="statusdiv">
                            <div class="entry" >
                                <div class="entryTextDivNarrow">
                                    <label class="entryLabel" for="">Select New Status</label>
                                </div>
                                <div class="entryTextDivNarrow">
                                    <select name="" id="" class='entrySelect' @change="selectStatus()" v-model="personcurrentPerson.statusID" >
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


                        <smallbutton toplabel="Send Reset Password Email" class="innerbutton" @click="resetpassword"/>
                        <label>{{resetMsg}}</label>
                    </div>
                </div>
                
            </div>

        </div>
         <!-- ACTIONS -->
        <imageeditor ref="imgedit" :img="selectedImageURL" @save="saveedits"/>
        <imageall ref="imgall" :img="selectedImageURL" @saveimg="saveedits" :allowFileSelect="paramTrue" :showImage="paramFalse"/>
      
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
import formentry from '../controls/entry.vue'
export default {
    name:'person',
    mixins:[datamethods, format],
    components:{
        smallbutton,
        formentrystacked,
        formentry,
        entrySelect,
        lookupresult,
        linkbutton,
        updateperson,
        formentrycheck,
        imageeditor,
        imageall,
 
    },
    data(){
        return{
            showStatus:false,
            newStatusName:null,
        
            gradDate:null,

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
            resetMsg:''
        }
    },
    computed:{
        //image
        imagePathPerson(){

            var path = this.personcurrentPerson.personImageFileName;
            if(path==''){return}
            return path
            /* console.log(this.imageBasePath + path)
            return this.imageBasePath + path; */
        },
        imagePathDLFront(){

            var path = this.personcurrentPerson.licenseFrontFileName;
            if(path==''){return}
            return path
            /* console.log(this.imageBasePath + path)
            return this.imageBasePath + path; */
        },
        imagePathDLBack(){

            var path = this.personcurrentPerson.licenseBackFileName;
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
            'pleaseWait',
            'pleaseWaitText',
            'lastRefreshDateTime_Wallet',
            'disableAddFunds',
            'imagepath',
           'imageBasePath',
           'statusList',
           'mealplanList',
           'locationList',
           'tuitionPaymentTypeList',
           'referredByList',
           'states'
        ]),
        
  
    },
    props:{
        personTypeText:{
            type:String,
            default:'Student'
        },
        personFilter:{
            type:Object
        },
        personlookupresults:{
            type:Object
        },
        personcurrentPerson:{
            type:Object
        },
        personselectedResultID:{
            type:Object
        }
    },
    methods:{
        clearLookup(){
            this.$store.dispatch('clear_personFilter');     
        },
        async saveStatus(){
           
            this.showStatus=false

            let req = {
                person:this.personcurrentPerson,
                isActive:this.newStatusName=='Active',
                status:this.personcurrentPerson.statusID,
                TermDate:this.gradDate

            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'updatestatus')
            //handle response
            if(response.Successful){
                 //if we deactivated, reset the check
                 //rerun lookup 
                 this.personFilter.showInactive=true
                 this.LookupPerson()
                 this.getPerson(this.personselectedResultID)
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;  

        },
        cancelStatus(){
            this.showStatus=false
             this.getPerson(this.personselectedResultID)
        },
        selectStatus(){
           console.log('stat ' + currentID + ' ' + this.newStatusName)
            var currentID = this.personcurrentPerson.statusID
            
            var newStatus
            this.statusList.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    let a=arr[index]
                    if(a.ID==currentID){
                        newStatus=a
                    }
                }
            this.newStatusName=newStatus.Name
            console.log('stat ' + currentID + ' ' + this.newStatusName)
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
            console.log('el ' + img)
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
            console.log('saveedits')
            this.selectedImageURL=url
        
            this.storeImage("", file, file.name)
        },
       async storeImage(filename,file, name){
            var bId=this.selectedImageBadgeID
            var postParams = new FormData();

            postParams.append(filename,file,name);
            
            postParams.append('badgeId',this.personcurrentPerson.badgeId);
            postParams.append('type',this.selectedImageType);

            var response = await this.callAPI_Image(postParams,'saveimage')
            //handle response
            if(response.Successful){
                this.getPerson(this.personselectedResultID)
            }else{
                this.responseMessagemessage = response.Message
            }
        },

        //msg
      gotopayment(){
            const message = JSON.stringify({
                to:'FundingAdmin',
                id:this.personcurrentPerson.walletID
            })
            window.parent.postMessage(message, '*')
        },
        isVisible(field){
            switch (field) {
                case 'Pictures':
                    return window.SHOW_PICTURES
                    break;
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
                default:
                    return true
                    break;
            }
        },
        toCurrency(value){
            return "$" + Number(value).toFixed(2);
        },
        formatData(){
            console.log('format')
            this.personcurrentPerson.Birthdate=this.$options.filters.formatDate(this.personcurrentPerson.Birthdate);
            this.personcurrentPerson.PhoneNumber1=this.$options.filters.formatPhone(this.personcurrentPerson.PhoneNumber1);
           
           
        },
        async LookupPerson(){
            this.responseMessage=""
            //validate
            let req = {
                lookup:{
                    FirstName:this.personFilter.lookupFirst,
                    LastName:this.personFilter.lookupLast,
                    EmailAddress:this.personFilter.lookupEmail,
                    BadgeNumber:this.personFilter.lookupBadge,
                    showInactive:this.personFilter.showInactive,
                    restrictToStudents:this.isStudent
                }
            }
            this.$store.dispatch('beforeAPI');
            
            var response = await this.callAPI(req,'personlookup')
            //handle response
            if(response.Successful){
                 this.personlookupresults =response.ResultList;
                 this.$store.dispatch('setCurrentDateTime');
                if(this.personlookupresults.length==0){this.responseMessage="No " + this.personTypeText + " found. Please try again."}
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;    
           
        },
        selectPerson(result){
            this.personselectedResultID=result.personId
            this.getPerson(result.personId)
        },
        async getPerson(id){
            console.log('get')
            //let prev = this.personcurrentPerson.personId
            let req = {
                person:{ID:id}
            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'getperson')
            //handle response
            if(response.Successful){
                 this.personcurrentPerson =response.Person;
                 this.selectStatus()
                 this.formatData()
                 
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;  

        },
        refresh(){
            this.getPerson(this.personselectedResultID)
        },
        refreshnew(id){
            this.LookupPerson()
            this.personselectedResultID=id
            this.getPerson(this.personselectedResultID)
        },
        async resetpassword(){
            //validate
            if(this.username==""){
                return this.getFailureResponse("Please enter your email address and click forgot password")
              }
            let req = {
                email:this.personcurrentPerson.EmailAddress,
                appUrl:window.RESET_PASSWORD_URL
            }
            this.pleaseWait=true;
            this.responseMessage='';
            var response = await this.callAPI(req,'forgotpass_appurl')
            //handle response
            if(response.Successful){
                 this.resetMsg = "Please check your email for your password reset link"
            }else{
                this.resetMsg = response.Message
            }
            this.pleaseWait=false; 
        }
    }
}
</script>

<style>

</style>