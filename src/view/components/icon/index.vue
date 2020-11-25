<template>
    <i :class="['common-icon', 'icon-' + name]" />
</template>

<script>
export default {
    name: 'Index',
    props: {
        name: {
            type: String,
            default: '',
        },
    },
};
</script>

<style scoped></style>
