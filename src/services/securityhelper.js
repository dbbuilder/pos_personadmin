import datamethods from '../services/datamethods.js'
import {mapFields} from 'vuex-map-fields'
export default{
    mixins:[datamethods],
    computed:{
        ...mapFields([
            
            'loggedInUser',
            'securityAppItems',
            'securityAppName',
            'username',
            'password'
    

        ]),
        
    },
    data(){
        return{
            
        }
    },
    methods:{
        async getSecurityAppItemList(){
            let req = {
                employeeId:this.loggedInUser.user_personId,
                appName:this.securityAppName
            }
            //call api
            var response = await this.callAPI(req,'securityappitems')
            //handle response
            if(response.Successful){
              this.securityAppItems=response.SecurityAppItemList

                //check main security to see if i can even be here
                if(this.canAccess(this.securityAppName)==false){
                    this.loggedIn=false
                    this.responseMessage="You do not have access to this application."
                    //console.log(this.responseMessage)
                }else{
                    this.loggedIn=true
                }

            }else{
              this.responseMessage = response.Message
            }
           
        },
        canAccess(itemName){
            if(this.securityAppItems==undefined){return false}
            //console.log('incanaccess')
            //find it in the list. if there and canaccess=true, then yes!
            var access = false;
            var found = false;
            if(this.securityAppItems.length==0){return false;}
            this.securityAppItems.forEach(myFunction2)
            
            function myFunction2(item, index, arr) {
                let p=arr[index]
                if(p.name==itemName){
                    found=true;
                    if(p.canAccess){
                        access=true;
                    }
                }
            } 

            if(!found){this.checkAddItem(itemName)}
            return access;
        },
        async checkAddItem(itemName){
            console.log(itemName)
            let req = {
                appName:this.securityAppName,
                appItemName:itemName
            }
            this.pleaseWait=true;
           
            var response = await this.callAPI(req,'checkaddsecurityappitem')
            //handle response
            if(response.Successful){
                
                
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;
        },
        canAccess_allowOverride(appName,itemName){
            var access = this.canAccess(itemName);
            
            //chance to override if false
            if(!access){
                this.$refs.override.getOverride(appName, itemName)
            }
            return access;
        },
        async securitylogin(){
            
            console.log('security login')
            //validate
            if(this.username=="" || this.password==""){return}
            let req = {
                email:this.username,
                password:this.password
            }
            this.pleaseWait=true;
            //console.log('login2')

            
            var response = await this.callAPI(req,'securityloginuser')
            //handle response
            if(response.Successful){
                
                this.loggedInUser=response.SecurityUser; //store user
                this.AddUserToAPI(this.loggedInUser)
                //this.loggedIn=true;
                
                this.getSecurityAppItemList()
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;
  
        },
        async securitypost_login(token){
            //add to api
           // console.log('token ' + token)
            this.AddTokenToAPI(token)
            
            let req = {
                useInternalSecurityOverride:true
            }

            this.pleaseWait=true;
            var response = await this.callAPI(req,'securityloginuser')
            //handle response
            if(response.Successful){
                this.currentWallet =response.wallet;
                
                this.loggedInUser=response.SecurityUser; //store user
                this.AddUserToAPI(this.loggedInUser)
                //this.loggedIn=true;

                this.getSecurityAppItemList()
            }else{
                this.responseMessage = response.Message
            }
            this.pleaseWait=false;
  
        },
       /*  overrideSuccessful(){
            console.log('override!!!')
        }, */
    }

}