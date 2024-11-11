<template>
    <div class="entry">    
        <div class="entryTextDiv">
            <label class="entryLabel" for="">{{label}}</label>
            <label class="required">{{requiredText}}</label>
        </div>
        <input :id="inputid" ref="myinput" class="entryText capital" :type="inputtype" name="" :pattern="pattern" :placeholder="placeholder" 
            :minlength="minlength" :value="modelValue" @blur="leavePhone" @input="$emit('update:modelValue',$event.target.value)"   :required="isrequired" >
        
    </div>
</template>

<script>
export default {
    name:'formentry-stacked',
    props:{
        label:{
            type:String,
            required:true,
        },
        isrequired:{
            type:Boolean,
            default:false,
        },
        modelValue:String,
        inputtype:{
            type:String,
            default:'text',
        },
        minlength:{
            type:String,
            default:"0",
        },
        placeholder:{
            type:String,
            default:'',
        },
        inputid:{
            type:String,
        }
    },
    data() {
        return {
            
        };
    },
    methods:{
        /* updateText(){
            this.$emit('input', $event.target.value)
        }, */
        leavePhone(){
            if(this.inputtype=='tel'){
                this.$refs.myinput.value=this.formatPhone(this.$refs.myinput.value);
            }
            
        },
        formatPhone(phn) {
           // console.log('formatph ' + phn)
            if(phn==''){return ''}
            phn=phn.replace('-','').replace('(','').replace(')','').replace(' ','')
           // console.log('cleannum ' + phn)

            if(phn.length==11 && phn.substring(0,1)=='1'){phn=phn.substring(1)}

            phn = "(" + phn.substring(0,3) + ")" + phn.substring(3,6) + "-" + phn.substring(6);
            return phn
                
        },
    },
    computed:{
        requiredText(){
            if(this.isrequired){return "*"}
            else{return ""}
        },
        pattern(){
            if(this.inputtype=="tel"){
                return "[1][0-9]{3}[0-9]{3}[0-9]{4}|[1]-[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{3}[0-9]{3}[0-9]{4}|[(][0-9]{3}[)][0-9]{3}-[0-9]{4}|[(][0-9]{3}[)] [0-9]{3}-[0-9]{4}"
            }
        },
        title(){
            if(this.inputtype=='tel'){
               return "10 digit phone number"
            }
        }

    }
}
</script>

<style scoped>
input:invalid {
  border-color: red;
}
select:invalid {
  border-color: red;
}
.entry{
    width: 100%;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
}
.entryLabel{
    margin:0px;
    font-size:medium;
    text-align: left;   
}
.entryCheckLabel{
    margin:0px 0px 0px 0px;
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
.entryCheckbox{
    margin-left:5px;
}
.entryText{
    margin:0px 0px 10px 0px;
    width:95%;
    font-size:16px;
}
.entrySelect{
    margin:5px;
    width:98%;
    font-size:16px;
}
.entryTextDiv{
    display:flex;
    flex-direction: row;
    min-width: 250px;
    
}
</style>