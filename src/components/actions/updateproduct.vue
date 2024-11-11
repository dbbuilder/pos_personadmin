<template>
    <div>
    <linkbutton toplabel="Update Course" @click="UpdateProduct()"/> 

        <!-- ACCT NOTE MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <form ref="myform">
                    <label class="titlelabel">Update Course</label>
                    
                    <div class="entry" >
                        <div class="entryTextDiv">
                            <label class="entryLabel" for="">Select Course Type</label>
                        </div>
                        <div class="entryTextDiv">
                        <select name="" id="" class='entrySelect' v-model="person.ProductTypeGlobalKey"  @change="getProducts()" >
                            <option v-for="ptype in ProductTypeList" :key="ptype.guid" :value="ptype.guid" >
                                {{ptype.name}}
                            </option>
                        </select>
                        </div>
                    </div>
                    <div class="entry"  >
                        <div class="entryTextDiv">
                            <label class="entryLabel" for="">Select Course</label>
                        </div>
                        <div class="entryTextDiv">
                        <select name="" id="" class='entrySelect' v-model="person.ProductGlobalKey"  @change="selectProduct()" >
                            <option v-for="p in ProductList" :key="p.guid" :value="p.guid" >
                                {{p.name}} ( {{toCurrency(p.price)}})
                            </option>
                        </select>
                        </div>
                    </div>
                    <div>
                        <label class="responsemessage">Warning: Changing the program will change the amount due on the student’s account if there is a price difference!   </label>
                   
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
        name:'updateproduct',
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
     
            buttonclass:{
                type:String,
                default:'updatebutton'
            },
    
        },
        mixins:[datamethods,format,securityhelper],
        data(){
            return{
                message:'',
             
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

            }
        },
        computed:{
            ...mapFields([

               'loggedInUser'
            
    
            ]),
       
      
        },
        methods:{
            
           
            toCurrency(value){
                return "$" + Number(value).toFixed(2);
            },
           UpdateProduct(){
            this.message=''
            this.person=this.inperson
            this.getProductTypes()
            this.$refs.mymodal.openModal()
           },
           
            cancelupdate(){
                this.$refs.mymodal.closeModal()
                this.$emit('refresh')
                
            },
            async saveNewperson(){
           
    
                let req = {
                    person:this.person,
                    amount:this.productamount,
                    oldProductId:this.person.productId
                }
                this.$store.dispatch('beforeAPI');
                var response = await this.callAPI(req,'updatepersonproduct')
                if(response.Successful){
                    //save prod sale
    
                    this.$emit('refresh')
                    this.$refs.mymodal.closeModal()
                    //console.log(response)
                    
                    
                    
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    