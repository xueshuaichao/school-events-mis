/**
 * @file
 * @author tanghao
 * @date 2018/8/11
 */

import { axios } from '../libs/axios';
import events from './events';

export default {
    getSchoolResourceList: events.getSchoolResourceList,
    getHomeData(data) {
        return axios.post('/index/index', data);
    },
    getSchoolResource(data) {
        return axios.post('/index/resourcelist', data);
    },
    // 学校资讯
    getSchoolNews() {
        return axios.post('/index/article');
    },
    // 学校排行
    getSchoolRanking() {
        return axios.post('/index/schoollist');
    },
    // 班级作品排名
    getSchoolWorksRanking(data) {
        return axios.post('/index/schoolworksranking', data);
    },
    // 资源信息
    getResourceInfo(data) {
        return axios.post('/index/resourceinfo', data);
    },
    // 新版本折线图信息
    newGetResourceInfo(data) {
        return axios.post('/index/newstatistics', data);
    },
    // 学生信息
    getStudentInfo(data) {
        return axios.post('/index/sudentinfo', data);
    },
    getuserinfouser() {
        return axios.post('/account/getuserinfo');
    },
};
