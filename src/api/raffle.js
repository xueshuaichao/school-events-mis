import { axios } from '../libs/axios';

export default {
    create(data) {
        return axios.post('/draw/addactivity', data);
    },
    detail(data) {
        return axios.post('/draw/getactivity', data);
    },
    list(data) {
        return axios.post('/draw/activitylist', data);
    },
    winner(data) {
        return axios.request('/draw/drawuser', data);
    },
    delivery(data) {
        return axios.post('/draw/addlogistics', data);
    },
    delete(data) {
        return axios.post('/draw/delactivity', data);
    },
};
