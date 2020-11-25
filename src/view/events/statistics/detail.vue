<template>
    <page-list
        class="statistics"
        :columns="columns"
        :data="list"
        :page-params="{ total }"
        @page-change="getActivityDetail"
    >
        <template slot="page-tips">
            <h4 class="title">
                {{ title }}
            </h4>
        </template>
        <template slot="page-header">
            <Tabs
                value="athletics"
                class="tabs"
                @on-click="handleClickTabs"
            >
                <TabPane
                    label="竞技类项目"
                    name="athletics"
                />
                <TabPane
                    label="才艺类项目"
                    name="talent"
                />
            </Tabs>
            <i-button @click="handleClickExport">
                导出
            </i-button>
        </template>
        <template
            v-if="!isSchool"
            slot="header-btn"
        >
            <p
                v-if="params.type === 'athletics'"
                class="tips"
            >
                总计:
                <span
                    v-if="isResource"
                >参与学校 {{ info.school_count || 0 }}
                </span>
                <span>作品总量 {{ info.works_count || 0 }} </span>
                <span>省级录 {{ info.province_record || 0 }}</span>
                <span>市记录 {{ info.city_record || 0 }} </span>
                <span>校级录 {{ info.school_record || 0 }}</span>
            </p>
            <p
                v-if="params.type === 'talent'"
                class="tips"
            >
                总计：
                <span
                    v-if="isResource"
                >参与学校 {{ info.school_count || 0 }}
                </span>
                <span>参与人数 {{ info.people_count || 0 }}</span>
                <span>作品总量 {{ info.works_count || 0 }}</span>
                <span>总播放量 {{ info.play_count || 0 }}</span>
                <span>总点赞数 {{ info.praise_count || 0 }}</span>
            </p>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import api from '@/api/events';
import { COLUMNS } from './config';
import './index.less';

export default {
    name: 'Detail',
    components: {
        PageList,
    },
    data() {
        return {
            columns: COLUMNS.athletics,
            total: 0,
            title: '',
            list: [],
            info: {},
            isResource: false,
            params: {
                resource_name: '',
                school_id: '',
                page_num: 1,
                page_size: 10,
                type: 'athletics',
            },
        };
    },
    computed: {
        isSchool() {
            // 学校端
            return this.$store.state.user.userInfo.identity === 3;
        },
    },
    created() {
        const { name, id } = this.$route.params;
        this.isResource = !id;
        this.title = name;
        this.params[this.isResource ? 'resource_name' : 'school_id'] = id || name;
        this.getActivityDetail();
        if (this.isSchool || !this.isResource) {
            this.generateColumns();
        }
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        generateUrl() {
            const { isResource, isSchool } = this;
            let url = '';
            if (isSchool) {
                url = 'getSchoolActivityStatisticsDetail';
            } else {
                url = isResource
                    ? 'getActivityStatisticsDetail'
                    : 'getSchoolStatisticsDetail';
            }
            this.generateUrl = () => url;
            return url;
        },
        generateColumns() {
            this.columns = this.columns.filter(v => v.key !== 'school_count');
        },
        getActivityDetail(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api[this.generateUrl()](this.params)
                .then(({ data: { list, count, total } }) => {
                    this.list = list;
                    this.total = count;
                    this.info = total || {};
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleClickTabs(name) {
            this.params.type = name;
            this.columns = COLUMNS[name];
            if (this.isSchool || !this.isResource) {
                this.generateColumns();
            }
            this.getActivityDetail();
        },
        handleClickExport() {
            let url = '';
            const {
                isResource,
                isSchool,
                params: { resource_name: name, school_id: id, type },
            } = this;
            if (isResource) {
                // 活动详情
                url = `/api/${
                    isSchool ? 'result' : 'education'
                }/exportactivitystatisticsdetail?resource_name=${name}&type=${type}`;
            } else {
                url = `/api/education/exportschoolstatisticsdetail?school_id=${id}&type=${type}`;
            }
            window.open(url);
        },
    },
};
</script>
