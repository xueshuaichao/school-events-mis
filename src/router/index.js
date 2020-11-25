import Vue from 'vue';
import iView from 'view-design';
import Router from 'vue-router';

import routes from './routers';
import store from '../store';
import { hasPermission } from '../libs/utils';
import CONFIG from '../config/index';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();

    // 数据统计
    // eslint-disable-next-line no-restricted-globals
    if (to.path && location.host === 'admin.qsnatz.com') {
        window._hmt.push(['_trackPageview', to.fullPath]);
    }
    store
        .dispatch('getUserInfo')
        .then(({ permission: permissionList }) => {
            const {
                meta: { permission: permissionCode },
            } = to;
            if (hasPermission(permissionList, permissionCode)) {
                next();
            } else {
                next({ name: 'error401' });
            }
        })
        .catch((data) => {
            if (
                CONFIG.STATUS_CODE.NO_LOGIN === data.status
                && CONFIG.LOGIN_PAGE.indexOf(to.name) === -1
            ) {
                next({ name: 'passportLogin' });
            } else {
                next();
            }
        });
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;
