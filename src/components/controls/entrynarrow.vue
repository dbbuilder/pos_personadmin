<template>
    <div class="entry">    
        <div class="entryLabelDivNarrow">
            <label class="entryLabel" for="">{{label}}</label>
            <label class="required">{{requiredText}}</label>
        </div>
        <div class="entryTextDivNarrow">
            <label class="entryLabel" v-if="isMoney">$</label>
            <input ref="myinput" class="entryText capital" :type="inputtype" name="" :pattern="pattern" :placeholder="placeholder" 
                :minlength="minlength" :value="modelValue" @blur="leavePhone" @input="$emit('update:modelValue',$event.target.value)" :required="isrequired" >
        </div>
    </div>
</template>

<script>
export default {
    name:'formentrynarrow',
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
        isFirstField:{
            type:Boolean,
            default:false
        },
        isMoney:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {

        };
    },
    mounted(){
        if(this.isFirstField=='True'){
            this.$nextTick(()=>{
              this.$refs.myinput.focus();
            });
        }
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
            
            if(phn==''){return ''}
            phn=phn.replace('-','').replace('(','').replace(')','').replace(' ','')
            

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
        isRequired(){
            return this.isrequired=='True'||this.isrequired=='true'
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
@media screen and (min-width: 812px) {
    .entry{
        flex-direction: row;
    }
}
/* phone */
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
    margin:5px;
    font-size:medium;
    text-align: left;   
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
.entryCheckbox{
    margin-left:5px;
}
.entryText{
    margin:5px 0px 0px 0px;
    width:95%;
    font-size:16px;
}
.entrySelect{
    margin:5px;
    width:98%;
    font-size:16px;
}
.entryTextDivNarrow{
    display:flex;
    flex-direction: row;
    min-width: 150px;
}
.entryLabelDivNarrow{
    display:flex;
    flex-direction: row;
    min-width: 100px;
}
.capital{
  text-transform: capitalize;
}

</style>