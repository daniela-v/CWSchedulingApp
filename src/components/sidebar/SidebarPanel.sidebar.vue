<template>
  <div :id="getPanelName" class="sidepanel-component-vue">
    <Button name="sidepanel-title" :icon="getArrowDirection" type="inversed expand" :click="expand">{{ title }}</Button>
    <transition @enter="expandEnter" @afterEnter="expandAfterEnter" @leave="expandLeave" appear>
      <div v-show="isExpanded" class="sidepanel-content">
        <component :is="component" v-for="(item, id) in data" :key="id" :data="item" />
      </div>
    </transition>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';

import Button from '../Button.component.vue';

export default {
  components: { Button },
  props: ['name', 'title', 'component', 'data', 'expanded'],
  data() {
    return {
      isExpanded: this.expanded,
    };
  },
  computed: {
    getPanelName() {
      return `sidepanel-${this.name}`;
    },
    getArrowDirection() {
      return (this.isExpanded) ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    },
  },
  methods: {
    expand() {
      this.$set(this, 'isExpanded', !this.isExpanded);
    },
    expandEnter(el, done) {
      el.style.height = 'auto';
      const maxHeight = Number.parseInt(el.style.maxHeight.substr(0, el.style.maxHeight.length - 2), 10);
      const height = (el.offsetHeight > maxHeight) ? maxHeight : el.offsetHeight;
      el.style.height = 0;
      el.style.overflowY = 'hidden';
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el, { height }, { easing: 'swing', duration: 200 });
      Velocity(el.children, { opacity: 1 }, { easing: 'swing', duration: 200, complete: done });
    },
    expandAfterEnter(el) {
      el.style.height = 'auto';
      el.style.overflowY = 'auto';
    },
    expandLeave(el, done) {
      el.style.overflowY = 'hidden';
      Velocity(el, 'stop');
      Velocity(el.children, 'stop');
      Velocity(el.children, { opacity: 0 }, { easing: 'swing', duration: 200 });
      Velocity(el, { height: 0 }, { easing: 'swing', duration: 200, complete: done });
    },
  },
};
</script>

<style lang="scss">
.sidepanel-component-vue {
  align-self: stretch;
  display: flex;
  flex-direction: column;

  .sidepanel-content {
    border-top: 1px solid $color-cyan;
    overflow-y: auto;
  }
}
</style>