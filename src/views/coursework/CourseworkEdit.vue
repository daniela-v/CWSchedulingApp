<template>
  <div class="subpanel coursework-view coursework-edit">
    <div class="title">
      <span>Edit Coursework</span>
      <Button v-bind="buttons.return" type="dialog" />
    </div>
    <div class="body"></div>
  </div>
</template>

<script>
import Button from '@/components/Button.component.vue';

export default {
  components: { Button },
  data() {
    return {
      buttons: {
        return: { name: 'return-to-coursework', icon: 'previous', text: 'Return', href: { name: 'courseworkView', params: this.$route.params, query: this.$route.query } },
      },
    };
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.coursework-edit {
  .title {
    position: relative;
    padding-bottom: 10px;
    border-bottom: 1px solid $color-cyan;
    text-align: center;
    > span {
      font-size: 30px;
      font-weight: 600;
    }
    .button-vue {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .body {
    flex: 1;
    display: flex;
  }
}
</style>
