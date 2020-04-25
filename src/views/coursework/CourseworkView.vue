<template>
  <div class="coursework-id-route">
    <transition name="fade" appear>
      <div v-if="coursework" class="coursework-wrapper">
        <Coursework v-if="coursework" :data="coursework" :key="coursework.id"></Coursework>
        <div class="breakdown">
          <Tag>BREAKDOWN</Tag>
        </div>
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

import Tag from '@/components/Tag.component.vue';
import Coursework from '@/components/Coursework.component.vue';

export default {
  components: { Tag, Coursework },
  data() {
    return {
      coursework: null,
    };
  },
  async mounted() {
    const { coursework } = this.$route.params;
    await this.loadCoursework(coursework);
  },
  methods: {
    async loadCoursework(coursework) {
      const shared = this.$route.query.share;
      const response = await axios.get('/courseworks/get', { params: { coursework, shared } });
      this.$set(this, 'coursework', response.data.result[0]);
    },
  },
  watch: {
    '$route.params.coursework': async function courseworkChange(to) {
      if (to) {
        this.$set(this, 'coursework', null);
        await this.$nextTick();
        await this.loadCoursework(to);
      }
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.coursework-id-route {
  display: flex;
  flex-direction: column;
  margin: 15px;
  .tag-component-vue {
    align-self: flex-start;
    margin: 10px 0;
  }
  .breakdown {
    display: flex;
    flex-direction: column;
  }
  .coursework-wrapper {
    transition: opacity .2s ease;
  }
}
</style>
