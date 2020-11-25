<template>
    <Modal
        v-model="show"
        title="新增"
        width="400"
        class="add-search-label"
    >
        <i-form
            ref="form"
            :model="form"
            :label-width="80"
            :rules="rules"
        >
            <form-item
                label="推荐词"
                prop="rec_word"
            >
                <i-input
                    v-model.trim="form.rec_word"
                    :maxlength="13"
                />
            </form-item>
            <form-item
                label="显示位置"
                prop="show_type"
            >
                <RadioGroup v-model="form.show_type">
                    <Radio label="3">
                        PC
                    </Radio>
                    <Radio label="2">
                        APP
                    </Radio>
                    <Radio label="1">
                        小程序
                    </Radio>
                </RadioGroup>
            </form-item>
            <form-item label="是否上架">
                <RadioGroup v-model="form.status">
                    <Radio :label="1">
                        上架
                    </Radio>
                    <Radio :label="2">
                        下架
                    </Radio>
                </RadioGroup>
                <p>选择上架后，点击确认会将新增推荐词上架展示</p>
            </form-item>
        </i-form>

        <template slot="footer">
            <i-button
                type="primary"
                @click="handleClickSave"
            >
                确认
            </i-button>
            <i-button @click="show = !show">
                取消
            </i-button>
        </template>
    </Modal>
</template>

<script>
import api from '@/api/information';

export default {
    name: 'AddSearchLabel',
    data() {
        return {
            show: false,
            form: {
                rec_word: '',
                show_type: '3',
                status: 1,
            },
            flag: false,
            rules: {
                rec_word: [
                    {
                        required: true,
                        message: '请输入推荐词',
                        trigger: 'change',
                    },
                ],
            },
        };
    },
    methods: {
        // 添加/修改
        handleSearchLabel() {
            const {
                show_type: type, rec_word: word, status, id,
            } = this.form;

            this.show = false;
            if (this.flag) return;
            this.flag = true;
            api[id ? 'updateSearchLabelInfo' : 'addSearchLabel']({
                id,
                rec_word: word,
                status,
                show_type: type,
            }).then(() => {
                this.$Message.success('操作成功');
                this.$emit('on-success');
            });
        },
        handleShow(params) {
            this.show = true;
            this.$refs.form.resetFields();
            if (!params) {
                // eslint-disable-next-line no-param-reassign
                params = {
                    rec_word: '',
                    show_type: '3',
                    status: 1,
                };
            }
            this.form = {
                ...params,
            };
            this.flag = false;
        },
        handleClickSave() {
            this.$refs.form.validate((res) => {
                if (res) {
                    this.handleSearchLabel();
                }
            });
        },
    },
};
</script>

<style lang="less">
.add-search-label {
    .ivu-input-wrapper {
        width: 240px;
    }
}
</style>
