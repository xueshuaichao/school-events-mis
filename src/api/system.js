/**
 * @des 系统管理
 */

import { axios } from '../libs/axios';

export default {
    getRoleList(data) {
        return axios.post('/role/list', data);
    },
    getRoleUserList(data) {
        return axios.post('/role/userlist', data);
    },
    addUserToRole(data) {
        return axios.post('/role/addusertorole', data);
    },
    addRole(data) {
        return axios.post('/role/addrole', data);
    },
    getMenuByRoleId(data) {
        return axios.post('/role/getmenubyroleid', data);
    },
    // 查询学校列表
    schoolEduschoollist(data) {
        return axios.post('/school/eduschoollist', data);
    },
    // 查询学校查询下拉字段
    schoolEduschoolstage(data) {
        return axios.post('/school/eduschoolstage', data);
    },
    // 修改管理员
    schoolChangeadmin(data) {
        return axios.post('/school/changeadmin', data);
    },
    // 重置密码
    schoolResetpwd(data) {
        return axios.post('/school/resetpwd', data);
    },
    // 学校导出
    schoolExportschool() {
        return axios.request('/school/exportschool');
    },
    // 获取学校老师
    schoolTeachers(data) {
        return axios.post('/school/teachers', data);
    },
};
