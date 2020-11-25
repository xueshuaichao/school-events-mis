<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total, page_num: form.page_num }"
        :hide-header-btn="false"
        @btn-click="handleAction"
        @page-change="getEventList"
    >
        <template slot="page-header">
            <i-button
                type="primary"
                @click="handleClickBtn('addEvent')"
            >
                添加活动
            </i-button>
            <i-button @click="getTopEventList">
                {{ btnName }}
            </i-button>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="活动名称">
                    <i-input v-model="form.name" />
                </form-item>
                <form-item label="活动状态">
                    <pull
                        v-model="form.status"
                        :list="eventStatus"
                        :use-type="false"
                    />
                </form-item>
                <form-item label="活动时间">
                    <DatePicker
                        type="daterange"
                        split-panels
                        placeholder="请选择活动起止时间"
                        @on-change="handleChange"
                    />
                </form-item>
            </i-form>
            <i-button @click="getEventList(1)">
                查询
            </i-button>
            <i-button @click="handleReset">
                重置
            </i-button>
        </template>
        <add-event
            ref="addEvent"
            @on-end="getEventList(1)"
        />
    </page-list>
</template>
<script>
/* eslint-disable */
import { mapMutations } from "vuex";
import api from "@/api/activity";
import { firstWordUpperCase } from "@/libs/utils";
import { eventStatus } from "@/libs/enum";
import PageList from "@/view/components/page/list.vue";
import Pull from "@/view/components/pull/index.vue";
import AddEvent from "./components/add-event/index.vue";
import CONFIG from "./config";

const clientMap = {
    pc_show: "PC",
    app_show: "APP",
    mini_h5_show: "小程序 H5"
};

const confirmContent = {
    top: ["取消该活动的置顶显示！", "是否确认置顶该活动？"],
    show: ["是否确认下架该活动?", "是否确认上架该活动"]
};
export default {
    name: "Index",
    components: {
        PageList,
        pull: Pull,
        AddEvent
    },
    data() {
        return {
            eventStatus,
            btnList: CONFIG.EVENT_BTN_LIST.defaultBtnList,
            columns: [
                {
                    title: "活动ID",
                    key: "id",
                    align: "center"
                },
                {
                    title: "活动名称",
                    key: "activity_name",
                    align: "center"
                },
                {
                    title: "活动主图",
                    slot: "img",
                    align: "center"
                },
                {
                    title: "活动时间",
                    key: "time",
                    align: "center"
                },
                {
                    title: "初始关注人数",
                    key: "activity_base_count",
                    align: "center"
                },
                {
                    title: "当前关注人数",
                    key: "activity_base",
                    align: "center"
                },
                {
                    title: "活动状态",
                    key: "status_name",
                    align: "center"
                },
                {
                    title: "显示端口",
                    key: "client",
                    align: "center",
                    width: "130"
                },
                {
                    title: "操作",
                    slot: "action",
                    width: "300",
                    align: "center"
                }
            ],
            form: {
                name: "",
                start_time: "",
                end_time: "",
                is_top: "",
                status: "", // 1 未开始 2 进行中 3 已结束
                page_size: 10,
                page_num: 1,
                show: 1
            },
            total: 0,
            list: [],
            btnName: "首页排序"
        };
    },
    created() {
        this.getEventList();
    },
    methods: {
        ...mapMutations(["openMainSpin"]),
        getEventList(pageNum = 1) {
            this.form.page_num = pageNum;
            this.openMainSpin(true);
            api.getEventList(this.form)
                .then(({ data: { list, total } }) => {
                    this.list = this.parseData(list, total);
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        getTopEventList() {
            const { is_top } = this.form;

            if (is_top) {
                this.updateTopEventsSort();
                this.form.is_top = "";
                this.btnName = "首页排序";
                this.btnList = CONFIG.EVENT_BTN_LIST.defaultBtnList;
            } else {
                this.form.is_top = 1;
                this.btnName = "排序完成";
                this.btnList = CONFIG.EVENT_BTN_LIST.topBtnList;
            }
            this.handleReset();
        },
        parseData(list, total) {
            list.forEach((v, i) => {
                // eslint-disable-next-line camelcase
                const { start_time, end_time } = v;
                // eslint-disable-next-line no-param-reassign
                v.client = Object.keys(clientMap).reduce((ac, cu) => {
                    if (v[cu]) {
                        // eslint-disable-next-line no-param-reassign
                        ac += `${clientMap[cu]} `;
                    }
                    return ac;
                }, "");
                // eslint-disable-next-line
                v.time = `${start_time}--${end_time}`;
                v.index = i + 1;
                v.total = total;
            });
            return list;
        },
        updateEventInfo(type, data) {
            this.openMainSpin(true);
            api[type === "top" ? "updateEventTopStatus" : "deleteEvent"](data)
                .then(() => {
                    this.openMainSpin(false);
                    this.$Message.success("操作成功");
                    this.getEventList();
                })
                .catch(this.openMainSpin(false));
        },
        updateTopEventsSort() {
            const params = this.list.map((v, i) => {
                return { id: v.id, sort: i + 1 };
            });
            api.updateEventsSort({ sort: params });
        },
        handleClickDetail(id) {
            let route = { name: "" };
            const resource_type = CONFIG.RESOURCE_TYPE;
            let name = Object.keys(resource_type).find(
                v => resource_type[v] - 2 === id
            );

            if (id <= 9) {
                route.name = `eventCheck${firstWordUpperCase(name)}`;
            } else {
                route = {
                    name: "activityManage",
                    params: {
                        id: id
                    }
                };
            }
            this.$router.push(route);
        },
        // eslint-disable-next-line camelcase
        handleAction({ name }, { id, is_top, show }) {
            switch (name) {
                case "resourceDetail":
                    this.handleClickDetail(id);
                    break;
                case "edit":
                    this.$refs.addEvent.handleShow(id);
                    break;
                case "top":
                case "unTop":
                    // eslint-disable-next-line camelcase
                    this.handleConfirm("top", {
                        id,
                        is_top: 1 - is_top
                    });
                    break;
                case "upperShelf":
                case "lowerShelf":
                    // eslint-disable-next-line camelcase
                    this.handleConfirm("show", {
                        id,
                        show: 1 - show
                    });
                    break;
                case "up":
                    this.handleSortChange("up", id);
                    break;
                case "down":
                    this.handleSortChange("down", id);
                    break;
                default:
                    break;
            }
        },
        handleConfirm(type, data) {
            this.$Modal.confirm({
                title: "提示",
                content:
                    confirmContent[type][
                        type === "top" ? data.is_top : data.show
                    ],
                onOk: () => {
                    this.updateEventInfo(type, data);
                }
            });
        },
        handleClickBtn(name) {
            this.$refs[name].handleShow();
        },
        handleChange([start, end]) {
            this.form.start_time = start;
            this.form.end_time = end;
        },
        handleReset() {
            const { form } = this;
            this.form = {
                ...form,
                name: "",
                start_time: "",
                end_time: "",
                status: ""
            };
            this.getEventList(1);
        },
        handleSortChange(type, id) {
            const { list } = this;
            let index = list.findIndex(v => v.id === id);
            let current = list[index];
            let temp = current.index;
            let tempIndex = type === "up" ? index - 1 : index + 1;

            current.index = list[tempIndex].index;
            list[tempIndex].index = temp;
            this.$set(list, index, list[tempIndex]);
            this.$set(list, tempIndex, current);
        }
    }
};
</script>

<style scoped></style>
