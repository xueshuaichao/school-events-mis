/*
 * @des 信息管理
 * */

import Main from '../view/main/main.vue';

export default {
    path: '/',
    meta: {
        show: true,
        i18n: 'information.home',
        icon: 'icon7',
        permission: 11,
    },
    component: Main,
    children: [
        {
            path: '/article-manage',
            name: 'articleManage',
            meta: {
                show: true,
                i18n: 'information.article',
                permission: 1101,
            },
            component: () => import('../view/information/index.vue'),
        },
        {
            path: '/sort-manage',
            name: 'sortManage',
            meta: {
                show: true,
                i18n: 'information.sort',
                permission: 1102,
            },
            component: () => import('../view/information/sortManage.vue'),
        },
        {
            path: '/messageBoard-manage',
            name: 'messageBoardManage',
            meta: {
                show: true,
                i18n: 'information.messageBoard',
                permission: 1103,
            },
            component: () => import('../view/information/messageBoard.vue'),
        },
        {
            path: '/add-article',
            name: 'addArticle',
            meta: {
                breadcrumb: [
                    {
                        name: 'articleManage',
                        i18n: 'information.article',
                    },
                ],
                i18n: 'information.addArticle',
                code: 1104,
            },
            component: () => import('../view/information/addArticle.vue'),
        },
        {
            path: '/edit-article',
            name: 'editArticle',
            meta: {
                breadcrumb: [
                    {
                        name: 'articleManage',
                        i18n: 'information.article',
                    },
                ],
                i18n: 'information.editArticle',
                code: 1109,
            },
            component: () => import('../view/information/addArticle.vue'),
        },
        {
            path: '/completedList',
            name: 'completedList',
            meta: {
                breadcrumb: [
                    {
                        name: 'messageBoardManage',
                        i18n: 'information.messageBoard',
                    },
                ],
                i18n: 'information.completedList',
                code: 1106,
            },
            component: () => import('../view/information/checkList.vue'),
        },
        {
            path: '/uncompletedList',
            name: 'uncompletedList',
            meta: {
                breadcrumb: [
                    {
                        name: 'messageBoardManage',
                        i18n: 'information.messageBoard',
                    },
                ],
                i18n: 'information.uncompletedList',
                code: 1107,
            },
            component: () => import('../view/information/checkList.vue'),
        },
        {
            path: '/carousel',
            name: 'carousel',
            meta: {
                show: true,
                i18n: 'information.carousel',
                permission: 1110,
            },
            component: () => import('../view/information/carousel.vue'),
        },
        {
            path: '/pictures',
            name: 'pictures',
            meta: {
                show: true,
                i18n: 'information.pictures',
                permission: 1111,
            },
            component: () => import('../view/information/pictures.vue'),
        },
        {
            path: '/news',
            name: 'news',
            meta: {
                show: true,
                i18n: 'information.news',
                permission: 1112,
            },
            component: () => import('../view/information/news/index.vue'),
        },
        {
            path: '/news/add',
            name: 'addNews',
            meta: {
                i18n: 'information.article',
                code: 1113,
            },
            component: () => import('../view/information/news/add-news.vue'),
        },
        {
            path: '/comment',
            name: 'commentManage',
            meta: {
                show: true,
                i18n: 'information.comment',
                code: 1114,
            },
            component: () => import('../view/information/comment/index.vue'),
        },
        {
            path: '/report',
            name: 'reportManage',
            meta: {
                show: true,
                i18n: 'information.report',
                code: 1115,
            },
            component: () => import('../view/information/report/index.vue'),
        },
        {
            path: '/report/detail/:id/:user',
            name: 'reportDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'reportManage',
                        i18n: 'information.report',
                    },
                ],
                i18n: 'information.reportDetail',
            },
            component: () => import('../view/information/report/detail.vue'),
        },
        {
            path: '/search',
            name: 'searchLabelManage',
            meta: {
                show: true,
                i18n: 'information.searchLabel',
                code: 1116,
            },
            component: () => import('../view/information/search/index.vue'),
        },
        {
            path: '/categories',
            name: 'popularCategoriesManage',
            meta: {
                show: true,
                i18n: 'information.popularCategories',
                code: 1117,
            },
            component: () => import('../view/information/categories/index.vue'),
        },
    ],
};
