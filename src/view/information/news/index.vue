<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :hide-page-hide="false"
        :hide-footer="true"
        @btn-click="handleBtnClick"
    >
        <template slot="header-btn">
            <pay-button :path="{ name: 'addNews' }">
                添加文章
            </pay-button>
        </template>
        <template slot="header-search-bar">
            <i-form
                ref="form"
                :model="params"
                :label-width="80"
            >
                <form-item
                    label="标题名称"
                    prop="title"
                >
                    <i-input
                        v-model="params.title"
                        clearable
                        @on-change="handleSearchClick"
                    />
                </form-item>
            </i-form>
            <i-button @click="getQuestionList()">
                查询
            </i-button>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import PayButton from '@/view/components/button/index.vue';
import api from '@/api/information';

export default {
    name: 'Index',
    components: {
        PageList,
        PayButton,
    },
    data() {
        return {
            modal1: false,
            params: {
                title: '',
                page_size: 10,
                page_num: 1,
            },
            btnList: [
                {
                    name: 'top',
                    show(data) {
                        return !data.is_top;
                    },
                },
                {
                    name: 'edit',
                },
                {
                    name: 'delete',
                },
            ],
            columns: [
                {
                    title: '问题',
                    key: 'title',
                    align: 'center',
                    slot: 'top',
                },
                {
                    title: '时间',
                    key: 'created_at',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    slot: 'action',
                },
            ],
            total: 0,
            list: [],
        };
    },
    created() {
        this.getQuestionList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getQuestionList() {
            this.openMainSpin(true);
            api.getQuestionList(this.params).then(({ data }) => {
                this.openMainSpin(false);
                this.list = data;
                this.total = data.length;
            });
        },
        deleteQuestion(id) {
            this.openMainSpin(true);
            api.deleteQuestion({
                question_id: id,
            }).then(() => {
                this.openMainSpin(false);
                this.getQuestionList();
                this.$Message.success('删除成功');
            });
        },
        questionTop(id) {
            this.openMainSpin(true);
            api.questionTop({ question_id: id }).then(() => {
                this.openMainSpin(false);
                this.$Message.success('置顶成功');
                this.getQuestionList();
            });
        },
        handleBtnClick({ name }, { id }) {
            switch (name) {
                case 'delete':
                    this.handleDeleteAction(id);
                    break;
                case 'top':
                    this.questionTop(id);
                    break;
                case 'edit':
                    this.$router.push({
                        name: 'addNews',
                        params: { id },
                    });
                    break;
                default:
                    break;
            }
        },
        handleDeleteAction(id) {
            this.$Modal.confirm({
                title: '删除提示',
                content: '<p>删除后数据将无法恢复，是否确认删除？</p>',
                onOk: () => {
                    this.deleteQuestion(id);
                },
            });
        },
        handleSearchClick() {
            if (this.params.title === '') {
                this.getQuestionList();
            }
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
