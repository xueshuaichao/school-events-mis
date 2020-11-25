/**
 * @des 批量导入
 */

import { axios } from '../libs/axios';
import api from './organization';

export default {
    getSchoolGrade: api.getSchoolGrade,
    schoolImportDepartment(data) {
        return axios.file('/school/importdepartment', data);
    },
    schoolImportGradeClass(data) {
        return axios.file('/school/importgradeclass', data);
    },
    educationImportDepartment(data) {
        return axios.file('/department/importdeparts', data);
    },
    personnelImport(data) {
        return axios.file('/edustaff/staffimport', data);
    },
    studentImport(data) {
        return axios.file('/student/import', data);
    },
    teacherImport(data) {
        return axios.file('/teacher/import', data);
    },
    poemImport(data) {
        return axios.file('/activity/importpoem', data);
    },
};
