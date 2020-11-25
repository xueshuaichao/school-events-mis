<template>
    <page-list
        :columns="mode === 'normal' ? columns : columnsLeave"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: form.page_num }"
        :hide-header-btn="false"
        :is-hidden-delete="true"
        @btn-click="handleAction"
        @page-change="getStudentList"
        @on-select="handleSelect"
        @on-delete="handleClickDelete"
    >
        <template slot="page-header">
            <div style="width: 100%;">
                <div>
                    <Tabs
                        :animated="false"
                        @on-click="switchTab"
                    >
                        <TabPane label="在校学生" />
                        <TabPane label="离校学生" />
                    </Tabs>
                </div>
                <div
                    v-if="mode === 'normal'"
                    style="width: 100%; display: flex;"
                >
                    <i-button
                        type="primary"
                        @click="handleClickBtn('studentImport')"
                    >
                        批量导入
                    </i-button>
                    <i-button @click="handleClickBtn('addStudent')">
                        单个新增
                    </i-button>
                    <a
                        class=" flex-row"
                        @click="$router.push({ name: 'studentHelpCenter' })"
                    ><Icon
                        type="ios-help-circle"
                        color="#1166FF"
                        size="20"
                    />学生导入帮助</a>
                    <p class="tips float-right">
                        请先筛选需要导出的班级，再进行导出操作。
                    </p>
                    <i-button @click="handleClickExport">
                        导出
                    </i-button>
                </div>
            </div>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="姓名">
                    <i-input v-model="form.name" />
                </form-item>
                <template v-if="mode === 'normal'">
                    <form-item label="年级">
                        <Select
                            v-model="form.grade_id"
                            placeholder="请选择年级"
                            @on-change="handleGradeChange"
                        >
                            <Option
                                v-for="item in gradeList"
                                :key="item.grade_id"
                                :value="item.grade_id"
                            >
                                {{ item.grade_name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item label="班级">
                        <Select
                            v-model="form.class_id"
                            placeholder="请选择班级"
                        >
                            <Option
                                v-for="item in classList"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.class_name }}
                            </Option>
                        </Select>
                    </form-item>
                    <!--                <form-item label="学工号">-->
                    <!--                    <i-input v-model="form.number" />-->
                    <!--                </form-item>-->
                    <form-item label="状态">
                        <pull
                            v-model="form.status"
                            :list="studentStatus"
                            :use-type="false"
                        />
                    </form-item>
                </template>
            </i-form>
            <i-button @click="getStudentList(1)">
                查询
            </i-button>
        </template>
        <reset-password
            ref="reset"
            @on-sure="handleClickSure"
        />
        <add-student
            ref="addStudent"
            @on-success="getStudentList(1)"
        />
        <import-student
            ref="studentImport"
            @on-success="getStudentList(1)"
        />
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import Pull from '@/view/components/pull/index.vue';
import ResetPassword from '@/view/components/reset-password/index.vue';
import AddStudent from './components/add-student.vue';
import ImportStudent from '@/view/components/import/modal-import.vue';
import { studentStatus } from '@/libs/enum';
import api from '@/api/personnel';
import './index.less';

export default {
    name: 'Index',
    components: {
        ResetPassword,
        PageList,
        pull: Pull,
        AddStudent,
        ImportStudent,
    },
    data() {
        return {
            studentStatus,
            btnList: [
                {
                    name: 'edit',
                    // eslint-disable-next-line arrow-body-style
                    show: () => {
                        return this.mode === 'normal';
                    },
                },
                {
                    name: 'password',
                    // eslint-disable-next-line arrow-body-style
                    show: () => {
                        return this.mode === 'normal';
                    },
                },
                {
                    name: 'student_leave',
                    // eslint-disable-next-line arrow-body-style
                    show: () => {
                        return this.mode === 'normal';
                    },
                },
            ],
            mode: 'normal',
            columns: [
                {
                    type: 'selection',
                    align: 'center',
                    width: 60,
                },
                {
                    title: '姓名',
                    key: 'student_name',
                    align: 'center',
                },
                {
                    title: '用户名',
                    key: 'user_account',
                    align: 'center',
                },
                {
                    title: '部门',
                    key: 'class_name',
                    align: 'center',
                },
                {
                    title: '绑定手机号',
                    key: 'mobile',
                    align: 'center',
                },
                // {
                //     title: '学工号',
                //     key: 'number',
                //     align: 'center',
                // },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '260',
                    align: 'center',
                },
            ],
            columnsLeave: [
                {
                    type: 'selection',
                    align: 'center',
                    width: 60,
                },
                {
                    title: '姓名',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '账号',
                    key: 'student_num',
                    align: 'center',
                },
                {
                    title: '绑定手机号',
                    key: 'mobile',
                    align: 'center',
                },
                {
                    title: '状态',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h) => {
                        return h('span', {}, '离校');
                    },
                },
            ],
            form: {
                name: '',
                grade_id: '',
                class_id: '',
                number: '',
                ID_number: '',
                status: '',
                page_size: 10,
                page_num: 1,
            },
            gradeList: [],
            classList: [],
            total: 0,
            list: [],
            selection: '',
        };
    },
    created() {
        this.getStudentList();
        this.getSchoolGrade();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getStudentList(pageNum = 1) {
            this.form.page_num = pageNum;
            this.openMainSpin(true);

            const fn = this.mode === 'normal'
                ? api.getStudentList
                : api.leftStudentList;

            fn(this.form)
                .then(({ data: { list, count } }) => {
                    this.parseData(list);
                    this.total = count;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        parseData(data) {
            const info = data;
            info.forEach((v) => {
                const obj = v;
                obj.class_name = `${v.grade_name}/${v.class_name}`;
                obj.mobile = v.mobile || '暂无';
                obj.status = studentStatus[v.status - 1];
            });
            this.list = info;
        },
        getSchoolGrade() {
            api.getSchoolGrade().then(({ data }) => {
                this.gradeList = data;
            });
        },
        getSchoolClass(data) {
            return api.getSchoolClass(data).then(({ data }) => {
                this.classList = data;
            });
        },
        deleteStudent(id) {
            this.openMainSpin(true);
            api.deleteStudent({ id })
                .then(() => {
                    this.$Message.success('删除学生成功!');
                    this.openMainSpin(false);
                    this.getStudentList();
                })
                .catch(this.openMainSpin(false));
        },
        handleDeleteStucent(id) {
            this.$Modal.confirm({
                title: '删除',
                content: '确认删除当前学生，删除后不可恢复?',
                onOk: () => {
                    this.deleteStudent(id);
                },
            });
        },
        handleGradeChange(value) {
            this.getSchoolClass({ grade_id: value });
        },
        handleAction({ name }, { id, student_name: studentName }) {
            if (name === 'password') {
                this.$refs.reset.handleShow({ name: studentName, id });
            } else if (name === 'delete') {
                this.handleDeleteStucent(id);
            } else if (name === 'student_leave') {
                this.$Modal.confirm({
                    title: '是否将学生设置为毕业或者离校？',
                    content: '注意：将学生设置毕业或离校后将无法再次更改',
                    onOk: () => {
                        // this.deleteStudent(id);
                        api.removeStudent({
                            id,
                        }).then(() => {
                            this.$Message.success('操作成功!');
                            this.getStudentList(this.form.page_num);
                        });
                    },
                });
            } else {
                this.$router.push(`/student/${name}/${id}`);
            }
        },
        handleClickBtn(name) {
            switch (name) {
                case 'studentImport':
                    this.$router.push({
                        name: 'studentImport',
                    });
                    break;
                default:
                    this.$refs[name].handleShow();
            }
        },
        handleClickExport() {
            const {
                name,
                class_id: classId,
                grade_id: grade,
                status,
            } = this.form;
            const url = `/api/student/export?name=${name}&class_id=${classId}&grade_id=${grade}&status=${status}`;
            window.open(url);
        },
        handleClickSure(id) {
            this.$refs.reset.handleHide();
            api.resetStudentPassword({ student_id: id }).then(() => {
                this.$Message.success('重置成功');
            });
        },
        handleSelect(selection) {
            this.selection = selection.map(v => v.id);
        },
        handleClickDelete() {
            if (this.selection.length) {
                api.deleteStudents({ student_ids: this.selection }).then(() => {
                    this.$Message.success('删除成功');
                    this.getStudentList();
                });
            } else {
                this.$Message.info('请选择删除的人');
            }
        },
        reset() {
            this.form = {
                name: '',
                grade_id: '',
                class_id: '',
                number: '',
                ID_number: '',
                status: '',
                page_size: 10,
                page_num: 1,
            };
        },
        switchTab(name) {
            if (name === 0) {
                this.mode = 'normal';
            } else {
                this.mode = 'left';
            }
            this.reset();
            this.getStudentList();
        },
    },
};
</script>

<style scoped></style>
