<template>
    <div class="content-wrapper page-edit">
        <slot name="backBtn">
            <i-button
                class="btn-prev"
                @click="handleClickCancel"
            >
                返回
            </i-button>
        </slot>

        <slot />
        <template v-if="footer">
            <slot name="footer">
                <div class="footer">
                    <i-button
                        type="primary"
                        class="mar-r-16"
                        @click="handleClickSave"
                    >
                        {{ saveText }}
                    </i-button>
                    <i-button @click="handleClickCancel">
                        取消
                    </i-button>
                </div>
            </slot>
        </template>
    </div>
</template>

<script>
export default {
    name: 'PageEdit',
    props: {
        onCancel: {
            type: Function,
            default() {
                return true;
            },
        },
        saveText: {
            type: String,
            default: '保存',
        },
        footer: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            editor: {
                config: {
                    initialFrameWidth: 700,
                    initialFrameHeight: 320,
                },
            },
            form: {
                input: '',
                select: '',
                radio: '',
                image: '',
            },
            rules: {},
        };
    },
    methods: {
        handleClickSave() {
            this.$emit('on-save');
        },
        handleClickCancel() {
            if (this.onCancel()) {
                this.$router.go(-1);
            }
        },
    },
};
</script>

<style lang="less">
@import "../../../less/variables.less";

.page-edit {
    .ivu-form {
        padding-left: 72px;
    }
    .ivu-form-item {
        margin-bottom: 32px;
    }
    .ivu-form-item-content {
        font-size: 14px;
    }
    .ivu-form-item-label {
        color: @black;
    }
    .ivu-cascader-not-found-tip {
        width: 220px;
        line-height: 1.5;
    }
    .ivu-btn {
        min-width: 90px;
        height: 36px;
    }
    .footer {
        margin-top: 40px;
        text-align: center;
        margin-bottom: 50px;
    }
    .btn-prev {
        margin-bottom: 40px;
    }
    .flex-row {
        & > div {
            flex-shrink: 0;
        }
    }
}
@media screen and (max-width: 1600px) {
    .page-edit .flex-row {
        .large {
            margin-right: 20px;
            width: 320px;
        }
        .common-area .ivu-select {
            width: 110px;
        }
    }
}
</style>
