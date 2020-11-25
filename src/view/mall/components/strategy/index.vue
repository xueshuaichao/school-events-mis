<template>
    <div>
        <Modal
            v-model="isModalShow"
            width="540"
            title="设置中奖策略"
            footer-hide
            class="modal-strategy"
        >
            <div class="form mar-b-24">
                <div class="label">
                    中奖设置：
                </div>
                <div class="item">
                    <RadioGroup
                        v-model="form.type"
                        vertical
                        @on-change="onSelect"
                    >
                        <Radio
                            label="times"
                            :disabled="!data.is_update"
                        >
                            <span>按抽奖次数</span><span
                                class="sep"
                                style="width: 18px;"
                            />
                            每<i-input
                                v-model="form.val_times"
                                type="text"
                                :disabled="
                                    !data.is_update || form.type !== 'times'
                                "
                                style="width: 100px; margin: 0 5px;"
                            />次
                        </Radio>
                        <Radio
                            label="users"
                            :disabled="!data.is_update"
                        >
                            <span>按抽奖人数</span><span
                                class="sep"
                                style="width: 35px;"
                            />
                            <i-input
                                v-model="form.val_users"
                                type="text"
                                :disabled="form.type !== 'users'"
                                style="width: 100px; margin: 0 5px;"
                            />人
                        </Radio>
                        <Radio
                            label="probability"
                            :disabled="!data.is_update"
                        >
                            <span>按抽奖概率</span><span
                                class="sep"
                                style="width: 35px;"
                            />
                            <i-input
                                v-model="form.val_probability"
                                type="text"
                                :disabled="form.type !== 'probability'"
                                style="width: 100px; margin: 0 5px;"
                            />支持小数点后五位
                        </Radio>
                    </RadioGroup>
                </div>
            </div>

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
export default {
    data() {
        return {
            isModalShow: false,
            data: {},
            form: {
                type: 'times',

                val_times: '',
                val_users: '',
                val_probability: '',
            },
        };
    },
    methods: {
        onSelect() {
            this.form.value = null;
        },
        onOk() {
            const val = this.form[`val_${this.form.type}`];
            if (!val) {
                return this.$Message.info('请输入相应的值');
            }
            if (this.form.type === 'probability') {
                if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,5})?$/.test(val)) {
                    return this.$Message.info('小数点后最多为5位');
                }
            }
            this.data.type = this.form.type;
            this.data.value = val;
            return this.hide();
        },

        show(data) {
            this.data = data;
            if (data.type) {
                this.form.type = data.type;
                this.form[`val_${data.type}`] = data.value;
            }
            this.isModalShow = true;
        },
        hide() {
            this.isModalShow = false;
        },
    },
};
</script>

<style lang="less">
.modal-strategy {
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
    .ivu-radio-group-item {
        height: 50px;

        .sep {
            display: inline-block;
        }
    }
}
</style>
