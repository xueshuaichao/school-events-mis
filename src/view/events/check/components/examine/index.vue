<template>
    <Modal
        v-model="options.show"
        title="提示"
        class="examine-modal"
    >
        <p
            v-if="options.status === 2"
            class="flex-row grade"
        >
            <span>作品等级：</span>
            <RadioGroup
                v-model="options.grade"
                type="button"
            >
                <Radio :label="1">
                    优秀
                </Radio>
                <Radio :label="0">
                    其他
                </Radio>
            </RadioGroup>
        </p>
        <p class="tip">
            审核备注(选填，30字以内)
        </p>
        <i-input
            v-model="options.reason"
            type="textarea"
            :maxlength="30"
            :autosize="{ minRows: 4, maxRows: 5 }"
            placeholder="请输入备注信息(30字以内)"
        />
        <div
            slot="footer"
            class="examine-footer"
        >
            <i-button @click="handleHide">
                取消
            </i-button>
            <i-button
                type="primary"
                @click="handleExamine"
            >
                {{ options.btnText }}
            </i-button>
        </div>
    </Modal>
</template>
<script>
import api from '@/api/activity';

export default {
    name: 'Index',
    data() {
        return {
            content: '',
            options: {
                show: false,
                type: 1,
                btnText: '审核通过',
                status: 2,
                reason: '',
                activity_id: '',
                grade: 0,
                resource_id: '',
                memo: '',
            },
        };
    },
    methods: {
        updateResourceStatus() {},
        handleHide() {
            this.options.show = false;
        },
        handleResolve(id, params = {}) {
            this.options = {
                ...this.options,
                show: true,
                btnText: '审核通过',
                status: 2,
                activity_id: id,
                reason: '',
                ...params,
            };
        },
        handleReject(id, params = {}) {
            this.options = {
                ...this.options,
                show: true,
                btnText: '审核驳回',
                status: 3,
                activity_id: id,
                reason: '',
                ...params,
            };
        },
        handleRejectResource(id, type) {
            this.options = {
                ...this.options,
                show: true,
                btnText: '下架',
                status: 3,
                resource_id: id,
                memo: '',
            };
            this.type = type;
        },
        handleExamine() {
            const {
                reason,
                status,
                activity_id: id,
                grade,
                type,
                resource_id: resourceId,
            } = this.options;
            const isResource = this.type === 'resource'; // 资源只有驳回
            this.handleHide();
            api[isResource ? 'educationResourceaudit' : 'updateActivityStatus'](
                {
                    activity_id: id,
                    status: isResource ? '2' : status,
                    reason,
                    grade,
                    resource_id: resourceId,
                    type,
                    memo: reason,
                },
            ).then(() => {
                this.$Message.success('操作成功');
                this.$emit('on-end');
            });
        },
    },
};
</script>

<style lang="less">
.examine-modal {
    .tip {
        font-size: 14px;
        margin-bottom: 16px;
    }
    .grade {
        margin-bottom: 16px;
    }
    .examine-footer {
        margin-top: -12px;
    }
}
</style>
