<template>
    <div>
        <Modal
            v-model="isModalShow"
            width="468"
            title="设置中奖策略"
            footer-hide
            class="modal-winner"
        >
            <i-form
                ref="form"
                :label-width="100"
                :model="form"
                :rules="rules"
                class="mar-b-24"
            >
                <form-item
                    label="快递单号"
                    prop="code"
                >
                    <i-input
                        v-if="!data.logistics"
                        v-model="form.code"
                        type="text"
                        placeholder="请填写快递单号"
                    />
                    <div v-else>
                        {{ data.logistics.code }}
                    </div>
                </form-item>

                <form-item
                    label="快递公司"
                    prop="name"
                >
                    <i-input
                        v-if="!data.logistics"
                        v-model="form.name"
                        type="text"
                        placeholder="请填写快递公司"
                    />
                    <div v-else>
                        {{ data.logistics.name }}
                    </div>
                </form-item>
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
import api from '@/api/raffle';

export default {
    data() {
        return {
            isModalShow: false,
            data: {},
            form: {
                id: '',
                name: '',
                code: '',
            },
            rules: {
                code: [
                    {
                        required: true,
                        message: '请填写快递单号',
                        trigger: 'blur',
                    },
                ],
                name: [
                    {
                        required: true,
                        message: '请填写快递公司',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    methods: {
        onSelect() {
            this.form.value = null;
        },
        onOk() {
            // eslint-disable-next-line consistent-return
            this.$refs.form.validate((res) => {
                if (res) {
                    // eslint-disable-next-line arrow-body-style
                    api.delivery(this.form).then(() => {
                        this.$emit('save');
                        this.hide();
                        return this.$Message.success('保存成功！');
                    });
                }
            });
            // return this.$Message.info('请输入相应的值');
        },

        show(data) {
            this.form = {
                id: data.id,
                name: '',
                code: '',
            };
            this.data = data;
            // this.form =
            this.isModalShow = true;
        },
        hide() {
            this.isModalShow = false;
        },
    },
};
</script>
