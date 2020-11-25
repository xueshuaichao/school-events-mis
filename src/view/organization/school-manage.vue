<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: schoolSearch.page_num }"
        :stages="stages"
        :systems="system"
        :status-type="statusType"
        :btn-detail-verify="btnDetailVerify"
        @page-change="handleSearch"
        @btn-click="handleBtnClick"
    >
        <template slot="header-btn">
            <Modal
                v-model="modal1"
                title="删除提示"
                ok-text="确认删除"
                @on-ok="ok"
            >
                <p class="deleteMessage">
                    删除后数据将无法恢复，是否确认删除
                </p>
            </Modal>
        </template>
        <template slot="header-search-bar">
            <i-form
                ref="schoolSearch"
                :label-width="100"
                :model="schoolSearch"
                :rules="ruleSchoolSearch"
            >
                <form-item
                    label="学校名称"
                    prop="school_name"
                >
                    <i-input v-model="schoolSearch.school_name" />
                </form-item>
                <form-item
                    label="学段"
                    prop="stage"
                >
                    <i-select
                        v-model="schoolSearch.stage"
                        placeholder="学段"
                        clearable
                    >
                        <i-option
                            v-for="stage in stages"
                            :key="stage.id"
                            :value="stage.id"
                        >
                            {{ stage.name }}
                        </i-option>
                    </i-select>
                </form-item>
                <form-item
                    label="状态"
                    prop="status"
                >
                    <i-select
                        v-model="schoolSearch.status"
                        placeholder="状态"
                        clearable
                    >
                        <i-option
                            v-for="selectStatus in selectStatuses"
                            :key="selectStatus.id"
                            :value="selectStatus.id"
                        >
                            {{ selectStatus.name }}
                        </i-option>
                    </i-select>
                </form-item>
                <form-item label="注册时间">
                    <DatePicker
                        type="daterange"
                        split-panels
                        @on-change="handleDateChange"
                    />
                </form-item>
                <form-item
                    label="所属地区"
                    prop="address"
                >
                    <i-address
                        v-model="schoolSearch.address"
                        province-code="610000"
                        @on-change="handleAreaChange"
                    />
                </form-item>
            </i-form>
            <i-button @click="handlExport">
                导出
            </i-button>
            <i-button @click="handleSearch(1)">
                查询
            </i-button>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '../components/page/list.vue';
import api from '../../api/organization';
import Area from '../components/area/index.vue';

export default {
    name: 'SchoolManage',
    components: {
        PageList,
        'i-address': Area,
    },
    data() {
        return {
            stages: [],
            selectStatuses: [],
            schoolSearch: {
                page_size: 10,
                page_num: 1,
                school_name: '',
                city: '',
                county: '',
                stage: '', // 学校类型
                status: '',
                address: [],
            },
            ruleSchoolSearch: {},
            btnList: [
                {
                    name: 'edit',
                },
                {
                    name: 'delete',
                },
                {
                    name: 'detail',
                },
            ],
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
                    key: 'stage', // 需要处理
                    slot: 'stage',
                    align: 'center',
                },
                {
                    title: '学校年制',
                    key: 'system', // system
                    slot: 'system',
                    align: 'center',
                },
                {
                    title: '状态',
                    key: 'status', // status
                    slot: 'status',
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
                    title: '操作',
                    key: 'detailVerify',
                    align: 'center',
                    slot: 'detailVerify',
                },
            ],
            deleteparams: {},
            total: 0,
            list: [],
            system: [],
            statusType: [
                {
                    id: '0',
                    name: '未审核',
                },
                {
                    id: '1',
                    name: '通过',
                },
                {
                    id: '2',
                    name: '未通过',
                },
            ],
            btnDetailVerify: {
                0: [
                    {
                        name: 'detail',
                    },
                    {
                        name: 'verify',
                    },
                    {
                        name: 'delete',
                    },
                ],
                1: [
                    {
                        name: 'detail',
                    },
                    {
                        name: 'delete',
                    },
                ],
                2: [
                    {
                        name: 'detail',
                    },
                    {
                        name: 'delete',
                    },
                ],
            },
            modal1: false,
        };
    },
    computed: {},
    created() {
        this.getStageList();
    },
    mounted() {
        this.handleSearch();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        handleAreaChange([province, city, county]) {
            this.schoolSearch.city = city;
            this.schoolSearch.county = county;
            this.schoolSearch.province = province;
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
        getStageList() {
            this.openMainSpin(true);
            api.schoolEduschoolstage()
                .then(({ data: { stage, audit, system } }) => {
                    audit.forEach((v) => {
                        if (v.id === '1') {
                            // eslint-disable-next-line no-param-reassign
                            v.name = '通过';
                        } else if (v.id === '2') {
                            // eslint-disable-next-line no-param-reassign
                            v.name = '未通过';
                        }
                    });
                    this.selectStatuses = audit;
                    this.stages = stage;
                    this.system = system;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleDateChange([start, end]) {
            this.schoolSearch = {
                ...this.schoolSearch,
                start_date: start,
                end_date: end,
            };
        },
        handlExport() {
            const params = Object.keys(this.schoolSearch).reduce((ac, cu) => {
                if (typeof cu !== 'object' && this.schoolSearch[cu]) {
                    // eslint-disable-next-line no-param-reassign
                    ac += `${cu}=${this.schoolSearch[cu]}&`;
                }
                return ac;
            }, '?');
            window.open(`/api/school/eduschoollist${params}export=1`);
            console.log(params);
        },
        handleBtnClick({ name }, { id }) {
            if (name === 'detail') {
                this.$router.push({
                    name: 'schoolDetail',
                    params: {
                        id,
                    },
                });
            }
            if (name === 'verify') {
                this.$router.push({
                    name: 'schoolVerify',
                    params: {
                        id,
                    },
                });
            }
            if (name === 'delete') {
                this.modal1 = true;
                this.school_id = id;
            }
        },
        ok(
            data = {
                school_id: this.school_id,
            },
        ) {
            api.schoolDetail(data)
                .then(() => {
                    this.modal1 = false;
                    this.handleSearch();
                })
                .catch((this.modal1 = false));
        },
    },
};
</script>

<style scoped></style>
