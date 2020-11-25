/**
 * @des 首页
 */

import Main from '../view/main/main.vue';

export default {
    path: '/',
    component: Main,
    children: [
        {
            path: '/',
            name: 'home',
            meta: {
                i18n: 'home',
            },
            component: () => import('../view/home/index.vue'),
        },
    ],
};
