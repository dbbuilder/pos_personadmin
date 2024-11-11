<template>
  <div class="lookupdetail">
      <div class="lookup">
          <form  ref="lookupform" v-on:keyup.enter="LookupPerson">
              <div class="vertFlexLeft lookupdiv">
                  <div class="lookupHeader">
                      <label class="titlelabel bottom10">{{lookupPromptText}} {{personTypeText}}</label>
                      <linkbutton toplabel="Clear" @click="clearLookup()" class="clearlink"/>
                  </div>
                
              
                <formentrynarrow  label="First Name" v-model="studentFilter.lookupFirst" minlength="3" placeholder="min 3 characters" />
                <formentrynarrow  label="Last Name" v-model="studentFilter.lookupLast" minlength="3" placeholder="min 3 characters"  />
                <formentrynarrow  label="Email" v-model="studentFilter.lookupEmail"     />
                <formentrynarrow  label="Student #" v-model="studentFilter.lookupBadge"    />
                  
                
                <div class=""  v-if="canAccess('View All Locations')">
                    <div class="">
                        <label class="entryLabel" for="">Location</label>
                    </div>
                    <div class="">
                    <select name="" id="" class='entrySelect' v-model="studentFilter.locationId"   required >
                        <option v-for="l in filterLocationList" :key="l.id" :value="l.id" >
                            {{l.name}}
                        </option>
                    </select>
                    </div>
                </div>
                
                <div class=""  v-if="isVisible('StudentGroup')" >
                    <!-- <div class="">
                        <label class="entryLabel" for="">Student Group</label>
                    </div> -->
                    <div class="">
                    <select name="" id="" class='entrySelect' v-model="studentFilter.studentGroupId"   required >
                        <option v-for="s in filtergroupList" :key="s.ID" :value="s.ID" >
                            {{s.Name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="" v-if="showStatusFilter" >
                    <div class="">
                    <select name="" id="" class='entrySelect' v-model="studentFilter.statusId"   required >
                        <option v-for="s in filterstatusList" :key="s.ID" :value="s.ID" >
                            {{s.Name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="" v-if="showRoleFilter" >
                    <div class="">
                    <select name="" id="" class='entrySelect' v-model="studentFilter.roleId"   required >
                        <option v-for="s in filterroleList" :key="s.id" :value="s.id" >
                            {{s.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="horizFlex ">
                    <input class="entryCheckbox" type="checkbox" v-model="studentFilter.showInactive" >
                    <label class="mediumtext">Show Inactive</label>
                </div>
                <div class="horizFlex " v-if="showDateFilter">
                    <input class="entryCheckbox" type="checkbox" v-model="studentFilter.onlyNullHireDate" @change="setOnlyNullHireDate()">
                    <label class="mediumtext">Only NO Start Date</label>
                </div>
                <div class="horizFlex " v-if="showDateFilter">
                    <input class="entryCheckbox" type="checkbox" v-model="useHireDate" @change="setUseHireDate()">
                    <label class="mediumtext"> Start Date</label>
                    <input type="date" :disabled="!useHireDate" v-model="studentFilter.limitToHireDate" class="lookupdate"/>
                </div>
                

                <div class="lookupHeader">
                    <updateperson :isAdd="trueParam" :inperson="newPerson" @refreshnew="refreshnew" :personTypeText="personTypeText" buttonclass="smallerlookup" />
                    
                    <smallbutton @click="LookupPerson()" toplabel="Go" buttonclass="buttonprimary button smallerlookup"/>
                    
                </div>
                <div class="lookupHeader">
                    <multistartdate buttonclass="button buttonprimary smallerlookup" @refresh="refreshaftermult()" v-if="showDateFilter"/>
                    <multistatus buttonclass="button buttonprimary smallerlookup" @refreshstatus="refreshaftermultstatus()" v-if="showStatusFilter"/>
                </div>
              </div>
              </form>

              <div v-if="pleaseWait">
                  <label class="pleasewaitlabel">{{pleaseWaitText}}</label>
              </div> 
              <div>
                <label class="responsemessage">{{responseMessage}}</label>
              </div>
               <div class="resultsdiv" v-if="studentlookupresults.length>0">
                <div v-for="result in studentlookupresults" :key="result.personId" :value="result.personId" >
                    <lookupresult :topLeft="result.name"  bottomLeft=""    @click="selectPerson(result)"
                        :selected="result.personId==studentselectedResultID" :inactive="!result.isActive"/>
                </div>
              </div>
              <div class="horizFlex">
              
              </div>
              
            <div v-if="showcameratest">
                <button @click="showCamera=!showCamera">camera</button>
                <cameratest v-if="showCamera"></cameratest>
            </div>
      </div>

      
       
        <div v-if="studentselectedResultID>0" class="pad10">
            <div class="bordered">
                <div class="horizFlexStretch">
                    <div class="horizFlex">
                        <label class="titlelabel bold right10">{{studentcurrentPerson.Name}} </label>
                        <updateperson :inperson="studentcurrentPerson" @refresh="refresh" :personTypeText="personTypeText"/>
                    </div>
                    <linkbutton toplabel="Refresh" @click="refresh" class="clearlink"/>
                </div>
                <div class="splitDiv ">
                    <!-- left col -->
                    <div class="leftjustified vertFlex padright">
                        
                        
                        <div class="dataitem" v-if="isVisible('ID')">
                            <p >Student #:</p>
                            <p >{{studentcurrentPerson.StudentID}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Location')">
                            <p >Location:</p>
                            <p >{{studentcurrentPerson.LocationName}}</p>
                        </div>
                        <div class="dataitem" v-if="isVisible('PersonRole')">
                            <p >Role:</p>
                            <p >{{studentcurrentPerson.PersonRoleName}}</p>
                        </div>
                        <div class="dataitem" v-if="isVisible('Pin')">
                            <p >Pin:</p>
                            <p >{{studentcurrentPerson.Pin}}</p>
                        </div>
                        <hr/>
                        <div class="dataitem"  v-if="isVisible('Birthdate')">
                            <p >Birthdate:</p>
                            <p >{{studentcurrentPerson.Birthdate}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('DL')">
                            <p >DL:</p>
                            <p >{{studentcurrentPerson.InternalID}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('SSN')">
                            <p >SSN:</p>
                            <p >{{studentcurrentPerson.fId}}</p>
                        </div>
                        <hr/>
                        <div class="horizFlexStretch">
                            <div class="dataitem"  v-if="isVisible('Course')">
                                <p >Course:</p>
                                <p >{{studentcurrentPerson.ProductString}}</p>
                            </div>
                            <div class="linkdiv" v-if="isVisible('Course')">
                                <updateproduct :inperson="studentcurrentPerson" @refresh="refresh"/>
                            </div>
                            
                        </div>
                        
                        <div class="dataitem"  v-if="isVisible('TuitionPaymentType')">
                            <p >Sponsor: </p>
                            <p >{{studentcurrentPerson.TuitionPaymentTypeName}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('TuitionPaymentType') && studentcurrentPerson.TuitionPaymentTypeName=='Sponsor'">
                            <p >Sponsor Name: </p>
                            <p >{{studentcurrentPerson.sponsor}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('ReferredBy')">
                            <p >Recruiter:</p>
                            <p >{{studentcurrentPerson.referredBy}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('ContractNumber')">
                            <p >Contract #:</p>
                            <p >{{studentcurrentPerson.contractNumber}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Mealplan')">
                            <p >Meal Plan:</p>
                            <p >{{studentcurrentPerson.MealPlan}}</p>
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
                                        <button v-if="personImageEnlarged" @click="editImage('person')" class="photobutton">Edit</button>
                                        <button v-if="personImageEnlarged" @click="replaceImage('person')" class="photobutton">Replace</button>
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
                                        <button v-if="frontImageEnlarged" @click="editImage('front')" class="photobutton">Edit</button>
                                        <button v-if="frontImageEnlarged" @click="replaceImage('front')" class="photobutton">Replace</button>
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
                                        <button v-if="backImageEnlarged"  @click="editImage('back')" class="photobutton">Edit</button>
                                        <button v-if="backImageEnlarged" @click="replaceImage('back')" class="photobutton">Replace</button>
                                    </div>
                                </div>
                           
                        </div>
                    </div>

                    <!-- right col -->
                    <div class="leftjustified vertFlex ">
                        
                        <div class="dataitemwithcheck"  v-if="isVisible('Email')">
                            <p >Email:</p>
                            <p >{{studentcurrentPerson.EmailAddress}} </p>

                            <input class="entryCheckbox" type="checkbox" :checked="studentcurrentPerson.optInForEmail"  disabled=true >
                            <label class="mediumtext">Accept Emails</label>
                            
                        </div>
                        <div class="dataitemwithcheck"  v-if="isVisible('Phone')">
                            <p >Phone:</p>
                            <p >{{studentcurrentPerson.PhoneNumber1}}</p>
                        
                            <input class="entryCheckbox" type="checkbox"  :checked="studentcurrentPerson.optInForText" disabled=true >
                            <label class="mediumtext">Accept Texts</label>
                            
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >Address:</p>
                            <p >{{studentcurrentPerson.AddressLine1}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >Address 2:</p>
                            <p >{{studentcurrentPerson.AddressLine2}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('Address')">
                            <p >City/ST/Zip:</p>
                            <p >{{studentcurrentPerson.City}}, {{studentcurrentPerson.StateName}} {{studentcurrentPerson.ZipCode}}</p>
                        </div>
                        <hr>
                        
                        <div class="horizFlexStretch" v-if="showPayInfo">
                            <div>
                                <div class="dataitem"  v-if="isVisible('Due')">
                                    <p >Due:</p>
                                    <p class="redtext" >{{toCurrency(studentcurrentPerson.accountDue)}}</p>
                                </div>
                                <div class="dataitem"  v-if="isVisible('Balance')">
                                    <p >Balance:</p>
                                    <p class="greentext">{{toCurrency(studentcurrentPerson.accountBalance)}}</p>
                                </div>
                            </div>
                            <linkbutton toplabel="Take Payment" class="innerbutton"  @click="gotopayment" v-if="!showPayNoFA"/>
                            <addadmintrans :showButton="paramFalse" :accountId="studentcurrentPerson.accountID"  
                                buttonclass="buttonprimary button innerbutton" @refresh="refresh()"/>
                        </div>
        
                        <hr v-if="showPayInfo"/>
                        
                        <!-- status -->
                        
                        <div class="dataitem"  v-if="isVisible('StudentGroup')">
                            <p >Student Group:</p>
                            <p  >{{studentcurrentPerson.studentGroupName}}</p>
                        </div>
                        <div class="horizFlexStretch">
                            <div>
                                <div class="dataitem"  v-if="isVisible('Status')">
                                    <p >Current Status:</p>
                                    <p  >{{studentcurrentPerson.statusName}}</p>
                                </div>
                            </div>  
                            <linkbutton toplabel="Change Status" class="innerbutton" @click="showStatus=true"/>
                        </div>  
                        <div class="dataitem"  v-if="isVisible('StartDate')">
                            <p >Start Date:</p>
                            <p  >{{studentcurrentPerson.hireDate}}</p>
                        </div>
                        <div class="dataitem"  v-if="isVisible('GraduatedDate')">
                            <p >Graduated Date:</p>
                            <p  >{{studentcurrentPerson.termDate}}</p>
                        </div>
                                
                                
                            
                        
                        

                        <div v-if="showStatus" class="statusdiv">
                                <div class="entry" >
                                    <div class="entryTextDivNarrow">
                                        <label class="entryLabel" for="">Select New Status</label>
                                    </div>
                                    <div class="entryTextDivNarrow">
                                        <select name="" id="" class='entrySelect' @change="selectStatus()" v-model="studentcurrentPerson.statusID" >
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
                        <div class="horizFlexStretch">
                            <div class=" notediv">
                                <div v-for="file in noteList" :key="file.note" :value="file.note" class="noteitem" >
                                    <p class="notetext" >{{formatDate(file.noteDate) }} </p>
                                    <p class="notetext" >{{file.enteredByName }} </p>
                                    <p class="notetext" >{{file.note }} </p>
     
                                </div>
                            </div>
                            <notes :personId="studentcurrentPerson.ID" buttonclass="buttonprimary button innerbutton" 
                                v-if="showNotes" :noteList="noteList" @refresh="getNotes()"/>
                        </div>
                        <hr/>
                        <div class="horizFlexStretch">
                            <p class="notetext" >{{lastTestString('date') }} </p>
                            <p class="notetext" >{{lastTestString('type') }} </p>
                            <p class="notetext" >{{lastTestString('passed') }} </p>
                            <!-- <p class="testtext">{{ lastTestString }}</p> -->
                            <tests :personId="studentcurrentPerson.ID" buttonclass="buttonprimary button innerbutton" 
                                v-if="showTests" :testList="testList" @refresh="getTests()"/>
                        </div>
                        <hr>
                        <div class="horizFlex">
                            <smallbutton toplabel="Send Reset Password Email" class="innerbutton" @click="resetpassword"/>
                            
                            <files :personId="studentcurrentPerson.ID" buttonclass="buttonprimary button innerbutton"/>
                            <sendsms :inperson="studentcurrentPerson" buttonclass="buttonprimary button innerbutton" v-if="showOptInSMS && studentcurrentPerson.optInForText" />
                        </div>
                        <label>{{resetMsg}}</label>
                    </div>
                </div>
                
            </div>

        </div>
         <!-- ACTIONS -->
        <imageeditor ref="imgedit" :img="selectedImageURL" @save="saveedits"/>
        <imageall ref="imgall" :img="selectedImageURL" @saveimg="saveedits" :allowFileSelect="paramTrue" :showImage="paramFalse" :allowCapture="paramTrue"/>
        <modalmessage ref="modalmessage" title="RESET PASSWORD" body="Please ask the person you added to check their email for the password reset link. It may be delivered to their Spam/Junk folder."/>
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
import formentrynarrow from '../controls/entrynarrow.vue'
import files from './files.vue'
import notes from './notes.vue'
import tests from './tests.vue'
import multistartdate from './multistartdate.vue'
import multistatus from './multistatus.vue'
import addadmintrans from './addadmintrans.vue'
import securityhelper from '../../services/securityhelper.js'
import cameratest from '../actions/cameratest.vue'
import updateproduct from '../actions/updateproduct.vue'
import sendsms from '../actions/sendsms.vue'
import modalmessage  from '../controls/modalmessage.vue'
export default {
    name:'student',
    mixins:[datamethods, format,securityhelper],
    components:{
        smallbutton,
        formentrystacked,
        formentrynarrow,
        entrySelect,
        lookupresult,
        linkbutton,
        updateperson,
        formentrycheck,
        imageeditor,
        imageall,
        files,
        multistartdate,
        multistatus,
        notes,
        addadmintrans,
        tests,
        cameratest,
        updateproduct,
        sendsms,
        modalmessage
    },
    data(){
        return{
            showCamera:false,

            useHireDate:false,

            showStatus:false,
            newStatusName:null,
            newStatusActive:true,
        
            gradDate:null,

            personImage:null,
            frontImage:null,
            backImage:null,

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
            filterstatusList:[],
            filterLocationList:[],
            filtergroupList:[],
            noteList:[],
            testList:[],
            filterroleList:[]
        }
    },
    computed:{
        showOptInSMS(){
            if(window.SHOW_OPTIN_SMS==undefined){return false}
            else{return window.SHOW_OPTIN_SMS}
        },
        showDateFilter(){
            if(window.SHOW_DATE_FILTER==undefined){
                return false
            }else{return window.SHOW_DATE_FILTER}
        },
        showStatusFilter(){
            if(window.SHOW_STATUS_FILTER==undefined){
                return false
            }else{return window.SHOW_STATUS_FILTER}
        },
        showRoleFilter(){
            if(window.SHOW_ROLE_FILTER==undefined){
                return false
            }else{return window.SHOW_ROLE_FILTER}
        },
        showcameratest(){
            return false
           
        },
        autoResetPasswordNew(){
            if(window.AUTO_RESET_PASSWORD_NEW_STUDENT==undefined){
                return false
            }else{return window.AUTO_RESET_PASSWORD_NEW_STUDENT}
        },

        showNotes(){
            if(window.SHOW_NOTES==undefined){
                return true
            }else{return window.SHOW_NOTES}
        },
        showTests(){
            var show=false
            if(window.SHOW_TESTS==undefined){
                show= true
            }else{show= window.SHOW_TESTS}

            if(show){show=this.canAccess('View Tests')}
            return show
        },
        showPayNoFA(){
            if(window.SHOW_PAY_NO_FA==undefined){
                return true
            }else{return window.SHOW_PAY_NO_FA}
        },
        showPayInfo(){
            if(window.SHOW_PAY_INFO==undefined){
                return true
            }else{return window.SHOW_PAY_INFO}
        },
        //image
        imagePathPerson(){

            var path = this.studentcurrentPerson.personImageFileName;
            if(path==''){return}
            return path
            /* console.log(this.imageBasePath + path)
            return this.imageBasePath + path; */
        },
        imagePathDLFront(){

            var path = this.studentcurrentPerson.licenseFrontFileName;
            if(path==''){return}
            return path
            /* console.log(this.imageBasePath + path)
            return this.imageBasePath + path; */
        },
        imagePathDLBack(){

            var path = this.studentcurrentPerson.licenseBackFileName;
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
            'studentFilter',
           'studentlookupresults',
           'studentcurrentPerson',
           'studentselectedResultID',
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
        
        
    },
    methods:{
        lastTestString(field){
            if(this.testList.length==0){return ''}
            var lasttest = this.testList[this.testList.length-1]
            var str = ''
            switch (field) {
                case 'date':
                    str=this.formatDate(lasttest.TestDate)
                    break;
                case 'type':
                    str = lasttest.personTestTypeName
                    break;
                case 'passed':
                    str =this.passedText(lasttest.Passed)
                    break;
                default:
                    break;
            }
            
            return str
                                      
        },
        formatDate(dt)
            {
                return this.$options.filters.formatDate_short(dt)
            },
            passedText(p){
                if(p){return "Passed"}
                else{return "Failed"}
            },
        async getStatusList(){

            
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(null,'employeestatus')

            //handle response
            if(response.Successful){
                this.filterstatusList = response.ValueList
                var all = {
                    ID:-1,
                    Name:'Any Current Status'
                }
                this.filterstatusList.unshift(all)
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
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
        async getGroupList(){

            
            //call api
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(null,'studentgroups')

            //handle response
            if(response.Successful){
                this.filtergroupList = response.ValueList
                var all = {
                    ID:-1,
                    Name:'Any Student Group'
                }
                this.filtergroupList.unshift(all)
            }else{
                this.message = response.Message
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
                this.studentFilter.locationId = this.loggedInUser.LocationId
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
            },
        setOnlyNullHireDate(){
           // console.log('setonlynll')
            if(this.studentFilter.onlyNullHireDate){
                this.useHireDate=false
                this.studentFilter.limitToHireDate=null
            }
        },
        setUseHireDate(){
          //  console.log('setnullhiredate')
            if(this.useHireDate){this.studentFilter.onlyNullHireDate=false}
            else{
                this.studentFilter.limitToHireDate=null
            }
        },
        clearLookup(){
            this.$store.dispatch('clear_studentfilter');     
        },
        async saveStatus(){
           
            this.showStatus=false

            let req = {
                person:this.studentcurrentPerson,
                isActive:this.newStatusActive,
                status:this.studentcurrentPerson.statusID,
                TermDate:this.gradDate

            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'updatestatus')
            //handle response
            if(response.Successful){
                 //if we deactivated, reset the check
                 //rerun lookup 
                 if(!this.newStatusActive){this.studentFilter.showInactive=true}
                 this.LookupPerson()
                 this.getPerson(this.studentselectedResultID)
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;  

        },
        cancelStatus(){
            this.showStatus=false
             this.getPerson(this.studentselectedResultID)
        },
        selectStatus(){
            var currentID = this.studentcurrentPerson.statusID
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
            //console.log('el ' + img)
            var enlarged = false
             switch (item) {
                case 'person':
                    this.personImage=img.src
                    this.personImageEnlarged = !this.personImageEnlarged
                    enlarged=true
                    break;
                case 'front':
                    this.frontImage=img.src
                    this.frontImageEnlarged = !this.frontImageEnlarged
                    enlarged=true
                    break;
                case 'back':
                    this.backImage=img.src
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
        editImage(item){
            switch (item) {
                case 'person':
                    this.selectedImageURL=this.personImage   
                    break;
                case 'front':
                    this.selectedImageURL=this.frontImage
                    break;
                case 'back':
                    this.selectedImageURL=this.backImage
                    break;
                default:
                    break;
            }
            this.selectedImageType=item
 
   
            this.$nextTick(()=>{
                this.$refs.imgedit.openModal()
            })
        },
        replaceImage(item){
            switch (item) {
                case 'person':
                    this.selectedImageURL=this.personImage   
                    break;
                case 'front':
                    this.selectedImageURL=this.frontImage
                    break;
                case 'back':
                    this.selectedImageURL=this.backImage
                    break;
                default:
                    break;
            }
            this.selectedImageType=item
   
            this.$nextTick(()=>{
                this.$refs.imgall.openModal()
            })
        },
        saveedits(file, url){
           // console.log('saveedits')
            switch (this.selectedImageType) {
                case 'person':
                    this.personImage=url   
                    break;
                case 'front':
                    this.frontImage=url
                    break;
                case 'back':
                    this.backImage=url
                    break;
                default:
                    break;
            }
            this.selectedImageURL=url
            this.storeImage("", file, file.name)
        },
       async storeImage(filename,file, name){
            var bId=this.selectedImageBadgeID
            var postParams = new FormData();

            postParams.append(filename,file,name);
            
            postParams.append('badgeId',this.studentcurrentPerson.badgeId);
            postParams.append('type',this.selectedImageType);

            var response = await this.callAPI_Image(postParams,'saveimage')
            //handle response
            if(response.Successful){
                this.getPerson(this.studentselectedResultID)
            }else{
                this.responseMessagemessage = response.Message
            }
        },

        //msg
      gotopayment(){
            const message = JSON.stringify({
                to:'FundingAdmin',
                action:'goto',
                id:this.studentcurrentPerson.walletID
            })
            window.parent.postMessage(message, '*')
        },
        payment_nofa(){

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
                case 'ContractNumber':
                    return window.SHOW_CONTRACTNUMBER
                    break;
                case 'StudentGroup':
                    return window.SHOW_STUDENTGROUP
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
            if(this.studentcurrentPerson.Birthdate.includes('0001-01')){
                this.studentcurrentPerson.Birthdate=null
            }else{
                this.studentcurrentPerson.Birthdate=this.$options.filters.formatDate(this.studentcurrentPerson.Birthdate);
            }
            this.studentcurrentPerson.PhoneNumber1=this.$options.filters.formatPhone(this.studentcurrentPerson.PhoneNumber1);
            if(this.studentcurrentPerson.hireDate.includes('0001-01')){
                this.studentcurrentPerson.hireDate=null
            } else{this.studentcurrentPerson.hireDate=this.$options.filters.formatDate(this.studentcurrentPerson.hireDate);}
            if(this.studentcurrentPerson.termDate.includes('0001-01')){
                this.studentcurrentPerson.termDate=null
            } else{this.studentcurrentPerson.termDate=this.$options.filters.formatDate(this.studentcurrentPerson.termDate);}
        },
        async LookupPerson(){
            this.responseMessage=""
            //validate
            let req = {
                lookup:{
                    FirstName:this.studentFilter.lookupFirst,
                    LastName:this.studentFilter.lookupLast,
                    EmailAddress:this.studentFilter.lookupEmail,
                    BadgeNumber:this.studentFilter.lookupBadge,
                    showInactive:this.studentFilter.showInactive,
                    restrictToStudents:this.isStudent,
                    limitToHireDate:this.studentFilter.limitToHireDate,
                    onlyNullHireDate:this.studentFilter.onlyNullHireDate,
                    statusId:this.studentFilter.statusId,
                    locationId:this.studentFilter.locationId,
                    studentGroupId:this.studentFilter.studentGroupId,
                    roleId:this.studentFilter.roleId
                }
            }
            if(!this.useHireDate){req.lookup.limitToHireDate=null}
            this.$store.dispatch('beforeAPI');
            
            var response = await this.callAPI(req,'personlookup')
            //handle response
            if(response.Successful){
                 this.studentlookupresults =response.ResultList;
                 this.$store.dispatch('setCurrentDateTime');
                if(this.studentlookupresults.length==0){this.responseMessage="No " + this.personTypeText + " found. Please try again."}
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;    
           
        },
        selectPerson(result){
            this.studentselectedResultID=result.personId
            this.getPerson(result.personId)
        },
        async getPerson(id,autoreset=false){
          //  console.log('get')
            this.resetMsg=''
            //let prev = this.studentcurrentPerson.personId
            let req = {
                person:{ID:id}
            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'getperson')
            //handle response
            if(response.Successful){
                 this.studentcurrentPerson =response.Person;
                this.selectStatus()
                 this.formatData()
                 this.getNotes()
                 this.getTests()
                 if(autoreset){
                    //console.log('should we reset because its new?')
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
           
            this.getPerson(this.studentselectedResultID)
        },
        refreshaftermult(){
            this.LookupPerson()
            this.getPerson(this.studentselectedResultID)
        },
        refreshaftermultstatus(isactive){
            console.log('active ' + isactive)
            if(!isactive){this.studentFilter.showInactive=true}
            this.LookupPerson()
            this.getPerson(this.studentselectedResultID)
        },
        refreshnew(id){
            this.LookupPerson()
            this.studentselectedResultID=id
            this.getPerson(this.studentselectedResultID,true)
        },
        async resetpassword(){
            //validate
            console.log('reset pwd')
            let req = {
                email:this.studentcurrentPerson.EmailAddress,
                appUrl:window.RESET_PASSWORD_URL
            }
            this.pleaseWait=true;
            this.responseMessage='';
            var response = await this.callAPI(req,'forgotpass_appurl')
            //handle response
            if(response.Successful){
                 this.resetMsg = "Please check your email for your password reset link. It may be delivered to your Spam/Junk folder."
                 this.$refs.modalmessage.show()
            }else{
                this.resetMsg = response.Message
            }
            this.pleaseWait=false; 
        },
        async getNotes(){
                if(this.listenersConnected){this.listenersConnected=false}
                this.pleaseWait=true
               
                let req = {
                        id:this.studentcurrentPerson.ID
                }
                    var response= await this.callAPI(req,'notes')
               
                //handle response
                if(response.Successful){
                    this.noteList=response.PersonNoteList
         
                }else{
                    this.responseMessage = response.Message
                }
                this.pleaseWait=false
            },
            async getTests(){
                if(this.listenersConnected){this.listenersConnected=false}
                this.pleaseWait=true
               
                let req = {
                        id:this.studentcurrentPerson.ID
                }
                    var response= await this.callAPI(req,'tests')
               
                //handle response
                if(response.Successful){
                    this.testList=response.PersonTestList
         
                }else{
                    this.responseMessage = response.Message
                }
                this.pleaseWait=false
            },
    },
    mounted(){
        this.getStatusList()
        this.getLocationList()
        this.getGroupList();
        this.getRoles();
    }
}
</script>

<style>
.lookupdate{
    margin-left:5px;
    width:130px;
    margin-bottom:5px;
}
.smallerlookup{
    height:30px;
    width:120px;
    border-radius: 5px;
    padding:3px;
    margin:0px 0px 10px 0px;
}
.notediv{
    width:70%;
    max-height:90px;
    overflow-x:hidden;
    overflow-y:auto;
    margin:0px;
    padding:0px;
}
.notetext{
    margin:0px;
}
.testtext{
    margin:0px;
}
.noteitem{
        width:98%;
        display:grid;
        grid-template-columns:3fr 3fr 5fr;
        text-align:left;
        font-size:medium;
        margin:0px 0px 5px 0px;
    }
.lookupdiv{
    max-width:300px;
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

.entrySelect{
    margin:5px;
    width:98%;
    font-size:medium;
}
.linkdiv{
    margin-right:10px;
}
</style>