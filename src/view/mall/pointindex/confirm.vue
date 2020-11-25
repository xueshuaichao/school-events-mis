<template>
    <page-list
        :columns="columnsMall"
        :data="list"
        :btn-list="btnListMall"
        :page-params="{ total, page_num: formList.page_num }"
        :hide-header-btn="false"
        @page-change="getListDataqqlist"
        @btn-click="handleAction"
    >
        <template
            slot="header-search-bar"
            style="float: right"
        >
            <i-button @click="$router.back()">
                返回
            </i-button>
            <i-button
                type="primary"
                @click="handleAction({ name: 'modalPool' })"
            >
                添加兑换商品
            </i-button>
            <i-form :label-width="80">
                <form-item label="奖品名称">
                    <i-input
                        v-model="formList.name"
                        placeholder="请输入奖品名称"
                        style="width:196px"
                    />
                </form-item>
                <form-item label="奖品状态">
                    <Select
                        v-model="formList.status"
                        style="width:196px"
                    >
                        <Option
                            :key="-1"
                            :value="-1"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in currentState"
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
                @click="getListDataqqlist()"
            >
                查询
            </i-button>
            <i-button @click="handleReset">
                重置
            </i-button>
        </template>
        <div>
            <modal
                v-model="pointjp"
                title="修改"
                width="600"
                class="app-modal"
                footer-hide
                :mask-closable="false"
            >
                <file
                    v-if="idlist === 1"
                    v-show="false"
                    ref="file"
                    :on-before-upload="onBeforeUploadsc"
                    @on-end="onUploadEndsc"
                />
                <i-form
                    ref="addpp"
                    :model="addpp"
                    :label-width="140"
                    class="add-event"
                    :rules="rules"
                >
                    <form-item label="奖品ID：">
                        <p>{{ addpp.id }}</p>
                    </form-item>
                    <form-item
                        label="奖品名称："
                        prop="name"
                    >
                        <i-input
                            v-model="addpp.name"
                            show-word-limit
                            maxlength="15"
                        />
                    </form-item>
                    <form-item
                        label="奖品图片："
                        prop="img"
                    >
                        <p
                            class="tip"
                            @click="uploadFilesc('img')"
                        >
                            添加封面 建议尺寸 100 X 100
                        </p>
                        <app-img
                            v-if="uploadImgStatusaddpp.img || addpp.img"
                            :src="addpp.img"
                            info="img"
                            class="mar-b-24"
                            @on-close="handleDeletesc"
                        />
                    </form-item>
                    <form-item
                        label="奖品单位："
                        prop="unit"
                    >
                        <Input
                            v-model="addpp.unit"
                            maxlength="4"
                            show-word-limit
                        />
                    </form-item>
                    <form-item
                        label="可用库存："
                        prop="num"
                    >
                        <Input
                            v-model="addpp.num"
                            maxlength="5"
                        />
                    </form-item>
                    <form-item
                        label="单品兑换积分："
                        prop="price"
                    >
                        <Input
                            v-model="addpp.price"
                            maxlength="5"
                        />
                    </form-item>
                </i-form>
                <div class="footer-wrapper">
                    <i-button
                        type="primary"
                        class="mar-r-24"
                        @click="handleAddEvent"
                    >
                        保存
                    </i-button>
                    <i-button @click="handleCancel">
                        取消
                    </i-button>
                </div>
            </modal>
        </div>
        <div class="maill">
            <Modal
                v-model="PointsExchangeAdd"
                title="添加兑换商品"
                width="54%"
                class="app-modal"
                footer-hide
                :mask-closable="false"
            >
                <div class="style_add">
                    <i-form
                        ref="addList"
                        :model="addList"
                        class="add-event"
                    >
                        <span class="jiany">建议图片照片尺寸为100*100像素</span>
                        <div
                            class="addlistmaill"
                            title="添加一行"
                            style="cursor:pointer;display: inline-block;
                            float: right;font-size: 14px;color: #1166ff"
                            @click="addL(addList.items.length)"
                        >
                            继续添加
                        </div>
                        <table
                            class="points"
                            cellspacing="0"
                            color="#ccc"
                        >
                            <tr style="background-color: #F8F9FA;height: 50px">
                                <th>奖品名称</th>
                                <th>奖品图片</th>
                                <th>奖品单位</th>
                                <th>可用库存</th>
                                <th>单品兑换积分</th>
                            </tr>
                            <!--eslint-disable-->
                            <tr
                                v-for="(item, index) in addList.items"
                                v-if="item.status"
                                :key="index"
                                style="border-bottom: 1px solid #ccc;margin: 4px 4px"
                            >
                                <!--eslint-enable-->
                                <td
                                    style=" padding:15px;text-align: center;width: 28%"
                                >
                                    <div
                                        class="style_add"
                                        style="position: relative"
                                    >
                                        <form-item
                                            label=""
                                            :prop="'items.' + index + '.name'"
                                            :rules="{
                                                required: true,
                                                message: '请填写奖品名称',
                                                trigger: 'blur'
                                            }"
                                        >
                                            <Input
                                                v-model="item.name"
                                                placeholder="请填写奖品名称"
                                                show-word-limit
                                                maxlength="15"
                                            />
                                        </form-item>
                                    </div>
                                </td>
                                <td
                                    style=" padding:15px;text-align: center;width: 18%"
                                >
                                    <div class="style_add">
                                        <form-item
                                            label=""
                                            :prop="'items.' + index + '.img'"
                                            :rules="{
                                                required: true,
                                                message: '请选择图片',
                                                trigger: 'change'
                                            }"
                                        >
                                            <p
                                                class="tip"
                                                style="color: #1166ff;font-size: 14px"
                                                @click="
                                                    uploadFile('image', index)
                                                "
                                            >
                                                上传图片
                                            </p>
                                            <app-img
                                                v-if="
                                                    uploadImgStatus.image ||
                                                        item.img
                                                "
                                                :src="item.img"
                                                info="image"
                                                class="mar-b-24"
                                                @on-close="handleDelete"
                                            />
                                        </form-item>
                                    </div>
                                </td>
                                <td style=" padding:15px;text-align: center">
                                    <div class="style_add">
                                        <form-item
                                            label=""
                                            :prop="'items.' + index + '.unit'"
                                            :rules="{
                                                required: true,
                                                message: '请设置单位',
                                                trigger: 'blur'
                                            }"
                                        >
                                            <Input
                                                v-model="item.unit"
                                                placeholder="请设置单位"
                                            />
                                        </form-item>
                                    </div>
                                </td>
                                <td style=" padding:15px;text-align: center">
                                    <div class="style_add">
                                        <form-item
                                            label=""
                                            :prop="'items.' + index + '.num'"
                                            :rules="{
                                                required: true,
                                                message: '请设置库存',
                                                trigger: 'blur'
                                            }"
                                        >
                                            <Input
                                                v-model="item.num"
                                                type="number"
                                                placeholder="请设置库存"
                                            />
                                        </form-item>
                                    </div>
                                </td>
                                <td style=" padding:15px;text-align: center">
                                    <div class="style_add">
                                        <form-item
                                            label=""
                                            :prop="'items.' + index + '.price'"
                                            :rules="{
                                                required: true,
                                                message: '请设置积分',
                                                trigger: 'blur'
                                            }"
                                        >
                                            <Input
                                                v-model="item.price"
                                                type="number"
                                                placeholder="请设置积分"
                                            />
                                        </form-item>
                                    </div>
                                </td>
                                <!--<td style="text-align: center">
                                    <div>
                                        <Button
                                            :disabled="listdisable"
                                            type="text"
                                            :size="buttonSize"
                                            icon="md-remove-circle"
                                            style="min-width: 20px"
                                            @click="handleRemove(index)"
                                        />
                                    </div>
                                </td>-->
                            </tr>
                        </table>

                        <div class="footer-wrapper">
                            <i-button
                                type="primary"
                                class="mar-r-24"
                                @click="handleAddconfirm('addList')"
                            >
                                确认
                            </i-button>
                            <i-button @click="cancelFirm('addList')">
                                取消
                            </i-button>
                        </div>
                        <file
                            v-if="idlist === 2"
                            v-show="false"
                            ref="file"
                            :on-before-upload="onBeforeUpload"
                            @on-end="onUploadEnd"
                        />
                    </i-form>
                </div>
            </Modal>
        </div>
        <modalPool ref="modalPool" />
    </page-list>
</template>

<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import File from '@/view/components/upload/file/index.vue';
import api from '@/api/integral';
import { extend } from '@/libs/utils';
import AppImg from "@/view/events/check/components/img/index.vue"; // eslint-disable-line
import modalPool from './pool.vue';

export default {
    components: {
        PageList,
        File,
        AppImg,
        modalPool,
    },
    data() {
        const that = this;
        /* eslint-disable */
        const validateNumber = (rule, value, callback) => {
            if (/^[0-9]+$/.test(value)) {
                callback();
            } else {
                return callback(new Error("请设置可用库存"));
            }
        };
        const validateNumberxs = (rule, value, callback) => {
            if (/^[0-9]+$/.test(value)) {
                callback();
            } else {
                return callback(new Error("请设置可用积分"));
            }
        };
        /* eslint-enable */
        return {
            listdisable: true,
            buttonSize: 'large',
            activity_id: Number(this.$route.params.activity_id),
            shows: 1,
            pointAddShow: false,
            pointjp: false,
            remnant: 15,
            btnListMall: [
                {
                    name: 'edit',
                },
                {
                    name: 'up',
                    // show(params) {
                    //     return params.status !== 2 && params.index !== 1;
                    // },
                    show(params) {
                        return params.sort !== 1 && params.status !== 2;
                    },
                },
                {
                    name: 'down',
                    /* eslint-disable */
                    show(params) {
                        // return params.status !== 2;
                        if (
                            that.formList.page_num ===
                            Math.ceil(params.total / 10)
                        ) {
                            return (
                                params.status !== 2 &&
                                that.list.length !== params.index
                            );
                        } else {
                            return params.status !== 2;
                        }
                    }
                    /* eslint-enable */
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
            columnsMall: [
                {
                    title: '商城ID',
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
                    title: '单品兑换积分',
                    key: 'price',
                    align: 'center',
                },
                {
                    title: '可用库存',
                    key: 'num',
                    align: 'center',
                },
                {
                    title: '兑换申请中',
                    key: 'lock_num',
                    align: 'center',
                },
                {
                    title: '已兑换',
                    key: 'sell_num',
                    align: 'center',
                },
                {
                    title: '上架状态',
                    key: 'status_name',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '240',
                    align: 'center',
                },
            ],
            list: [],
            total: 0,
            form: {
                image: '',
            },
            PointsExchangeAdd: false,
            addpp: {
                name: '',
                img: '',
                unit: '',
                num: '',
                price: '',
            },
            show: false,
            loading: true,
            currentUploadImg: '',
            currentUploadingImg: '',
            uploadImgStatus: {
                image: '',
            },
            uploadImgStatusaddpp: {
                img: '',
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
                        pattern: /^[0-9]+$/,
                    },
                ],
                price: [
                    {
                        required: true,
                        validator: validateNumberxs,
                        trigger: 'blur',
                        pattern: /^[0-9]+$/,
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
                            callback('请上传图片');
                        }
                    },
                },
            },
            rulesll: {
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
            },
            value16: '',
            addList: {
                items: [
                    {
                        name: '',
                        img: '',
                        unit: '',
                        num: '',
                        price: '',
                        index: 1,
                        status: 1,
                    },
                ],
            },
            formaddList: {
                name: '',
                img: '',
                unit: '',
                num: '',
                price: '',
            },
            nameIndex: null,
            formList: {
                name: '',
                start_time: '',
                end_time: '',
                is_top: '',
                status: '',
                page_size: 10,
                page_num: 1,
                activity_id: Number(this.$route.params.activity_id),
            },
            currentState: [
                {
                    value: 1,
                    label: '已上架',
                },
                {
                    value: 2,
                    label: '已下架',
                },
            ],
            adressSh: {},
            getdeliveryinfo: {},
            ztshshow: false,
            model1: '',
            kdnumber: false,
            numberLength: '',
            idlist: '',
        };
    },
    created() {
        this.getListDataqqlist();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        addL() {
            this.index += 1;
            this.listdisable = false;
            this.addList.items.push({
                name: '',
                img: '',
                unit: '',
                num: '',
                price: '',
                index: this.index,
                status: 1,
            });
        },
        parseData(list, total) {
            list.forEach((v, i) => {
                // eslint-disable-next-line camelcase education_level:gift_img,
                const { start_time, end_time } = v;
                const info = v;
                info.time = `${start_time}--${end_time}`;
                info.index = i + 1;
                info.total = total;
                if (this.shows === 3) {
                    info.img = v.gift_img;
                }
            });
            return list;
        },
        getListDataqqlist(pageNum = 1) {
            this.formList.page_num = pageNum;
            api.marketList(this.formList)
                .then(({ data: { list, total } }) => {
                    this.list = this.parseData(list, total);
                    this.total = total;
                    this.numberLength = list.length;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleAction({ name }, params) {
            // const { id, status, show_type: showType } = params;
            switch (name) {
                case 'upperShelf':
                case 'lowerShelf':
                    this.handleConfirmModal(params.status, params.id);
                    break;
                case 'up':
                    this.paixu(1, params.id);
                    break;
                case 'down':
                    this.paixu(2, params.id);
                    break;
                case 'edit':
                    this.handleShow(params);
                    break;
                case 'modalPool':
                    this.$refs.modalPool.show(this.activity_id);
                    break;
                default:
                    break;
            }
        },
        paixu(
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
                    this.getListDataqqlist(this.formList.page_num);
                },
                (err) => {
                    this.$Message.error(err);
                },
            );
        },
        handleShow(params) {
            this.$nextTick(() => {
                this.pointjp = !this.pointjp;
                this.addpp = params;
                this.idlist = 1;
            });
        },
        handleConfirmModal(status, id, showType) {
            const text = ['删除', '下架', '上架'][status];
            this.$Modal.confirm({
                title: '提示',
                content: `确认${text}`,
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
        // 删除/下架/上架
        handleSearchLabelItem(data) {
            this.openMainSpin(true);
            api[data.status ? 'changeszt' : 'deleteSearchLabel'](data)
                .then(() => {
                    this.$Message.success('操作成功');
                    this.openMainSpin(false);
                    this.getListDataqqlist(this.formList.page_num);
                })
                .catch(this.openMainSpin(false));
        },
        add() {
            this.$Message.info('Clicked ok');
        },
        handleAddconfirm(addList) {
            this.$refs[addList].validate((res) => {
                if (res) {
                    this.lwgiftAdd();
                } else {
                    this.$Message.info('请输入完整的信息');
                }
            });
        },
        handleRemove(index) {
            if (index > 0) {
                this.addList.items[index].status = 0;
                this.listdisable = false;
            } else {
                this.listdisable = true;
            }
        },
        cancelFirm(addList) {
            this.$refs[addList].resetFields();
            this.PointsExchangeAdd = false;
        },
        // 添加
        lwgiftAdd(
            data = {
                activity_id: this.activity_id,
                gift_infos: this.addList.items,
            },
        ) {
            api.marketAdd(data).then(
                () => {
                    this.$Message.success('操作成功');
                    this.$emit('on-end');
                    this.PointsExchangeAdd = false;
                    this.getListDataqqlist();
                },
                (err) => {
                    this.$Message.error(err);
                },
            );
        },
        cancel() {
            this.$Message.info('Clicked cancel');
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
        handleAddEvent() {
            this.$refs.addpp.validate((res) => {
                if (res) {
                    this.updateEventInfo();
                }
            });
        },
        /* eslint-disable */
        getEventInfo(id) {
            api.getInfo({ id }).then(({ data }) => {
                const { img: img } = data;
                this.form = {
                    ...extend(this.addpp, data),
                    img
                };
            });
        },
        /* eslint-enable */
        handleDelete(info) {
            this.form[info] = '';
            this.uploadImgStatus[info] = false;
        },
        handleDeletesc(info) {
            this.addpp[info] = '';
            // this.addpp.img = '';
            this.uploadImgStatusaddpp[info] = false;
        },
        uploadFile(img, i) {
            this.nameIndex = i;
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
            [this.nameIndex].img = img;
        },
        onUploadEnd([{ path }]) {
            this.formaddList[this.currentUploadingImg] = path;
            this.addList.items[this.nameIndex].img = path;
            // this.addListjf[this.nameIndex].img = path;
        },
        onBeforeUpload() {
            this.currentUploadingImg = this.currentUploadImg;
            this.uploadImgStatus[this.currentUploadImg] = true;
            return true;
        },
        uploadFilesc(img) {
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
        },
        onBeforeUploadsc() {
            this.currentUploadingImg = this.currentUploadImg;
            this.uploadImgStatusaddpp[this.currentUploadImg] = true;
            return true;
        },
        onUploadEndsc([{ path }]) {
            this.addpp[this.currentUploadingImg] = path;
            this.addpp.img = path;
        },
        handleCancel() {
            this.pointjp = false;
            this.$refs.addpp.resetFields();
            this.getListDataqqlist(this.formList.page_num);
        },

        /* eslint-disable */
        updateEventInfo(
            data = {
                activity_id: this.activity_id,
                id: Number(this.addpp.id),
                img: this.addpp.img,
                unit: this.addpp.unit,
                num: Number(this.addpp.num),
                price: Number(this.addpp.price),
                name: this.addpp.name
            }
        ) {
            api.giftAdd(data).then(
                () => {
                    this.$Message.success("操作成功");
                    this.$emit("on-end");
                    this.pointjp = false;
                    // this.getListDataqqlist();
                    this.getListDataqqlist(this.formList.page_num);
                },
                err => {
                    this.$Message.error(err);
                }
            );
        },
        /* eslint-enable */
        handleShowadd() {
            this.PointsExchangeAdd = true;
            this.idlist = 2;
        },
        handleReset() {
            const { formList } = this;
            this.formList = {
                ...formList,
                status: '',
                name: '',
            };
            this.getListDataqqlist();
        },
    },
};
</script>

<style lang="less" scoped>
.style_add {
    /deep/ .add-event .ivu-input-wrapper {
        width: 100%;
    }
    /deep/ .ivu-form-item-content {
        margin-left: 0 !important;
    }
}
</style>
