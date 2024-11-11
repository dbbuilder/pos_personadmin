<template>
    <div>
        <linkbutton toplabel="Add/View Tests" @click="start()" v-if="!showButton"/>
        <smallbutton toplabel="Add/View Tests" @click="start()" class="alertlink" :buttonclass="buttonclass" v-if="showButton"/>
        <!-- ACCT Test MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <form >
                    <div class="history">
                            <label class="studentname" >Tests</label>
                            <div v-if="pleaseWait"><label class="pleasewait">Please wait...</label></div>
                            
                                <div class="docDiv">
                                    <div v-for="file in testList" :key="file.Test" :value="file.Test" class="documentitems" >
                                        <p class="timetext" >{{formatDate(file.TestDate) }} </p>
                                        <p class="timetext" >{{file.personTestTypeName }} </p>
                                        <p class="timetext" >{{passedText(file.Passed) }} </p>
                                        <linkbutton class="editlink" toplabel="Update" @click="updateTest(file)" v-if="canAccess('Edit Tests')"/>
                                    </div>
                                </div>
                                <smallbutton toplabel="Add Test" @Click="addfile" v-if="!showNew"/>
                               
                                <div v-if="showNew" class="vertFlex">
                                    <div class="entry"  >
                                        <div class="entryTextDiv">
                                            <label class="entryLabel" for="">Test</label>
                                        </div>
                                        <div class="entryTextDiv">
                                        <select name="" id="" class='entrySelect' v-model="newTestType"  required >
                                            <option v-for="t in testTypeList" :key="t.ID" :value="t.ID" >
                                                {{t.Name}}
                                            </option>
                                        </select>
                                        </div>
                                    </div>


                                    <formentry inputtype="date" label="Test Date" v-model="newTestDate"/>
                                    <div class="entry ">    
                                        <div class="">
                                            <label class="entryLabel" for="">Passed</label>
                                        </div>
                                       <div class="leftjustified">
                                            <input ref="myinput" class="entryText" type="checkbox" v-model="newPassed">
                                       </div>
                                       
                                       
                                    </div>
                                   
                                    <div class="">
                                        <smallbutton toplabel="Save" @click="saveTest"/>
                                        <smallbutton toplabel="Cancel" @click="cancelTest"/>
                                   
                                    </div>
                                    
                                    
                                </div>
                            
       
                    </div>
                    <div>
                        <smallbutton  @click="$refs.mymodal.closeModal()" toplabel="Close"/>
                    </div>
                   
              </form>
            </template>
          </actionmodal>
        </div>
    </template>
    
    <script>
    import datamethods from '../../services/datamethods.js'
    import smallbutton from '../controls/button.vue'
    import actionmodal from '../controls/actionmodal.vue'
    import linkbutton from '../controls/linkbutton.vue'
    import format from '../../format.js'
    import formentry from '../controls/entry.vue'
    import securityhelper from '../../services/securityhelper.js'
    export default {
        name:'Tests',
        components:{
            smallbutton,
            actionmodal,
            linkbutton,
            confirm,
            formentry
        },
        props:{
            personId:{
                type:Number,
                
            },
            buttonclass:{
                type:String,
                default:'button buttonprimary'
            },
            showButton:{
                type:Boolean,
                default:false
             },
             testList:{
                type:Array
             }
        },
        mixins:[datamethods, format,securityhelper],
        data(){
            return{
                showNew:false,
                newTestDate:null,
                newPassed:false,
                newTestType:-1,
                testId:0,

                FileList:[],
                
                trueParam:true,
                falseParam:false,
                pleaseWait:false,
                docIdToDeactivate:0,
                testTypeList:[],
                inSave:false
            }
        },
        computed:{
            
           
        },
        methods:{
            updateTest(test){
                this.newTestDate=this.$options.filters.formatDateForInput(test.TestDate)
                this.newTestType = test.personTestTypeId
                this.newPassed = test.Passed
                this.testId=test.id
                this.showNew=true
            },
            formatDate(dt)
            {
                return this.$options.filters.formatDate(dt)
            },
            passedText(p){
                if(p){return "Passed"}
                else{return "Failed"}
            },
            start(){
                //this.GetFiles()
                this.newTestDate=null
                this.newPassed=false
                this.newTestType=-1
                this.$refs.mymodal.openModal()
            },
            addfile(){
               this.showNew=true
               this.newTestDate=null
               this.newTestType=-1
                this.newPassed=false
                this.testId=0
            },
            async saveTest(){
                if(this.inSave){return;}

                this.inSave=true
                this.pleaseWait=true
               
                let req = {
                    Test:{
                        personId:this.personId,
                        Passed:this.newPassed,
                        TestDate:this.newTestDate,
                        personTestTypeId:this.newTestType,
                        id:this.testId
                    }
                        
                }
                    var response= await this.callAPI(req,'addtest')
               
                //handle response
                if(response.Successful){
                    this.showNew=false
                    this.inSave=false
                    this.$emit('refresh')
                    
                }else{
                    this.responseMessage = response.Message
                    this.inSave=false
                }
                this.pleaseWait=false
            },
            async getTestTypes(){
                this.pleaseWait=true
               
               
                    var response= await this.callAPI(null,'testtypes')
               
                //handle response
                if(response.Successful){
                    this.testTypeList=response.ValueList
                }else{
                    this.responseMessage = response.Message
                }
                this.pleaseWait=false
            },
            cancelTest(){
                this.showNew=false
                this.newTest=null
            },
            
            
            
            
            
        },
        mounted(){
          this.getTestTypes()
        }
    }
    </script>
    
    <style>
    .history{
        margin-top:15px;
        display:flex;
        flex-direction: column;
        /* align-items: center; */
    }
    form{
        font-size:large;
    }
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
    .rightjustify{
        text-align: right;
        
    }
    .nomargin{
        margin:0px;
    }
    .alertlink{
        font-size:large;
    }

    
    .docDiv{
        width:95%;
        overflow-x:auto;
        overflow-y:auto;
        height:370px;
    }
    .documentitems{
        width:95%;
        display:grid;
        grid-template-columns:4fr 5fr 3fr 2fr;
        text-align:left;
        font-size:medium;
        margin:10px;
    }
   
    .col2{
        grid-column: 2;
    }
    .col3{
        grid-column:3;
        padding-right:10px;
       
    }
    .required{
        color:red;
    }
    
    .pleasewaitdoc{
        color:orangered;
        font-size:large;
    }
    .leftjustified{
        width:100%;
        text-align: left;
        align-content: left;
    }
    .editlink{
        margin-top:15px;
    }
    </style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    