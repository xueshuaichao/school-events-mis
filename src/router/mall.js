/*
 * @des 商城管理
 * */

import Main from '../view/main/main.vue';

export default {
    path: '/',
    meta: {
        show: false,
        i18n: '抽奖活动',
        icon: 'icon5',
        // permission: 15,
    },
    component: Main,
    children: [
        // {
        //     path: '/present',
        //     name: 'presentManage',
        //     meta: {
        //         show: true,
        //         i18n: 'mall.present',
        //         permission: 1501,
        //     },
        //     component: () => import('../view/mall/present/index.vue'),
        // },
        {
            path: '/check/raffle/pool/:id',
            component: () => import('../view/mall/present/index.vue'),
        },
        {
            path: '/check/raffle/winner/:id',
            component: () => import('../view/mall/present/winner.vue'),
        },
        {
            path: '/check/raffle/strategy/:id',
            component: () => import('../view/mall/strategy/index.vue'),
        },
        // {
        //     path: '/present/classification',
        //     name: 'presentClassificationManage',
        //     meta: {
        //         show: true,
        //         i18n: 'mall.presentType',
        //         permission: 1502,
        //     },
        //     component: () => import('../view/mall/present-type/index.vue'),
        // },
        // {
        //     path: '/present/add',
        //     name: 'addPresent',
        //     meta: {
        //         show: false,
        //         i18n: 'mall.addPresent',
        //         code: 1503,
        //         breadcrumb: [
        //             {
        //                 name: 'presentManage',
        //                 i18n: 'mall.present',
        //             },
        //         ],
        //     },
        //     component: () => import('../view/mall/present/add-present.vue'),
        // },
        // {
        //     path: '/exchange',
        //     name: 'exchangeRecordManage',
        //     meta: {
        //         show: true,
        //         i18n: 'mall.exchangeRecord',
        //         permission: 1504,
        //     },
        //     component: () => import('../view/mall/exchange/index.vue'),
        // },
        // {
        //     path: '/present/detail/:id',
        //     name: 'detailPresent',
        //     meta: {
        //         show: false,
        //         i18n: 'mall.detailPresent',
        //         code: 1505,
        //         breadcrumb: [
        //             {
        //                 name: 'presentManage',
        //                 i18n: 'mall.present',
        //             },
        //         ],
        //     },
        //     component: () => import('../view/mall/present/add-present.vue'),
        // },
        // {
        //     path: '/exchange/detail/:id',
        //     name: 'exchangeDetail',
        //     meta: {
        //         show: false,
        //         i18n: 'mall.exchangeDetail',
        //         code: 1506,
        //         breadcrumb: [
        //             {
        //                 name: 'exchangeRecordManage',
        //                 i18n: 'mall.exchangeRecord',
        //             },
        //         ],
        //     },
        //     component: () => import('../view/mall/exchange/detail.vue'),
        // },
    ],
};
