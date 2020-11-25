<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: currentPage }"
        :hide-header-btn="false"
        @btn-click="handleAction"
        @page-change="getResourceList"
        @page-size-change="onPageSizeChange"
    >
        <template slot="page-header">
            <i-button
                v-if="type === 'trash'"
                @click="goToNormal"
            >
                返回
            </i-button>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <!--   竞技和吉尼斯   -->
                <template v-if="resource_type === 1 || resource_type === 4">
                    <form-item label="分类">
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
                        v-if="resource_type !== 4"
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
                    <form-item
                        v-if="resource_type !== 4"
                        label="子项目"
                    >
                        <Select v-model="form.three_cat_id">
                            <Option
                                :key="0"
                                :value="0"
                            >
                                全部
                            </Option>
                            <Option
                                v-for="item in matchItemsTwoChild"
                                :key="item.cat_id"
                                :value="item.cat_id"
                            >
                                {{ item.name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item
                        v-if="userRole === 'edu_pro_admin'"
                        label="学校名称"
                    >
                        <Input
                            v-model="form.school_name"
                            type="text"
                            placeholder="请输入学校名称"
                        />
                    </form-item>
                    <form-item label="参赛者">
                        <Input
                            v-model="form.create_name"
                            type="text"
                            placeholder="请输入参赛者姓名"
                        />
                    </form-item>

                    <form-item label="学段">
                        <pull
                            v-model="form.education_level"
                            :list="learnSection"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="年级">
                        <Select
                            v-model="form.grade_id"
                            placeholder="请选择年级"
                        >
                            <Option
                                :key="0"
                                :value="0"
                            >
                                全部
                            </Option>
                            <Option
                                v-for="item in gradeList"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.grade_name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item label="作品等级">
                        <pull
                            v-model="form.grade"
                            :list="worksClass"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="作品排序">
                        <pull
                            v-model="form.is_home"
                            :list="worksSort"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="上报时间">
                        <DatePicker
                            type="daterange"
                            :value="form.dateDuration"
                            split-panels
                            placeholder="选择时间"
                            style="width: 240px"
                            @on-change="onDateChange"
                        />
                    </form-item>
                    <form-item label="初审状态">
                        <pull
                            v-model="form.machine_status"
                            :list="activityStatus"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="复审状态">
                        <pull
                            v-model="form.user_status"
                            :list="activityStatus"
                            :use-type="false"
                        />
                    </form-item>
                </template>
                <!--   才艺秀  -->
                <template v-if="resource_type === 2">
                    <form-item label="作品分类">
                        <Select v-model="form.one_cat_id">
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
                    <form-item label="形式">
                        <pull
                            v-model="form.resource_type"
                            :list="talentResourceType"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="学段">
                        <pull
                            v-model="form.education_level"
                            :list="learnSection"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="年级">
                        <Select
                            v-model="form.grade_id"
                            placeholder="请选择年级"
                        >
                            <Option
                                :key="0"
                                :value="0"
                            >
                                全部
                            </Option>
                            <Option
                                v-for="item in gradeList"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.grade_name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item label="作品等级">
                        <pull
                            v-model="form.grade"
                            :list="worksClass"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="作品排序">
                        <pull
                            v-model="form.is_home"
                            :list="worksSort"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item
                        v-if="userRole === 'edu_pro_admin'"
                        label="学校名称"
                    >
                        <Input
                            v-model="form.school_name"
                            type="text"
                            placeholder="请输入学校名称"
                        />
                    </form-item>
                    <form-item label="作品名称">
                        <Input
                            v-model="form.name"
                            type="text"
                            placeholder="请输入作品名称"
                        />
                    </form-item>
                    <form-item label="参赛者">
                        <Input
                            v-model="form.create_name"
                            type="text"
                            placeholder="请输入参赛者姓名"
                        />
                    </form-item>
                    <form-item label="上报时间">
                        <DatePicker
                            type="daterange"
                            :value="form.dateDuration"
                            split-panels
                            placeholder="选择时间"
                            style="width: 240px"
                            @on-change="onDateChange"
                        />
                    </form-item>
                    <form-item label="初审状态">
                        <pull
                            v-model="form.machine_status"
                            :list="activityStatus"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="复审状态">
                        <pull
                            v-model="form.user_status"
                            :list="activityStatus"
                            :use-type="false"
                        />
                    </form-item>
                </template>
                <!--   教育抖音  -->
                <template v-if="resource_type === 3">
                    <form-item label="分类">
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
                </template>
            </i-form>
            <i-button @click="getResourceList(1)">
                查询
            </i-button>
            <i-button @click="handleReset">
                重置
            </i-button>
        </template>
        <template slot="footer-panel-right">
            <router-link
                v-if="
                    type !== 'trash' &&
                        [1, 4].includes(resource_type) &&
                        userRole !== 'edu_pro_admin'
                "
                :to="`/check/${resource_name}?type=trash`"
                @click.native="scrollToTop"
            >
                <Icon
                    type="ios-trash"
                    style="font-size: 24px"
                />
                视频回收站
            </router-link>
        </template>
        <examine
            ref="examine"
            @on-end="getResourceList(1)"
        />
    </page-list>
</template>
<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import api from '@/api/events';
import PageList from '@/view/components/page/list.vue';
import Pull from '@/view/components/pull/index.vue';
import {
    learnSection,
    talentResourceType,
    worksClass,
    worksSort,
    activityStatus,
} from '@/libs/enum';
import { formateSeconds } from '@/libs/utils';
import Examine from './components/examine/index.vue';
import CONFIG from './config';

const PAGE_CACHE_DATA = new Map();

export default {
    name: 'ResourceList',
    components: {
        PageList,
        pull: Pull,
        Examine,
    },
    props: {
        currentIndex: {
            type: Number,
            default: 0,
        },
        defaultTab: {
            type: String,
            default: '',
        },
    },
    computed: {
        ...mapGetters(['resourceInfo']),
        ...mapState({
            userRole: state => state.user.userRole,
        }),
    },
    data() {
        return {
            learnSection,
            talentResourceType,
            worksClass,
            worksSort,
            activityStatus,
            btnList: [
                {
                    name: 'detail',
                    // eslint-disable-next-line arrow-body-style
                    show: (params) => {
                        if ([1, 4].includes(params.router_resource_type)) {
                            if (this.userRole === 'edu_pro_admin') {
                                return false;
                            }
                            return params.machine_status !== 1;
                        }
                        return params.status !== 0;
                    },
                },
                {
                    name: 'check',
                    show: (params) => {
                        if ([1, 4].includes(params.router_resource_type)) {
                            if (this.userRole === 'edu_pro_admin') {
                                return params.status === 0;
                            }
                            return params.machine_status === 1;
                        }
                        if (params.router_resource_type === 2) {
                            if (this.userRole === 'school_admin') {
                                return false;
                            }
                        }
                        return params.status === 0;
                    },
                },
                {
                    name: 'reCheck',
                    // eslint-disable-next-line arrow-body-style
                    // eslint-disable-next-line consistent-return
                    show: (params) => {
                        if ([1, 4].includes(params.router_resource_type)) {
                            if (this.userRole === 'edu_pro_admin') {
                                return params.status !== 0;
                            }
                        }
                    },
                },
                {
                    name: 'lowerShelf',
                    show(item) {
                        return (
                            item.status === 1
                            && [1, 4].indexOf(item.router_resource_type) === -1
                        );
                    },
                },
                {
                    name: 'delete',
                    // eslint-disable-next-line arrow-body-style
                    show: (item) => {
                        return (
                            this.userRole === 'school_admin'
                            && [1, 4].includes(item.router_resource_type)
                            && item.delete_status === 0
                        );
                    },
                },
                {
                    name: 'recover',
                    show(item) {
                        return (
                            this.userRole === 'school_admin'
                            && [1, 4].includes(item.router_resource_type)
                            && item.delete_status === 1
                        );
                    },
                },
            ],
            currentTab: -1,
            resource_type: 1,
            columns: [],
            gradeList: [],
            category: [],
            matchItems: [],
            matchItemsOneChild: [],
            matchItemsTwoChild: [],
            form: {
                // one_cat_id: 0,
                // two_cat_id: 0,
                // three_cat_id: 0,
                // grade_id: 0,
                // machine_status: '',
                // user_status: '',
                // level_cat_id: '',
                // parent_scope: 1,
                // resource_scope: '',
                // education_level: '',
                page_size: 10,
                // page_num: 1,
                // resource_type: '',
                // grade: '0',
                // is_home: '0',
                // delete_status: this.$route.query.type === 'trash' ? 1 : 0,
            },
            total: 0,
            list: [],
            currentPage: 1,
            type: this.$route.query.type,
        };
    },
    watch: {
        $route() {
            this.init(false);
        },
    },
    created() {
        this.form.school_id = this.$store.state.user.userInfo.school_id || '';
        this.init();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        init(flag = true) {
            const {
                meta: { resource_name: name },
                query: { status: status = '-1' },
            } = this.$route;
            const type = CONFIG.RESOURCE_TYPE[name];
            console.log(name, type);

            this.resetSearch();
            this.currentTab = status;
            this.resource_name = name;

            // FIXME: 应该用 keep-alive
            if (PAGE_CACHE_DATA.has(name) && flag) {
                const data = PAGE_CACHE_DATA.get(name);
                Object.assign(this, data);
                this.getResourceList(this.currentPage);
                PAGE_CACHE_DATA.delete(name);
            } else {
                this.resource_type = type;
                this.form.status = status >= 0 ? status : '';
                this.form.delete_status = this.$route.query.type === 'trash' ? 1 : 0;
                this.form.parent_scope = type;
                this.form.resource_scope = name === 'talent' ? 3 : '';
                this.columns = this.generateColumns();
                this.getCategory();
                this.getResourceList();
                this.getSchoolGrade();
            }
            this.type = this.$route.query.type;
        },
        generateColumns() {
            const { COLUMNS_MAP } = CONFIG;
            let columns = COLUMNS_MAP[`${this.resource_name}_columns`];

            function genRenderFn(statusKey = 'status', reasonKey = 'memo') {
                return function x(h, params) {
                    let status = params.row[statusKey];
                    if (statusKey === 'machine_status') {
                        status -= 1;
                    }
                    let text;
                    let info;

                    if (status === 0) {
                        text = h('span', '待审核');
                    } else if (status === 1) {
                        text = h('span', '已通过');
                    } else if (status === 2) {
                        text = h('span', '未通过');
                        info = h(
                            'Tooltip',
                            {
                                props: {
                                    content: params.row[reasonKey],
                                    placement: 'top',
                                    style: {
                                        whiteSpace: 'normal',
                                    },
                                },
                            },
                            [
                                h('Icon', {
                                    props: {
                                        type: 'md-help-circle',
                                    },
                                    style: {
                                        'font-size': '20px',
                                        position: 'relative',
                                        top: '-2px',
                                        marginLeft: '5px',
                                    },
                                }),
                            ],
                        );
                    }
                    return [text, info];
                };
            }
            const renderFn1 = genRenderFn('machine_status', 'machine_reason');
            const renderFn2 = genRenderFn();

            if (!columns) {
                columns = COLUMNS_MAP.default_columns;
            }
            if ([1, 4].includes(this.resource_type)) {
                columns = JSON.parse(JSON.stringify(columns));
                if (this.userRole === 'edu_pro_admin') {
                    columns.splice(9, 1);
                    columns[8].render = renderFn1;
                    columns[9].render = renderFn2;
                }
                if (this.userRole === 'school_admin') {
                    columns.splice(9, 1);
                    columns[8].title = '审核状态';
                    columns[9].title = '平台审核意见';
                    columns[8].render = renderFn1;
                    columns[9].render = renderFn2;
                }
            }
            if (this.resource_type === 2) {
                columns = JSON.parse(JSON.stringify(columns));
                if (this.userRole === 'edu_pro_admin') {
                    columns[7].render = renderFn1;
                    columns[8].render = renderFn2;
                }
                if (this.userRole === 'school_admin') {
                    columns[7].title = '审核状态';
                    columns[8].title = '平台审核意见';
                    columns[7].render = renderFn1;
                    columns[8].render = renderFn2;
                }
            }
            return columns;
        },
        getResourceList(pageNum = 1) {
            const form = this.handleSearchParams(pageNum);
            this.currentPage = pageNum;
            this.openMainSpin(true);
            api.educationResourcelist(form)
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
                    resource_type: type,
                    status: user,
                    machine_status: machine,
                    machine_reason: reason,
                } = v;
                const info = v;
                info.education_level = learnSection[level - 1];

                if (type) {
                    info.resource_type = type === 1 ? '视频' : '图片';
                }
                info.router_resource_type = this.resource_type;

                if (unit === '秒' || !unit) {
                    info.achievement = formateSeconds(achievement, true);
                } else {
                    info.achievement = achievement + unit;
                }
                info.machine_status_name = activityStatus[machine - 1];
                info.user_status_name = activityStatus[user];
                info.machine_reason = reason || '--';
                info.banner_image = v.video_img_url;
            });
            return data;
        },
        getCategory() {
            api.getCategoryall().then(({ data }) => {
                const { resource_name: name } = this;
                const map = {
                    talent: 0,
                    education: 1,
                    sports: 2,
                    guinness: 3,
                };
                console.log(data);
                this.matchItems = data[map[name]].child;
                api.getCategoryall = () => Promise.resolve({ data });
            });
        },
        getSchoolGrade() {
            api.getschoolGradeall().then(({ data }) => {
                this.gradeList = data;
                api.getschoolGradeall = () => Promise.resolve({ data });
            });
        },
        resetSearch() {
            this.form = {
                ...this.form,
                one_cat_id: 0,
                two_cat_id: 0,
                three_cat_id: 0,
                grade_id: 0,
                level_cat_id: '',
                machine_status: '',
                user_status: '',
                education_level: '',
                // page_size: 10,
                page_num: 1,
                resource_type: '',
                is_home: '0',
                grade: '0',
                start_time: '',
                end_time: '',
                school_name: '',
                dateDuration: [],
                create_name: '',
                name: '',
            };
        },
        handleSearchParams(pageNum) {
            const form = JSON.parse(JSON.stringify(this.form));
            const level = {};
            const {
                one_cat_id: one,
                two_cat_id: two,
                three_cat_id: three,
                grade_id: id,
                grade,
                is_home: home,
                user_status: status,
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
            form.is_home = Number(home) || '';
            form.grade = Number(grade) || '';
            form.status = status - 1;
            return form;
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
        handleAction({ name }, { id }) {
            switch (name) {
                case 'detail':
                    this.$router.push({
                        name: 'checkDetail',
                        params: {
                            id,
                            index: this.resource_type,
                        },
                    });
                    break;
                case 'check':
                case 'reCheck':
                    this.$router.push({
                        name: 'checkEvent',
                        params: {
                            id,
                            index: this.resource_type,
                        },
                    });
                    break;
                case 'lowerShelf':
                    this.$refs.examine.handleRejectResource(id, 'resource');
                    break;
                case 'delete':
                    this.$Modal.confirm({
                        title: '确定删除',
                        content: '删除后可在回收站中进行恢复',
                        onOk: () => {
                            api.deleteResource(id).then(() => {
                                this.$Message.success('操作成功');
                                this.getResourceList(this.currentPage);
                            });
                        },
                    });
                    break;
                case 'recover':
                    this.$Modal.confirm({
                        title: '确定恢复',
                        // content: '删除后可在回收站中进行恢复',
                        onOk: () => {
                            api.recoverResource(id).then(() => {
                                this.$Message.success('操作成功');
                                this.getResourceList(this.currentPage);
                            });
                        },
                    });
                    break;
                default:
                    break;
            }
            PAGE_CACHE_DATA.set(this.resource_name, this._data);
        },
        handleClickTabs(v) {
            this.$router.push({ name: this.$route.name, query: { status: v } });
        },
        handleReset() {
            this.resetSearch();
            this.getResourceList(1);
        },
        goToNormal() {
            this.$router.replace({
                path: `/check/${this.resource_name}`,
            });
        },
        onDateChange(vals) {
            [this.form.start_time, this.form.end_time] = vals;
        },
        scrollToTop() {
            document.querySelector('#xmis-content').scrollTop = 0;
        },
        onPageSizeChange(data) {
            this.form.page_size = data;
            this.getResourceList();
        },
    },
};
</script>

<style scoped></style>

<style>
.ivu-tooltip-inner {
    white-space: normal;
}
</style>
