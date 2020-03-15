<template>
  <div class="auth-window">
    <div class="title">{{ getForm.title }}</div>
    <form class="auth-form" @keypress="submit">
      <div v-for="(input, id) in getForm.input" :key="id" class="input-wrapper">
        <label :for="id" class="icon" :class="[ input.icon ]"></label>
        <input :id="id" :type="input.type" :name="id" :placeholder="input.placeholder" v-model="input.model" />
      </div>
    </form>
    <div class="form-control">
      <Button v-for="(button, id) in getForm.control" :key="id" :type="button.type" :icon="button.icon" :click="button.click">{{ button.text }}</Button>
    </div>
  </div>
</template>

<script>
import Button from '../Button.component.vue';

export default {
  props: ['name'],
  components: {
    Button,
  },
  data() {
    return {
      forms: {
        login: {
          title: 'Log In',
          action: '/users/authenticate',
          input: {
            username: { icon: 'icon-person', type: 'text', placeholder: 'username' },
            password: { icon: 'icon-key', type: 'password', placeholder: 'password' },
          },
          control: [
            { text: 'Log In', icon: 'menu', type: 'inversed dialog', click: this.login.bind(null) },
          ],
        },
        register: {
          title: 'Register',
          action: '/users/register',
          input: {
            username: { icon: 'icon-person', type: 'text', placeholder: 'username' },
            password: { icon: 'icon-key', type: 'password', placeholder: 'password' },
            confirmPassword: { icon: 'icon-key', type: 'password', placeholder: 'confirm password' },
            email: { icon: 'icon-email', type: 'text', placeholder: 'email' },
            confirmEmail: { icon: 'icon-email', type: 'text', placeholder: 'confirm email' },
          },
          control: [
            { text: 'Register', icon: 'menu', type: 'inversed dialog', click: this.register.bind(null) },
          ],
        },
      },
    };
  },
  computed: {
    getForm() {
      return this.forms[this.name];
    },
  },
  methods: {
    login() {
      document.alert('login');
    },
    register() {
      document.alert('login');
    },
    submit(ev) {
      if (ev.key === 'Enter') {
        console.log('submitting');
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors';
@import '@/scss/_mixins';

.auth-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 20px;
  width: 380px;
  min-height: 500px;
  background: linear-gradient(to bottom, rgba($color-beige, .2), transparent 100px),
              linear-gradient(to top, rgba($color-beige, .2), transparent 100px);
  .title {
    padding: 20px 0;
    color: $color-beige;
    font-size: 40px;
  }
  .auth-form {
    flex: 1;
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 8px;
    align-items: center;
    align-content: center;
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
  .form-control {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
