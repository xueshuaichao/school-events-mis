<template>
    <div>
        <Modal
            v-model="isModalShow"
            width="887"
            title="设置奖池"
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
                    :data="formDynamic.data"
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
import mallApi from '@/api/mall';

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
                                value: this.formDynamic.data[params.index].name,
                                callback: (value) => {
                                    this.formDynamic.data[
                                        params.index
                                    ].name = value;
                                },
                            },
                        });

                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `data[${params.index}].name`,
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
                                        console.log(this.$refs);
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
                                        src: params.row.image,
                                    },
                                }),
                                h('Icon', {
                                    props: {
                                        type: 'md-close-circle',
                                    },
                                    on: {
                                        click: () => {
                                            this.formDynamic.data[
                                                params.index
                                            ].image = null;
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
                        } else if (this.formDynamic.data[params.index].image) {
                            dom = [input, image];
                        } else {
                            dom = [input, btn];
                        }
                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `data[${params.index}].image`,
                                    rules: this.rules.image,
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
                                value: this.formDynamic.data[params.index].unit,
                                callback: (value) => {
                                    this.formDynamic.data[
                                        params.index
                                    ].unit = value;
                                },
                            },
                        });

                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `data[${params.index}].unit`,
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
                                // maxlength: 15,
                                placeholder: '请设置可用库存',
                                type: 'number',
                                // 'show-word-limit': true,
                            },
                            model: {
                                value: this.formDynamic.data[params.index]
                                    .capacity,
                                callback: (value) => {
                                    this.formDynamic.data[
                                        params.index
                                    ].capacity = value - 0;
                                },
                            },
                        });

                        return h(
                            'FormItem',
                            {
                                props: {
                                    prop: `data[${params.index}].capacity`,
                                    rules: this.rules.capacity,
                                },
                            },
                            [input],
                        );
                    },
                },
                {
                    title: '是否为虚拟商品',
                    align: 'center',
                    width: 140,
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'RadioGroup',
                            {
                                props: {
                                    value: params.row.is_virtual,
                                },
                                on: {
                                    'on-change': (val) => {
                                        // params.row.is_virtual = val;
                                        this.data[
                                            params.index
                                        ].is_virtual = val;
                                    },
                                },
                            },
                            [
                                h('Radio', { props: { label: 1 } }, '是'),
                                h('Radio', { props: { label: 0 } }, '否'),
                            ],
                        );
                    },
                },
            ],
            formDynamic: {
                data: [
                    {
                        name: '',
                        image: '',
                        unit: '',
                        capacity: 0,
                        is_virtual: 0,
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
                image: [
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
                capacity: [
                    {
                        required: true,
                        message: '请填写库存数量',
                        trigger: 'blur',
                        type: 'number',
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
            this.formDynamic.data.push({
                name: '',
                image: '',
                unit: '',
                capacity: 0,
                is_virtual: 0,
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
                    this.formDynamic.data[index].image = path;

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
                    mallApi.batchCreate(this.formDynamic).then(() => {
                        this.$emit('save');
                        this.$Message.success('添加成功！');
                        this.hide();
                    });
                } else {
                    this.$Message.info('请输入完成的信息');
                }
            });
        },

        resetForm() {
            this.formDynamic.data = [
                {
                    name: '',
                    image: '',
                    unit: '',
                    capacity: 0,
                    is_virtual: 0,
                },
            ];
        },
        show(draw_id) {
            this.formDynamic.draw_id = draw_id;
            this.isModalShow = true;
            this.resetForm();
        },
        hide() {
            this.isModalShow = false;
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
        margin: 24px 0;
    }

    .img-wrap {
        position: relative;
        padding: 10px 0;
        width: 60px;
        margin: 0 auto;

        .img-preview {
            width: 60px;
            height: 60px;
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
