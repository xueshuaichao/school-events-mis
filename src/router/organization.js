/*
 * @des 组织管理
 * */

import Main from '../view/main/main.vue';

const list = [
    {
        name: 'class',
        code: 1201,
        show: true,
    },
    {
        name: 'sdepartment', // 学校 》部门管理
        show: false,
        code: 1202,
    },
];

const routes = list.map((v) => {
    const { name } = v;
    return {
        path: `/${name}-manage`,
        name: `${name}Manage`,
        meta: {
            show: v.show,
            i18n: `organization.${name}`,
            permission: v.code,
            resource: name,
        },
        component: () => import('../view/organization/common.vue'),
    };
});

export default {
    path: '/',
    meta: {
        show: true,
        i18n: 'organization.home',
        icon: 'icon1',
        permission: 12,
    },
    component: Main,
    children: [
        ...routes,
        {
            // 部门管理
            path: '/edepartment-manage',
            name: 'edepartmentManage',
            meta: {
                show: true,
                i18n: 'organization.edepartment',
                permission: 1203,
            },
            component: () => import('../view/organization/departmentManage.vue'),
        },
        {
            // 学校管理
            path: '/school-manage',
            name: 'schoolManage',
            meta: {
                show: true,
                i18n: 'organization.school',
                permission: 1204,
            },
            component: () => import('../view/organization/school-manage.vue'),
        },
        {
            path: '/edepartment/import',
            name: 'edepartmentImport',
            meta: {
                breadcrumb: [
                    {
                        name: 'edepartmentManage',
                        i18n: 'organization.edepartment',
                    },
                ],
                resource: 'edupartment',
                i18n: 'contents.import',
            },
            component: () => import('../view/components/import/personnel-index.vue'),
        },
        {
            path: '/school',
            name: 'schoolMes',
            meta: {
                show: true,
                i18n: 'organization.school',
                permission: 1205,
            },
            component: () => import('../view/organization/school/index.vue'),
        },
        {
            path: '/school/edit',
            name: 'schoolEdit',
            meta: {
                breadcrumb: [
                    {
                        name: 'schoolMes',
                        i18n: 'organization.school',
                    },
                ],
                i18n: 'organization.editSchool',
                permission: 1206,
            },
            component: () => import('../view/organization/school/edit-school.vue'),
        },
        {
            // 学校管理详情
            path: '/schoolDetail',
            name: 'schoolDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'schoolManage',
                        i18n: 'organization.school',
                    },
                ],
                i18n: 'organization.schoolDetail',
                code: 1207,
            },
            component: () => import('../view/organization/school-detail.vue'),
        },
        {
            // 学校管理审核
            path: '/schoolVerify',
            name: 'schoolVerify',
            meta: {
                breadcrumb: [
                    {
                        name: 'schoolManage',
                        i18n: 'organization.school',
                    },
                ],
                i18n: 'organization.schoolVerify',
                code: 1208,
            },
            component: () => import('../view/organization/school-detail.vue'),
        },
        {
            path: '/class/import',
            name: 'classImport',
            meta: {
                breadcrumb: [
                    {
                        name: 'classManage',
                        i18n: 'organization.class',
                    },
                ],
                resource: 'class',
                permission: 1209,
                i18n: 'contents.import',
            },
            component: () => import('../view/components/import/index.vue'),
        },
        {
            path: '/sdepartment/import',
            name: 'sdepartmentImport',
            meta: {
                breadcrumb: [
                    {
                        name: 'sdepartmentManage',
                        i18n: 'organization.sdepartment',
                    },
                ],
                resource: 'sdepartment',
                permission: 1210,
                i18n: 'contents.import',
            },
            component: () => import('../view/components/import/index.vue'),
        },
    ],
};
