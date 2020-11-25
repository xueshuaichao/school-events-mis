<template>
    <Cascader
        :value="value1"
        :data="list"
        placeholder="请选择部门"
        @on-change="handleChange"
    />
</template>

<script>
import api from '@/api/organization';

export default {
    name: 'Index',
    props: {
        select: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            list: [],
            value1: [],
        };
    },
    watch: {
        select: {
            immediate: true,
            handler(val) {
                this.getParentId(val);
            },
        },
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            api.getSchoolDepartment().then(({ data }) => {
                this.parseData(data);
            });
        },
        parseData(data) {
            const info = data;
            const { select } = this;
            function setAttr(info) {
                info.forEach((v) => {
                    const obj = v;
                    obj.label = v.name;
                    obj.value = String(v.id);
                    if (obj.children) {
                        setAttr(obj.children);
                    }
                });
            }
            setAttr(info);
            this.list = info;
            if (select) {
                this.getParentId(select);
            }
        },
        getParentId(val) {
            const list = JSON.parse(JSON.stringify(this.list));
            const selected = [];
            function getDepartmentId(data, list) {
                list.forEach((v) => {
                    if (v.id === data) {
                        if (v.parent_id !== 0) {
                            getDepartmentId(v.parent_id, list);
                            selected.push(v.parent_id.toString());
                        }
                    }
                    if (v.children) {
                        getDepartmentId(data, v.children);
                    }
                });
            }
            if (list.length) {
                getDepartmentId(Number(val), list);
                selected.push(val);
                this.value1 = selected;
            }
        },
        handleChange(value) {
            const data = value.pop();
            this.$emit('input', data);
        },
    },
};
</script>
