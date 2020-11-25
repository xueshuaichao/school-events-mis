export default [
    {
        path: '/',
        component: () => import('../view/passport/index.vue'),
        children: [
            {
                path: '/passport',
                name: 'passportLogin',
                component: () => import('../view/passport/login/index.vue'),
            },
            {
                path: '/passport/register',
                name: 'passportRegister',
                component: () => import('../view/passport/register/index.vue'),
            },
            {
                path: '/passport/forget',
                name: 'passportForget',
                component: () => import('../view/passport/register/index.vue'),
            },
        ],
    },
];
