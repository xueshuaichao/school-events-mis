<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: form.page_num }"
        :hide-header-btn="false"
        class="comment-manage"
        @on-select="handleSelect"
        @btn-click="handleAction"
        @page-change="getCommentList"
    >
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="作品名称">
                    <i-input
                        v-model="form.resource_name"
                        placeholder="请输入作品名称"
                    />
                </form-item>
                <form-item label="用户名">
                    <i-input
                        v-model="form.user_name"
                        placeholder="请输入评论者姓名"
                    />
                </form-item>
                <form-item label="关键字">
                    <i-input
                        v-model="form.keyword"
                        placeholder="评论内容关键字"
                    />
                </form-item>
                <form-item label="开始时间">
                    <DatePicker @on-change="handleChangeStartTime" />
                </form-item>
                <form-item label="结束时间">
                    <DatePicker @on-change="handleChangeEndTime" />
                </form-item>
                <form-item label="状态">
                    <pull
                        v-model="form.status"
                        :list="commentStatus"
                        :use-type="false"
                    />
                </form-item>
            </i-form>
            <i-button @click="getCommentList(1)">
                查询
            </i-button>
            <i-button @click="handleRset">
                重置
            </i-button>
        </template>
        <template slot="batch">
            <a
                class="batch"
                type="primary"
                @click="handleCommentsStatus"
            >
                批量审核
            </a>
        </template>
    </page-list>
</template>
<script>
/* eslint-disable */
import { mapMutations } from "vuex";
import PageList from "@/view/components/page/list.vue";
import Pull from "@/view/components/pull/index.vue";
import { activityStatus } from "@/libs/enum";
import api from "@/api/information";

export default {
    name: "Index",
    components: {
        PageList,
        pull: Pull
    },
    props: {
        currentIndex: {
            type: Number,
            default: 0
        },
        defaultTab: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            commentStatus: activityStatus,
            btnList: [
                {
                    name: "show",
                    show(params) {
                        return params.is_hidden === 1;
                    }
                },
                {
                    name: "hidden",
                    show(params) {
                        return params.is_hidden === 0;
                    }
                }
            ],
            columns: [
                {
                    type: "selection",
                    align: "center",
                    width: 60
                },
                {
                    title: "作品名称",
                    key: "resource_name",
                    align: "center"
                },
                {
                    title: "评论者姓名",
                    key: "name",
                    align: "center"
                },
                {
                    title: "评论内容",
                    key: "content",
                    align: "center"
                },
                // {
                //     title: "昵称",
                //     key: "name",
                //     align: "center"
                // },
                {
                    title: "评论时间",
                    key: "created_at",
                    align: "center"
                },
                {
                    title: "状态",
                    key: "status_name",
                    align: "center"
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center"
                }
            ],
            form: {
                user_name: "",
                resource_name: "",
                keyword: "",
                is_hidden: "",
                start_date: "",
                end_date: "",
                page_size: 10,
                page_num: 1,
                status: ""
            },
            comment_ids: [],
            total: 0,
            list: []
        };
    },
    created() {
        this.getCommentList();
    },
    methods: {
        ...mapMutations(["openMainSpin"]),
        getScoreInfo(data) {
            this.$refs.detail.handleShow(data);
        },
        getCommentList(pageNum = 1) {
            this.form.page_num = pageNum;
            const { status } = this.form;
            this.openMainSpin(true);
            api.getCommentList({
                ...this.form,
                status: status - 1
            })
                .then(({ data: { list, total } }) => {
                    this.list = this.parseData(list);
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        parseData(data) {
            data.forEach(v => {
                const {
                    user_info: { name },
                    status
                } = v;
                const info = v;
                info.name = name;
                info.status_name = activityStatus[status];
            });
            return data;
        },
        /*
         * @params {Object} data
         * @des is_hidden 1 隐藏 0 显示
         * */
        updateCommentStatus(data, mes, type) {
            api[
                type === "section"
                    ? "updateCommentsStatus"
                    : "updateCommentStatus"
            ](data).then(() => {
                this.$Message.success(`${mes}成功`);
                this.getCommentList();
            });
        },
        handleAction({ name }, { comment_id: id, is_hidden: hidden }) {
            const mes = this.$t(`button.${name}`);

            this.$Modal.confirm({
                title: "提示",
                content: `是否${mes}该评论吗?`,
                onOk: () => {
                    this.updateCommentStatus(
                        { comment_id: id, is_hidden: 1 - hidden },
                        mes
                    );
                }
            });
        },
        handleChangeStartTime(val) {
            this.form.start_date = val;
        },
        handleChangeEndTime(val) {
            this.form.end_date = val;
        },
        handleSelect(section) {
            this.section = section;
        },
        handleCommentsStatus() {
            const { section } = this;

            if (!section) {
                this.$Message.error("请选择审核评论");
                return;
            }
            const { is_hidden } = section[0];
            const commentsStatus = section.every(
                v => v.is_hidden === section[0].is_hidden
            );

            if (!commentsStatus) {
                this.$Message.error("已勾选的评论显示状态不一致, 请重新选择");
                return;
            }

            this.$Modal.confirm({
                title: "提示",
                content: `确认${is_hidden ? "显示" : "隐藏"}评论?`,
                onOk: () => {
                    this.updateCommentStatus(
                        {
                            comment_ids: section.map(v => v.comment_id),
                            is_hidden: 1 - is_hidden
                        },
                        "操作",
                        "section"
                    );
                }
            });
        },
        handleRset() {
            this.form = {
                user_name: "",
                resource_name: "",
                keyword: "",
                is_hidden: "",
                start_date: "",
                end_date: "",
                page_size: 10,
                page_num: 1
            };
            this.getCommentList(1);
        }
    }
};
</script>

<style lang="less">
.comment-manage {
    .batch {
        display: inline-block;
        font-size: 14px;
        padding-bottom: 8px;
    }
}
</style>
