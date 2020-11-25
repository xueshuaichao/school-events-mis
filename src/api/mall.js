/*
 * @des 商城管理
 * */
import { axios } from '../libs/axios';

const present = {
    create(data) {
        return axios.post('/draw/addprize', data);
    },
    batchCreate(data) {
        return axios.post('/draw/addprizes', data);
    },
    edit(data) {
        return axios.post('/draw/editprize', data);
    },
    updateGiftStatus(data) {
        return axios.post('/draw/changestatus', data);
    },
    move(data) {
        return axios.post('/draw/move', data);
    },
    rullList(data) {
        return axios.post('/draw/getrule', data);
    },
    saveRules(data) {
        return axios.post('/draw/addrule', data);
    },

    getGiftList(data) {
        return axios.post('/draw/prizelist', data);
    },
    getGiftRecord(data) {
        return axios.post('/draw/dtuser', data);
    },

    updateGiftSort(data) {
        return axios.post('/market/giftsort', data);
    },

    addStock(data) {
        return axios.post('/market/addstock', data);
    },

    addGift(data) {
        return axios.post('/market/savegift', data);
    },

    getGiftInfo(data) {
        return axios.post('/market/giftinfo', data);
    },
};

const presentType = {
    getGiftTypeList(data) {
        return axios.post('/market/gifttypelist', data);
    },

    getGiftTypeInfo(data) {
        return axios.post('/market/giftcatinfo', data);
    },

    updateGiftTypeSort(data) {
        return axios.post('/market/gifttypesort', data);
    },

    addGiftType(data) {
        return axios.post('/market/savegifttype', data);
    },

    deleteGiftType(data) {
        return axios.post('/market/deletegifttype', data);
    },
};

const exchange = {
    getExchangeList(data) {
        return axios.post('/market/recordlist', data);
    },

    getExchangeInfo(data) {
        return axios.post('/market/recordinfo', data);
    },

    updateExchangeStatus(data) {
        return axios.post('/market/confirm', data);
    },
};

export default {
    ...present,
    ...presentType,
    ...exchange,
};
