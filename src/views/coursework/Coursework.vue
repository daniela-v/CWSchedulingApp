<template>
  <div class="coursework-route">
    <div class="coursework-tabs">
      <template v-for="(tab, key) in tabs">
        <Button v-if="tab.condition()" :key="key" class="btn-tab" v-bind="tab" type="tab" :class="[ isTabActive(key), key ]" :active="isTabActive(key)" />
      </template>
    </div>
    <!-- In progress -->
    <transition name="fade" mode="out-in">
      <div v-if="isTabActive('progress')" :key="renderKey" class="panel coursework-progress">
        <div class="panel-title">
          <div class="title">
            <Tag>IN PROGRESS</Tag>
          </div>
          <div class="control">
            <Button v-bind="control.refreshSearch" />
          </div>
        </div>
        <div class="panel-content">
          <template v-if="courseworkInProgress.length > 0">
            <Coursework v-for="(coursework, id) in courseworkInProgress" :key="id" :data="coursework" />
          </template>
          <template v-else>
            <div class="not-found">
              <span class="message">You don't have any courseworks in progress</span>
              <Button name="start-a-new-course" type="dialog">Start a new coursework</Button>
            </div>
          </template>
        </div>
      </div>
      <!-- Completed -->
      <div v-else-if="isTabActive('completed')" :key="renderKey" class="panel coursework-completed">
        <div class="panel-title">
          <div class="title">
            <Tag>COMPLETED</Tag>
          </div>
          <div class="control">
            <Button v-bind="control.refreshSearch" />
          </div>
        </div>
        <div class="panel-content">
          <template v-if="courseworkCompleted.length > 0">
            <Coursework v-for="(coursework, id) in courseworkCompleted" :key="id" :data="coursework" />
          </template>
          <template v-else>
            <div class="not-found">
              <span class="message">You don't have any completed courseworks</span>
            </div>
          </template>
        </div>
      </div>
      <!-- Search -->
      <div v-else-if="isTabActive('search')" :key="renderKey" class="panel coursework-search">
        <div class="panel-title">
          <div class="title">
            <Tag>SEARCH RESULT</Tag>
            <Tag v-if="!searchTags">NO TAGS</Tag>
            <template v-else>
              <Tag v-for="(tag, k) in searchTags" :key="k">{{ k }}: {{ tag }}</Tag>
            </template>
          </div>
          <div class="control">
            <Button v-bind="control.clearSearch" />
            <Button v-bind="control.refreshSearch" />
          </div>
        </div>
        <div class="panel-content">
          <template v-if="getSearchResults.length > 0">
            <Coursework v-for="(coursework, id) in getSearchResults" :key="id" :data="coursework" />
          </template>
          <template v-else>
            <div class="not-found">
              <span class="message">No results found</span>
            </div>
          </template>
        </div>
      </div>
      <!-- Recent -->
      <div v-else :key="renderKey" class="panel coursework-recent">
        <div class="panel-title">
          <div class="title">
            <Tag>MOST RECENT</Tag>
          </div>
        </div>
        <div class="panel-content">
          <Coursework v-for="(coursework, id) in getRecentResults" :key="id" :data="coursework" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash';

import Coursework from '@/components/Coursework.component.vue';
import Button from '@/components/Button.component.vue';
import Tag from '@/components/Tag.component.vue';

export default {
  components: { Coursework, Button, Tag },
  data() {
    return {
      renderKey: 0,
      tabs: {
        progress: { href: { name: 'coursework', query: { tab: 'progress' } }, name: 'tab-in-progress', icon: 'access_time', text: 'In progress', condition: (() => this.getUser).bind() },
        completed: { href: { name: 'coursework', query: { tab: 'completed' } }, name: 'tab-completed', icon: 'check', text: 'Completed', condition: (() => this.getUser).bind() },
        search: { href: { name: 'coursework', query: { tab: 'search' } }, name: 'tab-search-result', icon: 'search', text: 'Search result', condition: (() => this.searchTags).bind() },
        recent: { href: { name: 'coursework', query: { tab: 'recent' } }, name: 'tab-recent', icon: 'menu', text: 'Most recent', condition: (() => this.getRecentResults.length > 0).bind() },
      },
      tab: 'recent',
      control: {
        refreshSearch: { name: 'refresh-search', type: 'dialog', icon: 'repeat', text: 'Refresh', click: this.refreshSearch },
        refreshCoursework: { name: 'refresh-coursework', type: 'dialog', icon: 'repeat', text: 'Refresh', click: this.refreshCoursework },
        clearSearch: { name: 'clear-search', type: 'dialog', icon: 'close', text: 'Clear', click: this.clearSearch },
      },
    };
  },
  async mounted() {
    await this.$store.dispatch('getAllCourseworks', { section: 'recent' });
    await this.$store.dispatch('getAllCourseworks', { section: 'my' });
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
    searchTags() {
      const search = this.$store.getters.getSearchFilter;
      const filters = _.reduce(search, (acc, val, k) => {
        if (val !== undefined) acc[k.toUpperCase()] = val;
        return acc;
      }, {});
      return _.isEmpty(filters) ? null : filters;
    },
    getSearchResults() {
      return this.$store.getters.getAllCourseworks('search');
    },
    getRecentResults() {
      return this.$store.getters.getAllCourseworks('recent');
    },
    getCourseworkStyle() {
      return (this.getSearchResults.length) ? 'compact' : null;
    },
    courseworkInProgress() {
      return _.chain(this.$store.getters.getAllCourseworks('my'))
        .reject((c) => c.completedDate)
        .orderBy('expectedDate', 'asc')
        .value();
    },
    courseworkCompleted() {
      return _.chain(this.$store.getters.getAllCourseworks('my'))
        .filter((c) => c.completedDate)
        .orderBy('completedDate', 'desc')
        .value();
    },
  },
  methods: {
    isTabActive(tab) {
      const query = this.$route.query.tab;
      return (query === tab) ? 'active' : null;
    },
    clearSearch() {
      this.$store.commit('clearAllCourseworks', 'search');
      this.$store.commit('updateSearchFilter', null);
      this.$router.push({ name: 'coursework', query: { tab: 'recent' } }, () => {});
    },
    async refreshSearch() {
      if (this.control.refreshSearch.pending) return;
      this.$set(this.control.refreshSearch, 'pending', true);
      await this.$store.dispatch('getAllCourseworks', { section: 'search', search: this.$store.getters.getSearchFilter });
      this.$set(this.control.refreshSearch, 'pending', false);
    },
    async refreshCoursework() {
      if (this.control.refreshCoursework.pending) return;
      this.$set(this.control.refreshCoursework, 'pending', true);
      await this.$store.dispatch('getAllCourseworks', { section: 'my' });
      this.$set(this.control.refreshCoursework, 'pending', false);
    },
  },
  watch: {
    '$route.query.tab': function tabChange() {
      this.renderKey += 1;
    },
    async getUser(to) {
      this.$store.commit('clearAllCourseworks', 'my');
      this.$store.commit('clearAllCourseworks', 'recent');
      if (to) {
        await this.$store.dispatch('getAllCourseworks', { section: 'my' });
        this.$router.push({ name: 'coursework', query: { tab: 'progress' } }, () => {});
      } else {
        this.$router.push({ name: 'coursework', query: { tab: 'recent' } }, () => {});
      }
      await this.$store.dispatch('getAllCourseworks', { section: 'recent' });
    },
  },
};
</script>

<style lang="scss">
@import '~@/scss/_mixins';

.coursework-route {
  display: flex;
  flex-direction: column;
  margin: 15px;
  .coursework-tabs {
    position: relative;
    display: flex;
    height: 32px;
    box-shadow: 0 1px 0 darken($color-cyan, 15%), 0 2px 0 rgba(#000, .8);
    .btn-tab {
      position: relative;
      border-radius: 10px 10px 0 0;
      pointer-events: auto;
      &.recent {
        position: absolute;
        right: 0;
      }
      &:not(:first-child).active:before {
        left: -50px;
        border-bottom-right-radius: 10px;
        box-shadow: 10px 0 0 0 darken($color-cyan, 10%), -1px 0 0 darken($color-cyan, 45%) inset;
      }
      &:not(:last-child).active:after {
        right: -50px;
        border-bottom-left-radius: 10px;
        box-shadow: -10px 0 0 0 darken($color-cyan, 10%), 1px 0 0 darken($color-cyan, 45%) inset;
      }
      &.active {
        z-index: 5;
        &:before, &:after {
          content: "";
          position: absolute;
          background-color: transparent;
          background-blend-mode: screen;
          bottom: 0;
          width: 50px;
          height: 10px;
          transition: box-shadow .2s ease;
        }
      }
    }
  }
  .panel {
    box-sizing: border-box;
    padding: 15px 0;
    transition: opacity .2s ease;
    .panel-content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      height: 739px;
      overflow: auto;

      .not-found {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        padding: 50px;
        background-color: rgba(darken($color-cyan-d2, 4%), .6);
        .message {
          font-size: 20px;
          font-weight: 600;
        }
        .button-vue {
          margin-top: 40px;
        }
      }
    }
    .panel-title {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 10px;
      .title {
        flex: 1;
        display: flex;
        align-items: center;
        font-weight: 600;
      }
      .control {
        display: flex;
        .button-vue {
          margin: 0 5px;
          .dialog-style {
            padding: 6px 12px;
          }
        }
      }
    }
    .coursework {
      background-color: rgba(darken($color-cyan-bg, 4%), .8);
      padding: 10px;
      margin: 4px 0;
    }
  }
}

</style>
