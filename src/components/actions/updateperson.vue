<template>
<div>
    <!-- <linkbutton toplabel="Update person" @click="UpdatePerson()"/> -->
    <smallbutton @click="UpdatePerson()" :toplabel="updateText" :class="buttonclass"/>
    <!-- ACCT NOTE MODAL -->
      <actionmodal ref="mymodal"> 
        <template v-slot:body>
            <form ref="myform">
                <label class="titlelabel">{{updateText}}</label>

                <formentry  inputtype="text"  label="First Name" isrequired='True' v-model="person.FirstName" v-if="isVisible('FirstName')"/>
                <formentry  inputtype="text"  label="Last Name" isrequired='True' v-model="person.LastName"  v-if="isVisible('LastName')"/>

                <div class="entry"  v-if="isVisible('StudentGroup')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Student Group</label>
                    </div>
                    <div class="entryTextDiv">
                    <select name="" id="" class='entrySelect' v-model="person.studentGroupId" @change="selectGroup()" :required="isRequired('StudentGroup')" >
                        <option v-for="s in studentGroupList" :key="s.ID" :value="s.ID" >
                            {{s.Name}}
                        </option>
                    </select>
                    </div>
                </div>

                <div class="entry"  v-if="isVisible('Status')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Current Status</label>
                    </div>
                    <div class="entryTextDiv">
                    <select name="" id="" class='entrySelect' v-model="person.statusID"   required >
                        <option v-for="s in statusList" :key="s.ID" :value="s.ID" >
                            {{s.Name}}
                        </option>
                    </select>
                    </div>
                </div>

                <formentry  inputtype="text"  :label="idLabel"  v-model="person.StudentID"  v-if="isVisible('ID')" :isrequired="isRequired('ID')"/>
                
                <div class="entry"  v-if="isVisible('Location')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Location</label>
                    </div>
                    <div class="entryTextDiv">
                    <select name="" id="" class='entrySelect' required v-model="person.locationId_Primary" @change="selectLocation()" >
                        <option v-for="loc in locationList" :key="loc.id" :value="loc.id" >
                            {{loc.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="entry"  v-if="isVisible('PersonRole')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Role</label>
                    </div>
                    <div class="entryTextDiv">
                    <select name="" id="" class='entrySelect' v-model="person.personRoleId" required @change="selectRole()">
                        <option v-for="role in personRoleList" :key="role.id" :value="role.id" >
                            {{role.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <formentry  inputtype="text"  label="Pin"  v-model="person.Pin"  v-if="isVisible('Pin')" :isrequired="isRequired('Pin')"/>
                <formentry  inputtype="date"  label="Start Date"  v-model="person.hireDate"  v-if="isVisible('StartDate')" :isrequired="isRequired('StartDate')"/>



                <br>
                <formentry  inputtype="date"  label="Birthdate"  v-model="person.Birthdate"  v-if="isVisible('Birthdate')" :isrequired="isRequired('Birthdate')"/>
                <formentry  inputtype="text"  label="DL"  v-model="person.InternalID"  v-if="isVisible('DL')" :isrequired="isRequired('DL')"/>
                <formentry  inputtype="text"  label="SSN"  v-model="person.fId"  v-if="isVisible('SSN')" :isrequired="isRequired('SSN')"
                    :placeholder="FIDPlaceholder"/>
                <br>
                <div class="entry"  v-if="isVisible('Course')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Select Course Type</label>
                    </div>
                    <div class="entryTextDiv">
                    <select name="" id="" class='entrySelect' v-model="person.ProductTypeGlobalKey"  @change="getProducts()" :required="isRequired('Course')">
                        <option v-for="ptype in ProductTypeList" :key="ptype.guid" :value="ptype.guid" >
                            {{ptype.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="entry"  v-if="isVisible('Course')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Select Course</label>
                    </div>
                    <div class="entryTextDiv">
                    <select name="" id="" class='entrySelect' v-model="person.ProductGlobalKey"  @change="selectProduct()" :required="isRequired('Course')">
                        <option v-for="p in ProductList" :key="p.guid" :value="p.guid" >
                            {{p.name}} ( {{toCurrency(p.price)}})
                        </option>
                    </select>
                    </div>
                </div>
                <div class="entry"  v-if="isVisible('TuitionPaymentType')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Sponsor</label>
                    </div>
                    <div class="entryTextDiv">
                        <select name="" id="" class='entrySelect' v-model="person.tuitionPaymentTypeID" @change="selectTuitionPaymentType()" >
                            <option v-for="sponsor in tuitionPaymentTypeList" :key="sponsor.id" :value="sponsor.id" >
                                {{sponsor.name}}
                            </option>
                        </select>
                    </div>
                    
                </div>
                <!-- if sponsor, allow entry -->
                <formentry  inputtype="text"  label="Sponsor Name"  v-model="person.sponsor"   v-if="person.TuitionPaymentTypeName=='Sponsor'"/>
                <div class="entry"  v-if="isVisible('ReferredBy')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Referred By</label>
                    </div>
                    <div class="entryTextDiv">
                        <select name="" id="" class='entrySelect' v-model="person.referredId"  >
                            <option v-for="referred in referredByList" :key="referred.id" :value="referred.id" >
                                {{referred.Name}}
                            </option>
                        </select>
                    </div>
                </div>
                <formentry  inputtype="text"  label="Contract #"  v-model="person.contractNumber"  v-if="isVisible('ContractNumber')" :isrequired="isRequired('ContractNumber')"/>
                <div class="entry"  v-if="isVisible('MealPlan')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Meal Plan</label>
                    </div>
                    <div class="entryTextDiv">
                        <select name="" id="" class='entrySelect' v-model="person.MealPlan"  >
                            <option v-for="mealplan in mealplanList" :key="mealplan.MealPlanID" :value="mealplan.Name" >
                                {{mealplan.Name}}
                            </option>
                        </select>
                    </div>
                </div>

                <br>
                <formentry  inputtype="email"  label="Email Address"  v-model="person.EmailAddress"  v-if="isVisible('Email')" :isrequired="isRequired('Email')"/>
                <formentry  inputtype="tel"  label="Phone Number" @blur="leavePhone"  v-model="person.PhoneNumber1"  v-if="isVisible('Phone')" :isrequired="isRequired('Phone')"/>
                

                 <formentry label="Address 1"  v-model="person.AddressLine1"  v-if="isVisible('Address')" :isrequired="isRequired('Address')"/>
                <formentry label="Address 2"  v-model="person.AddressLine2" v-if="isVisible('Address')"/>
                <formentry label="City"  v-model="person.City" v-if="isVisible('Address')" :isrequired="isRequired('Address')"/>
                <div class="entry" v-if="isVisible('Address')">
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">State</label>
                    </div>
                    <div class="entryTextDiv">
                    <select name="" id="" class='entrySelect' v-model="person.StateID" :required="isRequired('Address')">
                        <option v-for="state in states" :key="state.id" :value="state.id" >
                            {{state.name}}
                        </option>
                    </select>
                    </div>
                </div>
                <formentry label="Zip"  v-model="person.ZipCode" v-if="isVisible('Address')" :isrequired="isRequired('Address')"/>
                <br>
                <div class="vertFlex" v-if="showLocationsEmployee && !isStudent">
                    <label class="  right10">Locations:</label>
                        <div v-for="pl in person.locationList" :key="pl.LocationID" :value="pl.LocationID" >
                            <div class="locationdiv3">
                                
                                <input class="entryCheckbox2" type="checkbox" v-model="pl.IsActive" @input="pl.isDirty=true;" >
                                
                                
                                <p class="nomargin" >{{pl.Name}}</p>
                            </div>
                            
                        </div>
                </div>


                <br>
                <div class="vertFlex ">
                    <label for="" class="" v-if="showOptInEmail || showOptInSMS">{{personTypeText}} agrees to receive communications through</label>
                    <label for="" class="" v-if="showOptInEmail && showOptInSMS">(Check at least one)</label>
                
                    <div class="horizFlex centered" v-if="showOptInEmail">
                        <input class="entryCheckbox" type="checkbox" v-model="person.optInForEmail" >
                        <label for="" :class="checkClass(person.optInForEmail)">Email</label>
                    </div>

                    <div class="horizFlex topMargin centered" v-if="showOptInSMS">
                        <input class="entryCheckbox" type="checkbox" v-model="person.optInForText" @change="setoptsms">
                        <label for="" :class="checkClass(person.optInForText)">Text Messaging</label>
                    </div>
                    <label v-if="showOptInSMS" for="" class="">({{personTypeText}} has given you consent to send text messages and understands that standard messaging and data rates may apply)</label>
                    

                    <div class="horizFlex topMargin centered" v-if="showOptInSMS && isAdd && isStudent" @change="setwelcome">
                        <input class="entryCheckbox" type="checkbox" v-model="sendNewSMS" >
                        <label for="" :class="checkClass(sendNewSMS)">Check to send Welcome Text</label>
                    </div>
                </div> 
    
                
                <smallbutton  @click="saveNewperson()" toplabel="Save" />
                <smallbutton  @click="cancelupdate()" toplabel="Cancel"/>
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
    name:'updateperson',
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
        personTypeText:{
            type:String,
            default:'Employee'
        },
        isAdd:{
            type:Boolean,
            default:false
        },
        buttonclass:{
            type:String,
            default:'updatebutton'
        },

    },
    mixins:[datamethods,format,securityhelper],
    data(){
        return{
            message:'',
            person:{},
            personRoleList:[],
            studentGroupList:[],

            ProductTypeList:[],
            ProductList:[],
            productSale: {
                walletId:-1,
                accountId:-1,
                locationId:-1,
                restrictToProductTypeGlobalKey:'',
                restrictToProductGlobalKey:'',
                price:0,
                walletTokenId:-1,
            },
           productamount:0,
           selectedRequiredFields:null,
           sendNewSMS:false
        }
    },
    computed:{
        ...mapFields([
           'mealplanList',
           'locationList',
           'tuitionPaymentTypeList',
           'referredByList',
           'states',
           'statusList',
           'newPersonRequiredFieldsList',
           'loggedInUser'
        

        ]),
        idLabel(){
            if(this.isEmployee){ return "Employee #"}
            else{return "Student #"}
        },
        updateText(){
            if(this.isAdd){
                return "Add " + this.personTypeText
            }else{
                return "Update " + this.personTypeText
            }
            
        },
        isEmployee(){
            return this.personTypeText == 'Employee'
        },
        isStudent(){
            return this.personTypeText == 'Student'
        },
        FIDPlaceholder(){
            var placeholder=''
            if(window.SSN_LENGTH==undefined){placeholder='last 4 digits'}
            else if(window.SSN_LENGTH==4){placeholder='last 4 digits'}
            else{placeholder=window.SSN_LENGTH + ' digits'}
            return placeholder
        },
        FIDLength(){
            var l=4
            if(window.SSN_LENGTH!=undefined){l=window.SSN_LENGTH}
            return l
        },
        showOptInEmail(){
            if(window.SHOW_OPTIN_EMAIL==undefined){return false}
            else{return window.SHOW_OPTIN_EMAIL}
        },
        showOptInSMS(){
            if(window.SHOW_OPTIN_SMS==undefined){return false}
            else{return window.SHOW_OPTIN_SMS}
        },
        showLocationsEmployee(){
            
            if(window.SHOW_LOCATIONS_EMPLOYEE==undefined){return false}
            else{return window.SHOW_LOCATIONS_EMPLOYEE}
        },
        defaultLocationIsSelected(){
            var defloc = this.person.locationId_Primary
            var ispicked=false
           this.person.locationList.forEach(myFunction2)
                    function myFunction2(item, index, arr) {
                        let a=arr[index]
                        if(a.LocationID==defloc){
                            if(a.IsActive)
                            {
                               ispicked=true
                            }
                           
                        }
                    }
            return ispicked
        }
    },
    methods:{
        selectRole(){
            console.log('sel role')
            //if we are doing checked locations, then refresh the list based on the new role and precheck the default loc
            if(this.showLocationsEmployee){
                this.getPersonLocationList()
            }
        },
        isSelected(id){

        },
        setoptsms(){
            //this.sendNewSMS= this.person.optInForText
        },
        setwelcome(){
            if(this.sendNewSMS){ this.person.optInForText=true}
        },
        isRequired(field){
            var required=false

            switch (field) {
                case 'ID':
                    if(this.isStudent){required= window.REQUIRE_ID}
                    else{required= window.REQUIRE_ID_EMPLOYEE}
                    break;
                case 'DL':
                    required= window.REQUIRE_DL
                    break;
                case 'Birthdate':
                    if(this.isStudent){required= window.REQUIRE_BIRTHDATE}
                    else{required= window.REQUIRE_BIRTHDATE_EMPLOYEE}
                    break;
                case 'Course':
                    required= window.REQUIRE_COURSE
                    break;
                case 'Address':
                    if(this.isStudent){required= window.REQUIRE_ADDRESS}
                    else{required= window.REQUIRE_ADDRESS_EMPLOYEE}
                    break;
                case 'Email':
                    required= window.REQUIRE_EMAIL
                    break;
                case 'Phone':
                    if(this.isStudent){required= window.REQUIRE_PHONE}
                    else{required= window.REQUIRE_PHONE_EMPLOYEE}
                    
                    break;
                case 'SSN':
                    required= window.REQUIRE_SSN
                    break;
                case 'ContractNumber':
                    required=false
                    break;
                case 'StudentGroup':
                    required = window.REQUIRE_GROUP
                    break;
                case 'StartDate':
                    required = false
                    break;
                default:
                    
                    break;
            }

            //if we have overrides, check that
            
            if(this.selectedRequiredFields!=null){
              
                switch (field) {
                    case 'ID':
                        required = this.selectedRequiredFields.requireID;
                        break;
                    case 'DL':
                        required = this.selectedRequiredFields.requireDL;
                        break;
                    case 'Birthdate':
                        required = this.selectedRequiredFields.requireBirthdate;
                        break;
                    case 'Course':
                        required = this.selectedRequiredFields.requireCourse;
                        break;
                    case 'Address':
                        required = this.selectedRequiredFields.requireAddress;
                        break;
                    case 'SSN':
                        required = this.selectedRequiredFields.requireSSN;
                        break;
                    case 'Phone':
                        required = this.selectedRequiredFields.requirePhone;



                        break;
                    case 'Email':
                        required = this.selectedRequiredFields.requireEmail;

                        

                        break;
                    case 'StartDate':
                        required = this.selectedRequiredFields.requireStartDate;
                        break;
                    default:
                        break;
                }
            }

            if(field=='Phone' && !required){
                        
                if(this.person.optInForText){required=true}
                console.log(this.person.optInForText + ' ' + required)
            }

            return required
        },
        isVisible(field){
            //console.log('isvis ' + field)
            switch (field) {
                case 'OptInEmail':
                    return window.SHOW_OPTIN_EMAIL
                    break;
                case 'OptInSMS':
                    return window.SHOW_OPTIN_SMS
                    break;
                case 'ID':
                    return window.SHOW_ID
                    break;
                case 'Status':
                    return this.isStudent && this.isAdd && window.SHOW_STATUS_UPDATESTUDENT;
                    break;
                case 'StudentGroup':
                    return this.isStudent && window.SHOW_STUDENTGROUP;
                    break;
                case 'DL':
                    return window.SHOW_DL && this.isStudent
                    break;
                case 'SSN':
                    return window.SHOW_SSN && this.isStudent
                    break;
                case 'Course':
                    return window.SHOW_COURSE && this.isStudent && this.isAdd
                    break;
                case 'TuitionPaymentType':
                    return window.SHOW_TUITIONPAYMENTTYPE && this.isStudent  
                    break;
                case 'ReferredBy':
                    return window.SHOW_REFERREDBY && this.isStudent  && this.isAdd
                    break;
                case 'MealPlan':
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
                case 'Location':
                    return this.canAccess('View All Locations')
                    break;
                case 'StartDate':
                    return this.isStudent
                    break;
                case 'PersonRole':
                    if(this.isStudent){return window.SHOW_ROLE_STUDENT
                    }else{return window.SHOW_ROLE_EMPLOYEE}
                    
                    break;
                case 'Pin':
                    return window.SHOW_PIN
                    break;
                default:
                    return true
                    break;
            }
        },
        isOKFID(fid){
            if(fid==null){return true}
            fid = fid.replaceAll('-','').replaceAll('.','').replaceAll(' ','')
           // console.log(fid.length)
            return fid.length==this.FIDLength
        },
        toCurrency(value){
            return "$" + Number(value).toFixed(2);
        },
       UpdatePerson(){
        this.message=''
        
        if(this.isAdd){
            this.person = {
                ID:0,
                FirstName:null,
                LastName:null,
                StudentID:null,
                locationId_Primary:this.loggedInUser.LocationId,
                personRoleId:-1,
                Birthdate:null,
                fId:null,
                InternalID:null,
                tuitionPaymentTypeID:-1,
                TuitionPaymentTypeName:null,
                sponsor:null,
                referredId:-1,
                EmailAddress:null,
                MealPlan:null,
                AddressLine1:null,
                AddressLine2:null,
                City:null,
                StateID:-1,
                ZipCode:null,
                optInForText:false,
                optInForEmail:false,
                statusID:-1,
                password:11111111,
                studentGroupId:-1,
                PhoneNumber1:null
            }
            this.sendNewSMS=false
        }else{
            this.person = this.inperson
            this.person.Birthdate = this.$options.filters.formatDateForInput(this.person.Birthdate)
            if(this.person.hireDate!=null){
                this.person.hireDate = this.$options.filters.formatDateForInput(this.person.hireDate)
            }
            this.selectGroup()
        }
        this.selectLocation()
        this.getRoles()
        this.getGroups()
        this.$refs.mymodal.openModal()
       },
        selectLocation(){
            this.getProductTypes()
        },
        selectGroup(){
            console.log('sel grp')
            var selReqFields=null
            var groupid = this.person.studentGroupId
            this.newPersonRequiredFieldsList.forEach(myFunction2)

                function myFunction2(item, index, arr) {
                    let acct=arr[index]
                    if(acct.ID==groupid){
                        selReqFields = acct
                    }
                }

                this.selectedRequiredFields=selReqFields
        },
       /*  selectStatus(){
          //  console.log('sel status')
            var selReqFields=null
            var statusid = this.person.statusID
            this.newPersonRequiredFieldsList.forEach(myFunction2)

                function myFunction2(item, index, arr) {
                    let acct=arr[index]
                    if(acct.EmployeeStatusID==statusid){
                        selReqFields = acct
                    }
                }

                this.selectedRequiredFields=selReqFields
        }, */
        checkClass(selected){
            if(selected){
                return "entryCheckLabelbold"
            }else{
                return "entryCheckLabel"
            }
        },
        cancelupdate(){
            this.$refs.mymodal.closeModal()
            this.$emit('refresh')
            
        },
        async saveNewperson(){
            if(this.$refs.myform.checkValidity()==false){
                this.message="Please complete all required fields before saving"
                return}
            //default to optinforemail if we aren't showing
            if(!this.showOptInEmail){
                this.person.optInForEmail=true
            }
            //if we show sms, and its checked, require phone
            if(this.showOptInSMS){
                if(this.person.optInForText && (this.person.PhoneNumber1=='' || this.person.PhoneNumber1==null)){
                    this.message="Please enter a phone number for text updates"
                    return
                } 
            }
            //if we show email, and its checked, require email
            if(this.showOptInEmail){
                if(this.person.optInForEmail && (this.person.EmailAddress=='' || this.person.EmailAddress==null)){
                    this.message="Please enter an email address for email updates"
                    return
                } 
            }
            //if we show both...one better be checked!!
            if(this.showOptInEmail && this.showOptInSMS && !this.person.optInForText && !this.person.optInForEmail){
                this.message="Please select either text or email updates"
                return
            }
           
            if(!this.isStudent){
                if(this.showLocationsEmployee && !this.defaultLocationIsSelected){
                        this.message="Please select the default location in the checklist or select a different default location"
                        return
                }
            }
           
            
            
            if(!this.isOKFID(this.person.fId)){
               // console.log('not ok fid')
                if(this.FIDLength==4){
                    this.message="Please enter the last 4 digits of your SSN"
                }else{
                    this.message="Please enter a " + this.FIDLength + ' digit SSN'
                }
                return
            }

            let req = {
                person:this.person,
                amount:this.productamount,
                sendSMS:this.sendNewSMS,
                removeOldJobRecords:!this.showLocationsEmployee || this.isStudent
            }

            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'updateperson')
            if(response.Successful){
                //save prod sale


                this.$refs.mymodal.closeModal()
                //console.log(response)

                if(this.isAdd){
                    this.$emit('refreshnew',response.person.ID, response.walletId)
                }else{
                    this.$emit('refresh')
                }
                
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        leavePhone(){
            this.person.PhoneNumber1=this.$options.filters.formatPhone(this.person.PhoneNumber1);
        },
        selectTuitionPaymentType(){
            var name
            var id=this.person.tuitionPaymentTypeID
            this.tuitionPaymentTypeList.forEach(myFunction2)

                function myFunction2(item, index, arr) {
                    let acct=arr[index]
                    if(acct.id==id){
                        name = acct.name
                    }
                }
            this.person.TuitionPaymentTypeName=name
        },
        async getRoles(){
            let req = {
                locationId:-1,
                employeeOnly:this.isEmployee,
                studentOnly:this.isStudent
            }
            //this.beforeAPI();
            var response = await this.callAPI(req,'rolelist')

            //handle response
            if(response.Successful){
            this.personRoleList = response.PersonRoleList
    
            if(this.personRoleList.length>0){
               //find student and pick it as default
               if(this.isStudent){
                var studentId=-1
                this.personRoleList.forEach(myFunction2)

                function myFunction2(item, index, arr) {
                    let acct=arr[index]
                    if(acct.name=='Student'){
                        studentId=acct.id
                    }
                }
                this.person.personRoleId=studentId
               }
                
                
            }
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        async getGroups(){
            
            //this.beforeAPI();
            var response = await this.callAPI(null,'studentgroups')

            //handle response
            if(response.Successful){
                this.studentGroupList = response.ValueList
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        async getProductTypes(){
            let req = {
                walletId:0,
                locationId:this.person.locationId_Primary
            }
            this.$store.dispatch('beforeAPI');;
            var response = await this.callAPI(req,'producttypes')

            //handle response
            if(response.Successful){
            this.ProductTypeList = response.productTypeList
    
            if(this.ProductTypeList.length==1){
                //select the type to skip it
            
                this.getProducts(this.productTypeList[0].guid)
                
            }
            }else{
                this.message = response.Message
            }
            this.pleaseWait=false;
        },
        async getProducts(){
            var guid = this.person.ProductTypeGlobalKey
           // console.log('get prod ' + guid)
            this.selectedProductTypeGUID=guid
            let req = {
                walletId:0,
                locationId:this.person.locationId_Primary,
                productTypeGUID:guid
            }
            this.$store.dispatch('beforeAPI');;
            var response = await this.callAPI(req,'products')

            //handle response
            if(response.Successful){
            this.ProductList = response.productList
            
            }else{
            this.message = response.Message
            }
            this.pleaseWait=false;
        },
       selectProduct(){
           var price=0;
           let guid = this.person.ProductGlobalKey
           this.ProductList.forEach(myFunction2)

            function myFunction2(item, index, arr) {
                let acct=arr[index]
                if (acct.guid==guid){
                    price=acct.price
                }
            }
            this.productamount=price
       },
       async saveTrans(){
     
            //send in to start transaction
            let req = this.productSale
            this.beforeAPI();
            var response = await this.callAPI(req,'productsale_admin')

            //handle response
            if(response.Successful){
            
            this.responseMessage="Product Transaction Completed"
            
            }else{
            this.message = response.Message
            }
            this.pleaseWait=false;

        
            
        },
        async getPersonLocationList(){
            //let prev = this.employeecurrentPerson.personId
            let req = {
                person:this.person
            }
            this.$store.dispatch('beforeAPI');
            var response = await this.callAPI(req,'getpersonlocationlist')
            //handle response
            if(response.Successful){
                 this.person.locationList =response.Person.locationList;
                 this.fixlocations()
                 
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;  

        },
        fixlocations(){
            let mythis = this

            //add locations if we are doing taht
            if(this.showLocationsEmployee){
                var empid=this.person.ID
                this.locationList.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    let a=arr[index]
                    var id = a.id
                    var found=false
                    var newname =a.name
                    //look to see if htis is in our list
                    mythis.person.locationList.forEach(myFunction2)
                    function myFunction2(item, index, arr) {
                        let a=arr[index]
                        if(a.LocationID==id){
                            found=true
                           
                        }
                    }
                    if(!found){
                        let newone={LocationID:id, PersonID:empid, IsActive:false, isDirty:false, Name:newname}
                        mythis.person.locationList.push(newone)
                    }
                }
            }
            //make sure default loc is picked
            var defloc = this.person.locationId_Primary
            mythis.person.locationList.forEach(myFunction2)
                    function myFunction2(item, index, arr) {
                        let a=arr[index]
                        if(a.LocationID==defloc){
                            if(!a.IsActive)
                            {
                                a.IsActive=true
                                a.isDirty=true
                            }
                           
                        }
                    }
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
.entry{
   width: 100%;
   display:flex;

   justify-content: space-between;
}
.entryLabel{
   margin:2px;
   font-size:medium;
   text-align: left;   
}


.entryCheckbox{
   margin-left:5px;
}
.entryCheckbox2{
    width:15px;
}
.locationdiv3{
    display:grid;
    grid-template-columns: 1fr 10fr;
    text-align:left;
}
.entryText{
   margin:5px 0px 0px 0px;
   width:95%;
   font-size:medium;
 
}
.entrySelect{
   margin:5px 2px 5px 2px;
   width:98%;
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
</style>





























