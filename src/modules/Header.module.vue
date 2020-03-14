<template>
  <header>
    <div class="logo"></div>
    <section class="navigation"></section>
    <section class="account"></section>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
header {
  display: grid;
  grid-template-columns: auto 1fr 200px;
  grid-template-areas: "logo navigation account";

  .logo {
    grid-area: logo;
  }
  .navigation {
    grid-area: navigation;
  }
  .account {
    grid-area: account;
  }
}
</style>
