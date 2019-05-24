import Vue from 'vue'
import axios from 'axios'
import PortalVue from 'portal-vue';
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css'



import App from './App.vue'

Vue.use(SuiVue)
Vue.use(PortalVue);
// Vue.use(PortalVue, {
//   portalName: 'portal', // default: 'portal'
//   portalTargetName: 'portal-target', // default:'portal-target'
// })

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
