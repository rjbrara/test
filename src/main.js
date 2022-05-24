import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'
import router from './router'
import JsonExcel from "vue-json-excel"

Vue.use(VueCompositionAPI)
Vue.component("downloadExcel", JsonExcel);
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
