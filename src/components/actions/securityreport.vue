<template>
    <div class="frame">
      

        <div class="horizFlex">
            <smallbutton  @click="cancelupdate()" toplabel="Back to Security"/>
            
            <label class="filterlabel" for="">Filter by Location</label>
            <div class="filterselect">
                    <select name="" id="" class='entrySelect' v-model="locationId"   required @change="getpeoplelist" >
                        <option v-for="l in locationList" :key="l.id" :value="l.id" >
                            {{l.name}}
                        </option>
                    </select>
            </div>
        </div>            
        <label class="titlelabel">Security Report</label>
    
                    
                    <div class="vertFlex">
                        <!-- header row -->
                        <div class="horizFlex">
                            <label class="fixedlabellong"></label>
                            <label v-for="p in SecurityPersonList" :key="p.personId" :value="p.personId" class="fixedlabel">{{ p.personName }}</label>
                        </div>
                        <div class="scrolldiv">
                            <div v-for="sa in securityList" :key="sa.id" :value="sa.id" class="leftjustified">
                                <!-- security app label -->
                                <div class="fullwidth bottomborder">
                                    <label class=" fixedlabelfullwidth bold ">{{getName(sa)}} </label>
                                </div>
                                
                                <!-- items -->
                                <div v-for="sai in sa.itemList" :key="sai.id" :value="sai.id" class="horizFlex bottomborder">
                                    
                                    <label class="fixedlabellong ">{{getName(sai)}} </label>
                                    <!-- for each Person -->
                                    <div v-for="p in SecurityPersonList" :key="p.personId" :value="p.personId" class="fixedlabel centered">
                                        <img :src="checkImage"  class="checkimage" v-if="getpersonaccess(p,sai.id) ">
                                        <!-- <label >{{getpersonaccess(p,sai.id)  }}</label> -->
                                    </div>  
                                </div>
                                <br>
                                <br>
                            </div>
                        </div>
                        
                    </div>

                    
                    <div>
                        <label class="responsemessage">{{message}}</label>
                   </div>
              
 
        </div>
    </template>
    
    <script>
    import {mapFields} from 'vuex-map-fields'
    import datamethods from '../../services/datamethods.js'
    import format from '../../format.js'
    import smallbutton from '../controls/button.vue'

    import formentry from '../controls/entry.vue'
    import linkbutton from '../controls/linkbutton.vue'
    import pencilbutton from '../controls/pencilbutton.vue'
    import securityhelper from '../../services/securityhelper.js'
    export default {
        name:'securityreport',
        components:{
            smallbutton,
         
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
                SecurityPersonList:[],
                locationId:0
            }
        },
        computed:{
            ...mapFields([
           
            'pleaseWait',
            'pleaseWaitText',
           'securityList',
           'locationList'

    
            ]),
            checkImage(){
                return require("@/assets/check.png")
            },
            
           
            
        },
        methods:{
            
            getName(s){
            if(s.displayName!=null){
                return s.displayName
            }else{return s.name}
        },
        getpersonaccess(p, saiid){
            var checked=""

            
            p.securityAppItemList.forEach(myFunction2)
                function myFunction2(item, index, arr) {
                    let a=arr[index]
                    if(a.id==saiid){
                        if(a.canAccess){
                            checked="*"
                        }
                        
                    }
                }

            return checked
        },
       
           Update(){
            this.message=''
            
            
           },
            
            cancelupdate(){

             this.$emit('close')
                
                
            },
            async getpeoplelist(){
                let req = {
                    id:this.locationId
                }
                
                this.$store.dispatch('beforeAPI');
                var response = await this.callAPI(req,'securitylist_personall')
                if(response.Successful){
                    this.SecurityPersonList=response.SecurityAppItemPersonList
                                 
                    
                }else{
                    this.message = response.Message
                }
                this.pleaseWait=false;
            },
            
            
        }
    }
    </script>
    
    <style scoped>
  .fixedlabellong{
    font-size:medium;
    width:250px;
    min-width: 300px;
    padding-left:30px;
  }
  .fixedlabel{
    font-size:medium;
    width:100px;
    min-width: 100px;
  }
  .fullwidth{
    width:100%;
    min-width: 100%;
  }
  .fixedlabelfullwidth{
    padding-left:20px;
    font-size:medium;
    width:100%;
    min-width: 100%;
  }
  .bottomborder{
    border-bottom: 1px solid gray;
    padding:5px;
  }
  .centered{
    text-align: center;
  }
  .colored{
    background-color: lightblue;
  }
  .scrolldiv{
        overflow-x:hidden;
        overflow-y:auto;
        height:570px;
        
    }
    .frame{
        background-color: white;
    }
    .checkimage{
    width:18px;
}
.filterlabel{
    margin:20px 0px 0px 0px;
}
.filterselect{
    margin:15px;
}
    </style>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    