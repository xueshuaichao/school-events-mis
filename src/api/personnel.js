/*
 *
 * @dez 人员管理
 * */
import { axios } from '../libs/axios';
import school from './organization';

const { getSchoolGrade, getSchoolClass } = school;
export default {
    getSchoolGrade,
    getSchoolClass,
    getTeacherList(data) {
        return axios.post('/teacher/list', data);
    },
    updateTeacherInfo(data) {
        return axios.post('/teacher/update', data);
    },
    getTeacherInfo(data) {
        return axios.post('/teacher/info', data);
    },
    addTeacher(data) {
        return axios.post('/teacher/add', data);
    },
    resetTeacherPassword(data) {
        return axios.post('/teacher/resetpw', data);
    },
    getStudentList(data) {
        return axios.post('/student/list', data);
    },
    getStudentInfo(data) {
        return axios.post('/student/info', data);
    },
    updateStudentInfo(data) {
        return axios.post('/student/update', data);
    },
    addStudent(data) {
        console.log(data);
        return axios.post('/student/add', data);
    },
    resetStudentPassword(data) {
        return axios.post('/student/resetpw', data);
    },
    deleteStudent(data) {
        return axios.post('/student/delstudent', data);
    },
    // 批量删除学生
    deleteStudents(data) {
        return axios.post('/student/del', data);
    },
    // 获取人员管理列表
    edustaffStafflist(data) {
        return axios.post('/edustaff/stafflist', data);
    },
    // 获取工会部门列表
    getEdudepartslist() {
        return axios.request('/department/edudepartslist');
    },
    // 新增人员
    addAndEditPerson(data) {
        return axios.post('/edustaff/editstaff', data);
    },
    // 重置密码
    edustaffResetpwd(data) {
        return axios.post('/edustaff/resetpwd', data);
    },
    // 获取单个人员信息
    edustaffStaffdetail(data) {
        return axios.post('/edustaff/staffdetail', data);
    },
    getStudent(data) {
        return axios.post('/student/listgrade', data);
    },
    // 离校
    removeStudent(data) {
        return axios.post('/student/leaveschool', data);
    },
    leftStudentList(data) {
        return axios.post('/student/leaveschoollist', data);
    },
};
