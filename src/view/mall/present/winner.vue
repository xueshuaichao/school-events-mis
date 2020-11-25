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
            <div style="flex: 1">
                <i-button
                    type="default"
                    @click="$router.back()"
                >
                    返回
                </i-button>
            </div>
            <i-button
                type="default"
                @click="handleAction({ name: 'download' })"
            >
                导出
            </i-button>
        </template>
        <modalDelivery
            ref="modalDelivery"
            @save="getListData(form.page_num)"
        />
    </page-list>
</template>

<script>
import raffleApi from '@/api/raffle';
import PageList from '@/view/components/page/list.vue';
import modalDelivery from '@/view/mall/components/delivery/index.vue';

export default {
    components: {
        PageList,
        modalDelivery,
    },
    data() {
        return {
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '用户名',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '绑定手机号',
                    align: 'center',
                    key: 'mobile',
                },
                {
                    title: '奖品',
                    align: 'center',
                    key: 'prize_name',
                },
                {
                    title: '中奖时间',
                    key: 'created_at',
                    align: 'center',
                },
                {
                    title: '收件信息',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const addr = params.row.address || {
                            name: '',
                            mobile: '',
                            address: '',
                        };
                        const text = `${addr.name} ${addr.mobile} ${addr.address}`;
                        return h('span', {}, text);
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '300',
                    align: 'center',
                },
            ],
            list: [],
            total: 0,
            btnList: [
                {
                    name: 'delivery_info',
                    // eslint-disable-next-line arrow-body-style
                    show: (row) => {
                        return row.logistics !== null;
                    },
                },
                {
                    name: 'set_delivery',
                    // eslint-disable-next-line arrow-body-style
                    show: (row) => {
                        return row.logistics === null;
                    },
                },
            ],
            form: {
                page_num: 1,
                draw_id: this.$route.params.id,
            },
        };
    },
    created() {
        this.getListData();
    },
    methods: {
        getListData(pageNum = 1) {
            this.form.page_num = pageNum;
            raffleApi.winner(this.form).then(({ data }) => {
                this.total = data.total;
                this.list = data.list;
            });
        },
        handleClickBtn(name) {
            this.$refs[name].handleShow();
        },
        handleAction({ name }, params) {
            // eslint-disable-next-line no-unused-vars
            const { id, is_top, show } = params || {};
            let url;
            switch (name) {
                case 'download':
                    url = `/api/draw/exportuser?id=${this.form.draw_id}`;
                    window.open(url);
                    break;
                case 'set_delivery':
                case 'delivery_info':
                    this.$refs.modalDelivery.show(params);
                    break;
                default:
                    break;
            }
        },
    },
};
</script>
