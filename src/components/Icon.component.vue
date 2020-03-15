<template>
  <i v-if="name" class="icon" :class="getIcon"></i>
</template>

<script>
export default {
  props: ['name'],
  computed: {
    getIcon() {
      return `icon-${this.name}`;
    },
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: 'cwscheduleappicon';
  src:
    url('../assets/fonts/cwscheduleappicon.ttf?u02jkd') format('truetype'),
    url('../assets/fonts/cwscheduleappicon.woff?u02jkd') format('woff'),
    url('../assets/fonts/cwscheduleappicon.svg?u02jkd#cwscheduleappicon') format('svg');
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

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-check:before {
  content: "\e907";
}
.icon-darrow-right:before {
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
