/*
 * @des 人员管理
 * */

import Main from '../view/main/main.vue';

export default {
    path: '/',
    meta: {
        show: true,
        i18n: 'personnel.home',
        icon: 'icon4',
        permission: 13,
    },
    component: Main,
    children: [
        {
            path: '/personnel',
            name: 'personnelManage',
            meta: {
                show: true,
                i18n: 'personnel.home',
                permission: 1301,
            },
            component: () => import('../view/personnel/person/index.vue'),
        },
        {
            path: '/personnel/import',
            name: 'personnelImport',
            meta: {
                i18n: 'personnel.import',
                permission: 1324,
                resource: 'personnelImport',
            },
            component: () => import('../view/components/import/personnel-index.vue'),
        },
        {
            path: '/student',
            name: 'studentManage',
            meta: {
                show: true,
                i18n: 'personnel.student',
                permission: 1302,
            },
            component: () => import('../view/personnel/student/index.vue'),
        },
        {
            path: '/student/add',
            name: 'editStudent',
            meta: {
                breadcrumb: [
                    {
                        name: 'studentManage',
                        i18n: 'personnel.student',
                    },
                ],
                i18n: 'personnel.editStudent',
                permission: 1303,
            },
            component: () => import('../view/personnel/student/add-student.vue'),
        },
        {
            path: '/student/help',
            name: 'studentHelpCenter',
            meta: {
                breadcrumb: [
                    {
                        name: 'studentManage',
                        i18n: 'personnel.student',
                    },
                ],
                i18n: 'personnel.studentHelp',
                permission: 1303,
            },
            component: () => import('../view/personnel/student/help.vue'),
        },
        {
            path: '/personnel/add',
            name: 'addPersonnel',
            meta: {
                i18n: 'personnel.addPersonnel',
                code: 1314,
            },
            component: () => import('../view/personnel/person/add-person.vue'),
        },
        {
            path: '/personnel/edit/:id',
            name: 'editPersonnel',
            meta: {
                i18n: 'personnel.editPersonnel',
                code: 1312,
            },
            component: () => import('../view/personnel/person/add-person.vue'),
        },
        {
            path: '/personnel/detail/:id',
            name: 'personnelDetail',
            meta: {
                i18n: 'personnel.addStudent',
                code: 1313,
            },
            component: () => import('../view/personnel/person/detail.vue'),
        },
        {
            path: '/student/edit/:id',
            name: 'studentDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'studentManage',
                        i18n: 'personnel.student',
                    },
                ],
                i18n: 'personnel.editStudent',
                permission: 1304,
            },
            component: () => import('../view/personnel/student/add-student.vue'),
        },
        {
            path: '/student/detail/:id',
            name: 'studentDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'studentManage',
                        i18n: 'personnel.student',
                    },
                ],
                i18n: 'personnel.studentDetail',
                permission: 1305,
            },
            component: () => import('../view/personnel/student/detail.vue'),
        },
        {
            path: '/student/import',
            name: 'studentImport',
            meta: {
                breadcrumb: [
                    {
                        name: 'studentManage',
                        i18n: 'personnel.student',
                    },
                ],
                i18n: 'personnel.import',
                permission: 1306,
                resource: 'student',
            },
            component: () => import('../view/components/import/index.vue'),
        },
        {
            path: '/teacher',
            name: 'teacherManage',
            meta: {
                show: true,
                i18n: 'personnel.teacher',
                permission: 1307,
            },
            component: () => import('../view/personnel/teacher/index.vue'),
        },
        {
            path: '/teacher/add',
            name: 'addTeacher',
            meta: {
                breadcrumb: [
                    {
                        name: 'teacherManage',
                        i18n: 'personnel.teacher',
                    },
                ],
                i18n: 'personnel.addStudent',
                permission: 1308,
            },
            component: () => import('../view/personnel/teacher/add-teacher.vue'),
        },
        {
            path: '/teacher/edit/:id',
            name: 'editTeacher',
            meta: {
                breadcrumb: [
                    {
                        name: 'teacherManage',
                        i18n: 'personnel.teacher',
                    },
                ],
                permission: 1309,
                i18n: 'personnel.editTeacher',
            },
            component: () => import('../view/personnel/teacher/add-teacher.vue'),
        },
        {
            path: '/teacher/detail/:id',
            name: 'teacherDetail',
            meta: {
                breadcrumb: [
                    {
                        name: 'teacherManage',
                        i18n: 'personnel.teacher',
                    },
                ],
                i18n: 'personnel.teacherDetail',
                permission: 1310,
            },
            component: () => import('../view/personnel/teacher/detail.vue'),
        },
        {
            path: '/teacher/import',
            name: 'teacherImport',
            meta: {
                breadcrumb: [
                    {
                        name: 'teacherManage',
                        i18n: 'personnel.teacher',
                    },
                ],
                resource: 'teacher',
                i18n: 'personnel.import',
                permission: 1311,
            },
            component: () => import('../view/components/import/index.vue'),
        },
    ],
};
