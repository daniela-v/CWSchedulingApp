<template>
  <transition name="css-animation" appear>
    <div v-show="isVisible" class="sidebar-module-vue">
      <div class="sidebar" :class="[ isLogged ]">
        <template v-if="getUser">
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
          <SidebarPanel name="coursework" title="IN PROGRESS" :component="SidebarCoursework" :data="courseworkInProgress" :expanded="true" />
          <SidebarPanel name="coursework" title="COMPLETED" :component="SidebarCoursework" :data="courseworkCompleted" />
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';

import Auth from '../components/windows/Auth.window.vue';
import Button from '../components/Button.component.vue';
import SidebarPanel from '../components/sidebar/SidebarPanel.sidebar.vue';
import SidebarCoursework from '../components/sidebar/SidebarCoursework.sidebarpanel.vue';

export default {
  components: { Button, SidebarPanel },
  data() {
    return {
      SidebarCoursework,
      dummyCourseworks: [
        {
          id: 0,
          owner: {
            id: 5,
            username: 'cora913',
          },
          title: 'Web Development Project 2',
          module: 'Computing',
          expected_date: Date.now() + (43200 * 1000),
        },
        {
          id: 1,
          owner: {
            id: 5,
            username: 'cora913',
          },
          title: 'Integrated Project 3',
          module: 'Computing',
          expected_date: Date.now() - (86400 * 2 * 1000),
          deleted: Date.now() + (1800 * 1000),
        },
        {
          id: 2,
          owner: {
            id: 5,
            username: 'cora913',
          },
          title: 'Integrated Project 3',
          module: 'Computing',
          expected_date: Date.now() - (53000 * 3 * 1000),
          deleted: Date.now() + (30 * 1000),
        },
        {
          id: 3,
          owner: {
            id: 6,
            username: 'cora914',
          },
          title: 'Random Project',
          module: 'Physics',
          expected_date: Date.now() + (86400 * 2 * 1000),
          completed_date: Date.now() - (86400 * 10 * 1000),
        },
        {
          id: 4,
          owner: {
            id: 6,
            username: 'cora914',
          },
          title: 'Random Project',
          module: 'Physics',
          expected_date: Date.now() + (86400 * 2 * 1000),
          completed_date: Date.now() - (86400 * 1000),
        },
        {
          id: 5,
          owner: {
            id: 6,
            username: 'cora914',
          },
          title: 'Random Project',
          module: 'Physics',
          expected_date: Date.now() + (86400 * 2 * 1000),
        },
        {
          id: 6,
          owner: {
            id: 5,
            username: 'cora914',
          },
          title: 'Random Project',
          module: 'Physics',
          expected_date: Date.now() - (86400 * 2 * 1000),
          completed_date: Date.now() + (86400 * 1000),
        },
      ],
    };
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
    isLogged() {
      return (this.getUser) ? 'logged' : 'guest';
    },
    isVisible() {
      return this.$store.getters.getSidebarVisibility;
    },
    courseworkInProgress() {
      return _.chain(this.dummyCourseworks)
        .reject((c) => c.completed_date)
        .orderBy('expected_date', 'asc')
        .value();
    },
    courseworkCompleted() {
      return _.chain(this.dummyCourseworks)
        .filter((c) => c.completed_date)
        .orderBy('completed_date', 'desc')
        .value();
    },
  },
  methods: {
    switchAccount() {
      this.$store.commit('setSidebarVisibility', false);
      this.$store.dispatch('deauthenticate');
      this.$store.commit('openWindow', { name: 'Login', component: Auth, type: 'fullscreen' });
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

  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 350px;
    transition: opacity .4s ease .1s;

    .btn-switch-account {
      margin: 20px 0;
    }
    &.logged .profile {
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
