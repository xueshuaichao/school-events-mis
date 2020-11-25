/*
 *
 * @dez 活动管理
 * */
import { axios } from '@/libs/axios';
import personnel from './personnel';
import school from './organization';
import account from './account';

const { getSchoolGrade, getSchoolClass, getSchoolInfo } = school;
export default {
    getStudent: personnel.getStudent,
    getSchoolGrade,
    getSchoolClass,
    getSchoolInfo,
    closeAccount: account.closeAccount,
    getCategory(data) {
        return axios.post('/result/category', data);
    },
    uploadScore(data) {
        return axios.post('/result/upload', data);
    },
    updateScore(data) {
        return axios.post('/result/update', data);
    },
    getScoreList(data) {
        return axios.post('/result/list', data);
    },
    getScoreInfo(data) {
        return axios.post('/result/info', data);
    },
    deleteScore(data) {
        return axios.post('/result/deleted', data);
    },
    // 资源名称列表
    getResourceNameList(data) {
        return axios.post('/result/resourcenamelist', data);
    },
    // 学校 项目列表
    getSchoolResourceList(data) {
        return axios.post('/result/resourcelist', data);
    },
    // 学校 项目列表
    // 学校 统计列表
    getSchoolActivityList(data) {
        return axios.post('/result/activitystatistics', data);
    },
    // 学校统计详情
    getSchoolActivityStatisticsDetail(data) {
        return axios.post('/result/activitystatisticsdetail', data);
    },
    // 学校网络证书 result/certificate
    getSchoolCertificate(data) {
        return axios.post('/result/certificate', data);
    },
    getResourceDetail(data) {
        return axios.post('/result/resourcedetail', data);
    },
    // 获取活动审核列表
    educationResourcelist(data) {
        return axios.post('/education/resourcelist', data);
    },
    // 审核详情
    educationResourcedetail(data) {
        return axios.post('/education/resourcedetail', data);
    },
    // 审核结果
    educationResourceaudit(data) {
        return axios.post('/education/resourceaudit', data);
    },
    deleteResource(id) {
        return axios.post('/education/shelves', {
            resource_id: id,
            status: 1,
        });
    },
    recoverResource(id) {
        return axios.post('/education/shelves', {
            resource_id: id,
            status: 0,
        });
    },
    getCertificate(data) {
        return axios.post('/education/certificate', data);
    },
    // 获取活动审核全部的下拉选项
    getCategoryall(data) {
        return axios.post('/result/categoryall', data);
    },
    // 获取年级接口
    getschoolGradeall(data) {
        return axios.post('/school/gradeall', data);
    },
    // 教育厅统计列表
    getActivityList(data) {
        return axios.post('/education/activitystatistics', data);
    },
    // 统计活动详情
    getActivityStatisticsDetail(data) {
        return axios.post('/education/activitystatisticsdetail', data);
    },
    // 统计学校详情
    getSchoolStatisticsDetail(data) {
        return axios.post('/education/schoolstatisticsdetail', data);
    },
};
