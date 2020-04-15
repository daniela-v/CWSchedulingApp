<template>
  <div class="sidebar-module-vue">
    <transition name="css-animation" appear>
      <div v-if="isVisible" class="sidebar" :class="[ isLogged ]">
        <template v-if="getUser">
          <div class="profile">
            <div class="avatar">
              <div class="image"></div>
            </div>
            <div class="data">
              <span class="username"># todo</span>
            </div>
          </div>
          <Button name="logout" type="menu">Switch account</Button>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
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
  },
};
</script>

<style lang="scss">
.sidebar-module-vue {
  grid-area: sidebar;
  position: relative;
  display: flex;
  .sidebar {
    display: flex;
    flex-direction: column;
    width: 350px;
    background-color: rgba($color-cyan-bg, .9);
    box-shadow: -4px -4px 20px rgba(#000, .5);
    transition: width .4s ease;
    * { transition: opacity .4s ease; }

    &.logged .profile {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto;
      padding: 20px;
      background-color: darken($color-cyan-border, 10%);
      border-bottom: 1px solid $color-cyan;
      color: $color-cyan-bg;
      text-shadow: none;
      .avatar {
        padding: 2px;
        border: 2px solid $color-cyan-bg;
        border-radius: 50%;
        .image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 1px solid $color-cyan-bg;
          background: url('../assets/images/bg-4.jpg') no-repeat center center / cover;
        }
      }
      .data {
        font-weight: 700;
      }
    }
  }
}

.sidebar.css-animation-leave-to {
  transition: width .4s;
  * { transition: opacity .4s ease; }
}
.sidebar.css-animation-enter, .sidebar.css-animation-leave-to {
  width: 0;
  * { opacity: 0; }
}
</style>
