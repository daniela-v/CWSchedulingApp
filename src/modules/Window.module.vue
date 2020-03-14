<template>
  <transition name="windowfx" appear>
    <div class="window" :class="[ slugifiedName ]">
      <div class="window-bg"></div>
      <component :is="window.component" v-bind="window.props"></component>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';

export default {
  props: ['id', 'window'],
  created() {
    window.addEventListener('resize', this.alignCenter);
    window.addEventListener('keydown', this.escape);
  },
  mounted() {
    this.$nextTick(this.alignCenter);
  },
  destroy() {
    window.removeEventListener('resize', this.alignCenter);
    window.removeEventListener('keydown', this.escape);
  },
  computed: {
    slugifiedName() {
      return _.kebabCase(this.window.name);
    },
  },
  methods: {
    alignCenter() {
      const el = this.$el;
      const y = Math.max(0, (document.documentElement.clientHeight - el.offsetHeight) / 2);
      const x = Math.max(0, (document.documentElement.clientWidth - el.offsetWidth) / 2);
      el.style.top = `${y}px`;
      el.style.left = `${x}px`;
    },
    escape(event) {
      const keyEscape = (event.key === 'Escape' || event.key === 'Esc');
      if (this.window.dismissable && keyEscape) {
        this.$store.commit('closeWindow', { id: this.key });
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors.scss';
@import '@/scss/_mixins.scss';

.window {
  position: absolute;
  border: 1px solid $color-beige;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(#000, .5);
  min-height: 600px;
  overflow: hidden;
  @include transition('opacity, transform', .4s, ease);
  .window-bg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: darken($color-beige, 40%);
    background: linear-gradient(to bottom, rgba(#000, .8) 50%, rgba(#000, .5)),
                url('../assets/bg-3.jpg') left center / 400% no-repeat;
  }
  .content {
    padding: 30px;
    box-sizing: border-box;
  }
}
.windowfx-enter, .windowfx-leave-active {
  opacity: 0;
  transform: translateY(-50px) scale(0.2);
}
</style>
