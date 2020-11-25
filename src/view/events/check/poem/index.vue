<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: form.page_num }"
        :hide-header-btn="false"
        @btn-click="handleAction"
        @page-change="getListData"
    >
        <template slot="page-header">
            <i-button
                type="primary"
                @click="handleClickBtn('modal')"
            >
                添加主题诗词库
            </i-button>
        </template>
        <add-poem
            ref="modal"
            @on-end="getListData(1)"
        />
    </page-list>
</template>

<script>
import api from '@/api/poem';
import PageList from '@/view/components/page/list.vue';
import AddPoem from './add-poem/index.vue';

export default {
    components: {
        PageList,
        AddPoem,
    },
    data() {
        return {
            columns: [
                {
                    title: '活动名称',
                    key: 'title',
                    align: 'center',
                },
                {
                    title: '活动时间',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            `${params.row.start_time} - ${params.row.end_time}`,
                        );
                    },
                },
                // {
                //     title: '活动状态',
                //     align: 'center',
                //     // eslint-disable-next-line arrow-body-style
                //     render: (h, params) => {
                //         const statusToText = {
                //             0: '初始化',
                //             1: '未开始',
                //             2: '进行中',
                //             3: '已过期',
                //             4: '已删除',
                //         };
                //         return h('span', {}, statusToText[params.row.status]);
                //     },
                // },
                {
                    title: '诗词总数',
                    key: 'poem_total',
                    align: 'center',
                },
                {
                    title: '容易',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            params.row.poems.filter(item => item.type === 0)
                                .length,
                        );
                    },
                },
                {
                    title: '一般',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            params.row.poems.filter(item => item.type === 1)
                                .length,
                        );
                    },
                },
                {
                    title: '较难',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'span',
                            {},
                            params.row.poems.filter(item => item.type === 2)
                                .length,
                        );
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '320',
                    align: 'center',
                },
            ],
            list: [],
            total: 0,
            btnList: [
                {
                    name: 'poem_edit',
                    show: () => true,
                },
                {
                    name: 'poem_title_edit',
                    show: () => true,
                },
                {
                    name: 'delete',
                    show: () => true,
                },
            ],
            form: {
                page_num: 1,
            },
        };
    },
    created() {
        this.getListData();
    },
    methods: {
        getListData(pageNum = 1) {
            this.form.page_num = pageNum;
            api.list(this.form).then(({ data }) => {
                console.log(data);
                this.total = data.total;
                this.list = data.list;
            });
        },
        handleClickBtn(name) {
            this.$refs[name].handleShow();
        },
        handleAction({ name }, params) {
            // eslint-disable-next-line no-unused-vars
            const { id, is_top, show } = params;
            switch (name) {
                case 'poem_edit':
                    this.$router.push(`/check/poem/manage/${id}`);
                    break;
                case 'delete':
                    this.$Modal.confirm({
                        title: '是否确定删除主题',
                        content: '注意：删除主题后，该主题内所有诗词将全部删除',
                        onOk: () => {
                            api.delete({ id }).then(() => {
                                this.$Message.success('操作成功！');
                                this.getListData(this.form.page_num);
                            });
                        },
                    });
                    break;
                case 'poem_title_edit':
                    this.$refs.modal.handleShow(params);
                    break;
                case 'lucky_list':
                    this.$router.push(`/check/raffle/winner/${id}`);
                    break;
                default:
                    break;
            }
        },
    },
};
</script>
