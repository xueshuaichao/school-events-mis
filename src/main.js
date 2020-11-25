import Vue from 'vue';
import './libs/iview';
import './directives';
import './plugin';

import ECharts from 'vue-echarts/components/ECharts.vue';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import './libs/polyfill/find';
import './libs/polyfill/file';
import './libs/polyfill/dataset';

import ossimg from 'wdc-vue-components/src/components/ossimg';

import Icon from './view/components/icon/index.vue';
import App from './app.vue';
import router from './router';
import store from './store';
import i18n from './locale';
import config from './config';

import './app.less';

Vue.config.productionTip = process.env.NODE_ENV === 'development';

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

Vue.component('chart', ECharts);
Vue.component('common-icon', Icon);
Vue.component('ossimg', ossimg);
new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#school-events-mis');
