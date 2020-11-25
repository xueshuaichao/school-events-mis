<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: formArticle.page_num }"
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
            <pay-button :path="{ name: 'addArticle' }">
                添加文章
            </pay-button>
        </template>
        <template slot="header-search-bar">
            <i-form
                ref="formArticle"
                :model="formArticle"
                :label-width="80"
            >
                <form-item
                    label="标题名称"
                    prop="title"
                >
                    <i-input v-model="formArticle.title" />
                </form-item>
                <form-item
                    label="栏目"
                    prop="column"
                >
                    <i-select
                        v-model="formArticle.column"
                        placeholder="栏目"
                        class="common-list-name"
                        clearable
                    >
                        <i-option
                            v-for="selectColumn in selectColumns"
                            :key="selectColumn.id"
                            :value="selectColumn.id"
                        >
                            {{ selectColumn.column_name }}
                        </i-option>
                    </i-select>
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
import PayButton from '../components/button/index.vue';
import api from '../../api/information';

export default {
    name: 'Index',
    components: {
        PageList,
        PayButton,
    },
    data() {
        return {
            modal1: false,
            formArticle: {
                title: '',
                column: '0',
                page_size: 10,
                page_num: 1,
            },
            selectColumns: [
                {
                    id: '0',
                    column_name: '全部',
                },
                // {
                //     id: '1',
                //     column_name: '大赛动态',
                // },
                // {
                //     id: '2',
                //     column_name: '新闻资讯',
                // },
                {
                    id: '3',
                    column_name: '最新公告',
                },
                {
                    id: '4',
                    column_name: '今日推送',
                },
                {
                    id: '7',
                    column_name: '今日教育',
                },
            ],
            btnList: [
                {
                    name: 'edit',
                },
                {
                    name: 'top',
                    show(params) {
                        // 1 已置顶 0 未置顶
                        return params.top === 0;
                    },
                },
                {
                    name: 'unTop',
                    show(params) {
                        return params.top === 1;
                    },
                },
                {
                    name: 'delete',
                },
                {
                    name: 'hot',
                    show(params) {
                        return !params.hot;
                    },
                },
                {
                    name: 'unHot',
                    show(params) {
                        return params.hot === 1;
                    },
                },
            ],
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '标题名称',
                    key: 'title',
                    slot: 'popularArticles',
                    align: 'center',
                },
                {
                    title: '文章标签',
                    key: 'mark',
                    align: 'center',
                },
                {
                    title: '栏目',
                    key: 'column_name',
                    align: 'center',
                },
                {
                    title: '发布者',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '点赞量',
                    key: 'click_num',
                    align: 'center',
                },
                {
                    title: '点击数',
                    key: 'play_count',
                    align: 'center',
                },
                {
                    title: '发布时间',
                    key: 'publish_at',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: '290',
                    slot: 'action',
                },
            ],
            deleteparams: {},
            total: 0,
            list: [],
        };
    },
    created() {
        this.handleSearch();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        updateArticleStatus(data) {
            this.openMainSpin(true);
            api[
                'top' in data
                    ? 'updateArticleTopStatus'
                    : 'updateArticleHotStatus'
            ](data)
                .then(() => {
                    this.openMainSpin(false);
                    this.handleSearch();
                })
                .catch(this.openMainSpin(false));
        },
        handleSearch(pageNum = 1) {
            this.openMainSpin(true);
            this.formArticle.page_num = pageNum;
            const data = JSON.parse(JSON.stringify(this.formArticle));
            if (data.column === '0') {
                data.column = '';
            }

            api.getList(data)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleBtnClick({ name }, { id, hot, top }) {
            if (name === 'delete') {
                this.modal1 = true;
                this.deleteparams.id = id;
            }
            if (name === 'edit') {
                this.$router.push({
                    name: 'editArticle',
                    params: { id },
                });
            }
            if (name === 'top' || name === 'unTop') {
                this.handleConfirm(name, { id, top: 1 - top });
            }
            if (name === 'hot' || name === 'unHot') {
                this.handleConfirm(name, { id, hot: 1 - hot });
            }
        },
        ok() {
            this.openMainSpin(true);
            api.articleDelete(this.deleteparams)
                .then(() => {
                    this.openMainSpin(false);
                    this.handleSearch();
                })
                .catch(this.openMainSpin(false));
        },
        handleConfirm(type, data) {
            this.$Modal.confirm({
                title: '提示',
                content: `确认${this.$t(`button.${type}`)}该文章?`,
                onOk: () => {
                    this.updateArticleStatus(data);
                },
            });
        },
    },
};
</script>

<style scoped>
.deleteMessage {
    font-weight: bold;
    line-height: 24px;
}
</style>
