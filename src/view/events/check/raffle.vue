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
                添加抽奖活动
            </i-button>
        </template>
        <add-raffle
            ref="modal"
            @on-end="getListData(1)"
        />
    </page-list>
</template>

<script>
import raffleApi from '@/api/raffle';
import PageList from '@/view/components/page/list.vue';
import AddRaffle from './components/add-raffle/index.vue';

export default {
    components: {
        PageList,
        AddRaffle,
    },
    data() {
        return {
            columns: [
                {
                    title: '策略 ID',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '活动名称',
                    key: 'activity_name',
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
                {
                    title: '活动状态',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const statusToText = {
                            0: '初始化',
                            1: '未开始',
                            2: '进行中',
                            3: '已过期',
                            4: '已删除',
                        };
                        return h('span', {}, statusToText[params.row.status]);
                    },
                },
                {
                    title: '可用库存',
                    key: 'capacity',
                    align: 'center',
                },
                {
                    title: '已派发',
                    key: 'draw_already_send',
                    align: 'center',
                },
                {
                    title: '待派发',
                    key: 'to_be_distributed',
                    align: 'center',
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
                    name: 'strategy',
                    show: () => true,
                },
                {
                    name: 'gift_list',
                    show: () => true,
                },
                {
                    name: 'lucky_list',
                    // eslint-disable-next-line arrow-body-style
                    show: (row) => {
                        return row.status - 0 > 1;
                    },
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
            raffleApi.list(this.form).then(({ data }) => {
                console.log(data);
                this.total = data.total;
                this.list = data.list;
            });
        },
        handleClickBtn(name) {
            this.$refs[name].handleShow();
        },
        // eslint-disable-next-line no-unused-vars
        handleAction({ name }, { id, is_top, show }) {
            switch (name) {
                case 'strategy':
                    this.$router.push(`/check/raffle/strategy/${id}`);
                    break;
                case 'delete':
                    this.$Modal.confirm({
                        title: '确定要删除吗？',
                        onOk: () => {
                            raffleApi.delete({ id }).then(() => {
                                this.$Message.success('操作成功！');
                                this.getListData(this.form.page_num);
                            });
                        },
                    });
                    break;
                case 'gift_list':
                    this.$router.push(`/check/raffle/pool/${id}`);
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
