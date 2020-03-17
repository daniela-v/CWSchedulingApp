<template>
  <transition name="tooltipfx">
    <div v-if="getTooltip" class="tooltip" :class="[ getTooltip.type, arrowPosition ]" :style="tooltipPosition">
      <span>{{ getTooltip.text }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      tooltipPosition: null,
      arrowPosition: null,
    };
  },
  computed: {
    getTooltip() {
      return this.$store.getters.getTooltip;
    },
  },
  watch: {
    async getTooltip(to) {
      if (!to) return;
      this.$nextTick(() => {
        const el = to.element;
        const tooltip = this.$el;
        const { left, top } = el.getBoundingClientRect();
        const preset = {
          top: document.documentElement.clientHeight - top + 15,
          middle: top + el.offsetHeight / 2 - tooltip.offsetHeight / 2,
          bottom: top + el.offsetHeight + 10,
          left: document.documentElement.clientWidth - left + 10,
          center: left + el.offsetWidth / 2 - tooltip.offsetWidth / 2,
          right: left + el.offsetWidth + 10,
        };
        const position = {
          x: { css: 'left', px: preset.center },
          y: { css: 'bottom', px: preset.top },
        };
        this.tooltipPosition = {};
        this.arrowPosition = 'bottom';
        this.tooltipPosition[position.x.css] = `${position.x.px}px`;
        this.tooltipPosition[position.y.css] = `${position.y.px}px`;
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors';
@import '@/scss/_mixins';

.tooltip {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 4px 6px 4px 6px;
  border-radius: 2px;
  border-color: $color-beige;
  border: 1px solid;
  background-color: darken($color-beige, 40%);
  box-shadow: 0 0 20px rgba(#000, .5);
  font-size: 14px;
  white-space: pre;
  z-index: 5000;
  @include transition('opacity', .2s, ease);
  &:before, &:after {
    content: "";
    position: absolute;
    display: block;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    pointer-events: none;
  }
  &.alert {
    border-color: red;
    border: 1px solid;
    color: red;
    background-color: darken(red, 55%);
  }

  &.top:before, &.top:after, &.bottom:before, &.bottom:after {
    left: 50%;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
  }
  &.left:before, &.left:after, &.right:before, &.right:after {
    top: 50%;
    transform: translateY(-50%);
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }
  &.top:before, &.top:after { top: 0; }
  &.bottom:before, &.bottom:after { top: 100%; }
  &.left:before, &.left:after { left: 0; }
  &.right:before, &.right:after { left: 100%; }
  &.right {
    &:before { border-left: 5px solid; }
    &:after {
      z-index: 10;
      margin-left: -1px;
      border-left: 5px solid darken($color-beige, 40%);
    }
    &.alert:after { border-left: 5px solid darken(red, 55%); }
  }
  &.bottom {
    &:before { border-top: 5px solid; }
    &:after {
      margin-top: -1px;
      z-index: 10;
      border-top: 5px solid darken($color-beige, 40%);
    }
    &.alert:after { border-top: 5px solid darken(red, 55%); }
  }
  &.left {
    &:before {
      left: -13px;
      border-right: 5px solid;
    }
    &:after {
      left: -12px;
      z-index: 10;
      border-right: 5px solid darken($color-beige, 40%)
    }
    &.alert:after { border-right: 5px solid darken(red, 55%); }
  }
  &.top {
    &:before {
      top: -6px;
      border-bottom: 5px solid;
    }
    &:after {
      top: -5px;
      z-index: 10;
      border-bottom: 5px solid darken($color-beige, 40%);
    }
    &.alert:after { border-bottom: 5px solid darken(red, 55%); }
  }
}

.tooltipfx-enter, .tooltipfx-leave-to {
  opacity: 0;
}
</style>
