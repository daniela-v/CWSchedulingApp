import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    windows: [],
    notifications: [],
    tooltip: null,
  },
  mutations: {
    openWindow(state, { name, component, props, dismissable }) { // eslint-disable-line
      state.windows.splice(0, 1, {
        window: {
          name,
          component,
          props,
          dismissable: dismissable || true,
        },
      });
    },
    closeWindow(state, id) {
      state.windows.splice(id || 0, 1);
    },
    showTooltip(state, tooltip) {
      state.tooltip = tooltip;
    },
    hideTooltip(state) {
      state.tooltip = null;
    },
    pushNotification(state, { text, icon, type, timeout }) {
      const id = _.uniqueId('notification');
      state.notifications.push({ id, icon, text, type });
      setTimeout(this.commit, (timeout || 5) * 1000, 'hideNotification');
    },
    hideNotification(state) {
      state.notifications.shift();
    },
  },
  getters: {
    getWindows(state) {
      return state.windows;
    },
    getWindowsNum(state) {
      return state.windows.length;
    },
    getNotifications(state) {
      return state.notifications;
    },
    getTooltip(state) {
      return state.tooltip;
    },
  },
  actions: {},
  modules: {},
});
