<template>
  <div class="window" :class="[ slugifiedName ]">
    <div class="window-bg"></div>
    <Icon class="close" v-if="window.dismissable" name="x" :click="close.bind()"></Icon>
    <component :is="window.component" :name="slugifiedName" v-bind="window.props"></component>
  </div>
</template>

<script>
import _ from 'lodash';

import Icon from '../components/Icon.component.vue';

export default {
  props: ['id', 'window'],
  components: {
    Icon,
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
@import '@/scss/_colors.scss';
@import '@/scss/_mixins.scss';

.window {
  display: flex;
  flex-direction: column;
  position: absolute;
  border: 1px solid $color-beige;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(#000, .5);
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
                url('../assets/images/bg-3.jpg') left center / 400% no-repeat;
  }
  .close {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 24px;
    z-index: 1;
  }
  .content {
    padding: 30px;
    box-sizing: border-box;
  }
}
</style>
