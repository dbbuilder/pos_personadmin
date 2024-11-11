<template>
  <div :class="getClass" @click="$emit('click')">
        <div class="leftColumn">
            <label for="" class="labelBold">
                {{topLeft}} 
            </label>
            <label class="label" >
               {{bottomLeft}}
            </label>
        </div>
        <div class="rightColumn" v-if="showRight">
            <label for="" class="labelBold">
                {{topRight}} 
            </label>
            <label class="label" >
               {{bottomRight}}
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name:"lookupresult",
    props:{
        topLeft:{
            type:String,
            required:true
        },
        bottomLeft:{
            type:String,
        },
        topRight:{
            type:String,
        },
        bottomRight:{
            type:String,
        },
        showborder:{
            type:String,
            default:'false'
        },
        showRight:{
            type:String,
            default:'false'
        },
        selected:{
            type:Boolean,
            default:false
        },
        inactive:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
           
        };
    },
    methods:{
   

    },
    computed:{
        getClass(){
            var thisclass='item'
            if(this.inactive){thisclass='inactiveitem'}
            if(this.selected){
                thisclass="selecteditem"
                if(this.inactive){thisclass='inactiveselecteditem'}
            }
            if(this.showborder=='true'){
                thisclass= thisclass + " borderedge"
            }
            return thisclass
        }
    }
}
</script>

<style  >
.item{

    background-color: white;
    border-radius:0px;
    margin:5px 0px 5px 0px;
    padding:10px;
}
.selecteditem{
    border-style:solid;
    border-color:var(--button-color);
    border-width: 4px;
    background-color: white;
    border-radius:0px;
    margin:5px 0px 5px 0px;
    padding:10px;
}

.inactiveitem{

    background-color: gray;
    border-radius:0px;
    margin:5px 0px 5px 0px;
    padding:10px;
}
.inactiveselecteditem{
    border-style:solid;
    border-color:var(--button-color);
    border-width: 4px;
    background-color: gray;
    border-radius:0px;
    margin:5px 0px 5px 0px;
    padding:10px;
}

.borderedge{
    border-style:inset;
    border-color:var(--border-color);
    border-width: .5px;
}
.leftColumn{
    display:flex;
    flex-direction: column;
    text-align: left;
}
.rightColumn{
    display:flex;
    flex-direction: column;
    text-align: right;
}
.labelBold{
  font-size:medium;
  font-weight: bold;
}
.label{
    font-size:medium;
}
</style>
