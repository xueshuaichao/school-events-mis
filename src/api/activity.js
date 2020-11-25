/**
 * @des 活动
 */

import { axios } from '../libs/axios';
import api from './account';
import events from './events';

export default {
    closeAccount: api.closeAccount,
    educationResourceaudit: events.educationResourceaudit,
    getCategoryall: events.getCategoryall,
    getActivityList(data) {
        return axios.post('/activity/resourcelist', data);
    },
    getActivityDetail(data) {
        return axios.post('/activity/detail', data);
    },
    updateActivityStatus(data) {
        return axios.post('/activity/audit', data);
    },
    getEventList(data) {
        return axios.post('/activity/getlist', data);
    },
    getEventInfo(data) {
        return axios.post('/activity/getone', data);
    },
    updateEventInfo(data) {
        return axios.post('/activity/editone', data);
    },
    updateEventsSort(data) {
        return axios.post('/activity/sorttop', data);
    },
    updateEventTopStatus(data) {
        return axios.post('/activity/maketopactivity', data);
    },
    deleteEvent(data) {
        return axios.post('/activity/deleteactivity', data);
    },
};
