<template>
    <div>
        <Modal
            v-model="isModalShow"
            width="887"
            title="添加兑换商品"
            footer-hide
            class="modal-gift-pool"
        >
            <i-form
                ref="form"
                class="mar-b-24"
                :model="formDynamic"
                :rules="rules"
            >
                <div class="hd">
                    <div class="tips">
                        建议图片照片尺寸为173*98像素
                    </div>
                    <div
                        class="add"
                        @click="onAdd"
                    >
                        继续添加
                    </div>
                </div>
                <i-table
                    :columns="columns"
                    :data="formDynamic.gift_infos"
                />
            </i-form>
            <div
                class="footer-wrapper"
                style="text-align: center;"
            >
                <i-button
                    type="primary"
                    class="mar-r-24"
                    @click="onOk"
                >
                    确定
                </i-button>
                <i-button @click="hide">
                    取消
                </i-button>
            </div>
        </Modal>
    </div>
</template>

<script>
import api from '@/api/information';
// import mallApi from '@/api/mall';
import apitk from '@/api/integral';

export default {
    data() {
        return {
            isModalShow: false,
            columns: [
                {
                    title: '奖品名称',
                    align: 'center',
                    key: 'name',
                    width: 280,
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const input = h('Input', {
                            props: {
                                // value: params.row.name,
                                maxlength: 15,
                                placeholder: '请填写奖品名称',
                                'show-word-limit': true,
                            },
                            model: {
                                value: this.formDynamic.gift_infos[params.index]
                                    .name,
                                callback: (value) => {
                                    this.formDynamic.gift_infos[
                                        params.index
                                    ].name = value;
                                },
                            },
                        });

                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `gift_infos[${params.index}].name`,
                                    rules: this.rules.name,
                                },
                            },
                            [input],
                        );
                    },
                },
                {
                    title: '奖品图片',
                    align: 'center',
                    key: 'age',
                    width: 120,
                    render: (h, params) => {
                        let dom = [];
                        const refKey = `file${params.index}`;
                        const input = h('input', {
                            style: {
                                display: 'none',
                            },
                            domProps: {
                                type: 'file',
                                id: refKey,
                                accept: 'image/*',
                            },
                            on: {
                                change: (e) => {
                                    const files = Array.prototype.slice.call(
                                        e.target.files,
                                    );
                                    if (files.length) {
                                        this.uploadFile(files[0], params.index);
                                    }
                                    e.target.value = null;
                                },
                            },
                        });

                        const btn = h(
                            'span',
                            {
                                style: {
                                    color: '#1166FF',
                                    cursor: 'pointer',
                                },
                                on: {
                                    click: () => {
                                        // this.$refs[refKey].click();
                                        document.getElementById(refKey).click();
                                        // console.log(this.$refs);
                                    },
                                },
                            },
                            '上传照片',
                        );

                        const image = h(
                            'div',
                            {
                                domProps: {
                                    className: 'img-wrap',
                                },
                            },
                            [
                                h('img', {
                                    domProps: {
                                        className: 'img-preview',
                                        src: params.row.img,
                                    },
                                }),
                                h('Icon', {
                                    props: {
                                        type: 'md-close-circle',
                                    },
                                    on: {
                                        click: () => {
                                            this.formDynamic.gift_infos[
                                                params.index
                                            ].img = null;
                                        },
                                    },
                                }),
                            ],
                        );

                        // <Icon type="" />
                        const uploading = h('Icon', {
                            props: {
                                type: 'ios-loading',
                            },
                        });

                        if (this.isUploading.includes(params.index)) {
                            dom = [uploading];
                        } else if (
                            this.formDynamic.gift_infos[params.index].img
                        ) {
                            dom = [input, image];
                        } else {
                            dom = [input, btn];
                        }
                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `gift_infos[${params.index}].img`,
                                    rules: this.rules.img,
                                },
                            },
                            dom,
                        );
                    },
                },
                {
                    title: '奖品单位',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const input = h('Input', {
                            props: {
                                // value: params.row.name,
                                maxlength: 4,
                                placeholder: '请设置单位',
                                'show-word-limit': true,
                            },
                            model: {
                                value: this.formDynamic.gift_infos[params.index]
                                    .unit,
                                callback: (value) => {
                                    this.formDynamic.gift_infos[
                                        params.index
                                    ].unit = value;
                                },
                            },
                        });

                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `gift_infos[${params.index}].unit`,
                                    rules: this.rules.unit,
                                },
                            },
                            [input],
                        );
                    },
                },
                {
                    title: '可用库存',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const input = h('Input', {
                            props: {
                                // value: params.row.name,
                                maxlength: 5,
                                placeholder: '请设置库存',
                                // type: 'number',
                                // 'show-word-limit': true,
                            },
                            model: {
                                value: this.formDynamic.gift_infos[params.index]
                                    .num,
                                callback: (value) => {
                                    this.formDynamic.gift_infos[
                                        params.index
                                    ].num = value;
                                },
                            },
                        });

                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `gift_infos[${params.index}].num`,
                                    rules: this.rules.num,
                                },
                            },
                            [input],
                        );
                    },
                },
                {
                    title: '单品兑换积分',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const input = h('Input', {
                            props: {
                                // value: params.row.name,
                                maxlength: 5,
                                placeholder: '请设置积分',
                                // type: 'number',
                                // 'show-word-limit': true,
                            },
                            model: {
                                value: this.formDynamic.gift_infos[params.index]
                                    .price,
                                callback: (value) => {
                                    this.formDynamic.gift_infos[
                                        params.index
                                    ].price = value;
                                },
                            },
                        });

                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `gift_infos[${params.index}].price`,
                                    rules: this.rules.price,
                                },
                            },
                            [input],
                        );
                    },
                },
            ],
            formDynamic: {
                activity_id: this.activity_id,
                gift_infos: [
                    {
                        name: '',
                        img: '',
                        unit: '',
                        num: '',
                        price: '',
                    },
                ],
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请填写奖品名称',
                        trigger: 'blur',
                    },
                ],
                img: [
                    {
                        required: true,
                        message: '请上传图片',
                        trigger: 'blur',
                    },
                ],
                unit: [
                    {
                        required: true,
                        message: '请设置单位',
                        trigger: 'blur',
                    },
                ],
                num: [
                    {
                        required: true,
                        message: '请填写库存数量',
                        trigger: 'blur',
                        // type: 'number',
                        pattern: /^[0-9]+$/,
                    },
                ],
                price: [
                    {
                        required: true,
                        message: '请填写积分',
                        trigger: 'blur',
                        // type: 'number',
                        pattern: /^[0-9]+$/,
                    },
                ],
            },

            isUploading: [],
        };
    },
    methods: {
        onSelect() {
            this.form.value = null;
        },
        onAdd() {
            this.formDynamic.gift_infos.push({
                name: '',
                img: '',
                unit: '',
                num: '',
                price: '',
            });
        },

        uploadFile(file, index) {
            // this.isUploading[index] = true;
            this.isUploading.push(index);
            return api
                .fileUpload({
                    file,
                    file_type: '1',
                })
                .then(({ data: { path } }) => {
                    // this.uploadSuccess(path, index);
                    this.formDynamic.gift_infos[index].img = path;

                    const i = this.isUploading.indexOf(index);
                    this.isUploading.splice(i, 1);
                })
                .catch(() => {
                    // this.uploadError(index);
                });
        },

        onOk() {
            this.$refs.form.validate((res) => {
                if (res) {
                    apitk.marketAdd(this.formDynamic).then(() => {
                        this.$emit('save');
                        this.$Message.success('添加成功！');
                        this.hide();
                        this.formDynamic = {
                            activity_id: this.activity_id,
                            gift_infos: [
                                {
                                    name: '',
                                    img: '',
                                    unit: '',
                                    num: '',
                                    price: '',
                                },
                            ],
                        };
                    });
                } else {
                    this.$Message.info('请输入完整的信息');
                }
            });
        },

        show(activity_id) {
            this.formDynamic.activity_id = activity_id;
            this.isModalShow = true;
            // this.formDynamic.gift_infos.forEach((v) => {
            //     // eslint-disable-next-line camelcase education_level:gift_img,
            //     const info = v;
            //     info.img = v.image;
            // });
        },
        hide() {
            this.isModalShow = false;
            this.formDynamic = {
                activity_id: this.activity_id,
                gift_infos: [
                    {
                        name: '',
                        img: '',
                        unit: '',
                        num: '',
                        price: '',
                    },
                ],
            };
        },
    },
};
</script>

<style lang="less">
.modal-gift-pool {
    .hd {
        display: flex;
        margin-bottom: 10px;
    }

    .tips {
        font-weight: 400;
        color: rgba(150, 151, 153, 1);
        line-height: 20px;
        font-size: 14px;
        flex: 1;
    }

    .add {
        font-size: 14px;
        font-weight: 400;
        color: rgba(17, 102, 255, 1);
        line-height: 20px;
        width: 60px;
        cursor: pointer;
    }

    .form {
        display: flex;

        .label {
            width: 100px;
            font-size: 14px;
            font-weight: 500;
            color: rgba(49, 50, 51, 1);
            line-height: 24px;
            text-align: right;
        }

        .item {
            flex: 1;
        }
    }
    .ivu-form-item {
        margin: 2px 0;
    }

    .img-wrap {
        position: relative;
        padding: 10px 0;
        width: 80px;
        margin: 0 auto;

        .img-preview {
            width: 80px;
            height: 54px;
            display: block;
        }

        .ivu-icon {
            padding: 5px;
            position: absolute;
            top: 0px;
            right: -8px;
            color: #ff6849;
            cursor: pointer;
        }
    }
}
</style>
