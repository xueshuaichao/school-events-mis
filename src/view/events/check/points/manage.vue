<template>
    <page-list
        class="points-manage"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :hide-header-btn="false"
        :page-params="{ total }"
        @btn-click="handleAction"
        @page-change="getList"
    >
        <template>
            <template slot="page-header">
                <!--  -->
            </template>
            <template slot="header-search-bar">
                <i-form :label-width="100">
                    <form-item
                        label="活动名称"
                        prop="activity_id"
                    >
                        <Select
                            v-model="params.activity_id"
                            style="width: 200px;"
                        >
                            <Option
                                v-for="opt in activityList"
                                :key="opt.id"
                                :value="opt.id"
                            >
                                {{ opt.activity_name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item label="用户名">
                        <i-input
                            v-model="params.user_name"
                            placeholder="请输入用户名"
                            clearable
                        />
                    </form-item>
                    <form-item label="绑定手机号">
                        <i-input
                            v-model="params.mobile"
                            placeholder="请输入手机号"
                            clearable
                        />
                    </form-item>

                    <i-button
                        type="primary"
                        @click="getList(1)"
                    >
                        查询
                    </i-button>
                    <i-button @click="handleReset">
                        重置
                    </i-button>
                </i-form>
            </template>
        </template>

        <modalPoint
            ref="modalPoint"
            @save="getList(params.page_num)"
        />
    </page-list>
</template>
<script>
import PageList from '@/view/components/page/list.vue';
// import Modal from '@/view/components/modal/index.vue';
import modalPoint from '@/view/events/check/components/point/index.vue';
import { giftStatus } from '@/libs/enum';
import api from '@/api/integral';
import activityApi from '@/api/activity';

const PRESENT_BTN_LIST = [
    {
        name: 'edit',
    },
];

export default {
    name: 'Index',
    components: {
        PageList,
        modalPoint,
    },
    data() {
        return {
            isModalShow: false,
            giftStatus,
            btnList: PRESENT_BTN_LIST,
            giftTypeList: [],
            total: 0,
            list: [],
            error: false,
            giftInfo: {
                add: 0,
            },
            columns: [
                {
                    title: '用户ID',
                    key: 'user_id',
                    align: 'center',
                },
                {
                    title: '活动名称',
                    key: 'activity_name',
                    align: 'center',
                },
                {
                    title: '用户名',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '绑定手机号',
                    key: 'mobile',
                    align: 'center',
                },
                {
                    title: '可用积分',
                    key: 'useful_score',
                    align: 'center',
                },
                {
                    title: '总积分',
                    key: 'score',
                    align: 'center',
                },
                {
                    title: '积分消耗',
                    key: 'draw_already_send',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, p) => {
                        return h('span', {}, p.row.score - p.row.useful_score);
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '220',
                    align: 'center',
                },
            ],
            params: {
                page_num: 1,
                page_size: 10,
                user_name: '',
                mobile: '',
                activity_id: '',
            },

            uploadImgStatus: {
                image: '',
            },
            rules: {
                detail: {
                    required: true,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        const { image } = this.form;

                        if (image) {
                            callback();
                        } else {
                            callback('请上传直播封面');
                        }
                    },
                },
            },
            raffleInfo: {},
            activityList: [],
        };
    },
    created() {
        this.getList();
        this.getOptions();
    },
    methods: {
        getOptions() {
            activityApi
                .getEventList({
                    page_num: 1,
                    page_size: 1000,
                })
                .then((res) => {
                    this.activityList = res.data.list;
                });
        },
        getList(pageNum = 1) {
            this.params.page_num = pageNum;
            api.scoreList(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                })
                .catch();
        },
        handleAction({ name }, params) {
            switch (name) {
                case 'edit':
                    this.$refs.modalPoint.show(params);
                    break;
                default:
                    break;
            }
        },

        handleReset() {
            const { params } = this;
            this.params = {
                ...params,
                user_name: '',
                mobile: '',
            };
            this.getList();
        },
    },
};
</script>
