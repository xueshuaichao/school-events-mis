<template>
    <page-list
        :columns="columns"
        :data="list"
        :stages="stages"
        :btn-list="btnList"
        :page-params="{ total, page_num: schoolSearch.page_num }"
        @page-change="handleSearch"
        @btn-click="handleBtnClick"
    >
        <template slot="header-btn">
            <Modal
                v-model="modal1"
                title="修改管理员"
                @on-cancel="cancel"
            >
                <i-form
                    ref="formModify"
                    :label-width="110"
                    :model="formModify"
                    :rules="ruleFormModify"
                    label-position="left"
                >
                    <form-item
                        label="选择新的管理员"
                        prop="new_user"
                    >
                        <i-select
                            v-model="formModify.new_user"
                            :style="{ width: '338px' }"
                            placeholder="姓名"
                            class="common-list-name"
                            clearable
                            @on-change="handleSelect"
                        >
                            <i-option
                                v-for="(selectColumn, index) in selectColumns"
                                :key="index"
                                :value="JSON.stringify(selectColumn)"
                            >
                                {{
                                    `${selectColumn.teacher_name} ${selectColumn.phone}`
                                }}
                            </i-option>
                        </i-select>
                        <p class="mention">
                            修改后，原管理员账号不能再登录，新管理账号为：<br>
                            用户名：{{ phone }}<br>
                            密码：123456
                        </p>
                    </form-item>
                </i-form>
                <template slot="footer">
                    <div>
                        <i-button @click="handleCancle">
                            取消
                        </i-button>
                        <i-button
                            type="primary"
                            @click="modifyOk"
                        >
                            确认修改
                        </i-button>
                    </div>
                </template>
            </Modal>
            <Modal
                v-model="modal2"
                title="重置密码"
            >
                <p>
                    管理员用户名：{{ sphone }}<br>
                    新密码为123456，确认后生效
                </p>
                <template slot="footer">
                    <div>
                        <i-button @click="handleCancle2">
                            取消
                        </i-button>
                        <i-button
                            type="primary"
                            @click="passwordOk"
                        >
                            确认
                        </i-button>
                    </div>
                </template>
            </Modal>
            <a
                href="/api/school/exportschool"
                :style="{ width: '90px', height: '37px' }"
            >
                <i-button type="primary">
                    导出
                </i-button>
            </a>
        </template>
        <template slot="header-search-bar">
            <i-form
                ref="schoolSearch"
                :model="schoolSearch"
                :rules="ruleSchoolSearch"
                :label-width="80"
            >
                <form-item
                    label="学校名称"
                    prop="school_name"
                >
                    <i-input v-model="schoolSearch.school_name" />
                </form-item>
            </i-form>
            <i-button @click="handleSearch(1)">
                查询
            </i-button>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '../components/page/list.vue';
import api from '../../api/system';

export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            selectColumns: [],
            formModify: {
                new_user: '',
            },
            stages: [],
            ruleFormModify: {
                new_user: [
                    {
                        required: true,
                        message: '请选择管理员',
                        trigger: 'blur',
                    },
                ],
            },
            schoolSearch: {
                school_name: '',
                page_size: 10,
                page_num: 1,
            },

            ruleSchoolSearch: {},
            btnList: [
                {
                    name: 'modify',
                },
                {
                    name: 'password',
                },
            ],
            modal1: false,
            modal2: false,
            columns: [
                {
                    title: '学校名称',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '所属地区',
                    key: 'details_area',
                    align: 'center',
                },
                {
                    title: '学校类型',
                    key: 'stage',
                    slot: 'stage',
                    align: 'center',
                },
                {
                    title: '学校联系人',
                    key: 'contacts',
                    align: 'center',
                },
                {
                    title: '联系电话',
                    key: 'phone',
                    align: 'center',
                },
                {
                    title: '管理员账户',
                    key: 'phone',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'name',
                    align: 'center',
                    slot: 'action',
                },
            ],
            params: {
                page_size: 10,
                page_num: 1,
            },
            modifyParams: {
                old_user_id: '',
                school_id: '',
            },
            total: 0,
            list: [],
            createdBy: '',
            sphone: '',
            phone: '',
        };
    },
    created() {
        this.handleSearch();
        // 学校类型查询
        this.getStageList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        handleSelect(item) {
            if (item) {
                this.phone = JSON.parse(item).phone;
            }
        },
        getStageList() {
            this.openMainSpin(true);
            api.schoolEduschoolstage()
                .then(({ data: { stage } }) => {
                    this.stages = stage;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleSearch(pageNum = 1) {
            this.openMainSpin(true);
            this.schoolSearch.page_num = pageNum;
            api.schoolEduschoollist(this.schoolSearch)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleBtnClick({ name }, { id, created_by: createdBy, phone }) {
            // 修改
            this.sphone = phone;
            if (name === 'modify') {
                // 查询待选教师数据
                this.modifyParams.school_id = id;
                this.modifyParams.old_user_id = createdBy;

                api.schoolTeachers({
                    school_id: id,
                })
                    .then(({ data: { list } }) => {
                        this.selectColumns = list;
                        this.openMainSpin(false);
                        this.modal1 = true;
                    })
                    .catch(this.openMainSpin(false));
            }
            if (name === 'password') {
                // 重置密码
                this.createdBy = createdBy;
                this.modal2 = true;
            }
        },
        modifyOk() {
            this.$refs.formModify.validate((valid) => {
                if (valid) {
                    this.phone = '';
                    this.openMainSpin(true);
                    api.schoolChangeadmin({
                        ...this.modifyParams,
                        phone: JSON.parse(this.formModify.new_user).phone,
                        new_user_id: JSON.parse(this.formModify.new_user)
                            .user_id,
                    })
                        .then(() => {
                            this.formModify.new_user = '';
                            this.openMainSpin(false);
                            this.modal1 = false;
                            this.handleSearch();
                        })
                        .catch(this.openMainSpin(false));
                }
            });
        },
        // 重置密码
        passwordOk() {
            this.modal2 = false;
            this.openMainSpin(true);
            api.schoolResetpwd({
                created_by: this.createdBy,
            })
                .then(() => {
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleCancle() {
            this.modal1 = false;
            this.formModify.new_user = '';
            this.phone = '';
        },
        handleCancle2() {
            this.modal2 = false;
        },
        cancel() {
            this.formModify.new_user = '';
        },
    },
};
</script>

<style scoped></style>
