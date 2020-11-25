<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-header-btn="false"
        @btn-click="handleAction"
        @page-change="getScoreList"
    >
        <template slot="page-header">
            <i-button
                type="primary"
                @click="handleClickBtn('reportScore')"
            >
                上报成绩
            </i-button>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="项目范围">
                    <Select
                        v-model="form.resource_scope"
                        :placeholder="'请选择项目范围'"
                        @on-change="handleResourceScopeChange"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in category"
                            :key="item.cat_id"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item label="分类">
                    <Select
                        v-model="form.one_cat_id"
                        @on-change="handleProjectTypeChange"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in matchItems"
                            :key="item.cat_id"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item label="项目">
                    <Select
                        v-model="form.two_cat_id"
                        @on-change="handleMatchItemsChange"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in matchItemsOneChild"
                            :key="item.cat_id"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item label="子项目">
                    <Select v-model="form.three_cat_id">
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in matchItemsTwoChild"
                            :key="item.cat_id"
                            :value="item.cat_id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </form-item>
                <form-item label="状态">
                    <pull
                        v-model="form.status"
                        :list="activityStatus"
                        :use-type="false"
                    />
                </form-item>
                <form-item label="学段">
                    <pull
                        v-model="form.education_level"
                        :list="learnSection"
                        :use-type="false"
                    />
                </form-item>
                <form-item label="年级">
                    <Select
                        v-model="form.grade_id"
                        placeholder="请选择年级"
                    >
                        <Option
                            :key="0"
                            :value="0"
                        >
                            全部
                        </Option>
                        <Option
                            v-for="item in gradeList"
                            :key="item.grade_id"
                            :value="item.grade_id"
                        >
                            {{ item.grade_name }}
                        </Option>
                    </Select>
                </form-item>
            </i-form>
            <i-button @click="getScoreList(1)">
                查询
            </i-button>
        </template>
        <detail ref="detail" />
    </page-list>
</template>
<script>
/* eslint-disable */
import { mapMutations } from "vuex";
import PageList from "@/view/components/page/list.vue";
import Pull from "@/view/components/pull/index.vue";
import Detail from "./components/detail/index.vue";
import {
    studentStatus,
    activityType,
    activityStatus,
    learnSection,
    projectScope
} from "@/libs/enum";
import { formateSeconds } from "@/libs/utils";
import api from "@/api/events";

export default {
    name: "Index",
    components: {
        PageList,
        Detail,
        pull: Pull
    },
    data() {
        return {
            studentStatus,
            activityType,
            activityStatus,
            learnSection,
            projectScope,
            btnList: [
                {
                    name: "edit"
                },
                {
                    name: "delete"
                },
                {
                    name: "detail"
                }
            ],
            columns: [
                {
                    title: "活动名称",
                    key: "resource_name",
                    align: "center"
                },
                {
                    title: "参赛项目",
                    key: "category_name",
                    align: "center"
                },
                {
                    title: "项目范围",
                    key: "resource_scope",
                    align: "center"
                },
                {
                    title: "参赛者姓名",
                    key: "create_name",
                    align: "center"
                },
                {
                    title: "成绩/单位",
                    key: "achievement",
                    align: "center"
                },
                {
                    title: "学段",
                    key: "education_level",
                    align: "center"
                },
                {
                    title: "年级",
                    key: "grade_name",
                    align: "center"
                },
                {
                    title: "上报时间",
                    key: "created_at",
                    align: "center"
                },
                {
                    title: "状态",
                    key: "status",
                    align: "center"
                },
                {
                    title: "操作",
                    slot: "action",
                    width: "200",
                    align: "center"
                }
            ],
            gradeList: [],
            category: [],
            matchItems: [],
            matchItemsOneChild: [],
            matchItemsTwoChild: [],
            form: {
                one_cat_id: 0,
                two_cat_id: 0,
                three_cat_id: 0,
                grade_id: 0,
                level_cat_id: "",
                resource_scope: 0,
                education_level: "",
                status: "",
                page_size: 10,
                page_num: 1
            },
            total: 0,
            list: []
        };
    },
    created() {
        this.getCategory();
        this.getScoreList();
        this.getSchoolGrade();
    },
    methods: {
        ...mapMutations(["openMainSpin"]),
        getScoreInfo(data) {
            this.$refs.detail.handleShow(data);
        },
        getScoreList(pageNum = 1) {
            const form = this.handleSearchParams(pageNum);
            this.openMainSpin(true);
            api.getScoreList(form)
                .then(({ data: { list, count } }) => {
                    this.list = this.parseData(list);
                    this.total = count;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        parseData(data) {
            data.forEach(v => {
                const {
                    resource_scope: scope,
                    education_level: level,
                    achievement,
                    achievement_unit: unit,
                    status
                } = v;
                const info = v;
                info.resource_scope = scope === 1 ? "个人" : "团体";
                info.education_level = learnSection[level - 1];
                if (unit === "秒" || !unit) {
                    info.achievement = formateSeconds(achievement, true);
                } else {
                    info.achievement = achievement + unit;
                }
                info.status = activityStatus[status];
            });
            return data;
        },
        getCategory() {
            api.getCategory().then(({ data }) => {
                data.forEach((v, i) => {
                    // eslint-disable-next-line no-param-reassign
                    v.cat_id = i < 2 ? i + 1 : 6;
                });
                this.category = data;
            });
        },
        getSchoolGrade() {
            api.getSchoolGrade().then(({ data }) => {
                this.gradeList = data;
            });
        },
        deleteScore(data) {
            api.deleteScore(data).then(() => {
                this.$Message.success("删除成功");
                this.getScoreList(1);
            });
        },
        handleSearchParams(pageNum) {
            const form = JSON.parse(JSON.stringify(this.form));
            const level = {};
            const {
                status,
                resource_scope: scope,
                one_cat_id: one,
                two_cat_id: two,
                three_cat_id: three,
                grade_id: id
            } = form;
            const keys = ["one", "two", "three"];
            form.page_num = pageNum;
            form.status = status ? status - 1 : "";
            [one, two, three].forEach((v, i) => {
                if (v) {
                    level[`${keys[i]}_level_id`] = v;
                }
            });
            form.level_cat_id = level;
            form.grade_id = id || "";
            form.resource_scope = scope || "";
            return form;
        },
        handleResourceScopeChange(value) {
            const { category } = this;
            if (value) {
                this.matchItems = category.filter(
                    v => v.cat_id === value
                )[0].child;
            }
        },
        handleProjectTypeChange(value) {
            const { matchItems } = this;
            let child;
            if (value) {
                child = matchItems.filter(v => v.cat_id === value);
                this.matchItemsOneChild = child[0].child || [];
            } else {
                this.matchItemsOneChild = [];
            }
        },
        handleMatchItemsChange(value) {
            const { matchItemsOneChild } = this;
            let child;
            if (value) {
                child = matchItemsOneChild.filter(v => v.cat_id === value);
                this.matchItemsTwoChild = child[0].child || [];
            } else {
                this.matchItemsTwoChild = [];
            }
        },
        handleAction({ name }, params) {
            switch (name) {
                case "edit":
                    this.$router.push(`/score/edit/${params.id}`);
                    break;
                case "delete":
                    this.handleDeleteAction(params.id);
                    break;
                case "detail":
                    this.getScoreInfo(params);
                    break;
                default:
                    break;
            }
        },
        handleClickBtn(name) {
            this.$router.push({ name });
        },
        handleDeleteAction(id) {
            this.$Modal.confirm({
                title: "删除提示",
                content: "<p>删除后数据将无法恢复，是否确认删除？</p>",
                onOk: () => {
                    this.deleteScore({ resource_id: id });
                }
            });
        }
    }
};
</script>

<style scoped></style>
