<template>
  <div class="horizFlex ">
        <input class="entryCheckbox" type="checkbox" :checked="value" @input="$emit('input',$event.target.checked)">
        <label for="" class="mediumtext">{{label}}</label>
  </div>
</template>


<script>
export default {
    name:'formentrycheck',
    props:{
        label:{
            type:String,
            required:true,
        },
        value:Boolean,
        inputtype:{
            type:String,
            default:'text',
        },
        inputRef:{
            type:String,
            default:'myInput'
        },
    },
    data() {
        return {
            labelText:this.label,
        };
    },
    methods:{
  
    
    },
    computed:{
     

    }
}
</script>

<style scoped>
.horizFlex{
  display:flex;
  flex-direction: row;
  margin:0px;
  margin-top:5px;
}
.mediumtext{
  font-size:medium;
  min-width:125px;
}
.entryCheckbox{
    margin-left:5px;
}
</style>