<template>
  <transition name="css-animation" appear>
    <div v-show="isVisible" class="sidebar-module-vue">
      <div v-if="getUser" class="sidebar">
        <div class="profile">
          <div class="avatar">
            <div class="image"></div>
          </div>
          <div class="data">
            <span class="username">{{ getUser.username }}</span>
            <span class="email">{{ getUser.email }}</span>
          </div>
        </div>
        <Button name="switch-account" icon="repeat" type="dialog" :click="switchAccount">Switch account</Button>
        <template v-if="isLoading">
          <div class="sidebar-loading">
            <div id="loading-nest"></div>
            <span class="loading-text">Loading</span>
          </div>
        </template>
        <template v-else>
          <template v-if="courseworks.length">
            <SidebarPanel name="coursework" title="IN PROGRESS" :component="SidebarCoursework" :data="courseworkInProgress" :expanded="true" />
            <SidebarPanel name="coursework" title="COMPLETED" :component="SidebarCoursework" :data="courseworkCompleted" />
          </template>
          <div v-else>
            No courseworks
            <Button name="create-coursework" icon="repeat" type="dialog" :click="switchAccount">Create a coursework</Button>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

import Auth from '../components/windows/Auth.window.vue';
import Button from '../components/Button.component.vue';
import SidebarPanel from '../components/sidebar/SidebarPanel.sidebar.vue';
import SidebarCoursework from '../components/sidebar/SidebarCoursework.sidebarpanel.vue';

export default {
  components: { Button, SidebarPanel },
  data() {
    return {
      SidebarCoursework,
      courseworks: [],
      isLoading: false,
    };
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
    isVisible() {
      return this.$store.getters.getSidebarVisibility;
    },
    courseworkInProgress() {
      return _.chain(this.courseworks)
        .reject((c) => c.completedDate)
        .orderBy('expectedDate', 'asc')
        .value();
    },
    courseworkCompleted() {
      return _.chain(this.courseworks)
        .filter((c) => c.completedDate)
        .orderBy('completedDate', 'desc')
        .value();
    },
  },
  methods: {
    switchAccount() {
      this.$store.commit('setSidebarVisibility', false);
      this.$store.dispatch('deauthenticate');
      this.$store.commit('openWindow', { name: 'Login', component: Auth, type: 'fullscreen' });
    },
    async loadCourseworks() {
      this.isLoading = true;
      setTimeout(async () => {
        const courseworks = await axios.get('/courseworks/list', { params: { brief: true } });
        this.courseworks = courseworks.data.result;
        this.isLoading = false;
      }, 1000);
    },
  },
  watch: {
    async isVisible(to) {
      if (!to || this.isLoading) return;
      await this.loadCourseworks();
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.sidebar-module-vue {
  grid-area: sidebar;
  position: relative;
  display: flex;
  width: 350px;
  background-color: rgba($color-cyan-bg, .9);
  box-shadow: -4px -4px 20px rgba(#000, .5);
  @include transition('width, opacity', .4s);

  .sidebar-loading {
    align-self: flex-start;
    min-width: 350px;
    display: grid;
    grid-row-gap: 10px;
    align-content: center;
    justify-content: center;
    margin: 40px 0;
    .loading-text {
      animation: fadeInOut 2s ease infinite;
    }
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 350px;
    transition: opacity .4s ease .1s;

    .profile {
      align-self: stretch;
      display: grid;
      grid-auto-flow: row;
      grid-row-gap: 10px;
      align-items: center;
      justify-items: center;
      padding: 20px;
      background: linear-gradient(to bottom, darken($color-cyan, 10%), darken($color-cyan, 20%));
      border-bottom: 1px solid $color-cyan;
      color: $color-cyan-bg;

      .avatar {
        width: 96px;
        height: 96px;
        padding: 2px;
        border: 2px solid $color-cyan-bg;
        border-radius: 50%;
        background: url('../assets/images/bg-4.jpg') no-repeat center center / cover;
      }

      .data {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: lighten($color-cyan, 30%);
      }
    }
    .btn-switch-account {
      margin: 20px 0;
    }
  }
}

.sidebar-module-vue.css-animation-leave-to {
  @include transition('width, opacity', .4s, 'ease', .1s);
  .sidebar { transition: opacity .4s ease; }
}
.sidebar-module-vue.css-animation-enter, .sidebar-module-vue.css-animation-leave-to {
  width: 0;
  opacity: 0;
  .sidebar { opacity: 0; }
}
</style>
