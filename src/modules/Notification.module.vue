<template>
  <transition-group tag="div" class="notification-module" name="notificationfx">
    <div v-for="(notification) in getNotifications" :key="notification.id" class="notification" :class="notification.type">
      <Icon :name="notification.icon"></Icon>
      <span class="message">{{ notification.text }}</span>
    </div>
  </transition-group>
</template>

<script>
// import _ from 'lodash';

import Icon from '../components/Icon.component.vue';

export default {
  components: {
    Icon,
  },
  computed: {
    getNotifications() {
      return this.$store.getters.getNotifications;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colors';
@import '@/scss/_mixins';

.notification-module {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  right: 0;
  bottom: 0;
  max-height: 222px;
  overflow: hidden;
  z-index: 100;
  .notification {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 32px;
    padding: 10px 20px;
    margin: 10px;
    border: 1px solid $color-purple;
    border-radius: 5px;
    background-color: rgba($color-purple, .4);
    color: lighten($color-purple, 20%);
    font-weight: 600;
    @include transition('height, opacity, transform', .4s, ease-in-out);
    &.alert {
      color: red;
      border-color: red;
      background-color: darken(red, 55%);
    }
    &.warning {
      color: yellow,;
      border-color: yellow,;
      background-color: darken(yellow, 40%);
    }
    i {
      margin-right: 10px;
    }
  }
}
.notificationfx-enter, .notificationfx-leave-active {
  height: 0 !important;
  opacity: 0;
  transform: scale(0.2);
}
</style>
