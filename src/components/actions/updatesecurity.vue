<template>
    <div>
        <!-- <linkbutton toplabel="Update person" @click="Update()"/> -->
        <smallbutton @click="Update()" toplabel="Update" :class="buttonclass"/>
        <!-- ACCT NOTE MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <form ref="myform">
                    <label class="titlelabel">{{updateText}}</label>
    
                    
                    <div class="vertFlex">
                        <div v-for="sa in tmpSecurityList" :key="sa.id" :value="sa.id" class="leftjustified">
                            <label class=" bold ">{{getName(sa)}} </label>
                            <div v-for="sai in sa.itemList" :key="sai.id" :value="sai.id" class="horizFlex margin5">
                                <input type="checkbox" v-model="sai.selected" @change="mark(sai,sa)"/> 
                                <label>{{getName(sai)}} </label>
                            </div>
                            <br>
                        </div>
                    </div>

                    <smallbutton  @click="save()" toplabel="Save" />
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
        name:'updatesecurity',
        components:{
            smallbutton,
            actionmodal,
            formentry,
            linkbutton,
            pencilbutton
        },
        props:{

            buttonclass:{
                type:String,
                default:'updatebutton'
            },
    
        },
        mixins:[datamethods,format,securityhelper],
        data(){
            return{
                message:'',
                tmpSecurityList:[]
            }
        },
        computed:{
            ...mapFields([
           
            'pleaseWait',
            'pleaseWaitText',
           'securityselectedResultID',
           'selectedEmployeeSecurityItems',
           'securityList',
           'securityselectedResultName'
            
    
            ]),
            
            updateText(){
                return "Update Security for " + this.securityselectedResultName
                
            },
           
            
        },
        methods:{
            mark(sai,sa){
                sai.dirty=true

                //if selected = true, go through the saitemlist, find the one that matches the name and set it true also
                if(sai.selected){
                    var thisName = sa.name
                    sa.itemList.forEach(myFunction2)
                    function myFunction2(item, index, arr) {
                        let a=arr[index]
                        if(a.name==thisName){
                            a.selected=true
                            a.dirty=true
                            
                        }
                    }
                }
                
            },
            getName(s){
            if(s.displayName!=null){
                return s.displayName
            }else{return s.name}
        },
        /* getSecurityValue(id){
            var checked=""

            
            this.selectedEmployeeSecurityItems.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    let a=arr[index]
                    if(a.id==id){
                        checked="*"
                        
                    }
                }

            return checked
        }, */
           Update(){
            this.message=''
            this.tmpSecurityList = JSON.parse(JSON.stringify(this.securityList))
            this.$refs.mymodal.openModal()
           },
            
            cancelupdate(){
                this.$emit('refresh')
                this.$refs.mymodal.closeModal()
                
                
            },
            async save(){
                
                let req = {
                    appList:this.tmpSecurityList,
                    personId:this.securityselectedResultID
                }
                this.$store.dispatch('beforeAPI');
                var response = await this.callAPI(req,'updatesecurity')
                if(response.Successful){
                    this.$emit('refresh')
                    this.$refs.mymodal.closeModal()
                    
                    
                    
                }else{
                    this.message = response.Message
                }
                this.pleaseWait=false;
            },
            
            
        }
    }
    </script>
    
    <style scoped>
  
    </style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    