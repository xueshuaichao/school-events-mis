import {
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getHomeRoute,
} from '../../libs/utils';

import routers from '../../router/routers';

export default {
    state: {
        breadCrumbList: [],
        tagNavList: [],
        openMainSpin: false,
        mainSpinText: '',
        openRechargeModal: false,
        homeRoute: getHomeRoute(routers),
        articleList: {},
    },
    getters: {
        menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.permission),
    },
    mutations: {
        setBreadCrumb(state, routeMetched) {
            state.breadCrumbList = getBreadCrumbList(routeMetched);
        },

        setBreadCrumbList(state, data) {
            state.breadCrumbList = data;
        },

        setTagNavList(state, list) {
            if (list) {
                state.tagNavList = [...list];
                setTagNavListInLocalstorage([...list]);
            } else {
                state.tagNavList = getTagNavListFromLocalstorage();
            }
        },

        addTag(state, item, type = 'unshift') {
            if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
                state.tagNavList[type](item);
                setTagNavListInLocalstorage([...state.tagNavList]);
            }
        },

        openMainSpin(state, data) {
            if (typeof data === 'object') {
                state.openMainSpin = data.open;
                state.mainSpinText = data.text;
            } else {
                state.openMainSpin = data;
                state.mainSpinText = '加载中...';
            }
        },

        openRechargeModal(state, open) {
            state.openRechargeModal = open;
        },
        setArticle(state, list) {
            state.articleList = list;
        },
    },
};
