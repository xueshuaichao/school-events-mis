<template>
    <Select
        :value="select"
        :placeholder="'请选择' + placeholder"
        @on-change="handleChange"
    >
        <Option
            v-for="item in pullList"
            :key="item.value"
            :value="item.value"
        >
            {{ item.label }}
        </Option>
    </Select>
</template>

<script>
export default {
    name: 'Pull',
    props: {
        list: {
            type: Array,
            default() {
                return [];
            },
        },
        value: {
            type: [String, Number],
            default: '0',
        },
        placeholder: {
            type: String,
            default: '',
        },
        useType: {
            type: Boolean, // true 选择 false 搜索
            default: true,
        },
    },
    data() {
        return {
            pullList: [],
            select: '0',
        };
    },
    watch: {
        value(val) {
            this.select = val || '0';
        },
        list(val) {
            this.parseData(val);
        },
    },
    created() {
        const { list } = this;
        this.parseData(list);
        this.select = this.value || (this.useType ? '1' : '0');
    },
    methods: {
        parseData(list = []) {
            if (typeof list[0] !== 'object') {
                this.pullList = list.map((v, index) => ({
                    value: String(index + 1),
                    label: v,
                }));
            } else {
                this.pullList = JSON.parse(JSON.stringify(list));
            }
            if (!this.useType && !this.pullList.find(v => v.label === '全部')) {
                this.pullList.unshift({
                    label: '全部',
                    value: '0',
                });
            }
        },
        handleChange(value) {
            let data = '';
            if (value !== '0') {
                data = value;
            }
            this.$emit('input', data);
        },
    },
};
</script>

<style scoped></style>
