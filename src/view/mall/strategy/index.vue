<template>
    <page-list
        class="raffle-strategy"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        @btn-click="handleAction"
        @page-change="getRuleList"
    >
        <template>
            <template slot="page-header">
                <div style="flex: 1;">
                    <i-button
                        type="default"
                        @click="$router.back()"
                    >
                        返回
                    </i-button>
                </div>

                <i-button
                    type="primary"
                    @click="handleAction({ name: 'modalPool' })"
                >
                    设置总奖池
                </i-button>
            </template>
            <template slot="footer">
                <div class="fixed-bar">
                    <i-button
                        type="primary"
                        @click="handleAction({ name: 'submit' })"
                    >
                        保存
                    </i-button>
                </div>
            </template>
        </template>
        <modal
            v-model="isModalShow"
            class="app-modal"
            width="628"
            footer-hide
            title="编辑"
            :mask-closable="false"
            @on-save="updateGiftAmount"
        >
            <i-form
                ref="form"
                :model="form"
                :label-width="140"
                class="add-event"
                :rules="rules"
            >
                <form-item label="活动名称：">
                    {{ raffleInfo.activity_name }}
                </form-item>
                <form-item label="奖品名称：">
                    <i-input
                        v-model="form.name"
                        show-word-limit
                        :maxlength="15"
                    />
                </form-item>
                <form-item
                    label="奖品图片："
                    prop="detail"
                >
                    <p
                        class="tip"
                        @click="uploadFile('image')"
                    >
                        上传图片 建议尺寸 100 X 100
                    </p>
                    <app-img
                        v-if="uploadImgStatus.image || form.image"
                        :src="form.image"
                        info="image"
                        class="mar-b-24"
                        @on-close="handleDelete"
                    />
                </form-item>
                <form-item
                    label="奖品单位："
                    prop="unit"
                >
                    <i-input
                        v-model="form.unit"
                        show-word-limit
                        :maxlength="4"
                    />
                </form-item>
                <form-item
                    label="可用库存："
                    prop="capacity"
                >
                    <div
                        class="value flex-row"
                        :class="[
                            'value',
                            'flex-row',
                            error ? 'value-error' : ''
                        ]"
                    >
                        <i-input
                            v-model="form.capacity"
                            type="number"
                            placeholder="1"
                            @on-change="handleAddChange"
                        />
                        <!-- <span class="error">请输入正整数</span> -->
                    </div>
                </form-item>
            </i-form>
            <file
                v-show="false"
                ref="file"
                :on-before-upload="onBeforeUpload"
                @on-end="onUploadEnd"
            />

            <div class="footer-wrapper">
                <i-button
                    type="primary"
                    class="mar-r-24"
                    @click="handleAddEvent"
                >
                    {{ form.id ? "保存" : "确定" }}
                </i-button>
                <i-button @click="handleCancel">
                    取消
                </i-button>
            </div>
        </modal>

        <modalStrategy ref="modalStrategy" />
        <modalGift ref="modalGift" />
        <modalPool ref="modalPool" />
        <modalGiftRecord ref="modalGiftRecord" />
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import modalStrategy from '@/view/mall/components/strategy/index.vue';
import modalGift from '@/view/mall/components/gift/index.vue';
import modalPool from '@/view/mall/components/pool/index.vue';
import modalGiftRecord from '@/view/mall/components/giftRecord/index.vue';
// import Modal from '@/view/components/modal/index.vue';
import File from '@/view/components/upload/file/index.vue';
import AppImg from '@/view/events/check/components/img/index.vue';
import { giftStatus } from '@/libs/enum';
import { isInteger } from '@/libs/validator';
import api from '@/api/mall';

const PRESENT_BTN_LIST = [
    {
        name: 'edit',
    },
    {
        name: 'up',
        // eslint-disable-next-line arrow-body-style
        show: (row) => {
            return row.sort !== 1;
        },
    },
    {
        name: 'down',
        show: () => true,
    },
    {
        name: 'upperShelf',
        show(params) {
            return params.status === 1;
        },
    },
    {
        name: 'lowerShelf',
        show(params) {
            return params.status === 0;
        },
    },
];

export default {
    name: 'Index',
    components: {
        PageList,
        modalStrategy,
        modalGift,
        modalPool,
        modalGiftRecord,
        // Modal,
        File,
        AppImg,
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
                    title: '日期',
                    key: 'date',
                    align: 'center',
                    width: 200,
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'div',
                            {
                                class: 'box',
                            },
                            params.row.date,
                        );
                    },
                },
                {
                    title: '中奖策略',
                    key: 'name',
                    align: 'center',
                    render: (h, params) => {
                        const { type, value } = params.row;
                        let text = '';

                        if (type === 'times') {
                            text = `抽奖次数 每${value}次`;
                        } else if (type === 'users') {
                            text = `抽奖人数 每${value}人`;
                        } else if (type === 'probability') {
                            text = `抽奖概率 ${value}`;
                        } else {
                            text = '请设置中奖策略';
                        }

                        return h(
                            'div',
                            {
                                class: 'box action',
                                on: {
                                    click: () => {
                                        this.$refs.modalStrategy.show(
                                            this.list[params.index],
                                        );
                                    },
                                },
                            },
                            text,
                        );
                    },
                },
                {
                    title: '每日奖池',
                    align: 'center',
                    render: (h, params) => {
                        const { prize } = params.row;
                        // eslint-disable-next-line arrow-parens
                        const text = prize
                            .map(item => `${item.prize_name}*${item.num}`)
                            .join(' ');

                        return h(
                            'div',
                            {
                                class: 'box action',
                                on: {
                                    click: () => {
                                        this.$refs.modalGift.show(
                                            this.params.draw_id,
                                            this.list[params.index],
                                        );
                                    },
                                    // 'on-submit': (data) => {
                                    //     console.log(data);
                                    //     this.list[params.index].prize = data;
                                    // },
                                },
                            },
                            text || '请添加奖品',
                        );
                    },
                },
                {
                    title: '中奖详情',
                    key: 'unit',
                    width: 180,
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'div',
                            {
                                class: 'box action',
                                on: {
                                    click: () => {
                                        this.$refs.modalGiftRecord.show(
                                            this.params.draw_id,
                                            this.list[params.index],
                                        );
                                    },
                                },
                            },
                            '查看详情',
                        );
                    },
                },
            ],
            params: {
                page_num: 1,
                page_size: 100,
                search: '',
                status: '',
                draw_id: this.$route.params.id,
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
            form: {
                image:
                    'http://img3.imgtn.bdimg.com/it/u=2688606261,2573311828&fm=26&gp=0.jpg',
                name: '',
                unit: '',
                capacity: 0,
                is_virtual: false,
                draw_id: this.$route.params.id,
            },
            raffleInfo: {},
        };
    },
    created() {
        this.getRuleList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),

        getRuleList(pageNum = 1) {
            const params = JSON.parse(JSON.stringify(this.params));
            const { status } = params;

            if (status > 2) {
                params.status = '4';
            }
            params.page_num = pageNum;
            this.openMainSpin(true);
            api.rullList(params)
                .then(({ data: { data, total } }) => {
                    this.list = data;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },

        updateGiftAmount() {
            const { id, add } = this.giftInfo;

            if (!add) {
                this.$Message.info('请输入补充数量');
                return;
            }
            if (this.error) {
                this.$Message.error('请输入正整数');
                return;
            }
            this.$refs.addAmount.handleHide();
            api.addStock({
                id,
                stock: add,
            }).then(() => {
                this.$Message.success('礼品补量成功');
                this.getRuleList();
            });
        },
        handleAction({ name }, params) {
            switch (name) {
                case 'edit':
                    this.handleEditGift(params);
                    break;
                case 'up':
                    this.handleGiftMove('up', params);
                    break;
                case 'down':
                    this.handleGiftMove('down', params);
                    break;
                case 'upperShelf':
                    this.handleGiftStatus(name, params);
                    break;
                case 'lowerShelf':
                    this.handleGiftStatus(name, params);
                    break;
                case 'modalPool':
                    this.$refs.modalPool.show(this.params.draw_id);
                    break;
                case 'detail':
                    this.$router.push(`/present/detail/${params.id}`);
                    break;
                case 'submit':
                    this.saveRules();
                    break;
                default:
                    break;
            }
        },

        handleEditGift(params) {
            this.form = {
                image: params.image,
                name: params.name,
                id: params.id,
                unit: params.unit,
                capacity: params.capacity,
                is_virtual: params.is_virtual,
                draw_id: params.draw_id,
            };
            this.isModalShow = true;
        },
        handleAddAmount() {
            this.form = {
                ...this.form,
                image: '',
                name: '',
                unit: '',
                capacity: null,
                is_virtual: 0,
            };
            this.isModalShow = true;
            // this.$refs.addAmount.handleShow();
        },
        handleCancel() {
            this.isModalShow = false;
        },
        handleAddEvent() {
            this.isloading = true;
            if (this.form.id) {
                api.edit(this.form).then(() => {
                    this.isloading = false;
                    this.isModalShow = false;
                    this.$Message.success('修改奖品成功！');
                    this.getRuleList();
                });
            } else {
                api.create(this.form).then(
                    () => {
                        this.isloading = false;
                        this.isModalShow = false;
                        this.$Message.success('添加奖品成功！');
                        this.getRuleList();
                    },
                    () => {
                        this.isloading = false;
                    },
                );
            }
        },
        handleReset() {
            const { params } = this;
            this.params = {
                ...params,
                search: '',
            };
            this.getRuleList();
        },
        handleSortSuccess() {
            this.$Modal.confirm({
                title: '提示',
                content: '礼品列表排列顺序发生变更是否发布新的礼品列表顺序？',
                onOk: () => {
                    this.getRuleList();
                },
            });
        },
        saveRules() {
            api.saveRules({
                draw_id: this.params.draw_id,
                data: this.list,
            }).then(() => {
                this.$Message.success('保存规则成功！');
                this.getRuleList();
            });
        },
        handleAddChange(event) {
            const { value } = event.target;
            const {
                giftInfo: { stock },
            } = this;

            if (!value) {
                this.error = false;
            } else if (!isInteger(value, 100)) {
                this.error = true;
            } else {
                this.giftInfo.total = stock + Number(value);
                this.error = false;
            }
        },
        uploadFile(img) {
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
        },
        onBeforeUpload() {
            this.currentUploadingImg = this.currentUploadImg;
            this.uploadImgStatus[this.currentUploadImg] = true;
            return true;
        },
        onUploadEnd([{ path }]) {
            this.form[this.currentUploadingImg] = path;
        },
        handleDelete(info) {
            this.form[info] = '';
            this.uploadImgStatus[info] = false;
        },
    },
};
</script>

<style lang="less">
.raffle-strategy .box {
    border-radius: 2px;
    border: 1px solid rgba(227, 228, 230, 1);
    margin: 0 20px;
    padding: 10px;
    min-height: 43px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &.action {
        cursor: pointer;
    }
}

#school-events-mis .content-wrapper.raffle-strategy {
    margin-bottom: 80px;

    .fixed-bar {
        width: 100%;
        z-index: 10;
        background: #ffff;
        padding: 10px 0;
        position: fixed;
        bottom: 0;
        left: 0;
        text-align: center;
        border-top: 1px solid #f5f7f9;
    }
}
</style>
