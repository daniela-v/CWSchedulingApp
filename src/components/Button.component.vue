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
    position: relative;
    top: 1px;
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
  padding: 6px 16px;
  background-color: darken($color-cyan, 30%);
  color: lighten($color-cyan, 20%);
  box-shadow: 0 1px 1px rgba(black, .3), 0 0 1px 1px rgba(white, .15) inset;
  @include transition('background-color, box-shadow', .2s, ease);
  &:not(.disabled) {
    &.is-active, &:hover {
      background-color: darken($color-cyan, 25%);
    }
  }
}

.dialog-button {
  padding: 8px 20px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-radius: 3px;
  background: linear-gradient(to bottom, darken($color-cyan, 10%), darken($color-cyan, 20%));
  background-blend-mode: screen;
  color: lighten($color-cyan, 40%);
  box-shadow: 0 1px 2px rgba(black, .8), 0 0 1px 1px rgba(white, .15) inset;
  @include transition('background-color, border', .2s, ease);
  &:not(.disabled) {
    &.is-active, &:hover {
      background-color: darken($color-cyan, 40%);
      border-top: 1px solid $color-cyan;
      border-bottom: 1px solid $color-cyan;
    }
  }
}

.header-button {
  padding: 10px;
  color: $color-cyan;
  font-size: 16px;
  font-weight: 600;
  @include transition('color', .2s, ease);
  &:hover, &.active { color: lighten($color-cyan, 20%); }
}

.menu-button {
  flex: 1;
  padding: 10px;
  font-size: 20px;
  font-weight: 600;
  border-radius: 4px;
  @include transition('color, backgroundcolor', .2s, ease);
  &:hover, &.active { color: lighten($color-cyan, 20%); }
  &.active { background-color: rgba($color-cyan, .2); }
}

/* @if $color == "teal" {
    background: linear-gradient(to bottom, rgba(#01936e, 1), rgba(#008562, 1));
    color: lighten(#01936e, 40%);

    &:hover:not(.disabled) {
      background-color: darken($cyan, 35%);
    }
  }
  @if $color == "red" {
    background: linear-gradient(to bottom, #dd4a36, darken(#dd4a36, 10%));
    color: lighten(#dd4a36, 40%);

    &:hover:not(.disabled) {
      background-color: darken(#c93737, 35%);
    }
  }
  @if $color == "cyan" {
    background: linear-gradient(to bottom, #00aaff, darken(#00aaff, 10%));
    color: lighten(#00aaff, 40%);

    &:hover:not(.disabled) {
      background-color: darken(#00aaff, 35%);
    }
  }
  @if $color == "blue" {
    background: linear-gradient(to bottom, #3965a4, darken(#3965a4, 10%));
    color: lighten(#3965a4, 40%);

    &:hover:not(.disabled) {
      background-color: darken(#3965a4, 35%);
    }
  }
  @if $color == "blurple" {
    background: linear-gradient(to bottom, #7289da, darken(#7289da, 10%));
    color: lighten(#7289da, 40%);

    &:hover:not(.disabled) {
      background-color: darken(#7289da, 35%);
    }
  } */
</style>
