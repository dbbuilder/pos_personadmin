
import {HTTP} from './repository'
import {HTTPImage} from './repository'
export default{
    methods:{
        AddTokenToAPI(token){
            
            HTTP.defaults.headers.post['token']=token
        },
        AddUserToAPI(user){
            //console.log('add user to api ' + user.userId + ' ' + user.userKey)
            HTTP.defaults.headers.post['adminuser']=user.userId + '|' + user.userKey
        },
        getFailureResponse(message){
            return {
                'Successful':false,
                'Message':message
            }
        },
        async callAPI(req,method){
            try{
                
                var response = await HTTP.post(method,req)
                if(response.data.Successful==false){
                    return this.getFailureResponse(response.data.RequestException.Message)
                }
                return response.data
            }
            catch(e){
                console.log('!' + e)
                return this.getFailureResponse(e.message)
            }
        }, 

        async callAPI_Image(req,method){
            try{
                
                var response = await HTTPImage.post(method,req)
                if(response.data.Successful==false){
                    return this.getFailureResponse(response.data.RequestException.Message)
                }
                return response.data
            }
            catch(e){
                console.log('!' + e)
                return this.getFailureResponse(e.message)
            }
        }, 
    },
    
}