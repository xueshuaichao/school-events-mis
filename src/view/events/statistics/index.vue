<template>
    <page-list
        class="statistics"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-page-hide="!isSchool"
        @btn-click="handleAction"
        @page-change="getActivityList"
    >
        <template v-if="!isSchool">
            <template slot="page-header">
                <Tabs
                    value="resource_name"
                    class="tabs"
                    @on-click="handleClickTabs"
                >
                    <TabPane
                        label="按活动统计"
                        name="resource_name"
                    />
                    <TabPane
                        label="按学校统计"
                        name="school_id"
                    />
                </Tabs>
                <i-button
                    v-if="params.type === 'resource_name'"
                    @click="handleClickExport"
                >
                    导出
                </i-button>
            </template>
            <template
                v-if="params.type === 'school_id'"
                slot="header-search-bar"
            >
                <i-form :label-width="80">
                    <form-item label="学校名称">
                        <i-input
                            v-model="params.school_name"
                            placeholder="请输入学校名称"
                        />
                    </form-item>
                </i-form>
                <i-button @click="getActivityList(1)">
                    查询
                </i-button>
                <i-button @click="handleClickExport">
                    导出
                </i-button>
            </template>
        </template>
        <template v-else>
            <template slot="header-search-bar">
                <i-button
                    class="mar-b-24"
                    @click="handleClickExport"
                >
                    导出
                </i-button>
            </template>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import api from '@/api/events';
import './index.less';
import { COLUMNS } from './config';

export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            btnList: [
                {
                    name: 'detail',
                },
            ],
            columns: COLUMNS.resource_name,
            total: 0,
            list: [],
            params: {
                page_num: 1,
                page_size: 10,
                school_name: '',
                type: 'resource_name',
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
        this.getActivityList();
        if (this.isSchool) {
            this.columns = this.columns.filter(v => v.key !== 'school_count');
        }
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getActivityList(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api[this.isSchool ? 'getSchoolActivityList' : 'getActivityList'](
                this.params,
            )
                .then(({ data: { list, count } }) => {
                    this.list = list;
                    this.total = count;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleAction({ name }, params) {
            const { school_id: id, name: resource } = params;
            if (name === 'detail') {
                this.$router.push(
                    `/statistics/${id ? resource : 'resource'}/${id
                        || resource}`,
                );
            }
        },
        handleClickTabs(name) {
            this.params.type = name;
            this.columns = COLUMNS[name];
            this.getActivityList();
        },
        handleClickExport() {
            const { type, school_name: name } = this.params;
            let url = '';
            if (this.isSchool) {
                url = '/api/result/exportactivitystatistics';
            } else {
                url = `/api/education/exportactivitystatistics?type=${type}&school_name=${name}`;
            }
            window.open(url);
        },
    },
};
</script>
