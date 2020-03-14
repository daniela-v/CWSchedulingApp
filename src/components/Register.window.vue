<template>
  <div class="register-overlay">
    <div class="title">Register</div>
    <form class="register-form">
      <div class="input-wrapper">
        <label for="username" class="icon icon-person"></label>
        <input id="username" type="text" name="username" />
      </div>
      <div class="input-wrapper">
        <label for="password" class="icon icon-key"></label>
        <input id="password" type="password" name="password" />
      </div>
      <div class="input-wrapper">
        <label for="confirmPassword" class="icon icon-key"></label>
        <input id="confirmPassword" type="password" name="confirmPassword" />
      </div>
      <div class="input-wrapper">
        <label for="email" class="icon icon-email"></label>
        <input id="email" type="text" name="email" />
      </div>
      <div class="input-wrapper">
        <label for="confirmEmail" class="icon icon-email"></label>
        <input id="confirmEmail" type="text" name="confirmEmail" />
      </div>
      <Button type="header">Register</Button>
    </form>
  </div>
</template>

<script>
import Button from './Button.component.vue';

export default {
  components: {
    Button,
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors';
@import '@/scss/_mixins';

.register-overlay {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
  width: 380px;
  .title {
    margin: 20px 0;
    color: $color-beige;
    font-size: 40px;
  }
  form {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 8px;
    align-items: center;
    justify-items: center;
    .input-wrapper {
      display: flex;
      font-size: 16px;
      height: 32px;
      .icon {
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-right: 1px solid $color-beige;
      }
      input {
        width: 200px;
        padding: 0 30px 0 20px;
        color: $color-beige;
        border: 1px solid $color-beige;
        border-left: none;
        border-radius: 0 4px 4px 0;
        @include transition('background-color', 200ms, ease);
        &:hover { background-color: rgba($color-beige, .1); }
        &:focus {
          text-shadow: 0 0 2px $color-beige;
          background-color: rgba($color-beige, .2);
        }
        background: none;
        outline: none;
      }
    }
  }
}
</style>
