<template>
  <transition name="overlayfx" appear>
    <div v-if="$store.getters.getWindowsNum" class="overlay">
      <Window v-for="(window, id) in $store.getters.getWindows" :key="id" v-bind="window"></Window>
    </div>
  </transition>
</template>

<script>
import Window from '@/modules/Window.module.vue';

export default {
  components: {
    Window,
  },
};
</script>

<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(#000, .6);
  transition: opacity .2s ease;
  z-index: 100;
}
.overlayfx-enter, .overlayfx-leave-active { opacity: 0; }
</style>
