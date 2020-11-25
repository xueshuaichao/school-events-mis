<template>
    <page-list
        :columns="columns"
        :data="list"
        :hide-header-btn="false"
        :page-params="{ total }"
        @page-change="getMessageBoard"
        @btn-click="handleBtnClick"
    />
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '../components/page/list.vue';
import api from '../../api/information';

export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            columns: [
                {
                    title: '活动名称',
                    key: 'activity_name',
                    align: 'center',
                },
                {
                    title: '留言板数量',
                    key: 'total_num',
                    align: 'center',
                },
                {
                    title: '已审核',
                    key: 'checked_num',
                    slot: 'completed',
                    align: 'center',
                },
                {
                    title: '未审核',
                    key: 'uncheck_num',
                    width: 360,
                    slot: 'uncompleted',
                    align: 'center',
                },
            ],
            params: {
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            list: [],
        };
    },
    created() {
        this.getMessageBoard();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getMessageBoard(pageNum = 1) {
            this.openMainSpin(true);
            this.params.page_num = pageNum;
            api.messageBoardList(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleBtnClick({ key }, row) {
            const checkType = {
                checked_num: {
                    name: 'completedList',
                    status: '1',
                },
                uncheck_num: {
                    name: 'uncompletedList',
                    status: '0',
                },
            };
            this.$router.push({
                name: checkType[key].name,
                params: {
                    activity_id: row.id,
                    status: checkType[key].status,
                },
            });
        },
    },
};
</script>

<style scoped></style>
