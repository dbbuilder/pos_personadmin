<template>
    <div>
        <smallbutton @click="Start()" toplabel="Update Dates" :buttonclass="buttonclass"/>
        <!-- ACCT NOTE MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <label class="titlelabel">Update Multiple Students - Start Date</label>
                <br>
                
                <div class="horizFlex ">
                        <label class="mediumtext"> Start Date</label>
                        <input type="date"  v-model="startDate" class="startdate"/>
                </div>
                
                    <br>
                    <hr>
                    <div class="entryTextDiv">
                        <label class="entryLabel" for="">Select Students</label>
                        <button @click="selectAll" class="allbutton left5" type="button">Select All</button>
                        <button @click="clearAll" class="allbutton left5" type="button">Clear All</button>
                    </div>
                    <div class="horizFlex wrap">
                        <div v-for="s in studentlookupresults" :key="s.id" :value="s.id" class="checkrecord">
                                <input class="" type="checkbox" v-model="s.selected" >
                                <p :class="studentchecklabel(s)">{{s.name}}</p>
                        </div>
                    </div>
                    
                    
                
           
                <div>

                    <smallbutton  @click="save()" toplabel="Save" />
                    <smallbutton  @click="cancel()" toplabel="Cancel" />
                </div>
                <p class="responsemessage">{{ responseMessage }}</p>
                
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
 
    export default {
        name:'multistartdate',
        components:{
            smallbutton,
            actionmodal,
        
        },
        props:{
            buttonclass:{
                type:String,
                default:"button buttonprimary"
            },
           
    
        },
        mixins:[datamethods,format],
        data(){
            return{
               startDate:null,
                responseMessage:null,
              
            }
        },
        computed:{
            ...mapFields([
                'studentlookupresults'
            ]),
            studentSelected(){
                var sel=false
                this.studentlookupresults.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    if(arr[index].selected){
                        sel=true
                    }
                }
                return sel
           }
        },
        methods:{
            selectAll(){
                this.studentlookupresults.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    arr[index].selected=true
                }
            },
            clearAll(){
                this.studentlookupresults.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    arr[index].selected=false
                }
            },
            studentchecklabel(stu){
               // return 'checklabel'
                if(stu.HasInProcessGradeSheet){return "checklabel required"}
                else{return "checklabel"}
            },
            
           Start(){
                this.responseMessage=null
                this.startDate=null
                this.$emit('refresh')
                this.$refs.mymodal.openModal()
           },
           
            cancel(){
                this.$refs.mymodal.closeModal()
                this.$emit('refresh')
            },
          

            async save(){
                if(!this.studentSelected){this.responseMessage="Please select at least one student"; return}

               
                let req = {
                    startDate:this.startDate,
                    studentList:this.studentlookupresults
                }
                this.$store.dispatch('beforeAPI');
                var response = await this.callAPI(req,'multiupdatestartdate')
                //handle response
                if(response.Successful){
                    this.pleaseWait=false; 
                    this.$emit('refresh')
                    this.$refs.mymodal.closeModal()
                    
                }else{
                    this.responseMessage = response.Message
                }
                this.pleaseWait=false; 
                   
            },
            
        }
    }
    </script>
    
    <style>
    .checkrecord{
        display:grid;
        grid-template-columns: 1fr 6fr;
        margin: 0px 0px 0px 20px;
    }
    
    
    .updatebutton{
        height:30px;
        width:150px;
        border-radius: 5px;
        padding:3px;
        margin:0px 0px 10px 0px;
    }
    .checklabel{
        margin:5px;
    }
    .checkrecord{
        display:flex;
        flex-direction: row;
        margin: 0px 0px 0px 20px;
    }
    .wrap{
        flex-wrap: wrap;
    }
    .startdate{
        margin:0px 5px 0px 10px;
    }
    .allbutton{
        font:inherit;
        border:1px gray solid;
        border-radius:2px;
    }
    </style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    