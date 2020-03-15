<template>
  <div id="app">
    <Header></Header>
    <router-view />
    <Overlay></Overlay>
  </div>
</template>

<script>
import Header from './modules/Header.module.vue';
import Overlay from './modules/Overlay.module.vue';

export default {
  components: {
    Header,
    Overlay,
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap");
@import './scss/_normalize';
@import './scss/_colors';

html, body, #app {
  min-height: 100vh;
}

a {
  text-decoration: none !important;
  color: $color-beige;
}

#app {
  background: darken($color-purple, 15%);
  background: radial-gradient(rgba(#000, .4), rgba(#000, .6)),
              $background center center / cover no-repeat fixed;
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  text-shadow: 1px 1px 1px #000;
  color: $color-beige;
}
</style>
