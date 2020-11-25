import { axios } from '../libs/axios';

export default {
    create(data) {
        return axios.post('/activity/addpoemtheme', data);
    },
    poemList(data) {
        return axios.post('/activity/poemlist', data);
    },
    addPoem(data) {
        return axios.post('/activity/addpoem', data);
    },
    updatePoem(data) {
        return axios.post('/activity/uppoem', data);
    },
    delPoem(data) {
        return axios.post('/activity/delpoem', data);
    },
    detail(data) {
        return axios.post('/activity/poemone', data);
    },
    list(data) {
        return axios.post('/activity/poemthemelist', data);
    },
    winner(data) {
        return axios.request('/draw/drawuser', data);
    },
    delivery(data) {
        return axios.post('/draw/addlogistics', data);
    },
    delete(data) {
        return axios.post('/activity/delpoemtheme', data);
    },
};
