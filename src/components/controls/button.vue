<template>
    <button :class="buttonclass" type="button"  :disabled="disabled">
        <div >
            <p class="buttontext">{{toplabel}}</p>
        </div>       
    </button>
</template>

<script>
export default {
    name:'smallbutton',
    props:{
        toplabel:{
            type:String,
            
        },
        buttonclass:{
          type:String,
          default:"button buttonprimary"
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

.button{
    
    color:var(--light-text-color);
    border: none;
    border-radius:10px;
    width:130px;
    height:50px;
    padding:0px;
    font-size: medium;
    margin:10px;
  text-decoration: none;
}
button:hover{
    background-color:var(--highlight-button-color);
  cursor:pointer;
}
button:disabled{
  background-color:var(--inactive-color);
}
.buttonprimary{
  background-color:var(--button-color);
}
.buttonhighlight{
  background-color:var(--highlight-button-color);
}
.buttondisabled{
  background-color:var(--disabled-color);
}
.buttonpay{
  background-color:var(--pay-color);
}
.buttonmeal{
  background-color:var(--meal-color);
}
</style>