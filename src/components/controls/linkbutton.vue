<template>
    <a class="linkedbutton"   @click="$emit('click')" :disabled="disabled">{{toplabel}}</a>
   
</template>

<script>
export default {
    name:'linkbutton',
    props:{
        toplabel:{
            type:String, 
        },
        disabled:{
          type:Boolean,
          default:false
        }
    }
}
</script>

<style >
.buttontext{
  margin:0px;
}

.linkedbutton{
    text-decoration: underline;
    min-width: 75px;
    
    height:25px;
    padding:0px;
    font-size: inherit;
    margin:0px;
    color:var(--button-color);
}
.linkedbutton:hover{
    color:var(--highlight-color);
    cursor:pointer;
}
.linkedbutton:link{
    color:var(--button-color);
}
.linkedbutton:disabled{
  background-color:gray;
}

</style>