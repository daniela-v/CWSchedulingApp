<template>
  <router-link :to="{ name: 'milestoneView', params: { ...$route.params, milestone: milestone.id }, query: $route.query }" class="milestone-component-vue">
    <div class="milestone-title">
      <div class="name">{{ milestone.title }}</div>
    </div>
    <div class="milestone-time">
      <div class="started" :class="[ getStartedStatus.status ]">
        <Icon :name="getStartedStatus.icon" class="status" />
        <span class="time">{{ getStartedDate || this.getCountdown(timers.startedDate) }}</span>
      </div>
      <div v-if="!timers.startedDate" class="deadline" :class="[ getDeadlineStatus.status ]">
        <Icon :name="getDeadlineStatus.icon" class="status" />
        <span class="time">{{ getCompletedDate || this.getCountdown(timers.expectedDate, true) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import util from '@/lib/general';

import Icon from '@/components/Icon.component.vue';

export default {
  components: { Icon },
  props: ['data'],
  data() {
    return {
      milestone: this.data,
      timers: {
        startedDate: null,
        expectedDate: null,
      },
    };
  },
  async created() {
    this.milestone.startedDate = util.datetime.fromUTC(this.milestone.startedDate);
    this.milestone.expectedDate = util.datetime.fromUTC(this.milestone.expectedDate);
    this.updateCountdown();
  },
  computed: {
    getDeadlineStatus() {
      if (this.milestone.completedDate) {
        if (this.milestone.completedDate > this.milestone.expectedDate) {
          return { icon: 'flag', status: 'late' };
        }
        return { icon: 'flag', status: 'completed' };
      }
      if (this.timers.expectedDate < 0) {
        return { icon: 'warning', status: 'late' };
      }
      if (this.timers.expectedDate < 86400) {
        return { icon: 'notice', status: 'soon' };
      }
      return { icon: 'access_time', status: 'on-time' };
    },
    getStartedStatus() {
      if (this.timers.startedDate > 86400) {
        return { icon: 'access_time', status: 'on-time' };
      }
      if (this.timers.startedDate > 0) {
        return { icon: 'notice', status: 'soon' };
      }
      return { icon: 'progress', status: 'on-time' };
    },
    getCompletedDate() {
      if (!this.milestone.completedDate) {
        return false;
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(this.milestone.completedDate);
      return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    getStartedDate() {
      if (Date.now() < this.milestone.startedDate) {
        return false;
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(this.milestone.startedDate);
      return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
  },
  methods: {
    updateCountdown() {
      setTimeout(this.updateCountdown, 1000);
      this.$set(this.timers, 'expectedDate', Math.floor((this.milestone.expectedDate - Date.now()) / 1000));
      if (this.milestone.startedDate >= Date.now()) {
        this.$set(this.timers, 'startedDate', Math.floor((this.milestone.startedDate - Date.now()) / 1000));
      }
    },
    getCountdown(diff) {
      const absoluteDiff = Math.abs(diff);
      const seconds = Math.floor(absoluteDiff % 60).toString();
      const minutes = Math.floor((absoluteDiff / 60) % 60).toString();
      const hours = Math.floor((absoluteDiff / 3600) % 24).toString();
      const days = Math.floor(absoluteDiff / 86400).toString();
      return `${days.padStart(2, '0')}:${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_mixins';

.milestone-component-vue {
  position: relative;
  display: grid;
  box-sizing: border-box;
  margin: 4px 0;
  padding: 10px;
  border: 1px solid;
  border-color: transparent;
  background-color: rgba(darken($color-cyan-bg, 4%), .8);
  overflow: hidden;
  @include transition('border-color, background-color', .2s, ease);

  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas: "title title"
                        "time time";
  grid-column-gap: 10px;
  height: 80px;
  .milestone-title { grid-area: title };
  .milestone-time { grid-area: time };
  &:hover {
    background-color: rgba($color-cyan-bg, .9);
    border-color: darken($color-cyan, 20%);
  }
  .soon { color: $color-mustard !important; }
  .late { color: $color-error-soft !important; }
}

.milestone-title {
  overflow: hidden;
  .name {
    display: flex;
    align-items: center;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.milestone-status {
  align-self: start;
  display: flex;
  align-items: center;
  > * { margin: 0 4px; }
}

.milestone-time {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  margin-top: 10px;
  > div {
    display: flex;
    align-items: center;
    font-weight: 600;
    .icon-wrapper { margin-right: 5px; }
    &.deadline { justify-self: right; }
    &.started { justify-self: left; }
  }
}
</style>
