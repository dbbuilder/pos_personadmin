<template>
    <footer>
        
    </footer>
</template>

<script>
import linkbutton from './controls/linkbutton.vue';
import modal from './controls/modal.vue'
export default {
  components: { linkbutton, modal },
    name: "spfooter",
    data() {
        return {
            

 
        };
    },
    computed:{
        
    }
}
</script>

<style>
footer{
    grid-area:footer;
    padding:10px;
    display:flex;
    flex-direction:column;
    text-align: center;
    font-size: small;
    color:var(--text-color);
}
.footerlink:link{
    color:var(--text-color);
}
.footerlink:visited{
    color:var(--text-color);
}
.footerlink:hover{
    color:var(--button-color);
}
.footerlogo{
  height:65px;
}
.footertextlight{
  color:var(--light-text-color);
  width:70%;
}
.darktext{
    color:var(--text-color);
    height:40px;
}
.button{
    text-decoration: underline;
    min-width: 75px;
    height:40px;
    padding:0px;
    font-size: small;
    margin-right:5px;

}
.subtitleBold{
  font-size:large;
  margin:20px;
  font-weight: bold;
}
</style>