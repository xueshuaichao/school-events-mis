<template>
    <div :class="hiddenClass ? 'common-list' : 'common-list content-wrapper'">
        <slot name="page-tips" />
        <div
            v-if="hidePageHide"
            class="page-header flex-row mar-b-24"
        >
            <slot name="page-header" />
        </div>
        <header class="common-list-header">
            <div
                v-if="hideHeaderBtn"
                class="btn-wrapper"
            >
                <slot name="header-btn" />
            </div>
            <div class="common-list-search">
                <slot name="header-search-bar" />
            </div>
        </header>
        <slot name="batch" />
        <div class="table">
            <slot name="table">
                <i-table
                    :columns="columns"
                    :data="data"
                    :row-class-name="rowClassName"
                    @on-sort-change="handleSortChange"
                    @on-selection-change="handleSelect"
                >
                    <template
                        slot="name"
                        slot-scope="{ row }"
                    >
                        <strong>{{ row.name }}</strong>
                    </template>
                    <!-- 置顶 -->
                    <template
                        slot="top"
                        slot-scope="{ row }"
                    >
                        {{ row.title }}
                        <span
                            v-if="row.is_top"
                            class="question-top"
                        >
                            置顶
                        </span>
                    </template>
                    <!-- 礼品图片 -->
                    <template
                        slot="img"
                        slot-scope="{ row }"
                    >
                        <img
                            class="gift-img"
                            :src="row.img || row.image"
                        >
                    </template>
                    <!-- 礼品状态 -->
                    <template
                        slot="commonStatus"
                        slot-scope="{ row }"
                    >
                        <p
                            v-if="row.status === 1"
                            class="green"
                        >
                            {{ row.status_name }}
                        </p>
                        <p
                            v-if="row.status === 2"
                            class="red"
                        >
                            {{ row.status_name }}
                        </p>
                        <p
                            v-if="row.status === 4"
                            class="yellow"
                        >
                            {{ row.status_name }}
                        </p>
                    </template>
                    <!-- 热门分类 -->
                    <template
                        slot="popularCategories"
                        slot-scope="{ row }"
                    >
                        <div
                            v-for="item in row.child_category"
                            :key="item.id"
                            class="category"
                        >
                            {{ item.name }}
                        </div>
                    </template>
                    <!-- 热门文章 -->
                    <template
                        slot="popularArticles"
                        slot-scope="{ row }"
                    >
                        <img
                            v-if="row.hot === 1"
                            src="../../../assets/images/app/hot.png"
                            alt=""
                        >
                        <a
                            class="article-title"
                            :href="row.url"
                            target="_blank"
                        >
                            {{ row.title }}
                        </a>
                    </template>
                    <template
                        slot="bannerImage"
                        slot-scope="{ row }"
                    >
                        <img
                            :src="row.banner_image"
                            :alt="row.banner_image"
                            :style="{ width: '120px', height: '50px' }"
                        >
                    </template>
                    <template
                        slot="action"
                        slot-scope="{ row, index }"
                    >
                        <div class="btn-list">
                            <template v-if="routename === 'completedList'">
                                <a
                                    :key="checkedBtnList[row.status].name"
                                    @click="
                                        handleBtnClick(
                                            checkedBtnList[row.status],
                                            row,
                                            index
                                        )
                                    "
                                >
                                    {{
                                        $t(
                                            "button." +
                                                checkedBtnList[row.status].name
                                        )
                                    }}
                                </a>
                            </template>
                            <template
                                v-else-if="
                                    routename === 'carousel' &&
                                        btnList[0].name === 'up'
                                "
                            >
                                <template v-if="index === 0">
                                    <a
                                        :key="btnList[1].name"
                                        @click="
                                            handleBtnClick(
                                                btnList[1],
                                                row,
                                                index
                                            )
                                        "
                                    >
                                        {{ $t("button." + btnList[1].name) }}
                                    </a>
                                </template>
                                <template v-else-if="index === data.length - 1">
                                    <a
                                        :key="btnList[0].name"
                                        @click="
                                            handleBtnClick(
                                                btnList[0],
                                                row,
                                                index
                                            )
                                        "
                                    >
                                        {{ $t("button." + btnList[0].name) }}
                                    </a>
                                </template>
                                <template v-else>
                                    <a
                                        v-for="item in btnList"
                                        :key="item.name"
                                        @click="
                                            handleBtnClick(item, row, index)
                                        "
                                    >
                                        {{ $t("button." + item.name) }}
                                    </a>
                                </template>
                            </template>
                            <template v-else>
                                <template v-for="item in btnList">
                                    <a
                                        v-if="
                                            (item.show && item.show(row)) ||
                                                !item.show
                                        "
                                        :key="item.name"
                                        @click="
                                            handleBtnClick(item, row, index)
                                        "
                                    >
                                        {{ $t("button." + item.name) }}
                                    </a>
                                </template>
                            </template>
                        </div>
                    </template>
                    <template
                        slot="status"
                        slot-scope="{ column, row }"
                    >
                        <div v-if="routename === 'uncompletedList'">
                            未审核
                        </div>
                        <div v-else>
                            {{ row.status === 1 ? "已通过" : "未通过" }}
                        </div>
                    </template>
                    <template
                        slot="err"
                        slot-scope="{ row }"
                    >
                        <p class="import-err">
                            {{ row.err }}
                        </p>
                    </template>
                    <template
                        slot="completed"
                        slot-scope="{ column, row, index }"
                    >
                        <div>
                            <a @click="handleBtnClick(column, row, index)">
                                {{ row.checked_num }}
                            </a>
                        </div>
                    </template>
                    <template
                        slot="uncompleted"
                        slot-scope="{ column, row, index }"
                    >
                        <div>
                            <a @click="handleBtnClick(column, row, index)">
                                {{ row.uncheck_num }}
                            </a>
                        </div>
                    </template>
                    <template
                        v-if="row.stage"
                        slot="stage"
                        slot-scope="{ column, row }"
                    >
                        <div>
                            {{ stage(row) }}
                        </div>
                    </template>

                    <template
                        slot="system"
                        slot-scope="{ column, row }"
                    >
                        <div>
                            {{ system(row) }}
                        </div>
                    </template>
                    <template
                        slot="checkStatus"
                        slot-scope="{ column, row }"
                    >
                        <div>
                            {{ checkStatus(row) }}
                        </div>
                    </template>
                    <template
                        slot="checkAction"
                        slot-scope="{ column, row }"
                    >
                        <div class="btn-list">
                            <a
                                v-if="row.status === 0"
                                :key="btnList[1].name"
                                @click="handleBtnClick(btnList[1], row)"
                            >
                                {{ $t("button." + btnList[1].name) }}
                            </a>
                            <a
                                v-else
                                :key="btnList[0].name"
                                @click="handleBtnClick(btnList[0], row)"
                            >
                                {{ $t("button." + btnList[0].name) }}
                            </a>
                        </div>
                    </template>
                    <template
                        slot="status"
                        slot-scope="{ column, row }"
                    >
                        <div>
                            {{ status(row) }}
                        </div>
                    </template>
                    <template
                        slot="personStatus"
                        slot-scope="{ column, row }"
                    >
                        <div>
                            {{ row.status === 1 ? "在职" : "离职" }}
                        </div>
                    </template>
                    <template
                        slot="detailVerify"
                        slot-scope="{ column, row }"
                    >
                        <div class="btn-list">
                            <a
                                v-for="item in btnDetailVerify[row.status]"
                                :key="item.name"
                                @click="handleBtnClick(item, row)"
                            >
                                {{ $t("button." + item.name) }}
                            </a>
                        </div>
                    </template>
                </i-table>
            </slot>
        </div>
        <footer v-if="!hideFooter">
            <slot name="footer">
                <div class="flex-row pager">
                    <i-button
                        v-if="isHiddenDelete"
                        @click="handleClickDelete"
                    >
                        删除
                    </i-button>
                    <slot name="footer-btn" />
                    <page
                        show-total
                        show-sizer
                        show-elevator
                        :current="pageParams.page_num"
                        :total="pageParams.total"
                        :page-size="pageParams.page_size"
                        @on-change="handlePageChange"
                        @on-page-size-change="handlePageSizeChange"
                    />
                    <slot name="footer-panel-right" />
                </div>
            </slot>
        </footer>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'PageList',

    props: {
        columns: {
            type: Array,
            default() {
                return [];
            },
        },
        hiddenClass: {
            type: Boolean,
            default() {
                return false;
            },
        },
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        btnList: {
            type: Array,
            default() {
                return [];
            },
        },
        checkedBtnList: {
            type: Object,
            default() {
                return {};
            },
        },
        hideHeaderBtn: {
            type: Boolean,
            default: true,
        },
        hidePageHide: {
            type: Boolean,
            default: true,
        },
        hideFooter: {
            type: Boolean,
            default: false,
        },
        pageParams: {
            type: Object,
            default() {
                return {
                    page_size: 10,
                    total: 100,
                    page_num: 1,
                };
            },
        },
        stages: {
            type: Array,
            default() {
                return [];
            },
        },
        systems: {
            type: Array,
            default() {
                return [];
            },
        },
        statusType: {
            type: Array,
            default() {
                return [];
            },
        },
        btnDetailVerify: {
            type: Object,
            default() {
                return {};
            },
        },
        isHiddenDelete: {
            type: Boolean,
            default: false,
        },
        rowClassName: {
            type: Function,
            default: () => '',
        },
    },
    computed: {
        routename() {
            return this.$route.name;
        },
    },
    methods: {
        stage({ stage }) {
            let stagename;
            this.stages.forEach((item) => {
                if (item.id === stage.toString()) {
                    stagename = item.name;
                }
            });
            return stagename;
        },
        checkStatus({ status }) {
            const statusType = {
                1: '已通过',
                2: '未通过',
                0: '未审核',
            };
            return statusType[status];
        },
        system({ system }) {
            let systemname;
            this.systems.forEach((item) => {
                if (item.id === system.toString()) {
                    systemname = item.name;
                }
            });
            return systemname;
        },
        status({ status }) {
            let statusname;
            this.statusType.forEach((item) => {
                if (item.id === status.toString()) {
                    statusname = item.name;
                }
            });
            return statusname;
        },
        handleBtnClick(...arg) {
            this.$emit('btn-click', ...arg);
        },
        handlePageChange(data) {
            this.$emit('page-change', data);
            console.log(data);
        },
        handlePageSizeChange(data) {
            this.$emit('page-size-change', data);
        },
        handleSortChange(params) {
            this.$emit('sort-change', params);
        },
        handleSelect(selection, row) {
            this.$emit('on-select', selection, row);
        },
        handleClickDelete() {
            this.$emit('on-delete');
        },
    },
};
</script>

<style lang="less">
@import "../../../less/variables.less";
.common-list {
    .pager {
        text-align: center;
        margin-top: 30px;
        .ivu-page {
            margin: 0 auto;
        }
    }
    .import-err {
        color: @errColor;
    }
    .ivu-table-row {
        height: 40px;
    }

    .ivu-table,
    .ivu-table-header {
        overflow: visible;
    }

    .ivu-table th {
        position: relative;
        overflow: visible;
    }
    .ivu-form-item-label {
        color: @fontColor;
    }
    .btn-list {
        a {
            padding: 0 8px;
            border-right: 1px solid @btnColor;
            color: @btnColor;
            line-height: 1;
        }
        a:last-child {
            border-right: none;
        }
    }
    .btn-list-item {
        margin-right: 10px;
    }
    .ivu-btn {
        margin-right: 24px;
    }
    .ivu-btn:last-child {
        margin-right: 0;
    }
    &-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .title {
            line-height: 32px;
            font-size: 16px;
            color: @black;
            border-left: 4px solid @mainColor;
            padding-left: 5px;
            .desc {
                padding-left: 20px;
                font-size: 12px;
                font-weight: normal;
                color: @black;
            }
        }
        .ivu-form {
            display: flex;
            flex-flow: row wrap;
            flex-shrink: 1;
        }
        .btn-wrapper {
            display: flex;
            flex-flow: row;
            button {
                margin-right: 10px;
            }
        }
        button {
            height: 32px;
        }
    }
    &-search {
        display: flex;
        flex-direction: row;
        flex-shrink: 1;
        .ivu-input-wrapper,
        .ivu-select {
            width: 240px;
        }
        .ivu-select-dropdown {
            width: 240px;
        }
        .ivu-form-item {
            margin-right: 24px;
        }
        .ivu-cascader-not-found-tip {
            width: 240px;
            line-height: 1.5;
        }
        .ivu-btn:last-child {
            margin-right: 0;
        }
    }

    &-state,
    &-name,
    &-type {
        margin-right: 10px;
    }

    &-state,
    &-type {
        .ivu-select-selection {
            width: 120px;
        }
    }

    &-name {
        input {
            width: 150px;
        }
    }

    &-state {
        width: 200px;
    }
    .page-header {
        .ivu-tabs {
            width: 100%;
        }
        .float-right {
            margin-left: auto;
        }
    }
    .question-top {
        display: inline-block;
        color: @red;
        padding: 0 6px;
    }
    .gift-img {
        width: 100px;
        max-height: 56px;
        border-radius: 2px;
        vertical-align: middle;
        margin: 14px 0;
    }
    .red {
        color: @red;
    }
    .green {
        color: @green;
    }
    .yellow {
        color: @yellow;
    }
    .page-header {
        .tips {
            font-size: 14px;
            color: @red;
        }
    }
    .ivu-date-picker .ivu-select-dropdown {
        width: auto;
    }
    .category {
        display: inline-block;
        padding: 0 5px;
        height: 38px;
        font-size: 14px;
        line-height: 38px;
        margin-right: 8px;
        margin-bottom: 8px;
        border-radius: 2px;
        border: 1px solid rgba(227, 228, 230, 1);
    }
    .article-title {
        color: @black;
        &:hover {
            color: @blue;
        }
    }
}
</style>
