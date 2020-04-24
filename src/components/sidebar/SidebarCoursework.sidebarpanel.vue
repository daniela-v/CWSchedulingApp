<template>
  <router-link :to="{ name: 'coursework', params: { coursework: coursework.id } }" v-if="isDeleted" class="coursework">
    <div class="coursework-title">
      <div class="name">{{ coursework.title }}</div>
      <div class="module">{{ coursework.module }}</div>
    </div>
    <div class="coursework-status">
      <Icon v-if="coursework.privacy" name="eye-blocked" class="is-private" v-tooltip="{ text: 'Private' }"/>
      <Icon v-if="coursework.shared" name="share" class="is-shared" v-tooltip="{ text: 'Share' }" @click.native.prevent="getSharedLink"/>
      <Icon v-if="coursework.owner === getUser.id" name="person" class="is-owner" />
    </div>
    <div class="coursework-time">
      <div class="deadline" :class="[ getStatusColor ]">
        <Icon :name="getStatusIcon" class="status" />
        <span class="time">{{ getCompletedDate || this.getCountdown(timers.expectedDate, true) }}</span>
      </div>
      <div v-if="coursework.deleted" class="delete">
        <Icon name="trash" />
        <span class="time">{{ this.getCountdown(timers.deleted) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import util from '@/lib/general';

import Icon from '../Icon.component.vue';

export default {
  components: { Icon },
  props: ['data'],
  data() {
    return {
      coursework: this.data,
      timers: {
        expectedDate: null,
        deleted: null,
      },
    };
  },
  async created() {
    this.coursework.deleted = util.datetime.fromUTC(this.coursework.deleted);
    this.coursework.expectedDate = util.datetime.fromUTC(this.coursework.expectedDate);
    this.coursework.completedDate = util.datetime.fromUTC(this.coursework.completedDate);
    this.coursework.shared = util.datetime.fromUTC(this.coursework.shared);
    this.updateCountdown();
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
    getStatusIcon() {
      return this.getStatus.icon;
    },
    getStatusColor() {
      return this.getStatus.status;
    },
    getStatus() {
      if (this.coursework.completedDate) {
        if (this.coursework.completedDate > this.coursework.expectedDate) {
          return { icon: 'check', status: 'late' };
        }
        return { icon: 'check', status: 'completed' };
      }
      if (this.timers.expectedDate < 0) {
        return { icon: 'warning', status: 'late' };
      }
      if (this.timers.expectedDate < 86400) {
        return { icon: 'notice', status: 'soon' };
      }
      return { icon: 'access_time', status: 'on-time' };
    },
    isDeleted() {
      return !(this.timers.deleted && this.timers.deleted <= 0);
    },
    getCompletedDate() {
      if (!this.coursework.completedDate) {
        return false;
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(this.coursework.completedDate);
      return (this.coursework.completedDate) ? `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}` : false;
    },
  },
  methods: {
    updateCountdown() {
      setTimeout(this.updateCountdown, 1000);
      this.$set(this.timers, 'expectedDate', Math.floor((this.coursework.expectedDate - Date.now()) / 1000));
      if (this.coursework.deleted) {
        this.$set(this.timers, 'deleted', Math.floor((this.coursework.deleted - Date.now()) / 1000));
      }
    },
    getCountdown(diff, full) {
      const absoluteDiff = Math.abs(diff);
      const seconds = Math.floor(absoluteDiff % 60).toString();
      const minutes = Math.floor((absoluteDiff / 60) % 60).toString();
      let str = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
      if (full) {
        const hours = Math.floor((absoluteDiff / 3600) % 24).toString();
        const days = Math.floor(absoluteDiff / 86400).toString();
        str = `${days.padStart(2, '0')}:${hours.padStart(2, '0')}:${str}`;
      }
      return str;
    },
    async getSharedLink(ev) {
      ev.stopImmediatePropagation();
      const path = this.$router.resolve({ name: 'coursework', params: { coursework: this.coursework.id } }).href;
      await navigator.clipboard.writeText(`${window.location.origin}${path}?share=${this.coursework.sharedToken}`);
      this.$store.commit('pushNotification', { icon: 'share', text: 'The share link has been copied to your clipboard' });
    },
  },
};
</script>

<style lang="scss">
.sidepanel-component-vue#sidepanel-coursework {
  .sidepanel-content {
    max-height: 340px;
    overflow: auto;
  }
  .coursework {
    position: relative;
    display: grid;
    box-sizing: border-box;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    grid-template-areas: "title status"
                          "time time";
    height: 80px;
    grid-column-gap: 10px;
    padding: 10px;
    background-color: rgba(#000, .2);
    margin: 4px 0;
    overflow: hidden;

    &:hover {
      background-color: rgba($color-cyan, .1);
    }

    .soon { color: $color-mustard; }
    .late { color: $color-error-soft; }
  }

  .coursework-title {
    grid-area: title;
    overflow: hidden;
    .module, .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name { font-weight: 600; }
  }

  .coursework-status {
    grid-area: status;
    align-self: start;
    display: flex;
    font-size: 18px;
    align-items: center;
    > * { margin: 0 4px; }
  }

  .coursework-time {
    grid-area: time;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    margin-top: 10px;
    > div {
      display: flex;
      align-items: center;
      font-weight: 600;
      .icon-wrapper { margin-right: 5px; }
      &.deadline { justify-self: left; }
      &.delete {
        color: $color-error-soft;
        justify-self: right;
      }
    }
  }
}
</style>
