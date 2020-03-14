import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    overlay: {},
  },
  mutations: {
    async displayOverlay(state, payload) {
      state.overlay = {
        closeable: payload.closeable || true,
        component: () => import('../components/' + payload.component + '.overlay.vue'), // eslint-disable-line
      };
    },
    hideOverlay(state) {
      state.overlay = {};
    },
  },
  getters: {
    getOverlay(state) {
      return state.overlay;
    },
  },
  actions: {},
  modules: {},
});
