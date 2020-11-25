import { axios } from '../libs/axios';

export default {
    getList(data) {
        return axios.post('/live/getlist', data);
    },
    updateInfo(data) {
        return axios.post('/live/save', data);
    },
    getInfo(data) {
        return axios.post('/live/getinfo', data);
    },
    delete(data) {
        return axios.post('/live/delete', data);
    },
};
