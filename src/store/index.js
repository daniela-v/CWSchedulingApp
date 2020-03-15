import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    windows: [],
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
    closeWindow(state, { id }) {
      state.windows.splice(id, 1);
    },
  },
  getters: {
    getWindows(state) {
      return state.windows;
    },
    getWindowsNum(state) {
      return state.windows.length;
    },
  },
  actions: {},
  modules: {},
});
