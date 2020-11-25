<template>
    <i-button
        type="primary"
        class="mar-r-10"
        @click="handleClickBtn"
    >
        <slot>创建</slot>
    </i-button>
</template>

<script>
export default {
    name: 'PayButton',
    props: {
        path: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    methods: {
        handleClickBtn() {
            const { path } = this;
            if (path) {
                this.$router.push(path);
            }
            this.$emit('on-click');
        },
    },
};
</script>
