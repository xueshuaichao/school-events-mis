<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: form.page_num }"
        :hide-header-btn="false"
        @btn-click="handleAction"
        @page-change="getStudentList"
    >
        <Modal
            v-model="modal2"
            title="重置密码"
            @on-ok="passwordOk"
        >
            <p>
                管理员用户名：{{ phone }}<br>
                新密码为123456，确认后生效
            </p>
        </Modal>
        <template slot="page-header">
            <i-button @click="handleClickBtn('personnelImport')">
                批量导入
            </i-button>
            <i-button @click="handleClickBtn('addPersonnel')">
                单个新增
            </i-button>
            <a
                href="/api/edustaff/stafflistexport"
                :style="{ width: '90px', height: '37px' }"
            >
                <i-button>
                    导出
                </i-button>
            </a>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="姓名">
                    <i-input v-model="form.name" />
                </form-item>
                <form-item label="部门">
                    <department
                        v-model="form.department_id"
                        :select="form.department_id"
                    />
                </form-item>
                <form-item label="手机号">
                    <i-input v-model="form.phone" />
                </form-item>
                <form-item label="状态">
                    <pull
                        v-model="form.status"
                        :list="personStatus"
                    />
                </form-item>
            </i-form>
            <i-button @click="getStudentList(1)">
                查询
            </i-button>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '../../components/page/list.vue';
import Pull from '../../components/pull/index.vue';
import { personStatus } from '@/libs/enum';
import api from '../../../api/personnel';
import Depart from './personIndex.vue';

export default {
    name: 'Index',
    components: {
        PageList,
        pull: Pull,
        department: Depart,
    },
    data() {
        return {
            personStatus,
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
                    key: 'staff_name',
                    align: 'center',
                },
                {
                    title: '部门',
                    key: 'department_name',
                    align: 'center',
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    slot: 'personStatus',
                },
                {
                    title: '手机号',
                    key: 'phone',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                },
            ],
            form: {
                name: '',
                class_id: '',
                number: '',
                ID_number: '',
                status: 1,
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            list: [],
            user_id: '',
            modal2: false,
            phone: '',
        };
    },
    created() {
        this.getStudentList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getStudentList(pageNum = 1) {
            this.form.page_num = pageNum;
            this.openMainSpin(true);
            api.edustaffStafflist(this.form)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleAction({ name }, { id, user_id: userId, phone }) {
            if (name === 'detail') {
                this.$router.push(`/personnel/detail/${id}`);
            }
            if (name === 'edit') {
                this.$router.push(`/personnel/edit/${id}`);
            }
            if (name === 'password') {
                // 重置密码
                this.phone = phone;
                this.modal2 = true;
                this.user_id = userId;
            }
        },
        passwordOk() {
            api.edustaffResetpwd({
                user_id: this.user_id,
            })
                .then(() => {
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleClickBtn(name) {
            this.$router.push({ name });
        },
    },
};
</script>

<style scoped></style>
