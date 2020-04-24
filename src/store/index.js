import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined,
    sidebar: false,
    windows: [],
    notifications: [],
    tooltip: null,
  },
  mutations: {
    openWindow(state, { name, component, props, type, dismissable }) { // eslint-disable-line
      state.windows.splice(0, 1, {
        window: {
          name,
          component,
          props,
          type: type || 'default',
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
    authenticate(state, user) {
      Vue.set(state, 'user', user);
    },
    deauthenticate(state) {
      state.user = null;
    },
    pushNotification(state, { text, icon = 'check', type, timeout }) {
      const id = _.uniqueId('notification');
      state.notifications.push({ id, icon, text, type });
      setTimeout(this.commit, (timeout || 5) * 1000, 'hideNotification');
    },
    hideNotification(state) {
      state.notifications.shift();
    },
    setSidebarVisibility(state, visibility) {
      Vue.set(state, 'sidebar', visibility);
    },
  },
  getters: {
    getSidebarVisibility: (state) => state.sidebar,
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
    getUser(state) {
      return state.user;
    },
  },
  actions: {
    async deauthenticate(context) {
      await axios.get('/users/deauthenticate');
      context.commit('deauthenticate');
      context.commit('pushNotification', { icon: 'check', text: 'You have been logged out' });
    },
  },
  modules: {},
});
