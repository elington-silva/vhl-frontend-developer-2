import Vue from 'vue'
// styles 
import './scss/style.scss';
import App from './App.vue'

import VDragged from 'v-dragged'

Vue.use(VDragged);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
