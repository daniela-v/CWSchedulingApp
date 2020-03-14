<template>
  <router-link :id="getName" class="button" :class="getStyle" v-if="href" :to="href">
    <span class="text"><slot></slot></span>
    <Icon :name="icon"></Icon>
  </router-link>
  <div v-else :id="getName" class="button" :class="getStyle" @click="OnButtonClick">
    <span class="text"><slot></slot></span>
    <Icon :name="icon"></Icon>
  </div>
</template>

<script>
import Icon from './Icon.component.vue';

export default {
  props: ['name', 'href', 'type', 'icon', 'text', 'click'],
  components: {
    Icon,
  },
  computed: {
    getName() {
      return `btn-${this.name}`;
    },
    getStyle() {
      return `button ${this.type}-button`;
    },
  },
  methods: {
    OnButtonClick() {
      if (typeof (this.click) !== 'function') return false;
      return this.click();
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors.scss';

.button {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.menu-button {
  flex: 1;
  padding: 10px;
  color: $color-beige;
  font-size: 24px;
  font-weight: 600;
  transition: color .2s ease, background-color .2s ease;
  .icon { margin-left: 8px; }
  &:hover, &.active { color: lighten($color-beige, 10%); }
  &.active { background-color: rgba($color-beige, .2); }
}
</style>
