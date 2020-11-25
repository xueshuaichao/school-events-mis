<template>
    <div
        v-if="!isLoading"
        class="content-wrapper common-department"
    >
        <div class="tabs flex-row mar-b-24">
            <div
                v-if="tabs.length"
                ref="tabs"
                class="columns"
            >
                <div
                    class="flex-row"
                    style="flex-wrap: wrap"
                >
                    <div
                        v-for="(item, index) in tabs"
                        :key="item.id"
                        :class="['item', { active: currentIndex === index }]"
                        @click="handleClickTabs(index, item.id)"
                    >
                        {{ item.name }}
                    </div>
                </div>
            </div>
            <i-button @click="handleClickBtn">
                批量导入
            </i-button>
        </div>
        <template v-if="resource === 'class'">
            <template v-if="!list.length">
                <div class="auto-gen">
                    <div class="bold">
                        你需要为该年级生成
                        <Input
                            v-model="autoGen.classNum"
                            style="display: inline-block; width: 200px"
                            type="number"
                            placeholder="请输入数字"
                        />
                        个班级
                    </div>
                    <div class="desc">
                        例如：您在输入框中输入10，
                        并点击【创建班级】按钮，系统会为您生成 1~10 班
                    </div>
                    <div class="tip">
                        <Icon type="ios-alert" /> 注意：创建后无法删除
                    </div>
                    <div style="text-align: center;">
                        <Button
                            type="primary"
                            @click="handleCreateClass()"
                        >
                            创建班级
                        </Button>
                    </div>
                </div>
            </template>
            <template v-else>
                <i-table
                    :columns="columns"
                    :data="list"
                />
            </template>
        </template>
        <template v-else>
            <i-table
                :columns="columns"
                :data="list"
            />
        </template>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import api from '@/api/organization';

const columnsConfig = {
    class: [
        {
            title: '班级名称',
            key: 'class_name',
            align: 'center',
        },
        {
            title: '班级别名',
            key: 'class_alias',
            align: 'center',
        },
    ],
    sdepartment: [
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
export default {
    name: 'Index',
    data() {
        return {
            tabs: [
                {
                    name: '',
                    id: '',
                },
            ],
            columns: [],
            list: [],
            currentIndex: null,
            resource: this.$route.meta.resource,
            autoGen: {
                classNum: null,
                gradeId: '',
            },
            isLoading: true,
        };
    },
    watch: {
        $route(data) {
            this.tabs = [];
            this.columns = [];
            this.list = [];
            this.currentIndex = 0;
            this.resource = data.meta.resource;
            this.loadData();
        },
    },
    created() {
        this.getFirstList();
        this.loadData();
    },
    mounted() {},
    methods: {
        ...mapMutations(['openMainSpin']),
        loadData() {
            switch (this.resource) {
                case 'class':
                    this.getSchoolGrade();
                    break;
                case 'sdepartment':
                    this.getSchoolDepartment();
                    break;
                default:
                    break;
            }
        },
        getSchoolGrade() {
            this.openMainSpin(true);
            api.getSchoolGrade()
                .then(({ data }) => {
                    if (data.length) {
                        this.parseClassData(data);
                        this.getSchoolClass(data[0].grade_id);
                        this.columns = columnsConfig[this.resource];
                        this.openMainSpin(false);
                        this.currentIndex = 0;
                    } else {
                        this.isLoading = false;
                    }
                })
                .catch(this.openMainSpin(false));
        },
        parseClassData(data) {
            this.tabs = data.map(v => ({
                name: v.grade_name,
                id: v.grade_id,
            }));
        },
        getSchoolClass(id) {
            this.openMainSpin(true);
            this.autoGen.gradeId = id;
            api.getSchoolClass({ grade_id: id })
                .then(({ data }) => {
                    this.list = data;
                    this.openMainSpin(false);
                    this.isLoading = false;
                })
                .catch(this.openMainSpin(false));
        },
        getSchoolDepartment() {
            this.openMainSpin(true);
            api.getSchoolDepartment()
                .then(({ data }) => {
                    if (data.length) {
                        this.columns = columnsConfig.sdepartment;
                        this.tabs = data;
                        this.getDeparmentChildren(0);
                        this.currentIndex = 0;
                    }
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        getDeparmentChildren(index) {
            this.list = this.tabs[index].children;
        },
        getFirstList() {
            this.openMainSpin(true);
            api.departmentEdudepartslist()
                .then(() => {
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleClickTabs(v, id) {
            this.currentIndex = v;
            switch (this.resource) {
                case 'class':
                    this.getSchoolClass(id);
                    break;
                case 'sdepartment':
                    this.getDeparmentChildren(v);
                    break;
                default:
                    break;
            }
        },
        handleClickBtn() {
            this.$router.push({
                name: `${this.resource}Import`,
            });
        },
        handleCreateClass() {
            if (!/^\d+$/.test(this.autoGen.classNum)) {
                return this.$Message.error('请输入需要创建的班级数量');
            }
            api.initSchoolClass({
                num: this.autoGen.classNum - 0,
                grade: this.autoGen.gradeId,
            }).then(() => {
                this.$Message.success('创建成功');
                this.getSchoolClass(this.autoGen.gradeId);
            });
            return false;
        },
    },
};
</script>

<style lang="less">
@import "../../less/variables";

.common-department {
    .auto-gen {
        width: 450px;
        margin: 60px auto;

        .bold {
            font-size: 16px;
            color: #313233;
            font-weight: bold;
            margin-bottom: 24px;
        }

        .desc {
            color: #969799;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .tip {
            color: #ff6849;
            font-size: 12px;
            margin-bottom: 24px;

            .ivu-icon {
                font-size: 14px;
                position: relative;
                top: -2px;
            }
        }
    }

    .tabs {
        font-size: 14px;
        color: @fontColor;
    }
    .columns {
        width: 100%;
        margin-right: 40px;
        border-bottom: 1px solid @borderColor;
        .item {
            flex-shrink: 0;
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
