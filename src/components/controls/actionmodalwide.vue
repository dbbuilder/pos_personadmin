<template> 
    <transition name="fade">
      <div class="modal" v-if="show">
        <div class="modal__backdrop" />
  
        <div class="modal__dialog">
          <div class="modal__body">
            <slot name="body"/>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: "actionmodalwide",
    data() {
      return {
        show: false
      };
    },
    methods: {
      closeModal() {
        this.show = false;
        document.querySelector("body").classList.remove("overflow-hidden");
      },
      openModal() {
        this.show = true;
        document.querySelector("body").classList.add("overflow-hidden");
      }
    }
  };
  </script>
  
  
  <style lang="scss" scoped>
  .modal {
      text-align:center;
    overflow-x: auto;
    overflow-y: auto;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    &__backdrop {
      background-color: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
    &__dialog {
      background-color: #ffffff;
      position: relative;
      width: 1200px;
      margin: 50px auto;
      display: flex;
      flex-direction: column;
      border-radius: 5px;
      z-index: 2;
      @media screen and (max-width: 992px) {
        width: 90%;
      }
    }
    &__close {
      width: 30px;
      height: 30px;
    }
    &__header {
      padding: 10px 40px 10px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    &__body {
      padding: 10px 20px 10px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    &__footer {
      padding: 10px 20px 20px;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  