<template>
  <div id="app">
    <div class="background"></div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap");
@import './scss/_normalize';
@import './scss/_colors';

html, body, #app {
  min-height: 100vh;
}

#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-yellow;
}

// Photo by Roland Epple on Unsplash
.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: darken($color-purple, 15%);
  background: radial-gradient(rgba(#000, .4), rgba(#000, .6)),
              url('./assets/bg-3.jpg') center center / cover no-repeat fixed;
}
</style>
