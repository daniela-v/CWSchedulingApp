<template>
  <div id="app">
    <Header></Header>
    <router-view />
    <Overlay></Overlay>
    <Notification></Notification>
    <Tooltip></Tooltip>
  </div>
</template>

<script>
import axios from 'axios';

import Header from './modules/Header.module.vue';
import Overlay from './modules/Overlay.module.vue';
import Notification from './modules/Notification.module.vue';
import Tooltip from './modules/Tooltip.module.vue';

export default {
  components: {
    Header,
    Overlay,
    Notification,
    Tooltip,
  },
  async created() {
    await this.trySession();
  },
  methods: {
    async trySession() {
      const response = await axios.get('/users/session');
      if (response.data.result) {
        this.$store.commit('authenticate', response.data.result);
      }
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap");
@import url('https://fonts.googleapis.com/css?family=Titillium+Web:300,400,600,700,900&display=swap');
@import './scss/_normalize';
@import './scss/_colors';

html, body, #app {
  min-height: 100vh;
}

a {
  text-decoration: none !important;
  color: $color-cyan;

  transition: color .15s linear, text-shadow .15s linear, background-color .15s linear;
  cursor: pointer;

  &:hover:not(.icon):not(.button) {
    color: lighten($color-cyan, 20%);
    text-shadow: 0 0 1px $color-cyan !important;
  }
}

#app {
  background: $color-cyan-bg;
  background: radial-gradient(rgba(#000, .6), rgba(#000, .8)),
              url('./assets/images/bg-4.jpg') center center / cover no-repeat fixed;
  font-family: "Titillium Web", "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  text-shadow: 1px 1px 1px #000;
  color: $color-cyan;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba($color-cyan, .2);
    mix-blend-mode: soft-light;
    pointer-events: none;
  }
}

::-webkit-input-placeholder {
  opacity: .4;
  font-size: 14px;
}
:-ms-input-placeholder {
  opacity: .4;
  font-size: 14px;
}
::placeholder {
  opacity: .4;
  font-size: 14px;
}
</style>
