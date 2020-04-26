<template>
  <div class="coursework-id-route">
    <transition name="fade" appear>
      <div v-if="coursework" class="coursework-wrapper">
        <template v-if="$route.name === 'courseworkView'">
          <div class="coursework-tabs">
            <Button v-for="(tab, key) in tabs" :key="key" class="btn-tab" v-bind="tab" type="tab" :class="[ isTabActive(key), key ]" :active="isTabActive(key)" />
          </div>
          <div class="coursework-content">
            <transition name="fade" mode="out-in" appear>
              <div v-if="isTabActive('overview') && getUser" class="panel coursework-overview">
                <div class="subpanel subpanel-information">
                  <header class="subpanel-header">
                    <div class="title">{{ coursework.title }}</div>
                    <div class="module">{{ coursework.module }}</div>
                    <div class="owner"><Icon name="crown" />{{ coursework.ownerName }}</div>
                  </header>
                  <section class="subpanel-body">
                    <div class="group">
                      <VLine icon="person" label="PARTICIPANTS">
                        <Icon v-for="i in coursework.participantsNumber" :key="i" name="person" />
                      </VLine>
                      <VLine icon="progress" label="MILESTONES">
                        <div v-if="getMilestonesTotal" class="milestones-completed">{{ getMilestonesComplete }}</div>
                        <div v-if="getMilestonesTotal" class="milestones-separator">/</div>
                        <div class="milestones-total">{{ getMilestonesTotal || 'No milestones' }}</div>
                        <div v-if="getMilestonesTotal" class="milestones-ratio">({{ getMilestonesRatio }}%)</div>
                      </VLine>
                    </div>
                    <div class="group">
                      <VLine icon="access_time" label="CREATED ON">{{ getFullDate(coursework.createdAt) }}</VLine>
                      <VLine icon="access_time" label="UPDATED ON">{{ getFullDate(coursework.updatedAt) }}</VLine>
                      <VLine icon="access_time" label="DEADLINE">{{ getFullDate(coursework.expectedDate) }}</VLine>
                      <VLine v-if="coursework.completedDate" icon="access_time" label="COMPLETED">{{ getFullDate(coursework.completedDate) }}</VLine>
                    </div>
                  </section>
                  <section class="subpanel-footer">
                    <Button v-bind="control.addParticipant" icon="close" type="google dialog">Mark as incomplete</Button>
                    <div class="group">
                      <Button v-bind="control.addParticipant" type="dialog">Edit Coursework</Button>
                      <Button v-bind="control.addParticipant" icon="trash" type="google dialog">Delete Coursework</Button>
                    </div>
                  </section>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <!-- <div class="coursework-breakdown">
          <div class="coursework-status">

          </div>
          <div class="coursework-header">
            <VLine :label="coursework.title" class="coursework-title">{{ coursework.module }}</VLine>
          </div>
          <div class="coursework-data">
            <div class="group-by-2">
              <div class="panel coursework-information">
                <Tag>INFORMATION</Tag>
                <div class="panel-content">
                  <VLine label="OWNER">{{ coursework.ownerName }}</VLine>
                  <div class="group">
                    <VLine label="PARTICIPANTS">
                      <Icon v-for="i in coursework.participantsNumber" :key="i" name="person" />
                    </VLine>
                    <VLine label="MILESTONES">
                      <div v-if="getMilestonesTotal" class="milestones-completed">{{ getMilestonesComplete }}</div>
                      <div v-if="getMilestonesTotal" class="milestones-separator">/</div>
                      <div class="milestones-total">{{ getMilestonesTotal || 'No milestones' }}</div>
                      <div v-if="getMilestonesTotal" class="milestones-ratio">({{ getMilestonesRatio }}%)</div>
                    </VLine>
                  </div>
                  <div class="group">
                    <VLine label="CREATED ON">{{ getFullDate(coursework.createdAt) }}</VLine>
                    <VLine label="UPDATED ON">{{ getFullDate(coursework.updatedAt) }}</VLine>
                    <VLine label="DEADLINE">{{ getFullDate(coursework.expectedDate) }}</VLine>
                    <VLine v-if="coursework.completedDate" label="COMPLETED">{{ getFullDate(coursework.completedDate) }}</VLine>
                  </div>
                </div>
                <Button v-bind="control.editCoursework" type="dialog" />
              </div>
              <div class="panel coursework-milestones">
                <Tag>MILESTONES</Tag>
                <div class="panel-content">
                  <div class="pie-progress">
                    <svg width="100%" height="100%" viewBox="0 0 42 42" class="donut">
                      <circle class="background" cx="21" cy="21" r="15.91549430918954"></circle>
                      <circle class="rail" cx="21" cy="21" r="15.91549430918954" stroke-width="4"></circle>
                      <circle class="segment complete" cx="21" cy="21" r="15.91549430918954" :stroke-dasharray="getCompleteOffset.dashArray" :stroke-dashoffset="getCompleteOffset.dashOffset"></circle>
                    </svg>
                    <span class="percentage">{{ getMilestonesRatio }}%</span>
                  </div>
                  <div class="group">
                    <VLine label="ON TIME" class="on-time">{{ getOnTimeMilestones }}</VLine>
                    <VLine label="CLOSE CALL" class="close-call">{{ getCloseCallMilestones }}</VLine>
                    <VLine label="MISSED" class="missed">{{ getMissedMilestones }}</VLine>
                  </div>
                </div>
                <Button v-bind="control.viewMilestones" type="dialog" />
              </div>
            </div>
            <div class="group-by-2">
              <div class="panel coursework-participants">
                <Tag>PARTICIPANTS</Tag>
                <div class="panel-content">
                  <div class="group">
                    <VLine v-for="(team, name) in getGroupedParticipants" :key="name" :label="name" class="team">
                      <Tag v-for="(member, i) in team" :key="i" class="member" :click="editParticipant.bind(null, i)" :remove="removeParticipant.bind(null, i)">{{ member.username }}</Tag>
                    </VLine>
                  </div>
                </div>
                <Button v-bind="control.addParticipant" type="dialog" />
              </div>
              <div class="panel coursework-extra">
                <Tag>CONTROL</Tag>
                <div class="panel-content">
                  <template v-if="coursework.shared">
                    <VLine label="TOKEN">
                      <Tag>Click to grab the token</Tag>
                    </VLine>
                    <VLine label="GENERATED ON">
                      {{ getFullDate(coursework.shared) }}
                    </VLine>
                  </template>
                  <Tag v-else type="alert">DISABLED</Tag>
                  <div class="group">
                    <Button v-bind="control.addParticipant" type="google dialog">Delete Coursework</Button>
                    <Button v-bind="control.addParticipant" type="dialog">Finish Coursework</Button>
                  </div>
                </div>
                <div class="share-control">
                  <template v-if="coursework.shared">
                    <Button v-bind="control.addParticipant" type="dialog">New token</Button>
                    <Button v-bind="control.addParticipant" type="google dialog">Disable sharing</Button>
                  </template>
                  <Button v-else v-bind="control.addParticipant" type="dialog">Enable sharing</Button>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <router-view v-else />
      </div>
      <div v-else class="loading-wrapper">
        <Loading v-bind="loading" />
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import _ from 'lodash';

import util from '@/lib/general';

import Loading from '@/components/Loading.component.vue';
import Button from '@/components/Button.component.vue';
import Tag from '@/components/Tag.component.vue';
import VLine from '@/components/VLine.component.vue';
import Icon from '@/components/Icon.component.vue';

export default {
  components: { Loading, Button, Tag, VLine, Icon },
  data() {
    return {
      tabs: {
        overview: { icon: 'clipboard', text: 'Overview' },
        milestones: { icon: 'module', text: 'Milestones' },
      },
      control: {
        editCoursework: { name: 'edit-coursework', text: 'Edit Coursework', href: { name: 'courseworkEdit', params: { coursework: this.$route.params.coursework } }, condition: (() => this.getUser.id === this.coursework.owner) },
        viewMilestones: { name: 'view-milestones', text: 'View Milestones', href: { name: 'milestoneView', params: { coursework: this.$route.params.coursework } } },
        addParticipant: { name: 'add-participant', text: 'Add Participant', click: this.addParticipant.bind(), condition: (() => this.getUser.id === this.coursework.owner) },
      },
      loading: { status: 'init' },
      coursework: null,
    };
  },
  async mounted() {
    this.createTabs();
    if (this.getUser !== undefined) {
      const { coursework } = this.$route.params;
      await this.loadCoursework(coursework);
    }
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
    getMilestonesTotal() {
      return (this.coursework.milestoneIncomplete || 0) + this.getMilestonesComplete;
    },
    getMilestonesComplete() {
      return (this.coursework.milestoneComplete || 0);
    },
    getMilestonesRatio() {
      const division = (this.getMilestonesTotal) ? this.getMilestonesComplete / this.getMilestonesTotal : 0;
      const r = Math.floor(division * 100);
      return r;
    },
    getCompleteOffset() {
      const r = this.getMilestonesRatio;
      return {
        dashArray: `${r} ${100 - r}`,
        dashOffset: 25,
      };
    },
    getMissedMilestones() {
      const sum = _.chain(this.coursework.milestones)
        .filter((c) => c.completedDate && c.completedDate > c.expectedDate)
        .sum()
        .value();
      return sum;
    },
    getCloseCallMilestones() {
      const sum = _.chain(this.coursework.milestones)
        .filter((c) => c.completedDate && c.completedDate < c.expectedDate && c.completedDate > c.expectedDate - (86400 * 1000))
        .sum()
        .value();
      return sum;
    },
    getOnTimeMilestones() {
      const sum = _.chain(this.coursework.milestones)
        .filter((c) => c.completedDate && c.completedDate < c.expectedDate - (86400 * 1000))
        .sum()
        .value();
      return sum;
    },
    getGroupedParticipants() {
      const group = _.reduce(this.coursework.participants, (acc, val) => {
        acc[val.team] = acc[val.team] || [];
        acc[val.team].push({
          id: val.id,
          username: val.username,
        });
        return acc;
      }, {});
      return group;
    },
  },
  methods: {
    async loadCoursework(coursework) {
      this.$set(this, 'coursework', null);
      this.loading = { status: 'pending', message: 'Loading coursework' };
      const shared = this.$route.query.share;
      const response = await this.$store.dispatch('get', { url: '/coursework/get', params: { coursework, shared } });
      if (response.error) {
        this.loading = { status: 'failed', message: response.error._system || response.error._notification };
      } else {
        const courseworkResponse = response.result[0];
        courseworkResponse.deleted = util.datetime.fromUTC(courseworkResponse.deleted);
        courseworkResponse.expectedDate = util.datetime.fromUTC(courseworkResponse.expectedDate);
        courseworkResponse.completedDate = util.datetime.fromUTC(courseworkResponse.completedDate);
        courseworkResponse.shared = util.datetime.fromUTC(courseworkResponse.shared);
        courseworkResponse.createdAt = util.datetime.fromUTC(courseworkResponse.createdAt);
        courseworkResponse.updatedAt = util.datetime.fromUTC(courseworkResponse.updatedAt);
        this.$set(this, 'coursework', courseworkResponse);
      }
    },
    createTabs() {
      const tabs = Object.keys(this.tabs);
      _.forEach(tabs, (key) => {
        const tab = {
          href: {
            path: this.$route.path,
            params: { ...this.$route.params },
            query: { ...this.$route.query, tab: key },
          },
          name: `tab-${key}`,
        };
        this.$set(this.tabs, key, { ...this.tabs[key], ...tab });
      });
    },
    isTabActive(tab) {
      const query = this.$route.query.tab || 'overview';
      return (query === tab) ? 'active' : null;
    },
    getFullDate(timestamp) {
      if (!timestamp) return null;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(timestamp);
      return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    addParticipant() {
      alert('adding participant');
    },
    editParticipant(id) {
      alert(`editing participant ${this.coursework.participants[id].username}`);
    },
    removeParticipant(id) {
      alert(`removing participant ${this.coursework.participants[id].username}`);
    },
  },
  watch: {
    '$route.params.coursework': async function courseworkChange(to, from) {
      // eslint-disable-next-line eqeqeq
      if (to != from) {
        this.$set(this, 'coursework', null);
        await this.$nextTick();
        await this.loadCoursework(to);
      }
    },
    async getUser() {
      const { coursework } = this.$route.params;
      await this.loadCoursework(coursework);
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
  overflow: auto;
  .coursework-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    transition: opacity .2s ease;
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
    .coursework-content {
      flex: 1;
      display: flex;
      background-color: rgba(darken($color-cyan-d2, 4%), .6);
      .panel {
        flex: 1;
        display: flex;
        flex-flow: row wrap;
        box-sizing: border-box;
        padding: 20px;
        transition: opacity .2s ease;
        .subpanel {
          flex: 1;
          display: flex;
          flex-direction: column;
          .group {
            align-self: stretch;
            display: flex;
            flex-direction: column;
          }
          .subpanel-header {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .subpanel-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            .group { align-items: center; }
          }
          .subpanel-footer {
            align-self: center;
            display: flex;
            flex-direction: column;
            width: 180px;
            .button-vue { margin: 4px 0; }
            .group { margin: 8px 0; }
          }
          &.subpanel-information {
            flex: 0 0 300px;
            margin: 10px 0;
            padding: 10px 0;
            padding-right: 20px;
            border-right: 1px solid $color-cyan;
            .subpanel-header {
              .title, .module { font-size: 20px; }
              .title { font-weight: 700; }
              .module {
                font-weight: 600;
                color: darken($color-cyan, 20%);
              }
              .owner {
                display: flex;
                align-items: center;
                padding: 4px 8px;
                margin: 10px 0;
                border: 1px solid $color-cyan;
                border-radius: 4px;
                background-color: $color-cyan-bg;
                font-weight: 600;
                .icon-wrapper { margin-right: 5px }
              }
            }
            .subpanel-body {
              align-items: center;
              justify-content: space-around;
            }
          }
        }
      }
    }
    // .coursework-breakdown {
    //   flex: 1;
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   .h-separator {
    //     align-self: stretch;
    //     margin: 5px 0;
    //     border-bottom: 2px solid $color-cyan;
    //     box-shadow: 0 2px 0 rgba($color-cyan-d2, .8);
    //   }
    //   .coursework-title {
    //     font-size: 40px;
    //     font-weight: 600;
    //     .value { color: darken($color-cyan, 15%); }
    //   }
    //   .coursework-data {
    //     flex: 1;
    //     align-self: stretch;
    //     display: flex;
    //     flex-flow: row wrap;
    //     margin: 20px 0;
    //     .group-by-2 {
    //       margin: 10px;
    //       flex: 1;
    //       display: grid;
    //       grid-template-columns: repeat(auto-fit, 350px);
    //       grid-auto-rows: minmax(600px, 1fr);
    //       grid-gap: 20px;
    //       justify-content: space-around;
    //     }
    //     .panel {
    //       align-self: stretch;
    //       display: flex;
    //       flex-direction: column;
    //       align-items: center;
    //       border-radius: 5px;
    //       &:not(.multiple) {
    //         background-color: rgba(darken($color-cyan-bg, 4%), .8);
    //         padding: 20px 10px;
    //       }
    //       &.multiple .panel {
    //         flex: 1;
    //         margin: 10px 0;
    //         &:first-child { margin-top: 0; }
    //         &:last-child { margin-bottom: 0; }
    //       }
    //       .panel-content {
    //         align-self: stretch;
    //         flex: 1;
    //         margin: 20px 0;
    //         display: flex;
    //         flex-direction: column;
    //         align-items: center;
    //         justify-content: space-around;

    //         .group {
    //           align-self: stretch;
    //           display: flex;
    //           flex-direction: column;
    //           align-items: center;
    //         }
    //       }

    //       &.coursework-participants .panel-content {
    //         justify-content: flex-start;
    //         .group {
    //           align-items: stretch;
    //           .team {
    //             align-items: flex-start;
    //             .label { padding: 0 2px; }
    //             .value {
    //               display: flex;
    //               flex-direction: column;
    //               padding: 0 2px;
    //               .member .tag {
    //                 margin: 2px 0;
    //               }
    //             }
    //           }
    //         }
    //       }

    //       &.coursework-share {
    //         .share-token {
    //           max-width: 200px;
    //           padding: 8px;
    //           border-radius: 5px;
    //           background-color: rgba(#000, .3);
    //           white-space: nowrap;
    //           overflow: hidden;
    //           text-overflow: ellipsis;
    //         }
    //         .share-control {
    //           display: flex;
    //           .button-vue {
    //             margin: 0 4px;
    //           }
    //         }
    //       }

    //       &.coursework-control {
    //         .button-vue {
    //           margin: 4px 0;
    //         }
    //       }

    //       &.coursework-milestones {
    //         .pie-progress {
    //           position: relative;
    //           .percentage {
    //             font-size: 32px;
    //             font-weight: 700;
    //             position: absolute;
    //             left: 50%;
    //             top: 50%;
    //             transform: translate(-50%, -50%);
    //           }
    //         }
    //       }
    //       svg.donut {
    //         .background { fill: transparent; }
    //         .rail, .segment {
    //           stroke-width: 3px;
    //         }
    //         .rail {
    //           fill: transparent;
    //           stroke: darken($color-cyan, 20%);
    //         }
    //         .segment {
    //           fill: transparent;
    //           &.complete { stroke: $color-cyan; }
    //         }
    //       }
    //     }
    //   }
    // }
  }
  .loading-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background-color: rgba(darken($color-cyan-d2, 4%), .6);
  }
}
</style>
