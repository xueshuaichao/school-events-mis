<template>
    <Modal
        v-model="show"
        :title="info.title"
        footer-hide
        width="530"
    >
        <div class="sort-modal">
            <p>{{ info.tips }}：</p>
            <i-input
                v-model="number"
                :placeholder="info.placeholder"
                :type="info.type"
                :maxlength="info.maxlength"
            />
            <i-button
                type="primary"
                @click="save"
            >
                确定
            </i-button>
            <i-button @click="hideModal">
                取消
            </i-button>
        </div>
    </Modal>
</template>

<script>
export default {
    name: 'Index',
    props: {
        info: {
            type: Object,
            default() {
                return {
                    title: '排序',
                    tips: '排序至第',
                    placeholder: '10',
                    type: 'number',
                    maxlength: 5,
                };
            },
        },
    },
    data() {
        return {
            show: false,
            number: '',
            params: {},
        };
    },
    methods: {
        showModal(params) {
            this.show = true;
            this.params = params;
            this.number = '';
        },
        hideModal() {
            this.show = false;
        },
        save() {
            this.$emit('on-save', this.number, this.params);
        },
    },
};
</script>
<style lang="less">
@import "../../../less/variables";

.sort-modal {
    display: flex;
    flex-flow: row;
    align-items: center;
    margin: 9px 0;
    p {
        font-size: 14px;
        color: @fontColor;
        flex-shrink: 0;
    }
    .ivu-input-wrapper {
        width: 190px;
    }
    .ivu-btn {
        margin-left: 16px;
    }
}
</style>
