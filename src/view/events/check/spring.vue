<template>
    <page-list
        id="spring-activity"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: currentPage }"
        :hide-header-btn="false"
        :hide-page-hide="false"
        @btn-click="handleAction"
        @page-change="getActivityList"
        @sort-change="handleSortChange"
    >
        <template slot="header-search-bar">
            <i-button @click="$router.back()">
                返回
            </i-button>
            <i-form :label-width="80">
                <form-item label="名称">
                    <i-input
                        v-model="form.search"
                        placeholder="参赛者姓名或参赛项目名称"
                    />
                </form-item>
                <form-item
                    v-if="
                        resource_name === 'epidemic' || resource_name === 'read'
                    "
                    label="组别"
                >
                    <Select v-model="form.activity_cat">
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in groupList"
                            :key="item.id"
                            :value="item.id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item
                    v-if="
                        resource_name === 'activity' ||
                            resource_name == 'childhood'
                    "
                    label="作品分类"
                >
                    <Select v-model="form.cat_id">
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
                    v-if="resource_name === 'spring'"
                    label="作品分类"
                >
                    <Select v-model="form.cat_id">
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
                <form-item
                    v-if="resource_name === 'epidemic'"
                    label="作品分类"
                >
                    <Select v-model="form.cat_id">
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in epidemicCategory"
                            :key="item.name"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
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
                <form-item label="形式">
                    <pull
                        v-model="form.resource_type"
                        :list="talentResourceType"
                        :use-type="false"
                    />
                </form-item>
                <form-item label="作品等级">
                    <pull
                        v-model="form.grade"
                        :list="worksClass"
                        :use-type="false"
                    />
                </form-item>
            </i-form>
            <i-button @click="getActivityList(1)">
                查询
            </i-button>
            <i-button @click="resetSearch">
                重置
            </i-button>
        </template>
        <examine
            ref="examine"
            @on-end="handleActivityStatus"
        />
    </page-list>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import Pull from '@/view/components/pull/index.vue';
import { activityStatus, talentResourceType, worksClass } from '@/libs/enum';
import api from '@/api/activity';
import Examine from './components/examine/index.vue';
import CONFIG from './config';

const PAGE_CACHE_DATA = new Map();
export default {
    name: 'Index',
    components: {
        PageList,
        Pull,
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
    },
    data() {
        return {
            activityStatus,
            talentResourceType,
            worksClass,
            btnList: [
                {
                    name: 'detail',
                    show(params) {
                        return params.user_status !== 1;
                    },
                },
                {
                    name: 'review',
                    show(params) {
                        return params.user_status === 1;
                    },
                },
                {
                    name: 'lowerShelf',
                    show(params) {
                        return params.user_status === 2;
                    },
                },
            ],
            columns: CONFIG.COLUMNS_MAP.spring_columns,
            category: CONFIG.SPRING_CATEGORY,
            epidemicCategory: CONFIG.EPIDEMIC_CATEGORY,
            groupList: CONFIG.EPIDEMIC_GROUP,
            childhoodCategory: CONFIG.CHILDHOOD_CATEGORY,
            resource_name: 'spring',
            form: {
                activity_id: 3,
                search: '',
                cat_id: '',
                machine_status: '',
                user_status: '',
                sort: '',
                sort_type: '',
                resource_type: '',
                activity_cat: '',
                page_size: 10,
                page_num: 1,
                grade: 0,
            },
            total: 0,
            list: [],
            currentPage: 1,
            matchItems: [],
        };
    },
    watch: {
        $route() {
            this.init(false);
        },
    },
    created() {
        this.init();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        init(flag = true) {
            let { resource_name: name } = this.$route.meta;
            let groupList = CONFIG.EPIDEMIC_GROUP;

            this.resource_name = name;
            this.form.activity_id = name === 'activity'
                ? this.$route.params.id
                : CONFIG.RESOURCE_TYPE[name] - 2;

            if (name === 'read') {
                groupList = CONFIG.READ_GROUP;
            }
            this.groupList = groupList;

            // FIXME: 应该用 keep-alive
            name = name === 'activity' ? `${name}_${this.$route.params.id}` : name;
            if (PAGE_CACHE_DATA.has(name) && flag) {
                const data = PAGE_CACHE_DATA.get(name);
                Object.assign(this, data);

                this.getActivityList(this.currentPage);
                PAGE_CACHE_DATA.delete(name);
            } else {
                this.$nextTick(() => {
                    this.resetSearch();
                });
            }
            this.getCategory();
        },
        getCategory() {
            api.getCategoryall().then(({ data }) => {
                this.matchItems = data[0].child;
            });
        },
        getActivityList(pageNum = 1) {
            const form = JSON.parse(JSON.stringify(this.form));
            const { grade } = form;
            this.currentPage = pageNum;
            form.page_num = pageNum;
            form.grade = Number(grade) || '';
            this.openMainSpin(true);
            api.getActivityList(form)
                .then(({ data: { list, total } }) => {
                    this.list = this.parseData(list);
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        parseData(data) {
            data.forEach((v) => {
                const {
                    resource_type: type,
                    user_status: user,
                    machine_status: machine,
                } = v;
                const info = v;

                info.machine_status_name = activityStatus[machine - 1];
                info.user_status_name = activityStatus[user - 1];
                info.resource_type = type === 1 ? '视频' : '图片';
                info.banner_image = v.img_url;
            });
            return data;
        },
        resetSearch() {
            this.form = {
                ...this.form,
                search: this.$route.params.search,
                cat_id: '',
                machine_status: '',
                user_status: '',
                sort: '',
                sort_type: '',
                activity_cat: '',
                resource_type: '',
                page_size: 10,
                page_num: 1,
                grade: 0,
            };

            this.getActivityList();
        },
        handleSortChange(params) {
            const { key, order } = params;
            this.form.sort = key;
            this.form.sort_type = order;
            this.getActivityList();
        },
        handleAction({ name }, { id }) {
            switch (name) {
                case 'lowerShelf':
                    this.$refs.examine.handleReject(id, { btnText: '下架' });
                    break;
                default:
                    this.handleLeavePage(id);
                    break;
            }
        },
        handleActivityStatus() {
            this.getActivityList();
        },
        handleLeavePage(id) {
            let { resource_name: name } = this;

            if (name === 'activity') {
                name = `${name}_${this.$route.params.id}`;
            }

            PAGE_CACHE_DATA.set(name, this._data);

            this.$router.push({
                name: 'springDetail',
                params: {
                    id,
                },
                query: {
                    name,
                },
            });
        },
    },
};
</script>
