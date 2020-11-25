<template>
    <Modal
        v-model="show"
        title="重置密码"
    >
        <div class="reset-password">
            <p class="user mar-b-24">
                <span>
                    姓名
                </span>
                {{ info.name }}
            </p>
            <p class="tips">
                新密码为123456，确认后生效
            </p>
        </div>
        <template slot="footer">
            <i-button
                type="primary"
                @click="handleClickSure"
            >
                确认
            </i-button>
            <i-button @click="handleHide">
                取消
            </i-button>
        </template>
    </Modal>
</template>
<script>
import './index.less';

export default {
    name: 'Index',
    data() {
        return {
            info: {
                name: '',
                id: '',
            },
            show: false,
        };
    },
    methods: {
        handleShow(data) {
            this.info = data;
            this.show = true;
        },
        handleHide() {
            this.show = false;
        },
        handleClickSure() {
            this.$emit('on-sure', this.info.id);
        },
    },
};
</script>
