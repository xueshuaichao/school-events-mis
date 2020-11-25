/**
 * @file
 * @author tanghao
 * @date 2019/3/5
 */

import { axios } from '../libs/axios';

export default {
    login(data) {
        return axios.post('/account/login', data);
    },
    logout() {
        return axios.post('/account/loginout');
    },
    getuserinfo() {
        return axios.post('/account/getuserinfo');
    },
    getPicCode() {
        return axios.post('/passport/piccode');
    },
    checkPicCode(data) {
        return axios.request('/passport/checkpiccode', data);
    },
    getTeacherInfoByMobile(data) {
        return axios.request('/teacher/getteacherinfobymobile', data);
    },
    sendModifyPassportMsg(data) {
        return axios.request('/passport/sendmodifypassportmsg', data);
    },
    forgetPassword(data) {
        return axios.request('/account/forgetpassword', data);
    },
};
