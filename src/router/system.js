/*
 * @des 系统管理
 * */

import Main from '../view/main/main.vue';

export default {
    path: '/',
    meta: {
        show: true,
        i18n: 'system.home',
        icon: 'icon6',
        permission: 14,
    },
    component: Main,
    children: [
        {
            path: '/rule',
            name: 'ruleManage',
            meta: {
                show: true,
                i18n: 'system.rule',
                permission: 1401,
            },
            component: () => import('../view/system/rule-manage.vue'),
        },
        {
            path: '/rule/add',
            name: 'addRule',
            meta: {
                breadcrumb: [
                    {
                        name: 'ruleManage',
                        i18n: 'system.rule',
                    },
                ],
                i18n: 'system.addRule',
                code: 1402,
            },
            component: () => import('../view/system/add-rule.vue'),
        },
        {
            path: '/rule/edit/:id',
            name: 'editRule',
            meta: {
                breadcrumb: [
                    {
                        name: 'ruleManage',
                        i18n: 'system.rule',
                    },
                ],
                i18n: 'system.editRule',
                code: 1403,
            },
            component: () => import('../view/system/add-rule.vue'),
        },
        {
            path: '/account-manage',
            name: 'schoolAccountManage',
            meta: {
                show: true,
                i18n: 'system.account',
                permission: 1404,
            },
            component: () => import('../view/system/account-manage.vue'),
        },
    ],
};
