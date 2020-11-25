<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-header-btn="false"
        @btn-click="handleAction"
        @page-change="getTeacherList"
    >
        <template slot="page-header">
            <i-button @click="handleClickBtn('teacherImport')">
                批量导入
            </i-button>
            <i-button @click="handleClickBtn('addTeacher')">
                单个新增
            </i-button>
            <i-button @click="handleClickExport">
                导出
            </i-button>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="姓名">
                    <i-input v-model="form.name" />
                </form-item>
                <!--                <form-item label="部门">-->
                <!--                    <department v-model="form.department_id" />-->
                <!--                </form-item>-->
                <form-item label="手机号">
                    <i-input v-model="form.phone" />
                </form-item>
                <form-item label="状态">
                    <pull
                        v-model="form.status"
                        :list="teacherStatus"
                        :use-type="false"
                    />
                </form-item>
            </i-form>
            <i-button @click="getTeacherList(1)">
                查询
            </i-button>
        </template>
        <reset-password
            ref="reset"
            @on-sure="handleClickSure"
        />
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import Pull from '@/view/components/pull/index.vue';
// import Depart from '@/view/components/department/index.vue';
import ResetPassword from '@/view/components/reset-password/index.vue';
import { teacherStatus } from '@/libs/enum';
import api from '@/api/personnel';

export default {
    name: 'Index',
    components: {
        ResetPassword,
        PageList,
        pull: Pull,
        //  department: Depart,
    },
    data() {
        return {
            teacherStatus,
            btnList: [
                {
                    name: 'edit',
                },
                {
                    name: 'password',
                },
                {
                    name: 'detail',
                },
            ],
            columns: [
                {
                    title: '姓名',
                    key: 'teacher_name',
                    align: 'center',
                },
                // {
                //     title: '部门',
                //     key: 'department_name',
                //     align: 'center',
                // },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                },
                {
                    title: '权限类型',
                    key: 'users',
                    align: 'center',
                },
                {
                    title: '手机号',
                    key: 'phone',
                    align: 'center',
                },
                {
                    title: '操作',
                    width: '200',
                    slot: 'action',
                    align: 'center',
                },
            ],
            form: {
                name: '',
                department_id: '',
                phone: '',
                number: '',
                ID_number: '',
                status: '',
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            list: [],
        };
    },
    created() {
        this.getTeacherList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getTeacherList(pageNum = 1) {
            this.form.page_num = pageNum;
            this.openMainSpin(true);
            api.getTeacherList(this.form)
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
                obj.status = teacherStatus[v.status - 1];
                obj.users = '教师';
            });
            this.list = info;
        },
        handleAction({ name }, { id, teacher_name: teacherName }) {
            if (name === 'password') {
                this.$refs.reset.handleShow({ name: teacherName, id });
            } else {
                this.$router.push(`/teacher/${name}/${id}`);
            }
        },
        handleClickBtn(name) {
            this.$router.push({ name });
        },
        handleClickExport() {
            window.open('/api/teacher/export');
        },
        handleClickSure(id) {
            this.$refs.reset.handleHide();
            api.resetTeacherPassword({ teacher_id: id }).then(() => {
                this.$Message.success('重置成功');
            });
        },
    },
};
</script>

<style scoped></style>
