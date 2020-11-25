<template>
    <page-list
        id="spring-activity"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: form.page_num }"
        :hide-page-hide="false"
        @btn-click="handleAction"
        @page-change="getSearchLabelList"
    >
        <template slot="header-btn">
            <i-button
                type="primary"
                @click="$refs.add.handleShow()"
            >
                新增
            </i-button>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="100">
                <form-item label="推荐词名称">
                    <i-input
                        v-model="form.rec_word"
                        placeholder="关键字"
                        clearable
                    />
                </form-item>
                <form-item label="显示设置">
                    <pull
                        v-model="form.show_type"
                        :list="custonmersList"
                        :use-type="false"
                    />
                </form-item>
                <form-item label="状态">
                    <pull
                        v-model="form.status"
                        :list="searchLabelStatus"
                        :use-type="false"
                    />
                </form-item>
            </i-form>
            <i-button @click="getSearchLabelList(1)">
                查询
            </i-button>
            <i-button @click="resetSearch">
                重置
            </i-button>
        </template>
        <add
            ref="add"
            @on-success="getSearchLabelList(1)"
        />
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import { custonmersList, searchLabelStatus } from '@/libs/enum';
import api from '@/api/information';
import PageList from '@/view/components/page/list.vue';
import Pull from '@/view/components/pull/index.vue';
import mixin from '../mixins';
import add from './add.vue';

export default {
    name: 'Index',
    components: {
        PageList,
        Pull,
        add,
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
                    name: 'edit',
                },
                {
                    name: 'delete',
                },
                {
                    name: 'upperShelf',
                    show(params) {
                        return params.status === 2; //  2 已下架
                    },
                },
                {
                    name: 'lowerShelf',
                    show(params) {
                        return params.status === 1; // 1 已上架
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
                    title: '推荐词',
                    key: 'rec_word',
                    align: 'center',
                },
                {
                    title: '显示位置',
                    key: 'show_type_name',
                    align: 'center',
                },
                {
                    title: '搜索次数  ',
                    key: 'search_num',
                    align: 'center',
                },
                {
                    title: '状态',
                    slot: 'commonStatus',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                },
            ],
            custonmersList,
            searchLabelStatus,
            form: {
                show_type: '',
                status: '',
                rec_word: '',
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            list: [],
        };
    },
    created() {
        this.getSearchLabelList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getSearchLabelList(pageNum = 1) {
            this.form.page_num = pageNum;

            this.openMainSpin(true);
            api.getSearchLabelList(this.form)
                .then(({ data: { list = [], total = 0 } }) => {
                    this.list = this.parseData(list);
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        // 删除/下架/上架
        handleSearchLabelItem(data) {
            this.openMainSpin(true);
            api[data.status ? 'updateSearchLabelStatus' : 'deleteSearchLabel'](
                data,
            )
                .then(() => {
                    this.$Message.success('操作成功');
                    this.openMainSpin(false);
                    this.getSearchLabelList();
                })
                .catch(this.openMainSpin(false));
        },
        parseData(list) {
            return list.map((v) => {
                const info = v;
                info.show_type_name = this.getShowTypeNames(info.show_type);
                info.status_name = v.status === 1 ? '已上架' : '已下架';
                return info;
            });
        },
        getShowTypeNames(data) {
            return custonmersList.reduce((ac, cu, i) => {
                if (data.indexOf(i + 1) > -1) {
                    // eslint-disable-next-line no-param-reassign
                    ac += `${cu} `;
                }

                return ac;
            }, '');
        },
        resetSearch() {
            this.form = {
                ...this.form,
                show_type: '',
                status: '',
                rec_word: '',
                page_size: 10,
                page_num: 1,
            };

            this.getSearchLabelList(1);
        },
        handleAction({ name }, params) {
            const { id, status, show_type: showType } = params;

            switch (name) {
                case 'upperShelf':
                case 'lowerShelf':
                    this.handleConfirmModal(status, id, showType);
                    break;
                case 'delete':
                    this.handleConfirmModal(0, id);
                    break;
                case 'edit':
                    this.$refs.add.handleShow(params);
                    break;
                default:
                    break;
            }
        },
        handleConfirmModal(status, id, showType) {
            const text = ['删除', '下架', '上架'][status];
            this.$Modal.confirm({
                title: '提示',
                content: `确认${text}该搜索词`,
                onOk: () => {
                    if (status) {
                        this.handleSearchLabelItem({
                            id,
                            show_type: showType,
                            status: 3 - status,
                        });
                    } else {
                        this.handleSearchLabelItem({ id });
                    }
                },
            });
        },
    },
};
</script>
