/**
 * @des 组织管理
 */

import { axios } from '../libs/axios';

export default {
    getSchoolInfo(data) {
        return axios.post('/school/info', data);
    },
    schoolUpdateInfo(data) {
        return axios.post('/school/update', data);
    },

    getSchoolGrade(data) {
        return axios.post('/school/grade', data);
    },
    getSchoolClass(data) {
        return axios.post('/school/class', data);
    },
    initSchoolClass(data) {
        return axios.post('/school/addclass', data);
    },
    getSchoolDepartment(data) {
        return axios.post('/school/department', data);
    },
    // 查询学校学段
    schoolEduschoolstage(data) {
        return axios.post('/school/eduschoolstage', data);
    },
    // 查询学校列表
    schoolEduschoollist(data) {
        return axios.post('/school/eduschoollist', data);
    },
    // 查询学校详情
    schoolEduschooldetail(data) {
        return axios.post('/school/eduschooldetail', data);
    },

    // 提交审核结果
    schoolAuditschool(data) {
        return axios.post('/school/auditschool', data);
    },

    // 获取组织管理一级列表
    departmentEdudepartslist(data) {
        return axios.request('/department/edudepartslist', data);
    },
    personnelImport(data) {
        return axios.file('/department/importdeparts', data);
    },
    schoolDetail(data) {
        return axios.post('/school/deleteschool', data);
    },
};
