<template>
    <page-list
        id="spring-activity"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-header-btn="false"
        :hide-page-hide="false"
        @btn-click="handleAction"
        @page-change="getInformList"
    >
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="名称">
                    <i-input
                        v-model="form.resource_name"
                        placeholder="参赛者姓名或参赛项目名称"
                    />
                </form-item>
                <form-item label="举报分类">
                    <pull
                        v-model="form.cat_id"
                        :list="reportCategoryList"
                        :use-type="false"
                    />
                </form-item>
            </i-form>
            <i-button @click="getInformList(1)">
                查询
            </i-button>
            <i-button @click="resetSearch">
                重置
            </i-button>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import Pull from '@/view/components/pull/index.vue';
import { reportCategoryList, reportContentStatus } from '@/libs/enum';
import api from '@/api/information';
import mixin from '../mixins';

export default {
    name: 'Index',
    components: {
        PageList,
        Pull,
    },
    mixins: [mixin],
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
    data() {
        return {
            btnList: [
                {
                    name: 'detail',
                    show(params) {
                        return params.resource_status === 2;
                    },
                },
                {
                    name: 'review',
                    show(params) {
                        return params.resource_status === 1;
                    },
                },
                {
                    name: 'lowerShelf',
                    show(params) {
                        return params.resource_status === 1; // 1 已上架
                    },
                },
                {
                    name: 'offShelf',
                    show(params) {
                        return params.resource_status === 2; // 已下架
                    },
                },
            ],
            columns: [
                {
                    title: '作品',
                    key: 'resource_name',
                    align: 'center',
                },
                {
                    title: '上传作者',
                    key: 'create_name',
                    align: 'center',
                },
                {
                    title: '上传时间',
                    key: 'created_at',
                    align: 'center',
                },
                {
                    title: '举报分类',
                    key: 'cat_name',
                    align: 'center',
                },
                {
                    title: '举报人',
                    key: 'report_name',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                },
            ],
            reportCategoryList,
            reportContentStatus,
            form: {
                cat_id: '',
                status: '',
                resource_name: '',
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            list: [],
        };
    },
    created() {
        this.getInformList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getInformList(pageNum = 1) {
            this.form.page_num = pageNum;

            this.openMainSpin(true);
            api.getInformList(this.form)
                .then(({ data: { list = [], total = 0 } }) => {
                    this.list = this.parseData(list);
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        updateInformStatus(data) {
            this.openMainSpin(true);
            api.updateInformStatus(data)
                .then(() => {
                    this.$Message.success('操作成功');
                    this.openMainSpin(false);
                    this.getInformList();
                })
                .catch(this.openMainSpin(false));
        },
        parseData(list) {
            return list.map((v) => {
                const info = v;
                info.cat_name = this.getReportCategoryNames(info.cat_id);
                info.status_name = v.status === 2 ? '未处理' : '已处理';
                info.report_name = v.user_name || v.uuid;
                return info;
            });
        },
        resetSearch() {
            this.form = {
                ...this.form,
                cat_id: '',
                status: '',
                resource_name: '',
                page_size: 10,
                page_num: 1,
            };

            this.getInformList();
        },
        handleAction(
            { name },
            {
                id,
                resource_id: resource,
                resource_status: status,
                create_user_id: userId,
            },
        ) {
            switch (name) {
                case 'lowerShelf':
                    this.handleUpdateInformStatus(status, resource);
                    break;
                case 'detail':
                case 'review':
                    this.$router.push(`/report/detail/${id}/${userId}`);
                    break;
                default:
                    break;
            }
        },
        handleUpdateInformStatus(status, id) {
            const text = status === 2 ? '上架' : '下架';
            this.$Modal.confirm({
                title: text,
                content: `确认${text}该内容`,
                onOk: () => {
                    this.updateInformStatus({ resource_id: id });
                },
            });
        },
    },
};
</script>
