/* eslint-disable no-param-reassign */
import api from '@/api/passport';
import CONFIG from '@/config/permission';
import { parsePermissionList } from '@/libs/utils';

export default {
    state: {
        userInfo: {},
        permission: [],
        userRole: '',
    },

    mutations: {
        setAppid(state, data) {
            state.userInfo.appid = data;
        },
        SET_USER_ROLE(state, role) {
            state.userRole = role;
        },
    },

    actions: {
        getUserInfo({ state, dispatch }) {
            return api.getuserinfo().then(({ data, data: { identity } }) => {
                const info = data;
                let permission = '';
                state.userInfo = data;
                if (identity === 2) {
                    let eduPermission = data.is_admin === 1 // 超级用户
                        ? CONFIG.ADMIN
                        : parsePermissionList(data.menus);

                    // 非省级教育厅屏蔽活动审核
                    if (!data.is_province_edu) {
                        eduPermission = eduPermission.filter(v => v !== 1003);
                    }
                    eduPermission.push(1003);

                    // 兼容旧数据
                    if (eduPermission.includes(1003)) {
                        eduPermission.push(
                            10030,
                            10031,
                            10032,
                            10033,
                            10034,
                            10035,
                        );
                        if (
                            ['18710101111', '13141189510'].includes(
                                info.user_account,
                            )
                        ) {
                            eduPermission.push(
                                10036,
                                10037,
                                10038,
                                10039,
                                10040,
                                10041,
                                10042,
                                10043,
                                10044,
                                10045,
                                10046,
                            );
                        }
                    }

                    permission = eduPermission;
                } else {
                    // 学校
                    permission = CONFIG.SCH;
                }
                info.permission = permission;
                state.permission = permission;
                dispatch('setUserRole', info);
                return info;
            });
        },
        setUserRole: (context, userInfo) => {
            let role;
            if (userInfo.identity === 3) {
                role = 'school_admin';
            } else if (userInfo.identity === 2) {
                if (userInfo.is_province_edu === 1) {
                    role = 'edu_pro_admin';
                } else {
                    role = 'edu_admin';
                }
            }
            context.commit('SET_USER_ROLE', role);
        },

        handleLogOut({ state }) {
            return api.logout().then(() => {
                state.userInfo = '';
                state.userRole = '';
            });
        },
    },
};
