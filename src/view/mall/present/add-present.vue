<template>
    <page-edit
        :on-cancel="handleCancel"
        @on-save="handleSave"
    >
        <div
            v-if="info"
            class="flex-row present-info mar-b-24"
        >
            <div class="item">
                兑换总量：<span>{{ info.pay_num }}</span>
            </div>
            <div class="item">
                创建人： <span> {{ info.creater }} </span>
            </div>
            <div class="item">
                创建时间：<span>{{ info.create_time }}</span>
            </div>
        </div>
        <i-form
            id="add-present"
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="100"
        >
            <form-item
                v-if="info"
                label="礼品ID"
            >
                {{ info.show_id }}
            </form-item>
            <form-item
                label="礼品名称"
                prop="name"
            >
                <i-input
                    v-model="form.name"
                    placeholder="请输入礼品名称"
                    :maxlength="20"
                />
            </form-item>
            <form-item
                label="礼品分类"
                prop="cat_id"
            >
                <Select v-model="form.cat_id">
                    <Option
                        v-for="item in list"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.type_name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="礼品图片"
                prop="img"
            >
                <div class="gift-images flex-row">
                    <div
                        v-for="(item, index) in form.img"
                        :key="index"
                        class="item"
                        @click="upload(index)"
                    >
                        <img
                            v-if="item"
                            :src="item"
                            alt=""
                        >
                        <Icon
                            v-if="item"
                            type="ios-close-circle"
                            color="#FF6849"
                            size="20"
                            @click.stop="handleDelete(index)"
                        />
                        <div
                            v-if="loading && currentUploadIndex === index"
                            class="loading"
                        >
                            <Icon
                                type="ios-loading"
                                class="spin-icon-load"
                                size="30"
                            />
                        </div>
                    </div>
                </div>
            </form-item>
            <form-item
                label="礼品价值"
                prop="price"
            >
                <i-input
                    v-model="form.price"
                    placeholder="请输入礼品价格"
                    :maxlength="5"
                />
                挑战币
            </form-item>
            <form-item
                label="库存数量"
                prop="stock"
            >
                <i-input
                    v-model="form.stock"
                    placeholder="请设置库存数量"
                    :maxlength="5"
                />
            </form-item>
            <form-item
                label="礼品状态"
                prop="status"
            >
                <RadioGroup v-model="form.status">
                    <Radio :label="1">
                        已上架
                    </Radio>
                    <Radio :label="2">
                        已下架
                    </Radio>
                </RadioGroup>
            </form-item>
            <form-item
                label="礼品简介"
                prop="introduction"
            >
                <editor v-model="form.introduction" />
            </form-item>
        </i-form>
        <upload
            v-show="false"
            ref="upload"
            :on-before-upload="beforeUpload"
            @on-end="uploadEnd"
        />
    </page-edit>
</template>

<script>
import { mapMutations } from 'vuex';
import PageEdit from '@/view/components/page/edit.vue';
import Editor from '@/view/components/editor/index.vue';
import Upload from '@/view/components/upload/file/index.vue';
import api from '@/api/mall';
import { extend, objectDiff } from '@/libs/utils';
import './index.less';

const PRESENT_MES_MAP = {
    name: '礼品名称',
    cat_id: '礼品分类',
    img: '礼品图片',
    price: '礼品价值',
    stock: '库存数量',
    status: '礼品状态',
    introduction: '礼品简介',
};

export default {
    name: 'AddPresent',
    components: {
        'page-edit': PageEdit,
        Editor,
        Upload,
    },
    data() {
        return {
            form: {
                id: '',
                name: '',
                cat_id: 0,
                img: ['', '', ''],
                price: '',
                stock: '',
                status: 2,
                introduction: '',
            },
            info: '',
            list: [],
            currentUploadIndex: 0,
            loading: false,
            rules: {
                name: {
                    required: true,
                    message: '请输入礼品名称',
                    trigger: 'blur',
                },
                cat_id: {
                    required: true,
                    type: 'number',
                    message: '请选择礼品分类',
                    trigger: 'change',
                },
                img: {
                    required: true,
                    type: 'array',
                    min: 1,
                    message: '请至少上传一张礼品图片',
                    trigger: 'change',
                    validator(rule, value, callback) {
                        if (value.join() === ',,') {
                            callback(new Error('请至少上传一张礼品图片'));
                        } else {
                            callback();
                        }
                    },
                },
                price: {
                    required: true,
                    trigger: 'blur',
                    validator(rule, value, callback) {
                        const val = Number(value);
                        if (!value.trim()) {
                            callback(new Error('请输入礼品价值'));
                        } else if (!Number.isInteger(val)) {
                            callback(new Error('请输入阿拉伯数字'));
                        } else {
                            callback();
                        }
                    },
                },
                stock: {
                    required: true,
                    trigger: 'blur',
                    validator(rule, value, callback) {
                        const val = Number(value);
                        if (!value.trim()) {
                            callback(new Error('请输入库存数量'));
                        } else if (!Number.isInteger(val)) {
                            callback(new Error('请输入阿拉伯数字'));
                        } else {
                            callback();
                        }
                    },
                },
                status: {
                    required: true,
                    type: 'number',
                    message: '请选择礼品状态',
                    trigger: 'change',
                },
                introduction: {
                    required: true,
                    message: '请输入礼品简介',
                    trigger: 'blur',
                },
            },
        };
    },
    created() {
        const { id } = this.$route.params;
        if (id) {
            this.getGiftInfo(id);
        }
        this.getGiftTypeList();
    },
    mounted() {
        const { handleClick } = this.$refs.upload;
        this.handleClick = handleClick;
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getGiftTypeList() {
            api.getGiftTypeList({ no_type: 1 }).then(({ data: { list } }) => {
                this.list = list;
            });
        },
        getGiftInfo(id) {
            api.getGiftInfo({ id }).then(({ data }) => {
                const info = extend(this.form, data);
                const { price, stock } = info;

                this.form = {
                    ...info,
                    price: String(price),
                    stock: String(stock),
                };
                this.info = data;
                this.backupInfo = JSON.parse(JSON.stringify(this.form));
            });
        },
        addGift() {
            this.openMainSpin(true);
            api.addGift(this.form)
                .then(() => {
                    this.openMainSpin(false);
                    if (!this.form.id) {
                        this.handleAddSuccess();
                    } else {
                        this.$Message.success('修改成功！');
                        this.handleCancel();
                    }
                })
                .catch(this.openMainSpin(false));
        },
        infoDiff() {
            const { backupInfo, form } = this;
            const str = [];
            if (objectDiff(backupInfo, form)) {
                Object.keys(backupInfo).forEach((v) => {
                    if (typeof backupInfo[v] === 'object') {
                        if (objectDiff(backupInfo[v], form[v])) {
                            str.push(PRESENT_MES_MAP[v]);
                        }
                    } else if (backupInfo[v] !== form[v]) {
                        str.push(PRESENT_MES_MAP[v]);
                    }
                });
                return this.handleDiff(str.join('、'));
            }
            return this.addGift();
        },
        beforeUpload() {
            this.loading = true;
            return true;
        },
        upload(index) {
            if (!this.loading) {
                this.currentUploadIndex = index;
                this.handleClick();
            }
        },
        uploadEnd([{ path }]) {
            this.loading = false;
            this.$set(this.form.img, this.currentUploadIndex, path);
        },
        handleAddSuccess() {
            this.$Modal.confirm({
                title: '提示',
                content: '礼品信息添加成功，是否继续添加礼品？',
                okText: '继续',
                cancelText: '暂不添加',
                onOk: () => {
                    this.form = {
                        name: '',
                        cat_id: 0,
                        img: ['', '', ''],
                        price: '',
                        stock: '',
                        status: 2,
                        introduction: '',
                    };
                },
                onCancel: () => {
                    this.handleCancel();
                },
            });
        },
        handleDiff(info) {
            this.$Modal.confirm({
                title: '提示',
                content: `您本次修改了<span style="color: #FFBF52">${info}</span>，您确定要保存本次修改吗?`,
                okText: '保存',
                onOk: () => {
                    this.addGift();
                },
            });
        },
        handleDelete(index) {
            this.$set(this.form.img, index, '');
        },
        handleSave() {
            this.$refs.form.validate((res) => {
                if (res) {
                    if (this.form.id) {
                        this.infoDiff();
                    } else {
                        this.addGift();
                    }
                }
            });
        },
        handleCancel() {
            this.$router.push({
                name: 'presentManage',
                params: { cat_id: this.form.cat_id.toString() },
            });
        },
    },
};
</script>
