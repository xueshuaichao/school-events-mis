/*
 * @des 批量导入配置 columns
 * */

const uploadUrl = {
    class: 'schoolImportGradeClass',
    sdepartment: 'schoolImportDepartment',
    edupartment: 'educationImportDepartment',
    personnelImport: 'personnelImport',
    student: 'studentImport',
    teacher: 'teacherImport',
};
const download = {
    class:
        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/docs/年级导入模板.xlsx',
    sdepartment:
        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/docs/部门导入模板.xlsx',
    edupartment:
        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/docs/部门导入模板.xlsx',
    personnelImport:
        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/docs/人员导入模板.xlsx',
    student:
        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/docs-test/学生导入模板V2.xlsx',
    teacher:
        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/docs/教师导入模板.xlsx',
};
const columnsConfig = {
    class: [
        {
            title: '班级名称',
            key: 'class_name',
            align: 'center',
        },
        {
            title: '班级别明',
            key: 'class_alias',
            align: 'center',
        },
    ],
    sdepartment: [
        {
            title: '二级部门',
            key: 'name',
            align: 'center',
        },
        {
            title: '职责',
            key: 'duty',
            align: 'center',
        },
    ],
    student: [],
    teacher: [],
};
export default {
    columnsConfig,
    uploadUrl,
    download,
};
