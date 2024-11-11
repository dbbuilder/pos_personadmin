<template>
    <a class="iconbutton"   @click="$emit('click')" :disabled="disabled">
        <img src="@/assets/pencil.png"  class="iconimage" >
    </a>
</template>

<script>
export default {
    name:'pencilbutton',
    props:{
        
        disabled:{
          type:Boolean,
          default:false
        }
    },
    data() {
        return {
            
        };
    },
}
</script>

<style >

.iconbutton:hover{
    
    cursor:pointer;
}

.iconimage{
    width:11px;
}
</style>