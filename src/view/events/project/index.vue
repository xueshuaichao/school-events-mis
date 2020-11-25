<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-header-btn="false"
        @btn-click="handleAction"
        @page-change="getResourceList"
    >
        <template slot="page-header">
            <Tabs
                value="province"
                @on-click="handleClickTabs"
            >
                <TabPane
                    label="省记录"
                    name="province"
                />
                <TabPane
                    label="市记录"
                    name="city"
                />
                <TabPane
                    label="校记录"
                    name="school"
                />
            </Tabs>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <!-- <form-item
                    v-if="isSchool"
                    label="活动名称"
                >
                    <Select
                        v-model="form.resource_name"
                        placeholder="请选择活动名称"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in resourceNameList"
                            :key="item.resource_name"
                            :value="item.resource_name"
                        >
                            {{ item.resource_name }}
                        </Option>
                    </Select>
                </form-item> -->
                <form-item label="项目范围">
                    <Select
                        v-model="form.resource_scope"
                        :placeholder="'请选择项目范围'"
                        @on-change="handleResourceScopeChange"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in category"
                            :key="item.cat_id"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item :label="form.resource_scope !== 6 ? '分类' : '项目'">
                    <Select
                        v-model="form.one_cat_id"
                        @on-change="handleProjectTypeChange"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in matchItems"
                            :key="item.cat_id"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item
                    v-if="form.resource_scope !== 6"
                    label="项目"
                >
                    <Select
                        v-model="form.two_cat_id"
                        @on-change="handleMatchItemsChange"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in matchItemsOneChild"
                            :key="item.cat_id"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item label="组别">
                    <Select v-model="form.group_type">
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in groupMenu"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
            </i-form>
            <i-button @click="getResourceList(1)">
                查询
            </i-button>
        </template>
        <certificate ref="certificate" />
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
// import Pull from '@/view/components/pull/index.vue';
import { learnSection, resourceList } from '@/libs/enum';
import api from '@/api/events';
import { formateSeconds } from '@/libs/utils';
import Certificate from './certificate.vue';
import './index.less';

export default {
    name: 'Index',
    components: {
        PageList,
        // pull: Pull,
        Certificate,
    },
    data() {
        return {
            learnSection,
            resourceList,
            btnList: [
                {
                    name: 'detail',
                },
                {
                    name: 'certificate',
                },
            ],
            columns: [
                {
                    title: '参赛项目',
                    key: 'category_name',
                },
                {
                    title: '记录保持者',
                    key: 'create_name',
                    align: 'center',
                },
                {
                    title: '成绩/单位',
                    key: 'achievement',
                    align: 'center',
                },
                {
                    title: '组别',
                    key: 'group_type',
                    align: 'center',
                    render: (h, params) => {
                        const groupType = Number(params.row.group_type);
                        const menu = this.groupMenu.find(
                            e => e.value === groupType,
                        );
                        return h('span', menu.name);
                    },
                },
                {
                    title: '年级',
                    key: 'grade_name',
                    align: 'center',
                },
                {
                    title: '学校',
                    key: 'school_name',
                    align: 'center',
                },
                {
                    title: '上报时间',
                    key: 'created_at',
                    align: 'center',
                },
                {
                    title: '审核时间',
                    key: 'audit_time',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '200',
                    align: 'center',
                },
            ],
            resourceNameList: [],
            gradeList: [],
            category: [],
            matchItems: [],
            matchItemsOneChild: [],
            matchItemsTwoChild: [],
            groupMenu: [
                {
                    name: '1-3年级',
                    value: 1,
                },
                {
                    name: '4-6年级',
                    value: 2,
                },
                {
                    name: '7-9年级',
                    value: 3,
                },
                {
                    name: '高一-高三',
                    value: 4,
                },
            ],
            form: {
                status: 1,
                resource_name: '',
                one_cat_id: 0,
                two_cat_id: 0,
                three_cat_id: 0,
                grade_id: 0,
                level_cat_id: '',
                resource_scope: 0,
                education_level: '',
                page_size: 10,
                page_num: 1,
                group_type: 0,
            },
            currentTabName: 'province',
            total: 0,
            list: [],
        };
    },
    computed: {
        isSchool() {
            // 学校端
            return this.$store.state.user.userInfo.identity === 3;
        },
    },
    created() {
        this.getCategory();
        this.getResourceList();
        this.getSchoolGrade();
        this.getResourceNameList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getResourceList(pageNum = 1) {
            const form = this.handleSearchParams(pageNum);
            this.openMainSpin(true);
            api[
                this.isSchool
                    ? 'getSchoolResourceList'
                    : 'educationResourcelist'
            ](form)
                .then(({ data: { list, count } }) => {
                    this.list = this.parseData(list);
                    this.total = count;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        parseData(data) {
            data.forEach((v) => {
                const {
                    education_level: level,
                    achievement,
                    achievement_unit: unit,
                    audit_time: audit,
                } = v;
                const info = v;

                info.education_level = learnSection[level - 1];
                if (unit === '秒' || !unit) {
                    info.achievement = formateSeconds(achievement, true);
                } else {
                    info.achievement = achievement + unit;
                }
                info.audit_time = audit || '尚未审核';
            });
            return data;
        },
        getCategory() {
            api.getCategory().then(({ data }) => {
                data.forEach((v, i) => {
                    // eslint-disable-next-line no-param-reassign
                    v.cat_id = i < 2 ? i + 1 : 6;
                });
                this.category = data;
            });
        },
        getResourceNameList() {
            api.getResourceNameList().then(({ data }) => {
                this.resourceNameList = data;
            });
        },
        getSchoolGrade() {
            api[this.isSchool ? 'getSchoolGrade' : 'getschoolGradeall']().then(
                ({ data }) => {
                    this.gradeList = data;
                },
            );
        },
        handleSearchParams(pageNum) {
            const form = JSON.parse(JSON.stringify(this.form));
            const level = {};
            const {
                resource_name: name,
                resource_scope: scope,
                one_cat_id: one,
                two_cat_id: two,
                three_cat_id: three,
                grade_id: id,
            } = form;
            const keys = ['one', 'two', 'three'];
            form.page_num = pageNum;
            [one, two, three].forEach((v, i) => {
                if (v) {
                    level[`${keys[i]}_level_id`] = v;
                }
            });
            form.level_cat_id = level;
            form.grade_id = id || '';
            form.resource_scope = scope || '';
            form.resource_name = name || '';
            form[`${this.currentTabName}_record`] = 1;
            return form;
        },
        handleResourceScopeChange(value) {
            const { category } = this;
            if (value) {
                this.matchItems = category.filter(
                    v => v.cat_id === value,
                )[0].child;
            }
        },
        handleProjectTypeChange(value) {
            const { matchItems } = this;
            let child;
            if (value) {
                child = matchItems.filter(v => v.cat_id === value);
                this.matchItemsOneChild = child[0].child || [];
            } else {
                this.matchItemsOneChild = [];
            }
        },
        handleMatchItemsChange(value) {
            const { matchItemsOneChild } = this;
            let child;
            if (value) {
                child = matchItemsOneChild.filter(v => v.cat_id === value);
                this.matchItemsTwoChild = child[0].child || [];
            } else {
                this.matchItemsTwoChild = [];
            }
        },
        handleAction({ name }, params) {
            switch (name) {
                case 'detail':
                    this.handleClickDetail(params);
                    break;
                case 'certificate':
                    this.handleShow(params);
                    break;
                default:
                    break;
            }
        },
        handleClickTabs(name) {
            this.currentTabName = name;
            this.form = {
                status: 1,
                resource_name: 0,
                one_cat_id: 0,
                two_cat_id: 0,
                three_cat_id: 0,
                group_tyoe: 0,
                level_cat_id: '',
                resource_scope: 0,
                education_level: '',
                page_size: 10,
                page_num: 1,
            };
            this.getResourceList(1);
        },
        handleClickDetail({ id }) {
            this.$router.push(`/events/detail/${id}`);
        },
        handleShow({ id }) {
            api[this.isSchool ? 'getSchoolCertificate' : 'getCertificate']({
                resource_id: id,
            }).then(({ data }) => {
                this.$refs.certificate.handleShow(data);
            });
        },
    },
};
</script>
