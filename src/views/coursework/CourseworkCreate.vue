<template>
  <div class="coursework-route">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVisible: false,
    };
  },
  computed: {
    getSearchVisibility() {
      return (this.searchVisible) ? 'is-visible' : 'is-hidden';
    },
  },
  methods: {
    toggleSearch() {
      this.$set(this, 'searchVisible', !this.searchVisible);
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.coursework-route {
  display: flex;
  flex-direction: column;
}
</style>
