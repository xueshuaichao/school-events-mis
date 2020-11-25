<template>
    <div class="app-img">
        <Icon
            v-if="path"
            type="ios-close-circle"
            color="#FF6849FF"
            size="16"
            class="close"
            @click="close"
        />
        <Spin
            v-if="!path"
            fix
        >
            <Icon
                type="ios-loading"
                size="18"
                class="demo-spin-icon-load"
            />
        </Spin>
        <img
            v-if="path"
            :src="path"
        >
    </div>
</template>

<script>
export default {
    name: 'Img',
    props: {
        src: {
            type: String,
            default: '',
        },
        info: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            path: '',
        };
    },
    watch: {
        src(val) {
            this.path = val;
        },
    },
    created() {
        this.path = this.src;
    },
    methods: {
        close() {
            this.path = '';
            this.$emit('on-close', this.info, this.path);
        },
    },
};
</script>

<style lang="less">
@import "../../../../../less/variables.less";

.app-img {
    position: relative;
    width: 100px;
    height: 44px;
    text-align: center;
    border-radius: 2px;
    background-color: @borderColor;
    .close {
        position: absolute;
        right: -8px;
        top: -8px;
        &:hover {
            cursor: pointer;
        }
    }
    img {
        max-width: 100%;
        max-height: 44px;
        border-radius: 2px;
    }
    .ivu-spin-fix {
        background: none;
    }
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
}
</style>
