/*
 * @des 账户管理
 * */

import Main from '../view/main/main.vue';

export default {
    path: '/',
    meta: {
        show: false,
        i18n: 'account.home',
        icon: 'icon3',
    },
    component: Main,
    children: [
        {
            path: '/account/change',
            name: 'accountManage',
            meta: {
                show: true,
                i18n: 'account.change',
            },
            component: () => import('../view/account/password/index.vue'),
        },
    ],
};
