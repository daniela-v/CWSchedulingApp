<template>
  <div class="tag-component-vue">
    <div class="tag" :class="[ getStyle ]">
      <Icon v-if="icon" :name="icon"></Icon>
      <div v-if="icon && (text || $slots.default)" class="spacer"></div>
      <span v-if="text || $slots.default" class="text"><slot>{{ this.text }}</slot></span>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.component.vue';

export default {
  components: { Icon },
  props: ['text', 'icon', 'type'],
  computed: {
    getStyle() {
      return `${this.type}-style`;
    },
  },
};
</script>

<style lang="scss">
.tag-component-vue {
  position: relative;
  .tag {
    display: flex;
    align-items: center;
    padding: 2px 8px;
    margin: 0 4px;
    border-radius: 2px;
    background: linear-gradient(to bottom, darken($color-cyan, 15%), darken($color-cyan, 20%));
    color: lighten($color-cyan, 40%);
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(black, .8), 0 0 1px 1px rgba(white, .15) inset;

    .icon-wrapper { order: 1; }
    .text { order: 3 };
    .spacer {
      order: 2;
      margin: 0 4px;
    }

    &.inversed {
      .text { order: 1 };
      .icon-wrapper { order: 3; }
    }

    &.alert-style {
      color: lighten($color-error-soft, 30%);
      background: linear-gradient(to bottom, darken($color-error-soft, 15%), darken($color-error-soft, 20%));
    }
  }
}
</style>
