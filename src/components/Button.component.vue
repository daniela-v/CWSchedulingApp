<template>
  <router-link :id="getName" class="button" :class="getStyle" v-if="href" :to="href">
    <Icon :name="icon"></Icon>
    <span class="text"><slot></slot></span>
  </router-link>
  <div v-else :id="getName" class="button" :class="getStyle" @click="OnButtonClick">
    <Icon :name="icon"></Icon>
    <span class="text"><slot></slot></span>
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
  .icon {
    margin: 0 8px 0 0; // Add spacing between icon and text on the right side of the icon [ICON  TEXT]
  }
}

.header-button {
  padding: 10px;
  color: $color-light-grey;
  font-size: 16px;
  font-weight: 600;
  transition: color .2s ease;
  &:hover, &.active { color: lighten($color-light-grey, 20%); }
}

.menu-button {
  flex: 1;
  padding: 10px;
  font-size: 24px;
  font-weight: 600;
  border-radius: 4px;
  transition: color .2s ease, background-color .2s ease;
  .text { order: 1; }
  .icon {
    order: 2;
    margin: 0 0 0 8px; // Add spacing between icon and text on the left side of the icon [TEXT  ICON]
  }
  &:hover, &.active { color: lighten($color-beige, 20%); }
  &.active { background-color: rgba($color-beige, .2); }
}
</style>
