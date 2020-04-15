<template>
  <div class="button-vue">
    <router-link class="button" :class="[ getName, getStyle ]" v-if="href" :to="href">
      <Icon :name="icon"></Icon>
      <span class="text">{{ getButtonText }}</span>
    </router-link>
    <div v-else class="button" :class="[ getName, getStyle, isDisabled ]" @click.capture="OnButtonClick">
      <Icon :name="icon"></Icon>
      <span class="text">{{ getButtonText }}</span>
    </div>
  </div>
</template>

<script>
import Icon from './Icon.component.vue';

export default {
  props: ['name', 'href', 'type', 'icon', 'text', 'click', 'disabled'],
  components: { Icon },
  computed: {
    getName() {
      return `btn-${this.name}`;
    },
    getButtonText() {
      return this.text || ((this.$slots.default && this.$slots.default.length) ? this.$slots.default[0].text : null);
    },
    getStyle() {
      return `${this.type}-style`;
    },
    isDisabled() {
      return this.disabled ? 'disabled' : null;
    },
  },
  methods: {
    OnButtonClick() {
      if (typeof (this.click) !== 'function' || this.disabled) return false;
      return this.click();
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_mixins.scss';

.button-vue {
  position: relative;
  .button {
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon-wrapper {
      position: relative;
      margin: 0 8px 0 0; // Add spacing between icon and text on the right side of the icon [ICON  TEXT]
    }
    &.inversed {
      .text { order: 1 };
      .icon-wrapper {
        order: 2;
        margin: 0 0 0 8px; // Add spacing between icon and text on the left side of the icon [TEXT  ICON]
      }
    }
    &.disabled {
      cursor: default;
      opacity: .4;
    }
    @include disableSelect();
  }

  .bzard-style {
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

  .dialog-style {
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
        border-color: $color-cyan;
      }
    }
    &.google {
      font-weight: 600;
      background: linear-gradient(to bottom, #dd4a36, darken(#dd4a36, 10%));
      color: lighten(#dd4a36, 40%);
      &:hover:not(.disabled) {
        background-color: darken(#c93737, 35%);
        border-color: #c93737;
      }
    }
    &.facebook {
      font-weight: 600;
      background: linear-gradient(to bottom, #7289da, darken(#7289da, 10%));
      color: lighten(#7289da, 40%);
      &:hover:not(.disabled) {
        background-color: darken(#7289da, 35%);
        border-color: #7289da;
      }
    }
  }

  .icon-style {
    .icon-wrapper { margin: 0; }
    @include transition('color', .2s, ease);
    &:hover, &.active { color: lighten($color-cyan, 20%); }
  }

  .header-style {
    padding: 10px;
    color: $color-cyan;
    font-size: 16px;
    font-weight: 600;
    @include transition('color', .2s, ease);
    &:hover, &.active { color: lighten($color-cyan, 20%); }
  }

  .menu-style {
    flex: 1;
    padding: 10px;
    font-size: 20px;
    font-weight: 600;
    border-radius: 4px;
    @include transition('color, background-color', .2s, ease);
    &:hover, &.active { color: lighten($color-cyan, 20%); }
    &.active { background-color: rgba($color-cyan, .2); }
  }
}
</style>
