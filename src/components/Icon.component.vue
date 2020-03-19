<template>
  <router-link v-if="name && href && !disabled" :to="href" class="icon-wrapper">
    <img v-if="img" :src="getImage" :class="[ getIcon ]" />
    <i v-else class="icon" :class="[ getIcon, isPointer ]"></i>
  </router-link>
  <div v-else-if="name" class="icon-wrapper" :class="[ isDisabled ]" @click.stop="OnIconClick">
    <img v-if="img" :src="getImage" :class="[ getIcon ]" />
    <i v-else class="icon" :class="[ getIcon, isPointer ]"></i>
  </div>
</template>

<script>
export default {
  props: ['name', 'disabled', 'click', 'href', 'img'],
  computed: {
    isDisabled() {
      return this.disabled ? 'disabled' : false;
    },
    isPointer() {
      return this.click || this.href ? 'pointer' : false;
    },
    getImage() {
      return require(`@/assets/images/${this.img}.png`); // eslint-disable-line
    },
    getIcon() {
      return `icon-${this.name}`;
    },
  },
  methods: {
    OnIconClick() {
      if (this.disabled || typeof (this.click) !== 'function') return false;
      return this.click();
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors';
@import '@/scss/_mixins';

@font-face {
  font-family: 'cwscheduleappicon';
  src:
    url('../assets/fonts/cwscheduleappicon.ttf?lft96k') format('truetype'),
    url('../assets/fonts/cwscheduleappicon.woff?lft96k') format('woff'),
    url('../assets/fonts/cwscheduleappicon.svg?lft96k#cwscheduleappicon') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.icon {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'cwscheduleappicon' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @include transition(color, .2s, ease);
  &.pointer:hover {
    color: lighten($color-cyan, 20%);
    cursor: pointer;
  }
}

.icon-refresh:before {
  content: "\e90e";
}
.icon-add:before {
  content: "\e90d";
}
.icon-add-circle:before {
  content: "\e90c";
}
.icon-user-circle:before {
  content: "\e90b";
}
.icon-user:before {
  content: "\e90a";
}
.icon-next:before {
  content: "\e909";
}
.icon-close:before {
  content: "\e908";
}
.icon-check:before {
  content: "\e907";
}
.icon-previous:before {
  content: "\e906";
}
.icon-warning:before {
  content: "\e905";
}
.icon-arrow-right:before {
  content: "\e904";
}
.icon-email:before {
  content: "\e903";
}
.icon-key:before {
  content: "\e902";
}
.icon-person:before {
  content: "\e901";
}
.icon-menu:before {
  content: "\e900";
}
</style>
