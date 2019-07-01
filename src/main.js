import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VCalendar from 'v-calendar';

Vue.use(Buefy)
Vue.use(VCalendar, {
  locales: {
    'custom': {
      firstDayOfWeek: 1,
      masks: {
        L: 'YYYY/MM/DD',
      }
    }
  }
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
