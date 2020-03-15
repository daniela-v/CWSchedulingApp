import store from '../store/index';

const tooltipDirective = {
  bind(el, binding) {
    function show() {
      store.commit('showTooltip', { element: el, type: binding.value.type, text: binding.value.text });
    }
    function hide() {
      store.commit('hideTooltip');
    }
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
  },
};

export default tooltipDirective;
