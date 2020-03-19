<template>
  <div class="auth-window">
    <div class="title">{{ getForm.title }}</div>
    <form class="auth-form" @keypress="OnKeyPress">
      <div v-for="(input, id) in getForm.input" :key="id" class="input-wrapper" :class="[ hasFailed(input) ]">
        <label :for="id" class="label icon" :class="[ input.icon ]"></label>
        <input :id="id" :type="input.type" :name="id" :placeholder="input.placeholder" v-model="input.model" />
        <Icon v-if="input.error" class="error" name="warning" v-tooltip="{ type: 'alert', text: input.error }"></Icon>
      </div>
    </form>
    <div class="form-control">
      <Button v-for="(button, id) in getForm.control" :key="id" :type="button.type" :icon="button.icon" :click="button.click">{{ button.text }}</Button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

import Auth from './Auth.window.vue'; // eslint-disable-line
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
            { text: 'Log In', icon: 'next', type: 'dialog', click: this.submit.bind(null) },
          ],
          success: (user, data) => {
            this.$store.commit('pushNotification', { icon: 'check', text: `You have been logged in as "${data.username}"` });
            this.$store.commit('closeWindow');
            this.$store.commit('authenticate', data);
          },
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
            { text: 'Register', icon: 'next', type: 'dialog', click: this.submit.bind(null) },
          ],
          success: (user) => {
            this.$store.commit('pushNotification', { icon: 'check', text: `Your account "${user}" has been created` });
            this.$store.commit('openWindow', { name: 'Login', component: Auth });
          },
        },
      },
    };
  },
  computed: {
    /**
     * Returns the active form
     */
    getForm() {
      return this.forms[this.name];
    },
  },
  methods: {
    /**
     * Returns a styling class name if the field has failed the validation checks
     *
     * @param {String} field          Field name to check
     * @returns {String}  The styling class name
     */
    hasFailed(field) {
      return (field.error) ? 'failed' : null;
    },
    /**
     * Cleans the active form of errors
     */
    clean() {
      _.forEach(this.getForm.input, (field, key) => {
        this.$delete(this.getForm.input[key], 'error');
      });
    },
    /**
     * Submits the active form data to the server
     */
    async submit() {
      this.clean();
      // Reduce the input fields to { 'fieldName': 'fieldValue' } to prepare it
      const data = _.reduce(this.getForm.input, (acc, val, key) => {
        acc[key] = val.model;
        return acc;
      }, {});
      // Submit the form data
      const response = await axios.post(this.getForm.action, data);
      // Format the input errors if there are any
      if (response.data.error) {
        _.forEach(response.data.error, (error, field) => {
          this.$set(this.getForm.input[field], 'error', error[0]);
        });
      } else {
        this.getForm.success(data.username, response.data.result);
      }
    },
    /**
     * Checks if the pressed key when the user has any of the input fields focused
     */
    OnKeyPress(ev) {
      if (ev.key === 'Enter') {
        this.submit();
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
  padding: 40px 0;
  width: 300px;
  min-height: 400px;
  background: linear-gradient(to bottom, rgba($color-cyan, .1) -50px, transparent 100px),
              linear-gradient(to top, rgba($color-cyan, .1) -50px, transparent 100px);
  .title {
    color: $color-cyan;
    font-weight: 600;
    font-size: 28px;
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
        border-right: 1px solid $color-cyan;
        border-radius: 4px 0 0 4px;
        background-color: $color-cyan;
        color: black;
        text-shadow: none;
      }
      input {
        padding: 0 30px 0 20px;
        color: $color-cyan;
        border: 1px solid $color-cyan;
        border-left: none;
        border-radius: 0 4px 4px 0;
        @include transition('background-color', 200ms, ease);
        &:hover { background-color: rgba($color-cyan, .1); }
        &:focus {
          text-shadow: 0 0 2px $color-cyan;
          background-color: rgba($color-cyan, .2);
        }
        background: none;
        outline: none;
        min-width: 50px;
      }
      // If input field has failed the validation checks styling below applies
      &.failed {
        .label {
          border-color: $redish;
          background-color: $redish;
        }
        .error {
          font-size: 20px;
          color: $redish;
          animation: .4s fxerror ease-in-out;
        }
        input {
          color: $redish;
          border: 1px solid $redish;
          &:hover { background-color: rgba($redish, .1); }
          &:focus {
            text-shadow: 0 0 2px $redish;
            background-color: rgba($redish, .2);
          }
        }
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
