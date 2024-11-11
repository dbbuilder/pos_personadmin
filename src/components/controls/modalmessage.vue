<template>
    <div>
        
        <!-- MODAL -->
          <actionmodal ref="mymodal"> 
            <template v-slot:body>
                <label class="titlelabel">{{title}}</label>
                <label >{{body}}</label>
                <div>
                    <smallbutton  @click="close" toplabel="OK"/>
                </div>
                <div>
                  <label class="responsemessage">{{responseMessage}}</label>
                </div>
            </template>
          </actionmodal>
        </div>
    </template>
    
    <script>
    import smallbutton from '../controls/button.vue'
    import actionmodal from './actionmodal.vue'

    export default {
        name:'modalmessage',
        components:{
            smallbutton,
            actionmodal,
        },
        props:{
            title:{
                type:String,
                required:true
            },
            body:{
                type:String,
            },

            buttonclass:{
                type:String,
                default:"button primarybutton"
            }
        },
        data(){
            return{
                responseMessage:''
            }
        },
        methods:{
            show(){
                this.$refs.mymodal.openModal()
            },
            close(){
                this.$emit('close')
                this.$refs.mymodal.closeModal()
            }

        }
    }
    </script>
    
    <style>
    
    </style>