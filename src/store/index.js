/**
 * @file
 * @author tanghao
 * @date 2019-06-19
 */

import Vue from 'vue';
import Vuex from 'vuex';
import app from './module/app';
import user from './module/user';
import events from './module/events';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {
        //
    },
    modules: {
        app,
        user,
        events,
    },
});
