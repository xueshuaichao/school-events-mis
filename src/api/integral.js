import { axios } from '../libs/axios';

export default {
    activitylist(data) {
        return axios.post('/market/activitylist', data);
    },
    marketList(data) {
        return axios.post('/market/giftlist', data);
    },
    marketAdd(data) {
        return axios.post('/market/savegifts', data);
    },
    giftAdd(data) {
        return axios.post('/market/savegift', data);
    },
    integralAdd(data) {
        return axios.post('/market/createactivity', data);
    },
    // 兑换记录列表
    recordLists(data) {
        return axios.post('/market/recordlist ', data);
    },
    // 修改状态
    changeszt(data) {
        return axios.post('/market/changestatus', data);
    },
    // 修改状态
    giftpx(data) {
        return axios.post('/market/giftsort', data);
    },
    // 审核
    reasonsh(data) {
        return axios.post('/market/confirm ', data);
    },
    // 详情
    recordXq(data) {
        return axios.post('/market/recordinfo', data);
    },
    // 快递详情
    expressXq(data) {
        return axios.post('/market/getdeliveryinfo', data);
    },
    expressQr(data) {
        return axios.post('/market/savedeliveryinfo', data);
    },
    expressapi(data) {
        return axios.post('/market/giftinfo', data);
    },
    getEventList(data) {
        return axios.post('/activity/getlist', data);
    },

    //
    scoreList(data) {
        return axios.post('/market/scorelist', data);
    },
    scoreInfo(data) {
        return axios.post('/market/scoreinfo', data);
    },
    scoreUpdate(data) {
        return axios.post('/market/updatescore', data);
    },
};
