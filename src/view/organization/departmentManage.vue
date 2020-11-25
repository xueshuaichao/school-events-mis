<template>
    <div class="content-wrapper common-department">
        <i-button
            class="btn-prev"
            @click="handleImport"
        >
            批量导入
        </i-button>
        <Tabs
            v-if="tabs[0]"
            :value="tabs[0].name"
        >
            <TabPane
                v-for="item in tabs"
                :key="item.name"
                :label="item.name"
                :name="item.name"
            >
                <page-list
                    :columns="columns"
                    :data="item.children"
                    :hidden-class="true"
                    :hide-page-hide="false"
                >
                    <div slot="footer" />
                </page-list>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import api from '../../api/organization';
import PageList from '../components/page/list.vue';

export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            tabs: [],
            currentIndex: 0,
            columns: [
                {
                    title: '二级部门',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '职责',
                    key: 'duty',
                    align: 'center',
                },
            ],
        };
    },

    created() {
        // 请求一级列表
        this.getFirstList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getFirstList() {
            this.openMainSpin(true);
            api.departmentEdudepartslist()
                .then(({ data }) => {
                    this.tabs = data;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleClickTabs(v) {
            this.currentIndex = v;
        },
        handleImport() {
            this.$router.push({
                name: 'edepartmentImport',
            });
        },
    },
};
</script>

<style lang="less">
@import "../../less/variables";

.common-department {
    .tabs {
        font-size: 14px;
        color: @fontColor;
    }
    .columns {
        width: 100%;
        margin-right: 40px;
        border-bottom: 1px solid @borderColor;
        .item {
            margin: 0 12px;
            padding: 4px 12px 10px 12px;
            cursor: pointer;
        }
        .active {
            color: @blue;
            border-bottom: 2px solid @blue;
        }
    }
    .ivu-btn {
        width: 110px;
        margin-right: 0;
    }
}
</style>
