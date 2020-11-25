<template>
    <page-list
        class="present"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        @btn-click="handleAction"
        @page-change="getGiftList"
    >
        <template>
            <template slot="page-header">
                <div>
                    <i-button
                        type="default"
                        @click="$router.back()"
                    >
                        返回
                    </i-button>
                    <i-button
                        type="primary"
                        @click="handleAction({ name: 'addGifts' })"
                    >
                        添加奖品
                    </i-button>
                </div>
                <i-form :label-width="80">
                    <form-item label="奖品名称">
                        <i-input
                            v-model="params.search"
                            placeholder="请输入奖品名称"
                            clearable
                        />
                    </form-item>
                    <form-item label="奖品状态">
                        <Select
                            v-model="params.status"
                            placeholder="请选择奖品状态"
                        >
                            <Option
                                :key="-1"
                                :value="-1"
                            >
                                全部
                            </Option>
                            <Option
                                v-for="item in status"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </Option>
                        </Select>
                    </form-item>
                    <i-button @click="getGiftList(1)">
                        查询
                    </i-button>
                    <i-button @click="handleReset">
                        重置
                    </i-button>
                </i-form>
            </template>
        </template>
        <sort
            ref="sort"
            @on-save="updateSort"
        />
        <modal
            v-model="isModalShow"
            class="app-modal"
            width="628"
            footer-hide
            title="编辑"
            :mask-closable="false"
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
        <modalPool
            ref="modalPool"
            @save="getGiftList(params.page_num)"
        />
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import Sort from '@/view/components/sort/index.vue';
// import Modal from '@/view/components/modal/index.vue';
import File from '@/view/components/upload/file/index.vue';
import modalPool from '@/view/mall/components/pool/index.vue';
import AppImg from '@/view/events/check/components/img/index.vue';
import { giftStatus } from '@/libs/enum';
import { isInteger } from '@/libs/validator';
import api from '@/api/mall';
import raffleApi from '@/api/raffle';
import './index.less';

export default {
    name: 'Index',
    components: {
        PageList,
        Sort,
        modalPool,
        File,
        AppImg,
    },
    data() {
        console.log(giftStatus);

        return {
            isModalShow: false,
            status: [
                {
                    name: '已上架',
                    id: '0',
                },
                {
                    name: '已下架',
                    id: '1',
                },
            ],
            btnList: [
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
                    // eslint-disable-next-line arrow-body-style
                    show: (row) => {
                        return row.sort !== this.total;
                    },
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
            ],
            giftTypeList: [],
            total: 0,
            list: [],
            error: false,
            giftInfo: {
                add: 0,
            },
            columns: [
                {
                    title: '奖品ID',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '奖品名称',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '奖品图片',
                    slot: 'img',
                    align: 'center',
                },
                {
                    title: '单位',
                    key: 'unit',
                    align: 'center',
                },
                {
                    title: '可用库存',
                    key: 'capacity',
                    align: 'center',
                },
                {
                    title: '待派发',
                    key: 'to_be_distributed',
                    align: 'center',
                },
                {
                    title: '已派发',
                    key: 'draw_already_send',
                    align: 'center',
                },
                {
                    title: '奖品状态',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const statusToText = {
                            0: '已上架',
                            1: '已下架',
                        };
                        return h('span', {}, statusToText[params.row.status]);
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '240',
                    align: 'center',
                },
            ],
            params: {
                page_num: 1,
                page_size: 10,
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
        this.getGiftList();
        this.getRaffleInfo();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getRaffleInfo() {
            raffleApi
                .detail({
                    id: this.params.draw_id,
                })
                .then(({ data }) => {
                    this.raffleInfo = data;
                });
        },
        getGiftList(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api.getGiftList(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        updateSort(sort, { id }) {
            if (!sort) {
                this.$Message.info('请输入序号');
                return;
            }
            this.$refs.sort.hideModal();
            api.updateGiftSort({ id, sort }).then(() => {
                this.handleSortSuccess();
            });
        },
        updateGiftStatus(data) {
            api.updateGiftStatus(data).then(() => {
                console.log(this.params.page_num);
                this.getGiftList(this.params.page_num);
                this.$Message.success(
                    `礼品${data.status === 1 ? '下架' : '上架'}成功`,
                );
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
                case 'addGifts':
                    this.$refs.modalPool.show(this.params.draw_id);
                    break;
                case 'detail':
                    this.$router.push(`/present/detail/${params.id}`);
                    break;
                default:
                    break;
            }
        },
        handleGiftStatus(name, { id }) {
            const isUpperShelf = name === 'upperShelf';
            const text = isUpperShelf ? '上架' : '下架';

            this.$Modal.confirm({
                title: text,
                content: `确定要${text}当前礼品吗？`,
                onOk: () => {
                    this.updateGiftStatus({ status: isUpperShelf ? 0 : 1, id });
                },
            });
        },
        handleGiftMove(direction, params) {
            api.move({
                id: params.id,
                direction: direction === 'up' ? 1 : 0,
            }).then(() => {
                // this.getGiftList();
                this.getGiftList(this.params.page_num);
                this.$Message.success(
                    `礼品${direction === 'up' ? '上移' : '下移'}成功`,
                );
            });
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
                    this.getGiftList(this.params.page_num);
                });
            } else {
                api.create(this.form).then(
                    () => {
                        this.isloading = false;
                        this.isModalShow = false;
                        this.$Message.success('添加奖品成功！');
                        this.getGiftList(this.params.page_num);
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
                status: -1,
            };
            this.getGiftList();
        },
        handleSortSuccess() {
            this.$Modal.confirm({
                title: '提示',
                content: '礼品列表排列顺序发生变更是否发布新的礼品列表顺序？',
                onOk: () => {
                    this.getGiftList();
                },
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
