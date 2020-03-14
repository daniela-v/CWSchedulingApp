<template>
  <transition name="windowfx" appear>
    <div class="window" :class="[ slugifiedName ]">
      <component :is="window.component" v-bind="window.props"></component>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';

export default {
  props: ['window'],
  created() {
    window.addEventListener('mousemove', this.move);
    window.addEventListener('mouseup', this.release);
    window.addEventListener('resize', this.resize);
  },
  mounted() {
    this.$nextTick(this.alignCenter);
  },
  destroy() {
    window.removeEventListener('mousemove', this.move);
    window.removeEventListener('mouseup', this.release);
    window.removeEventListener('resize', this.resize);
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
    resize() {
      const el = this.$el;
      const { top, left } = this.$el.getBoundingClientRect();
      const y = _.clamp(top, 0, (document.documentElement.clientHeight - 1) - el.offsetHeight);
      const x = _.clamp(left, 0, (document.documentElement.clientWidth - 1) - el.offsetWidth);
      el.style.top = `${y}px`;
      el.style.left = `${x}px`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors.scss';
@import '@/scss/_mixins.scss';

.window {
  position: absolute;
  border: 1px solid $border-color;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(#000, .5);
  overflow: hidden;
  @include transition('opacity, transform', .4s, ease);
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
