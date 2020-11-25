/*
 * @des 权限菜单
 * */
const EDU = [
    {
        i18n: 'mall.home',
        permission: 15,
        children: [
            {
                i18n: 'mall.present',
                permission: 1501,
            },
            {
                i18n: 'mall.presentType',
                permission: 1502,
            },
            {
                i18n: 'mall.exchangeRecord',
                permission: 1504,
            },
        ],
    },
    {
        i18n: 'events.home',
        permission: 10,
        children: [
            {
                i18n: 'events.record',
                permission: 1005,
            },
            {
                i18n: 'events.statistics',
                permission: 1007,
            },
            {
                i18n: 'events.check',
                permission: 1003,
            },
        ],
    },
    {
        i18n: 'information.home',
        permission: 11,
        children: [
            {
                i18n: 'information.article',
                permission: 1101,
            },
            {
                i18n: 'information.sort',
                permission: 1102,
            },
            {
                i18n: 'information.messageBoard',
                permission: 1103,
            },
            {
                i18n: 'information.carousel',
                permission: 1110,
            },
            {
                i18n: 'information.pictures',
                permission: 1111,
            },
            {
                i18n: 'information.news',
                permission: 1112,
            },
            {
                i18n: 'information.comment',
                permission: 1114,
            },
            {
                i18n: 'information.report',
                permission: 1115,
            },
            {
                i18n: 'information.searchLabel',
                permission: 1116,
            },
            {
                i18n: 'information.popularCategories',
                permission: 1117,
            },
        ],
    },
    {
        i18n: 'organization.home',
        permission: 12,
        children: [
            {
                i18n: 'organization.school',
                permission: 1204,
            },
            {
                i18n: 'organization.edepartment',
                permission: 1203,
            },
        ],
    },
    {
        i18n: 'personnel.home',
        permission: 13,
        children: [
            {
                i18n: 'personnel.home',
                permission: 1301,
            },
        ],
    },
    {
        i18n: 'system.home',
        permission: 14,
        children: [
            {
                i18n: 'system.rule',
                permission: 1401,
            },
            {
                i18n: 'system.account',
                permission: 1403,
            },
        ],
    },
];

const SCH = [
    10,
    1001,
    1002,
    1003,
    10030,
    10031,
    10032,
    1005,
    1006,
    1007,
    1008,
    1009,
    13,
    1302,
    1303,
    1304,
    1305,
    1306,
    1307,
    1308,
    1309,
    1310,
    1311,
    12,
    1201,
    1202,
    1209,
    1210,
    1205,
    1206,
];

const ADMIN = [
    11,
    1101,
    1102,
    1103,
    1104,
    1105,
    1106,
    1107,
    1109,
    1110,
    1111,
    1112,
    1114,
    1115,
    1116,
    1117,
    12,
    1203,
    1204,
    1207,
    1208,
    13,
    1301,
    1304,
    1306,
    1312,
    1313,
    1314,
    1324,
    14,
    1401,
    1402,
    1403,
    1404,
    15,
    1501,
    1502,
    1503,
    1504,
    10,
    1003,
    // 10030,
    // 10031,
    // 10032,
    // 10033,
    // 10034,
    // 10035,
    // 10036,
    // 10037,
    // 10038,
    // 10039,
    // 10040,
    // 10041,
    // 10042,
    // 10043,
    // 10044,
    // 10045,
    1004,
    1005,
    1006,
    1007,
    1008,
    1009,
    16,
];
export default {
    EDU,
    SCH,
    ADMIN,
};
