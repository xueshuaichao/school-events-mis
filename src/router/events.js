/**
 * @file
 * @author tanghao
 * @date 2019-07-25
 */

import Main from '@/view/main/main.vue';
import Spring from '@/view/events/check/spring.vue';
import Resource from '@/view/events/check/resource.vue';
import Live from '@/view/events/check/live.vue';
import Event from '@/view/events/check/event.vue';
import Raffle from '@/view/events/check/raffle.vue';
import Points from '@/view/events/check/points.vue';
import PointsManage from '@/view/events/check/points/manage.vue';
import Poem from '@/view/events/check/poem/index.vue';
import { firstWordUpperCase } from '../libs/utils';

const EVENTS_CHECK_MAP = [
    // 'person',
    // 'group',
    'sports',
    'guinness',
    'talent',
    'education',
    'activity',
    'live',
    'raffle',
    'points',
    'pointsManage',
    'poem',
    'spring',
    'festival',
    'epidemic',
    'read',
    'teenagers',
    'childhood',
];
const ACTIVITY_MAP = [
    'spring',
    'festival',
    'epidemic',
    'read',
    'teenagers',
    'childhood',
];

const routes = EVENTS_CHECK_MAP.map((v, i) => {
    const upperCase = firstWordUpperCase(v);
    let componentName;
    switch (v) {
        case 'activity':
            componentName = Event;
            break;
        case 'live':
            componentName = Live;
            break;
        case 'raffle':
            componentName = Raffle;
            break;
        case 'points':
            componentName = Points;
            break;
        case 'pointsManage':
            componentName = PointsManage;
            break;
        case 'poem':
            componentName = Poem;
            break;
        default:
            componentName = ACTIVITY_MAP.includes(v) ? Spring : Resource;
    }

    return {
        path: `${v}`,
        name: `eventCheck${upperCase}`,
        meta: {
            show: !ACTIVITY_MAP.includes(v),
            breadcrumb: [
                {
                    name: 'eventCheck',
                    isVisited: true,
                    i18n: 'events.check',
                },
            ],
            permission: 10030 + i,
            resource_name: v,
            i18n: `events.check${upperCase}`,
        },
        component: componentName,
    };
});
export default {
    path: '/',
    meta: {
        show: true,
        i18n: 'events.home',
        icon: 'icon2',
        permission: 10,
    },
    component: Main,
    children: [
        {
            path: '/score',
            name: 'scoreManage',
            meta: {
                show: true,
                i18n: 'events.score',
                permission: 1001,
            },
            component: () => import('../view/events/score/index.vue'),
        },
        {
            path: '/score/report',
            name: 'reportScore',
            meta: {
                breadcrumb: [
                    {
                        name: 'scoreManage',
                        i18n: 'events.score',
                    },
                ],
                i18n: 'events.reportScore',
                permission: 1002,
            },
            component: () => import('../view/events/score/report-score.vue'),
        },
        {
            path: '/score/edit/:id',
            name: 'editScore',
            meta: {
                i18n: 'events.reportScore',
                permission: 1002,
            },
            component: () => import('../view/events/score/report-score.vue'),
        },
        {
            path: '/check',
            name: 'eventCheck',
            meta: {
                show: true,
                i18n: 'events.check',
                permission: 1003,
            },
            component: () => import('../view/events/check/index.vue'),
            children: [
                ...routes,
                {
                    path: 'sports/trash',
                    name: 'eventCheckSportsTrash',
                    meta: {
                        // show: !ACTIVITY_MAP.includes(v),
                        breadcrumb: [
                            {
                                name: 'eventCheck',
                                isVisited: true,
                                i18n: 'events.check',
                            },
                        ],
                        permission: 10030 + 1,
                        resource_name: 'trash',
                        i18n: 'events.checkSports',
                    },
                    component: Resource,
                },
            ],
        },
        {
            path: '/activity/:id',
            name: 'activityManage',
            meta: {
                show: false,
                breadcrumb: [
                    {
                        name: 'eventCheck',
                        isVisited: true,
                        i18n: 'events.check',
                    },
                    {
                        name: 'eventCheckActivity',
                        i18n: 'events.checkActivity',
                    },
                ],
                i18n: 'events.activityDetail',
                resource_name: 'activity',
            },
            component: Spring,
        },
        {
            path: '/check/checkDetail/:id',
            name: 'checkDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventCheck',
                        isVisited: true,
                        i18n: 'events.check',
                    },
                ],
                i18n: 'events.checkDetail',
            },
            component: () => import('../view/events/components/checkDetail.vue'),
        },
        {
            path: '/check/spring/detail/:id',
            name: 'springDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventCheck',
                        isVisited: true,
                        i18n: 'events.check',
                    },
                ],
                i18n: 'events.checkDetail',
            },
            component: () => import('../view/events/check/springDetail.vue'),
        },
        {
            path: '/check/checkEvent/:id',
            name: 'checkEvent',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventCheck',
                        isVisited: true,
                        i18n: 'events.check',
                    },
                ],
                i18n: 'events.checkEvent',
                code: 1004,
            },
            component: () => import('../view/events/components/checkDetail.vue'),
        },
        {
            path: '/check/poem/manage/:id',
            name: 'checkPoemManage',
            component: () => import('../view/events/check/poem/manage.vue'),
        },
        {
            path: '/check/poem/import/:id',
            name: 'checkPoemImport',
            component: () => import('../view/events/check/poem/import.vue'),
        },
        {
            path: '/check/poem/edit/:tid/:id',
            name: 'checkPoemEdit',
            component: () => import('../view/events/check/poem/edit.vue'),
        },
        {
            path: '/events',
            name: 'eventsRecord',
            meta: {
                show: true,
                i18n: 'events.record',
                permission: 1005,
            },
            component: () => import('../view/events/project/index.vue'),
        },
        {
            path: '/events/detail/:id',
            name: 'eventsDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventsRecord',
                        i18n: 'events.record',
                    },
                ],
                i18n: 'events.detail',
                permission: 1006,
            },
            component: () => import('../view/events/components/checkDetail.vue'),
        },
        {
            path: '/statistics',
            name: 'eventsStatistics',
            meta: {
                show: true,
                i18n: 'events.statistics',
                permission: 1007,
            },
            component: () => import('../view/events/statistics/index.vue'),
        },
        {
            path: '/statistics/resource/:name', // 按活动统计详情
            name: 'statisticsResourceDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventsStatistics',
                        i18n: 'events.statistics',
                    },
                ],
                i18n: 'events.statisticsDetail',
                permission: 1008,
            },
            component: () => import('../view/events/statistics/detail.vue'),
        },
        {
            path: '/statistics/:name/:id', // 按学校统计详情
            name: 'statisticsSchoolDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventsStatistics',
                        i18n: 'events.statistics',
                    },
                ],
                i18n: 'events.statisticsDetail',
                permission: 1009,
            },
            component: () => import('../view/events/statistics/detail.vue'),
        },
        /* 积分活动_积分商城 */
        {
            path: '/check/points/pointsMall/:activity_id',
            name: 'pointsMall',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventCheck',
                        isVisited: true,
                        i18n: 'events.check',
                    },
                    {
                        name: 'eventCheckPoints',
                        i18n: 'events.checkPoints',
                    },
                ],
                i18n: 'events.pointsMall',
            },
            component: () => import('../view/mall/pointindex/confirm.vue'),
        },
        /* 积分活动_兑换审核 */
        {
            path: '/check/points/examine/:activity_id',
            name: 'exchangeAudit',
            meta: {
                breadcrumb: [
                    {
                        name: 'eventCheck',
                        isVisited: true,
                        i18n: 'events.check',
                    },
                    {
                        name: 'eventCheckPoints',
                        i18n: 'events.checkPoints',
                    },
                ],
                i18n: 'events.exchangeAudit',
            },
            component: () => import('../view/mall/pointindex/addIndex.vue'),
        },
    ],
};
