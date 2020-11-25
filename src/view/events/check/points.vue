<template>
    <div>
        <div v-if="list.length">
            <!--v-if="list.length"-->
            <page-list
                :columns="columns"
                :data="list"
                :btn-list="btnList"
                :page-params="{ total, page_num: form.page_num }"
                :hide-header-btn="false"
                @page-change="getListData"
                @btn-click="handleBtnClick"
            >
                <template slot="page-header">
                    <i-button
                        type="primary"
                        @click="handleClickBtn()"
                    >
                        添加积分活动
                    </i-button>
                </template>
                <!-- <add-raffle
                        ref="addLive"
                        @on-end="getListData(1)"
                    /> -->
            </page-list>
        </div>
        <div
            v-else
            class="add"
        >
            暂无任何积分活动，点击去
            <span
                class="addList"
                @click="handleClickBtn()"
            >添加</span>
        </div>
        <div>
            <div class="maill">
                <file
                    v-show="false"
                    ref="file"
                    :on-before-upload="onBeforeUpload"
                    @on-end="onUploadEnd"
                />
                <Modal
                    v-model="pointAddShow"
                    title="添加积分活动"
                    width="54%"
                    class="app-modal"
                    footer-hide
                    :mask-closable="false"
                >
                    <div class="style_add">
                        <i-form
                            ref="addListjf"
                            :model="addListjf"
                            class="add-event"
                        >
                            <form-item label="活动名称">
                                <Select
                                    v-model="addListjf.pointadds"
                                    style="width:210px"
                                    placeholder="请选择活动名称"
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
                            <form-item
                                label="兑换时间"
                                prop="time"
                            >
                                <date-picker
                                    :value="addListjf.start_time"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm"
                                    placeholder="开始时间"
                                    style="width:210px"
                                    @on-change="handleStartTimeChange"
                                />
                                至
                                <date-picker
                                    :value="addListjf.end_time"
                                    type="datetime"
                                    style="width:210px"
                                    format="yyyy-MM-dd HH:mm"
                                    placeholder="结束时间"
                                    @on-change="handleEndTimeChange"
                                />
                            </form-item>
                            <span
                                class="jiany"
                            >建议图片照片尺寸为100*100像素</span>
                            <div
                                class="addlistmaill"
                                title="添加一行"
                                style="cursor:pointer;display: inline-block;
                            float: right;font-size: 14px;color: #1166ff"
                                @click="addjf(addListjf.items.length)"
                            >
                                继续添加
                            </div>
                            <table
                                class="points"
                                cellspacing="0"
                                color="#ccc"
                            >
                                <tr
                                    style="background-color: #F8F9FA;height: 50px"
                                >
                                    <th>奖品名称</th>
                                    <th>奖品图片</th>
                                    <th>奖品单位</th>
                                    <th>可用库存</th>
                                    <th>单品兑换积分</th>
                                </tr>
                                <!--eslint-disable-->
                                <tr
                                    v-for="(item, index) in addListjf.items"
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
                                                :prop="
                                                    'items.' + index + '.name'
                                                "
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
                                                :prop="
                                                    'items.' + index + '.img'
                                                "
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
                                                        uploadFile(
                                                            'image',
                                                            index
                                                        )
                                                    "
                                                >
                                                    上传图片
                                                </p>
                                                <!-- v-if="
                                                        uploadImgStatus.image ||
                                                            item.img
                                                    "-->
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
                                    <td
                                        style=" padding:15px;text-align: center"
                                    >
                                        <div class="style_add">
                                            <form-item
                                                label=""
                                                :prop="
                                                    'items.' + index + '.unit'
                                                "
                                                :rules="{
                                                    required: true,
                                                    message: '请设置单位',
                                                    trigger: 'blur'
                                                }"
                                            >
                                                <Input
                                                    v-model="item.unit"
                                                    maxlength="4"
                                                    show-word-limit
                                                    placeholder="请设置单位"
                                                />
                                            </form-item>
                                        </div>
                                    </td>
                                    <td
                                        style=" padding:15px;text-align: center"
                                    >
                                        <div class="style_add">
                                            <form-item
                                                label=""
                                                :prop="
                                                    'items.' + index + '.num'
                                                "
                                                :rules="{
                                                    required: true,
                                                    message: '请设置正确的库存',
                                                    trigger: 'blur',
                                                    pattern: /^[0-9]+$/
                                                }"
                                            >
                                                <Input
                                                    v-model="item.num"
                                                    maxlength="5"
                                                    placeholder="请设置库存"
                                                />
                                            </form-item>
                                        </div>
                                    </td>
                                    <td
                                        style=" padding:15px;text-align: center"
                                    >
                                        <div class="style_add">
                                            <form-item
                                                label=""
                                                :prop="
                                                    'items.' + index + '.price'
                                                "
                                                :rules="{
                                                    required: true,
                                                    message: '请设置正确的积分',
                                                    trigger: 'blur',
                                                    pattern: /^[0-9]+$/
                                                }"
                                            >
                                                <Input
                                                    v-model="item.price"
                                                    maxlength="5"
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
                                                @click="
                                                    handleRemove(index)
                                                "
                                            />
                                        </div>
                                    </td>-->
                                </tr>
                            </table>

                            <div class="footer-wrapper">
                                <Button
                                    type="primary"
                                    @click="handleAddEvent('addListjf')"
                                >
                                    确认
                                </Button>
                                <Button
                                    style="margin-left: 8px"
                                    @click="cancel('addListjf')"
                                >
                                    取消
                                </Button>
                            </div>
                        </i-form>
                    </div>
                </Modal>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import File from '@/view/components/upload/file/index.vue';
import api from '@/api/integral';
import { extend } from '@/libs/utils';
import AppImg from "./components/img/index"; // eslint-disable-line
export default {
    components: {
        PageList,
        File,
        AppImg,
    },
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
            pointselect: false,
            listdisable: true,
            buttonSize: 'large',
            pointAddShow: false,
            pointjp: false,
            remnant: 15,
            btnList: [
                {
                    name: 'pointsMall',
                },
                {
                    name: 'exchangeAudit',
                },
            ],
            columns: [
                {
                    title: '活动名称',
                    key: 'activity_name',
                    align: 'center',
                },
                {
                    title: '兑换时间',
                    key: 'time',
                    align: 'center',
                },
                {
                    title: '活动状态',
                    key: 'status_name',
                    align: 'center',
                },
                {
                    title: '剩余奖品',
                    key: 'last_num',
                    align: 'center',
                },
                {
                    title: '已兑换奖品',
                    key: 'pass_num',
                    align: 'center',
                },
                {
                    title: '待审核奖品',
                    key: 'no_audit_num',
                    align: 'center',
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
            form: {
                page_num: 1,
                page_size: 10,
            },
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
                            callback('请上传封面');
                        }
                    },
                },
            },
            addListjf: {
                pointadds: '',
                start_time: '',
                end_time: '',
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
            pointadds: '',
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
            activityList: [],
        };
    },
    created() {
        this.getListData();
        this.getOptions();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        addjf() {
            this.index += 1;
            this.listdisable = false;
            this.addListjf.items.push({
                name: '',
                img: '',
                unit: '',
                num: '',
                price: '',
                index: this.index,
                status: 1,
            });
        },
        getListData(pageNum = 1) {
            this.form.page_num = pageNum;
            api.activitylist(this.form)
                .then(({ data: { list, total } }) => {
                    this.list = this.parseData(list, total);
                    // this.list = this.list.filter(
                    //     item => item.status - 0 < 2,
                    // );
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        getOptions() {
            api.getEventList({
                page_num: 1,
                page_size: 1000,
            }).then((res) => {
                this.activityList = res.data.list.filter(
                    item => item.status - 0 < 3,
                );
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
        handleClickBtn() {
            this.pointAddShow = true;
        },
        handleBtnClick({ name }, params) {
            const { activity_id } = params;
            if (name === 'pointsMall') {
                this.formList.activity_id = activity_id;
                this.$router.push(
                    `/check/points/pointsMall/${params.activity_id}`,
                );
            }
            if (name === 'exchangeAudit') {
                this.$router.push(
                    `/check/points/examine/${params.activity_id}`,
                );
            }
        },
        handleStartTimeChange(val) {
            this.addListjf.start_time = val;
        },
        handleEndTimeChange(val) {
            this.addListjf.end_time = val;
        },
        // 积分兑换
        txintegralAdd(
            data = {
                activity_id: this.addListjf.pointadds,
                gift_infos: this.addListjf.items,
                start_time: this.addListjf.start_time,
                end_time: this.addListjf.end_time,
            },
        ) {
            if (this.addListjf.pointadds !== '') {
                if (this.addListjf.start_time && this.addListjf.end_time) {
                    if (
                        new Date(this.addListjf.start_time).valueOf()
                        > new Date(this.addListjf.end_time).valueOf()
                    ) {
                        this.$Message.warning('结束时间不能小于开始时间！');
                        return;
                    }
                } else {
                    this.$Message.warning('请选择起始时间！');
                    return;
                }
                api.integralAdd(data).then(
                    () => {
                        this.$Message.success('操作成功！');
                        this.$emit('on-end');
                        this.pointAddShow = false;
                        this.$refs.addListjf.resetFields();
                        this.addListjf = {
                            pointadds: '',
                            start_time: '',
                            end_time: '',
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
                        };
                        this.getListData();
                    },
                    (err) => {
                        this.$Message.error(err);
                    },
                );
            } else {
                this.$Message.warning('请选择活动名称！');
            }
        },
        handleAddEvent(addListjf) {
            this.$refs[addListjf].validate((res) => {
                if (res) {
                    this.txintegralAdd();
                } else {
                    this.$Message.info('请输入完整的信息');
                }
            });
        },
        handleRemove(index) {
            if (index > 0) {
                this.addListjf.items[index].status = 0;
                this.listdisable = false;
            } else {
                this.listdisable = true;
            }
        },
        cancel(addListjf) {
            this.$refs[addListjf].resetFields();
            this.addListjf = {
                pointadds: '',
                start_time: '',
                end_time: '',
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
            };
            this.pointAddShow = false;
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
            // this.form[info] = '';
            this.addListjf.items[this.nameIndex].img = '';
            this.uploadImgStatus[info] = true;
        },
        uploadFile(img, i) {
            this.nameIndex = i;
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
            [this.nameIndex].img = img;
        },
        onUploadEnd([{ path }]) {
            this.addListjf.items[this.nameIndex].img = path;
        },
        onBeforeUpload() {
            this.currentUploadingImg = this.currentUploadImg;
            this.uploadImgStatus[this.currentUploadImg] = true;
            return true;
        },
        handleCancel() {
            this.pointjp = false;
        },
        handleReset() {
            const { addList } = this;
            this.form = {
                ...addList,
                name: '',
                start_time: '',
                end_time: '',
                status: '',
            };
            this.getEventList(1);
        },
    },
};
</script>
<style lang="less" scoped>
.points {
    font-size: 16px;
    width: 100%;
}
.limt {
    font-size: 12px;
    color: rgb(153, 153, 153);
    position: absolute;
    bottom: 0;
    right: 4px;
}
.maill {
    .jiany {
        color: #969799;
        font-size: 14px;
    }
}
.style_add {
    /deep/ .add-event .ivu-input-wrapper {
        width: 100%;
    }
    /deep/ .ivu-form-item-content {
        margin-left: 0 !important;
    }
    /deep/ .ivu-btn-small {
        min-width: 10px;
        height: 36px;
        font-size: 14px;
        border-radius: 2px;
    }
}
.add {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(49, 50, 51, 1);
    line-height: 24px;
    margin: 100px auto;
    text-align: center;
    .addList {
        cursor: pointer;
        font-weight: 500;
        color: rgba(17, 102, 255, 1);
        line-height: 22px;
    }
}
</style>
