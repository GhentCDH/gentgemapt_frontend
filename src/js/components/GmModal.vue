<template>
  <div class="gm-modal-backdrop"
       v-show="isOpen"
       :class="{open: isOpen}"
       >

    <div class="gm-modal-dialog" :class="{open: isOpen}" >
      <div class="gm-modal-header">
        <button class="gm-modal-close" @click="$emit('onClose', true)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
        <div class="gm-modal-title" v-if="title">{{ title }}</div>
      </div>
      <div class="gm-modal-body">
        <slot />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    title: String
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter .modal-dialog, .fade-leave-to .modal-dialog {
  transform: translateY(-20%);
}
.gm-modal-backdrop {
  background: rgba(70, 70, 70, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}
.gm-modal-dialog {
  width: 95%;
  height: 95%;
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 0.3rem;
  transition: 0.5s;
  position: relative;
  display: flex;
  flex-direction: column;
}

.gm-modal-header {

}

.gm-modal-close {
  background: none;
  border: none;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  outline: none;
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gm-modal-close svg {
  fill: rgb(150, 150, 150);
}
.gm-modal-close svg:hover {
  fill: rgb(100, 100, 100);
}
.gm-modal-title {
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: rgb(100, 100, 100);
}
.gm-modal-body {
  position: relative;
  flex-grow: 1;
}
</style>