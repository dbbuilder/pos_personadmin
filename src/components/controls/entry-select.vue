<template>
 
    <select name="" id="" class='lookupSelect2' :value="value" @input="$emit('input',$event.target.value)">
        <option v-for="item in items" :key="item.id" :value="item.id">
            {{item.name}}
        </option>
    </select>
  
</template>

<script>
export default {
    name:'formentryselect',
    props:{
        
        value:String,
        items:{
            type:Array,
            
        },
        
    },
    data() {
        return {
            
        };
    },
    methods:{
       
    
    },
    computed:{
        

    }
}
</script>

<style>

input:invalid {
  border-color: red;
}
select:invalid {
  border-color: red;
}
.lookupSelect2{
  outline-color:rgb(238,120,45);
  outline-width:2px;
  border-radius: 5px;
  font-size:large;
  width:98%;
  margin-bottom:10px;
}

</style>