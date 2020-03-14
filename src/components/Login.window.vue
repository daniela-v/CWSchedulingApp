<template>
  <div class="login-overlay">
    <div class="title">Log In</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '@/scss/_colors';

.login-overlay {
  position: relative;
  padding: 10px;
  width: 380px;
  .title {
    margin: 20px 0;
    color: $color-beige;
    font-size: 40px;
  }
}
</style>
