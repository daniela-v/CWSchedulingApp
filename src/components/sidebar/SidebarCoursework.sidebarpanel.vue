<template>
  <router-link :to="`/coursework/${coursework.id}`" v-if="isDeleted" class="coursework">
    <div class="coursework-title">
      <div class="name">{{ coursework.title }}</div>
      <div class="module">{{ coursework.module }}</div>
    </div>
    <div class="coursework-status">
      <Icon :name="getStatusIcon" class="status" :class="[ getStatusColor ]" v-tooltip="{ text: getStatus.text }" />
      <Icon v-if="coursework.owner.id === getUser.id" name="shield2" class="is-owner" v-tooltip="{ text: 'Owner' }" />
    </div>
    <div class="coursework-time">
      <div class="deadline" :class="[ getStatusColor ]">
        <Icon name="access_time" />
        <span class="time">{{ getCompletedDate || this.getCountdown(timers.expected_date, true) }}</span>
      </div>
      <div v-if="coursework.deleted" class="delete">
        <Icon name="trash" />
        <span class="time">{{ this.getCountdown(timers.deleted) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import Icon from '../Icon.component.vue';

export default {
  components: { Icon },
  props: ['data'],
  data() {
    return {
      coursework: this.data,
      timers: {
        expected_date: null,
        deleted: null,
      },
    };
  },
  created() {
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
      return (this.getStatus.status) ? this.getStatus.status : this.getStatus.text.toLowerCase().replace(/ /g, '-');
    },
    getStatus() {
      if (this.coursework.completed_date) {
        if (this.coursework.completed_date > this.coursework.expected_date) {
          return { icon: 'check', text: 'Completed late', status: 'late' };
        }
        return { icon: 'check', text: 'Completed on time', status: 'completed' };
      }
      if (this.timers.expected_date <= 0) {
        return { icon: 'warning', text: 'Late' };
      }
      if (this.timers.expected_date <= 86400) {
        return { icon: 'notice', text: 'Soon' };
      }
      return { icon: 'access_time', text: 'On time' };
    },
    isDeleted() {
      return !(this.timers.deleted && this.timers.deleted <= 0);
    },
    getCompletedDate() {
      if (!this.coursework.completed_date) {
        return false;
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(this.coursework.completed_date);
      return (this.coursework.completed_date) ? `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}` : false;
    },
  },
  methods: {
    updateCountdown() {
      setTimeout(this.updateCountdown, 1000);
      this.$set(this.timers, 'expected_date', Math.floor((this.data.expected_date - Date.now()) / 1000));
      if (this.coursework.deleted) {
        this.$set(this.timers, 'deleted', Math.floor((this.data.deleted - Date.now()) / 1000));
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
    .is-owner {
      position: relative;
      top: -1px;
      margin-left: 8px;
    }
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
