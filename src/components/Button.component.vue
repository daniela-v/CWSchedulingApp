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
      return `${this.type}-button`;
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
@import '@/scss/_mixins.scss';
@import '@/scss/_colors.scss';

.button {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .icon-wrapper {
    margin: 0 8px 0 0; // Add spacing between icon and text on the right side of the icon [ICON  TEXT]
  }
  &.inversed {
    .text { order: 1 };
    .icon-wrapper {
      order: 2;
      margin: 0 0 0 8px; // Add spacing between icon and text on the left side of the icon [TEXT  ICON]
    }
  }
}

.bzard-button {
  padding: 6px 16px 6px 16px;
  background-color: darken($color-beige, 30%);
  color: lighten($color-beige, 20%);
  box-shadow: 0 1px 1px rgba(black, .3), 0 0 1px 1px rgba(white, .15) inset;
  @include transition('background-color, box-shadow', .2s, ease);
  &:not(.disabled) {
    &.is-active, &:hover {
      background-color: darken($color-beige, 25%);
    }
  }
}

.dialog-button {
  padding: 6px 16px 6px 16px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-radius: 2px;
  background: linear-gradient(to bottom, darken($color-beige, 25%), darken($color-beige, 30%));
  background-blend-mode: screen;
  color: lighten($color-beige, 40%);
  box-shadow: 0 1px 1px rgba(black, .3), 0 0 1px 1px rgba(white, .15) inset;
  @include transition('background-color, border', .2s, ease);
  &:not(.disabled) {
    &.is-active, &:hover {
      background-color: darken($color-beige, 45%);
      border-top: 1px solid $color-beige;
      border-bottom: 1px solid $color-beige;
    }
  }
}

.header-button {
  padding: 10px;
  color: $color-light-grey;
  font-size: 16px;
  font-weight: 600;
  @include transition('color', .2s, ease);
  &:hover, &.active { color: lighten($color-light-grey, 20%); }
}

.menu-button {
  flex: 1;
  padding: 10px;
  font-size: 24px;
  font-weight: 600;
  border-radius: 4px;
  @include transition('color, backgroundcolor', .2s, ease);
  &:hover, &.active { color: lighten($color-beige, 20%); }
  &.active { background-color: rgba($color-beige, .2); }
}
</style>
