<template>
    <Modal
        v-model="show"
        title="详情"
        width="490"
    >
        <div class="common-modal">
            <slot name="content" />
        </div>
        <div slot="footer">
            <i-button
                type="primary"
                @click="handleSave"
            >
                确认
            </i-button>
            <i-button @click="handleHide">
                取消
            </i-button>
        </div>
    </Modal>
</template>

<script>
export default {
    name: 'Index',
    data() {
        return {
            show: false,
            info: {},
        };
    },
    methods: {
        handleShow(data = {}) {
            this.info = data;
            this.show = true;
        },
        handleHide() {
            this.show = false;
        },
        handleSave() {
            this.$emit('on-save');
        },
    },
};
</script>

<style lang="less">
@import "../../../less/variables.less";
.common-modal {
    font-size: 14px;
    .item {
        display: flex;
        flex-flow: row;
        align-items: center;
        margin-bottom: 28px;
        img {
            width: 160px;
            height: 90px;
            border-radius: 2px;
        }
    }
    .item:last-child {
        margin-bottom: 0;
    }
    .label {
        display: inline-block;
        width: 90px;
        text-align: right;
        margin-right: 16px;
        color: @black;
    }
    .value {
        color: @fontColor;
    }
    .value-error {
        .ivu-input {
            border: 1px solid @red;
            box-shadow: none;
        }
        .error {
            display: block;
        }
    }
    .error {
        display: none;
        color: @red;
        flex-shrink: 0;
        margin-left: 4px;
    }
}
</style>
