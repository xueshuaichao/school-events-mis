/**
 * @des 上传
 */

import { axios } from '../libs/axios';

export default {
    getUploadToken(data) {
        return axios.post('/cert/createtoken', data);
    },
    updateUploadToken(data) {
        return axios.post('/cert/refreshmediatoken', data);
    },
    uploadFile(data) {
        return axios.file('/file/uploadfile', data);
    },
};
