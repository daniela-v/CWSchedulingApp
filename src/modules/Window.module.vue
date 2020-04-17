<template>
  <transition name="windowfx" mode="out-in" appear>
    <div class="window" :class="[ slugifiedName, window.type ]">
      <Button name="close" type="icon" icon="close" v-if="window.dismissable" :click="close.bind()"></Button>
      <component :is="window.component" :name="slugifiedName" v-bind="window.props"></component>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';

import Button from '../components/Button.component.vue';

export default {
  props: ['id', 'window'],
  components: {
    Button,
  },
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
        this.close();
      }
    },
    close() {
      this.$store.commit('closeWindow');
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_mixins.scss';

.window {
  display: flex;
  flex-direction: column;
  position: absolute;
  border: 1px solid $color-cyan-border;
  border-radius: 4px;
  background: $color-cyan-bg;
  background: linear-gradient(to bottom, rgba($color-cyan-bg, .8) 50%, rgba($color-cyan-bg, .4));
  box-shadow: 0 0 30px rgba(#000, .5);
  overflow: hidden;
  @include transition('opacity, transform', .4s, ease);
  &.fullscreen {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: none;
    border: none;
    // Big X in the corner when window is full screen
    > .button-vue .button {
      right: 10px;
      top: 10px;
      font-size: 30px;
    }
  }
  .btn-close {
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 16px;
    z-index: 1;
  }
  .content {
    padding: 30px;
    box-sizing: border-box;
  }
}
.windowfx-enter, .windowfx-leave-active {
  opacity: 0;
  &.default {
    transform: translateY(-50px) scale(0.2);
  }
}
</style>
