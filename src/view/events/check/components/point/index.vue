<template>
    <div>
        <Modal
            v-model="isModalShow"
            width="536"
            title="设置中奖策略"
            footer-hide
            class="modal-point"
        >
            <i-form
                ref="form"
                :label-width="100"
                :model="form"
                :rules="rules"
                class="mar-b-24"
            >
                <form-item label="活动名称">
                    {{ data.activity_name }}
                </form-item>
                <form-item label="用户名">
                    {{ data.user_name }}
                </form-item>
                <form-item label="姓名">
                    {{ data.user_name }}
                </form-item>
                <form-item label="绑定手机号">
                    {{ data.mobile }}
                </form-item>
                <form-item label="积分余额">
                    {{ data.useful_score }}
                </form-item>
                <form-item label="积分变更">
                    <RadioGroup
                        v-model="form.type"
                        vertical
                        @on-change="onSelect"
                    >
                        <Radio label="add">
                            <span>增加积分</span><span
                                class="sep"
                                style="width: 18px;"
                            />
                            <i-input
                                v-model="form.val_add"
                                type="text"
                                :disabled="form.type !== 'add'"
                                style="width: 252px; margin: 0 5px;"
                            />
                        </Radio>
                        <Radio label="minus">
                            <span>扣除积分</span><span
                                class="sep"
                                style="width: 18px;"
                            />
                            <i-input
                                v-model="form.val_minus"
                                type="text"
                                :disabled="form.type !== 'minus'"
                                style="width: 252px; margin: 0 5px;"
                            />
                        </Radio>
                    </RadioGroup>
                    <i-input
                        v-model="form.reason"
                        placeholder="请填写原因"
                        style="width: 356px;"
                        type="textarea"
                        show-word-limit
                        maxlength="15"
                    />
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
import api from '@/api/integral';

export default {
    data() {
        return {
            isModalShow: false,
            data: {},
            form: {},
            rules: {
                type: [
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
            const value = this.form[`val_${this.form.type}`];
            const { reason, id, type } = this.form;
            if (!value) {
                return this.$Message.info('请输入要调整的积分值');
            }
            if (!reason) {
                return this.$Message.info('请输入调整原因');
            }
            return api
                .scoreUpdate({
                    id,
                    type: type === 'add' ? 1 : 2,
                    reason,
                    score: value,
                })
                .then(() => {
                    this.$emit('save');
                    this.hide();
                    return this.$Message.success('保存成功！');
                });

            // this.$refs.form.validate((res) => {
            //     if (res) {
            //         // eslint-disable-next-line arrow-body-style
            //         api.delivery(this.form).then(() => {
            //             this.$emit('save');
            //             this.hide();
            //             return this.$Message.success('保存成功！');
            //         });
            //     }
            // });
            // return this.$Message.info('请输入相应的值');
        },
        initForm() {
            this.form = {
                id: '',
                name: '',
                type: 'add',
                reason: '',
            };
        },

        show(data) {
            this.initForm();
            this.form.id = data.id;
            console.log(data);
            this.data = data;
            api.scoreInfo({
                id: data.id,
            }).then((res) => {
                console.log(res);
            });
            // this.form =
            this.isModalShow = true;
        },
        hide() {
            this.isModalShow = false;
        },
    },
};
</script>

<style lang="less">
.modal-point {
    // .form {
    //     display: flex;

    //     .label {
    //         width: 100px;
    //         font-size: 14px;
    //         font-weight: 500;
    //         color: rgba(49, 50, 51, 1);
    //         line-height: 24px;
    //         text-align: right;
    //     }

    //     .item {
    //         flex: 1;
    //     }
    // }
    .ivu-radio-group-item {
        height: 50px;

        .sep {
            display: inline-block;
        }
    }
}
</style>
