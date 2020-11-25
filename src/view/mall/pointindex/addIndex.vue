<template>
    <page-list
        :columns="cExpress"
        :data="list"
        :btn-list="btnListExpress"
        :page-params="{ total, page_num: recordList.page_num }"
        :hide-header-btn="false"
        @page-change="recordListSh"
        @btn-click="handleBtnExpress"
    >
        <file
            v-show="false"
            ref="file"
            :on-before-upload="onBeforeUpload"
            @on-end="onUploadEndsc"
        />
        <template
            slot="header-search-bar"
            style="float: right"
        >
            <i-button @click="$router.back()">
                返回
            </i-button>
            <i-form :label-width="80">
                <form-item label="订单编号">
                    <i-input
                        v-model="recordList.order_no"
                        placeholder="请输入订单编号"
                    />
                </form-item>
                <form-item label="兑奖用户">
                    <i-input
                        v-model="recordList.user_name"
                        placeholder="请输入兑奖用户"
                        clearable
                    />
                </form-item>
                <form-item label="兑奖状态">
                    <Select v-model="recordList.status">
                        <Option
                            :key="-1"
                            :value="-1"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in cityList"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </form-item>
            </i-form>
            <i-button
                type="primary"
                @click="recordListSh(1)"
            >
                查询
            </i-button>
            <i-button @click="handleReset">
                重置
            </i-button>
        </template>
        <div>
            <Modal
                v-model="kdnumber"
                title="快递单号"
                class="app-modal"
                footer-hide
                :mask-closable="false"
            >
                <i-form
                    ref="getdeliveryinfotx"
                    :model="getdeliveryinfotx"
                    :label-width="140"
                    class="add-event"
                    :rules="rulesll"
                >
                    <div
                        v-show="
                            getdeliveryinfo.delivery === '' &&
                                getdeliveryinfo.delivery_code === ''
                        "
                    >
                        <form-item
                            label="请填写快递单号："
                            prop="delivery_code"
                        >
                            <Input
                                v-model="getdeliveryinfotx.delivery_code"
                                style="width: 100%;"
                            />
                        </form-item>
                        <form-item
                            label="请填写快递公司："
                            prop="delivery"
                        >
                            <Input
                                v-model="getdeliveryinfotx.delivery"
                                style="width: 100%;"
                            />
                        </form-item>
                    </div>
                    <div
                        v-show="
                            getdeliveryinfo.delivery !== '' &&
                                getdeliveryinfo.delivery_code !== ''
                        "
                    >
                        <FormItem label="快递单号：">
                            <p>{{ getdeliveryinfo.delivery_code }}</p>
                        </FormItem>
                        <FormItem label="快递公司：">
                            <p>{{ getdeliveryinfo.delivery }}</p>
                        </FormItem>
                    </div>
                </i-form>
                <div
                    v-if="
                        getdeliveryinfo.delivery === '' &&
                            getdeliveryinfo.delivery_code === ''
                    "
                    class="footer-wrapper"
                >
                    <i-button
                        type="primary"
                        class="mar-r-24"
                        @click="handleAddEvent()"
                    >
                        确定
                    </i-button>
                    <i-button @click="cancel">
                        返回
                    </i-button>
                </div>
                <div
                    v-if="
                        getdeliveryinfo.delivery !== '' &&
                            getdeliveryinfo.delivery_code !== ''
                    "
                    class="footer-wrapper"
                >
                    <i-button
                        type="primary"
                        class="mar-r-24"
                        @click="cancel"
                    >
                        确定
                    </i-button>
                </div>
            </Modal>
        </div>
        <div>
            <Modal
                v-model="ztshshow"
                :title="adressSh.status === 1 ? '审核' : '详情'"
                class="app-modal"
                footer-hide
                :mask-closable="false"
            >
                <i-form
                    ref="adressSh"
                    :model="adressSh"
                    :label-width="140"
                    class="add-event"
                    :rules="rulesll"
                >
                    <form-item label="订单编号：">
                        <p>{{ adressSh.order_no }}</p>
                    </form-item>
                    <form-item label="提交时间：">
                        {{ adressSh.created_at }}
                    </form-item>
                    <form-item label="兑奖用户：">
                        {{ adressSh.user_name }}
                    </form-item>
                    <form-item label="兑奖奖品：">
                        {{ adressSh.gift_name }}
                    </form-item>
                    <form-item label="所需积分：">
                        {{ adressSh.total_price }} 积分
                    </form-item>
                    <form-item label="用户积分余额：">
                        {{ adressSh.useful_score }} 积分
                    </form-item>
                    <form-item label="收件信息：">
                        {{ adressSh.address }}
                    </form-item>
                    <form-item
                        v-if="adressSh.status === 1"
                        label="审核意见："
                    >
                        <Input
                            v-model="adressSh.reason"
                            maxlength="15"
                            show-word-limit
                            type="textarea"
                            placeholder="请填写审核意见"
                            style="width: 90%"
                        />
                    </form-item>
                    <div v-if="adressSh.status !== 1">
                        <form-item label="审核意见：">
                            {{ adressSh.reason }}
                        </form-item>
                        <form-item label="审核时间：">
                            {{ adressSh.confirm_time }}
                        </form-item>
                        <form-item label="审核人：">
                            {{ adressSh.confirm_user }}
                        </form-item>
                    </div>
                </i-form>
                <div
                    v-if="adressSh.status === 1"
                    class="footer-wrapper"
                >
                    <i-button
                        type="primary"
                        class="mar-r-24"
                        @click="addsh(2)"
                    >
                        通过
                    </i-button>
                    <i-button
                        class="stylebh"
                        @click="addsh(3)"
                    >
                        驳回
                    </i-button>
                </div>
                <div
                    v-if="adressSh.status !== 1"
                    class="footer-wrapper"
                >
                    <i-button
                        type="primary"
                        class="mar-r-24"
                        @click="handleCancel"
                    >
                        确认
                    </i-button>
                </div>
            </Modal>
        </div>
        <!-- <add-raffle
                ref="addLive"
                @on-end="getListData(1)"
            /> -->
    </page-list>
</template>

<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import File from '@/view/components/upload/file/index.vue';
import api from '@/api/integral';
import { extend } from '@/libs/utils';
import AppImg from "@/view/events/check/components/img/index.vue"; // eslint-disable-line
export default {
    /* eslint-disable */
    components: {
        PageList,
        File,
        AppImg
    },
    /* eslint-enable */
    data() {
        /* eslint-disable */
        const validateNumber = (rule, value, callback) => {
            if (/^[0-9]+$/.test(value)) {
                callback();
            } else {
                return callback(new Error("请设置可用库存"));
            }
        };
        const validateNumberxs = (rule, value, callback) => {
            if (
                /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/.test(
                    value
                )
            ) {
                callback();
            } else {
                return callback(new Error("请设置可用积分"));
            }
        };
        /* eslint-enable */
        return {
            activity_id: Number(this.$route.params.activity_id),
            shows: 1,
            pointAddShow: false,
            pointjp: false,
            remnant: 15,
            btnListExpress: [
                {
                    name: 'check',
                    show(params) {
                        return params.status === 1; // 审核
                    },
                },
                {
                    name: 'detail',
                    show(params) {
                        return params.status !== 1; //  详情
                    },
                },
                {
                    name: 'works', // 作品
                },
                {
                    name: 'courierNumber',
                    show(params) {
                        return params.status === 2; //  运单号
                    },
                },
            ],
            cExpress: [
                {
                    title: '订单编号',
                    key: 'order_no',
                    align: 'center',
                },
                {
                    title: '兑奖用户',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '兑奖奖品',
                    key: 'gift_name',
                    align: 'center',
                },
                {
                    title: '奖品图片',
                    slot: 'img',
                    align: 'center',
                },
                {
                    title: '兑奖数量',
                    key: 'gift_num',
                    align: 'center',
                },
                {
                    title: '所属积分',
                    key: 'total_price',
                    align: 'center',
                },
                {
                    title: '收件信息',
                    key: 'address',
                    align: 'center',
                    // render: (h, params) => h('div', [
                    //     h('span', {
                    //         style: {
                    //             display: 'inline-block',
                    //             width: '95%',
                    //             overflow: 'hidden',
                    //             textOverflow: 'ellipsis',
                    //             whiteSpace: 'nowrap',
                    //         },
                    //     }, params.row.address),
                    //
                    // ]),
                    /* eslint-disable */
                    render: (h, params) => {
                        let value = params.row.address;
                        if (
                            typeof value === "undefined" ||
                            value === null ||
                            value === ""
                        ) {
                            value = "--";
                        } else if (value && value.length > 16) {
                            value = `${value.slice(0, 16)} ` + "...";
                        }
                        return h("div", [
                            h(
                                "span",
                                {
                                    style: {
                                        display: "inline-block",
                                        width: "100%"
                                    },
                                    domProps: {
                                        title: params.row.address
                                    }
                                },
                                value
                            )
                        ]);
                    }
                    /* eslint-enable */
                },
                {
                    title: '兑换状态',
                    key: 'status_name',
                    align: 'center',
                    /* eslint-disable */
                    render: (h, params) => {
                        if (params.row.status_name === "已通过") {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#19CA6C"
                                    }
                                },
                                params.row.status_name
                            );
                        }
                        if (params.row.status_name === "待审核") {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#626366"
                                    }
                                },
                                params.row.status_name
                            );
                        }
                        if (params.row.status_name === "未通过") {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#FF6849"
                                    }
                                },
                                params.row.status_name
                            );
                        }
                    }
                    /* eslint-enable */
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '220',
                    align: 'center',
                },
            ],
            list: [],
            total: 0,
            form: {
                page_num: 1,
                page_size: 10,
            },
            PointsExchangeAdd: false,
            addpp: {},
            show: false,
            loading: true,
            currentUploadImg: '',
            currentUploadingImg: '',
            uploadImgStatus: {
                image: '',
            },
            rules: {
                name: {
                    required: true,
                    message: '请填写奖品名称',
                    trigger: 'blur',
                },
                delivery: {
                    required: true,
                    message: '请填写奖品名称',
                    trigger: 'blur',
                },
                deliveryCode: {
                    required: true,
                    message: '请填写奖品名称',
                    trigger: 'blur',
                },
                unit: {
                    required: true,
                    message: '请设置单位',
                    trigger: 'blur',
                },
                num: [
                    {
                        required: true,
                        validator: validateNumber,
                        trigger: 'blur',
                    },
                ],
                price: [
                    {
                        required: true,
                        validator: validateNumberxs,
                        trigger: 'blur',
                    },
                ],
                img: {
                    required: true,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        const { img } = this.addpp;

                        if (img) {
                            callback();
                        } else {
                            callback('请上传直播封面');
                        }
                    },
                },
            },
            rulesll: {
                delivery: {
                    required: true,
                    message: '请填写快递公司',
                    trigger: 'blur',
                },
                delivery_code: {
                    required: true,
                    message: '请填写快递单号',
                    trigger: 'blur',
                },
                reason: [
                    {
                        required: true,
                        message: 'Please enter a personal introduction',
                        trigger: 'blur',
                    },
                ],
            },
            addList: [
                {
                    name: '',
                    img: '',
                    unit: '',
                    num: '',
                    price: '',
                },
            ],
            formaddList: {
                name: '',
                img: '',
                unit: '',
                num: '',
                price: '',
            },
            nameIndex: null,
            cityList: [
                {
                    value: 1,
                    label: '待审核',
                },
                {
                    value: 2,
                    label: '已通过',
                },
                {
                    value: 3,
                    label: '未通过',
                },
            ],
            formList: {
                name: '',
                start_time: '',
                end_time: '',
                is_top: '',
                status: '',
                activity_id: '',
                page_size: 10,
                page_num: 1,
            },
            recordList: {
                name: '',
                start_time: '',
                end_time: '',
                is_top: '',
                status: '', // 1 未开始 2 进行中 3 已结束
                page_size: 10,
                page_num: 1,
                activity_id: Number(this.$route.params.activity_id),
            },
            adressSh: {},
            getdeliveryinfo: {},
            getdeliveryinfotx: {
                delivery: '',
                delivery_code: '',
            },
            ztshshow: false,
            model1: '',
            kdnumber: false,
            kdxq: false,
            numberLength: '',
            shenheId: '',
            expressDeId: '',
        };
    },
    created() {
        this.recordListSh();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        parseData(list, total) {
            list.forEach((v, i) => {
                // eslint-disable-next-line camelcase education_level:gift_img,
                const { start_time, end_time } = v;
                const info = v;
                info.time = `${start_time}--${end_time}`;
                info.index = i + 1;
                info.total = total;
                info.img = v.gift_img;
            });
            return list;
        },
        handleClickBtn() {
            this.pointAddShow = true;
        },
        // 兑换审核
        ...mapMutations(['openMainSpin']),
        recordListSh(pageNum = 1) {
            this.recordList.page_num = pageNum;
            api.recordLists(this.recordList)
                .then(({ data: { list, total } }) => {
                    this.list = this.parseData(list, total);
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleAction({ name }, params) {
            const { id, status, show_type: showType } = params;

            switch (name) {
                case 'upperShelf':
                case 'lowerShelf':
                    this.handleConfirmModal(status, id, showType);
                    break;
                case 'up':
                    this.sortList(1, id);
                    break;
                case 'down':
                    this.sortList(2, id);
                    break;
                case 'edit':
                    this.handleShow(params);
                    break;
                default:
                    break;
            }
        },
        sortList(
            i,
            s,
            data = {
                type: i,
                id: s,
            },
        ) {
            api.giftpx(data).then(
                () => {
                    this.$Message.success('操作成功');
                    this.$emit('on-end');
                    this.show = false;
                    this.getListDataqqlist();
                },
                (err) => {
                    this.$Message.error(err);
                },
            );
        },
        handleBtnExpress({ name }, params) {
            const { id } = params;
            switch (name) {
                case 'works':
                    // this.$router.push(`/activity/${this.activity_id}/${params.user_name}`);
                    this.$router.push({
                        name: 'activityManage',
                        params: {
                            id: this.activity_id,
                            search: params.user_name,
                        },
                    });
                    break;
                case 'courierNumber':
                    this.expressNumber(id);
                    break;
                case 'detail':
                    this.ztsh(id);
                    break;
                case 'check':
                    this.ztsh(id);
                    break;
                default:
                    break;
            }
        },
        // 审核
        ztsh(id) {
            this.ztshshow = true;
            this.xiangQ(id);
            this.shenheId = id;
        },
        addsh(
            i,
            data = {
                status: i,
                id: this.shenheId,
                reason: this.adressSh.reason,
            },
        ) {
            if (this.adressSh.reason !== '') {
                api.reasonsh(data).then(
                    () => {
                        this.$Message.success('操作成功');
                        this.ztshshow = false;
                        this.$emit('on-end');
                        this.recordListSh(this.recordList.page_num);
                    },
                    (err) => {
                        this.$Message.error(err);
                    },
                );
            } else {
                this.$Message.warning('请填写审核意见！');
            }
        },
        xiangQ(
            i,
            data = {
                id: i,
            },
        ) {
            api.recordXq(data).then(
                ({ data }) => {
                    this.adressSh = data;
                },
                (err) => {
                    this.$Message.error(err);
                },
            );
        },
        // 快递单号编辑
        expressNumber(id) {
            this.kdnumber = true;
            this.conDetailsKd(id);
            this.expressDeId = id;
        },
        // 快递详情
        conDetailsKd(
            i,
            data = {
                id: i,
            },
        ) {
            api.expressXq(data).then(
                ({ data }) => {
                    this.getdeliveryinfo = data;
                },
                (err) => {
                    this.$Message.error(err);
                },
            );
        },
        handleAddEvent() {
            this.$refs.getdeliveryinfotx.validate((res) => {
                if (res) {
                    this.expressDelivery();
                }
            });
        },
        cancel() {
            // this.$Message.info('Clicked cancel');
            this.kdnumber = false;
            this.$refs.getdeliveryinfotx.resetFields();
        },
        expressDelivery(
            data = {
                id: this.expressDeId,
                delivery: this.getdeliveryinfotx.delivery,
                delivery_code: this.getdeliveryinfotx.delivery_code,
            },
        ) {
            api.expressQr(data).then(
                () => {
                    this.$Message.success('操作成功');
                    this.kdnumber = false;
                    this.$emit('on-end');
                    this.$refs.getdeliveryinfotx.resetFields();
                },
                (err) => {
                    this.$Message.error(err);
                },
            );
        },
        // 快递详情
        handleShow(params) {
            this.$nextTick(() => {
                this.pointjp = !this.pointjp;
                this.addpp = params;
            });
        },
        add() {
            this.$Message.info('Clicked ok');
        },
        handleVisibleChange() {
            this.handleResetForm();
        },
        handleResetForm() {
            this.addpp = {
                name: '',
                img: '',
                unit: '',
                num: '',
                price: '',
            };
            this.uploadImgStatus = {
                image: '',
            };
            this.$refs.addpp.resetFields();
        },
        /* eslint-disable */
        getEventInfo(id) {
            api.getInfo({ id }).then(({ data }) => {
                const { img: image } = data;
                this.form = {
                    ...extend(this.form, data),
                    image
                };
            });
        },
        /* eslint-enable */
        handleDelete(info) {
            this.form[info] = '';
            this.uploadImgStatus[info] = false;
        },
        uploadFile(img, i) {
            this.nameIndex = i;
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
            // [this.nameIndex].img = img;
            [this.nameIndex].img = img;
        },
        onUploadEnd([{ path }]) {
            this.formaddList[this.currentUploadingImg] = path;
            this.addList[this.nameIndex].img = path;
        },
        onUploadEndsc([{ path }]) {
            this.formaddList[this.currentUploadingImg] = path;
            this.addpp.img = path;
        },
        onBeforeUpload() {
            this.currentUploadingImg = this.currentUploadImg;
            this.uploadImgStatus[this.currentUploadImg] = true;
            return true;
        },
        handleCancel() {
            this.pointjp = false;
            this.ztshshow = false;
            this.kdnumber = false;
        },
        handleShowadd() {
            this.PointsExchangeAdd = true;
        },
        handleReset() {
            const { recordList } = this;
            this.recordList = {
                ...recordList,
                status: '',
            };
            this.recordListSh();
        },
    },
};
</script>

<style lang="less" scoped>
.stylebh {
    background-color: red;
    color: white;
}
</style>
