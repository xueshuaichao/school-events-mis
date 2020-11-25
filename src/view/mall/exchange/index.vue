<template>
    <page-list
        id="exchange"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-page-hide="false"
        @btn-click="handleAction"
        @page-change="getExchangeList"
    >
        <template>
            <template slot="header-btn">
                <i-form :label-width="80">
                    <form-item label="关键字">
                        <i-input
                            v-model="params.name"
                            placeholder="请输入关键字"
                        />
                    </form-item>
                    <form-item label="记录状态">
                        <pull
                            v-model="params.record_status"
                            :list="exchangeStatus"
                            :use-type="false"
                        />
                    </form-item>
                    <form-item label="创建时间">
                        <DatePicker
                            type="daterange"
                            split-panels
                            placeholder="全部日期"
                            @on-change="handleChange"
                        />
                    </form-item>
                    <i-button @click="getExchangeList(1)">
                        确定
                    </i-button>
                    <i-button @click="handleReset">
                        重置
                    </i-button>
                </i-form>
            </template>
            <template slot="header-search-bar">
                <i-button
                    type="primary"
                    @click="handleClickExport"
                >
                    批量导出
                </i-button>
            </template>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import Pull from '@/view/components/pull/index.vue';
import { exchangeStatus } from '@/libs/enum';
import { updateExchangeStatus } from '../mixins';
import api from '@/api/mall';
import './index.less';

export default {
    name: 'Index',
    components: {
        PageList,
        Pull,
    },
    mixins: [updateExchangeStatus],
    data() {
        return {
            exchangeStatus,
            btnList: [
                {
                    name: 'info',
                    show(params) {
                        return params.status === 1;
                    },
                },
                {
                    name: 'detail',
                },
            ],
            giftTypeList: [],
            total: 0,
            list: [],
            giftInfo: {
                add: 0,
            },
            columns: [
                {
                    title: '记录ID',
                    key: 'show_id',
                    align: 'center',
                },
                {
                    title: '礼品名称',
                    key: 'gift_name',
                    align: 'center',
                },
                {
                    title: '礼品数量',
                    key: 'pay_num',
                    align: 'center',
                },
                {
                    title: '礼品单价',
                    key: 'price',
                    align: 'center',
                },
                {
                    title: '礼品总价',
                    key: 'total_price',
                    align: 'center',
                },
                {
                    title: '收货地址',
                    key: 'address',
                    align: 'center',
                },
                {
                    title: '收货人',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '联系电话',
                    key: 'phone',
                    align: 'center',
                },
                {
                    title: '记录状态',
                    slot: 'commonStatus',
                    key: 'status_name',
                    align: 'center',
                },
                {
                    title: '生成时间',
                    key: 'created_at',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '200',
                    align: 'center',
                },
            ],
            params: {
                page_num: 1,
                page_size: 10,
                name: '',
                record_status: '',
                create_at_begin: '',
                created_at_end: '',
            },
        };
    },
    created() {
        this.getExchangeList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getExchangeList(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api.getExchangeList(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleAction({ name }, params) {
            switch (name) {
                case 'info':
                    this.handleExchangeStatus(params.id, this.getExchangeList);
                    break;
                case 'detail':
                    this.$router.push(`/exchange/detail/${params.id}`);
                    break;
                default:
                    break;
            }
        },
        handleChange(val) {
            const [begin, end] = val;
            this.params = {
                ...this.params,
                create_at_begin: begin,
                created_at_end: end,
            };
        },
        handleClickExport() {
            const {
                name,
                record_status: status,
                create_at_begin: begin,
                created_at_end: end,
            } = this.params;
            const url = `/api/market/downloadexcel?name=${name}&record_status=${status}&create_at_begin=${begin}&created_at_end=${end}`;

            window.open(url);
        },
        handleReset() {
            this.params = {
                page_num: 1,
                page_size: 10,
                name: '',
                record_status: '',
                create_at_begin: '',
                created_at_end: '',
            };
            this.getExchangeList();
        },
    },
};
</script>
