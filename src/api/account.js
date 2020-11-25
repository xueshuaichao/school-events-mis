/**
 * @file
 * @author tanghao
 * @date 2018/8/11
 */

import { axios } from '../libs/axios';

export default {
    modifyPassword(data) {
        return axios.post('/account/modifypassword', data);
    },
    closeAccount(data) {
        return axios.post('/account/closeaccount', data);
    },
};
