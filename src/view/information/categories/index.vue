<template>
    <page-list
        id="spring-activity"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: form.page_num }"
        :hide-page-hide="false"
        @btn-click="handleAction"
        @page-change="getHotList"
    >
        <setting
            ref="set"
            @on-success="getHotList(1)"
        />
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import api from '@/api/information';
import PageList from '@/view/components/page/list.vue';
import Setting from './setting.vue';

export default {
    name: 'Index',
    components: {
        PageList,
        Setting,
    },
    data() {
        return {
            btnList: [
                {
                    name: 'set',
                },
            ],
            columns: [
                {
                    title: '标题',
                    key: 'name',
                    align: 'center',
                    width: '200',
                },
                {
                    title: '子分类',
                    key: 'child_category',
                    slot: 'popularCategories',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    width: 100,
                },
            ],
            form: {
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            list: [],
        };
    },
    created() {
        this.getHotList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getHotList(pageNum = 1) {
            this.form.page_num = pageNum;

            this.openMainSpin(true);
            api.getHotList(this.form)
                .then(({ data }) => {
                    this.list = data;
                    this.total = data.length;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleAction({ name }, params) {
            if (name === 'set') {
                this.$refs.set.handleShow(params);
            }
        },
    },
};
</script>
