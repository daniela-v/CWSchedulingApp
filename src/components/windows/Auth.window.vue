<template>
  <div class="auth-window">
    <div class="title">{{ getForm.title }}</div>
    <form class="auth-form" @keypress="OnKeyPress">
      <div v-for="(input, id) in getForm.input" :key="id" class="input-wrapper" :class="[ getError(input) ]">
        <label :for="id" class="label icon" :class="[ input.icon ]"></label>
        <input :id="id" :type="input.type" :name="id" :placeholder="input.placeholder" v-model="input.model" />
        <Icon v-if="input.error" class="error" name="warning"></Icon>
      </div>
    </form>
    <div class="form-control">
      <Button v-for="(button, id) in getForm.control" :key="id" :type="button.type" :icon="button.icon" :click="button.click">{{ button.text }}</Button>
    </div>
  </div>
</template>

<script>
import Icon from '../Icon.component.vue';
import Button from '../Button.component.vue';

export default {
  props: ['name'],
  components: {
    Icon,
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
            { text: 'Log In', icon: 'darrow-right', type: 'inversed dialog', click: this.submit.bind(null) },
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
            { text: 'Register', icon: 'darrow-right', type: 'inversed dialog', click: this.submit.bind(null) },
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
    getError(field) {
      return (field.error) ? 'error' : null;
    },
    submit() {

    },
    OnKeyPress(ev) {
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
@import '@/scss/_animations';

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
    grid-row-gap: 10px;
    align-content: center;
    padding: 0 50px;
    .input-wrapper {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-areas: "label field error";
      font-size: 16px;
      .label, .error {
        display: flex;
        align-items: center;
        padding: 8px;
        font-size: 20px;
      }
      .label {
        border-right: 1px solid $color-beige;
        border-radius: 4px 0 0 4px;
        background-color: $color-beige;
        color: black;
        text-shadow: none;
      }
      .error {
        font-size: 20px;
        color: red;
        animation: .4s fxerror ease-in-out;
      }
      input {
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
        min-width: 50px;
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
