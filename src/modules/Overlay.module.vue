<template>
  <transition name="overlayfx" appear>
    <div v-if="getOverlay.component" class="overlay">
      <component :is="getOverlay.component" :props="getOverlay.props"></component>
    </div>
  </transition>
</template>

<script>
export default {
  mounted() {
    document.addEventListener('keydown', this.OnKeyPress);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.OnKeyPress);
  },
  computed: {
    getOverlay() {
      return this.$store.getters.getOverlay;
    },
  },
  methods: {
    OnKeyPress(ev) {
      const keyEscape = (ev.key === 'Escape' || ev.key === 'Esc');
      if (this.getOverlay.closeable && keyEscape) {
        this.$store.commit('hideOverlay');
      }
    },
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
}
.overlayfx-enter, .overlayfx-leave-active { opacity: 0; }
</style>
