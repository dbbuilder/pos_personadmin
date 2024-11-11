<template>
<div>
    <smallbutton toplabel="Add Admin Transaction" @click="startAdd()" v-if="showButton" :class="buttonclass"/>
    <linkbutton toplabel="Add Admin Transaction" @click="startAdd()" v-if="!showButton"/>
    <!--  MODAL -->
      <actionmodal ref="mymodal"> 
        <template v-slot:body>
            <form ref="balform">
                <label class="titlelabel">Add Transaction for {{AdminFundRequest.Name}}</label>
                <br/>
                
                <formentry  isrequired="True" label="Transaction Amount $"  v-model="AdminFundRequest.newAmount" inputtype="number"  />
                <formentry inputtype="date"  label="Effective Date"  v-model="AdminFundRequest.effectiveDate" isrequired='True'/>
                <formentry   label="Reason"  v-model="AdminFundRequest.Reason" isrequired="True" />
                
                <div>
                    <label for="" class="required">{{requiredFieldLabel}}</label>
                </div>
                <smallbutton  @click="ConfirmAddTransaction()" toplabel="Save" />
                <smallbutton  @click="$refs.mymodal.closeModal()" toplabel="Close"/>
                <div>
                    <label class="responsemessage">{{responseMessage}}</label>
                </div>
                
            </form>
            
            
        </template>
      </actionmodal>
    </div>
</template>

<script>
import datamethods from '../../services/datamethods.js'
import {mapFields} from 'vuex-map-fields'
import format from '../../format.js'
import smallbutton from '../controls/button.vue'
import linkbutton from '../controls/linkbutton.vue'
import actionmodal from '../controls/actionmodal.vue'
import formentry from '../controls/entry.vue'
export default {
    name:'addadmintrans',
    components:{
        smallbutton,
        actionmodal,
        formentry,
        linkbutton
    },
    props:{
        accountId:{
            type:Number,
            required:true
        },
        showButton:{
            type:Boolean,
            default:false
        },
        buttonclass:{
                type:String,
                default:"button buttonprimary"
            },
        
    },
    mixins:[datamethods,format],
    data(){
        return{
            
            responseMessage:'',
            pleaseWait:false,
            AdminFundRequest:{
                Name:'',
                fromAccount:0,
                toAccount:0,
                oldAmount:'',
                newAmount:'',
                Reason:'',
                effectiveDate:'',
            },
            
            
        }
    },
    computed:{
        ...mapFields([
            'disableAddFunds',
            'currentWallet'

        ]),
        
    },
    methods:{
        beforeAPI(){
            this.pleaseWait=true
            this.responseMessage=''
        },
        startAdd(){
            var dt = this.$options.filters.formatDateForInputToday();
            this.AdminFundRequest={
                Name:'',
                fromAccount:0,
                toAccount:0,
                oldAmount:'',
                newAmount:'',
                Reason:'',
                effectiveDate:dt
            }   
            this.AdminFundRequest.oldAmount=0;
            //this.AdminFundRequest.Name=this.account.Name;
            this.AdminFundRequest.fromAccount=this.accountId;
            this.$refs.mymodal.openModal()
        },
        async ConfirmAddTransaction(){
            if(this.$refs.balform.checkValidity()){
                this.beforeAPI();
                let req = {
                    adminfunds:this.AdminFundRequest,
                }
                var response = await this.callAPI(req,'addtransaction')

                if(response.Successful){
                    this.responseMessage="Add Transaction was successful"
                this.$emit('refresh')
                }else{
                    this.responseMessage = response.Message
                }
                this.pleaseWait=false;
            }
        },

       
        
       
        
    }
}
</script>

<style>

</style>





























