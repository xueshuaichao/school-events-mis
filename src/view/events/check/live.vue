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
                @click="handleClickBtn('addLive')"
            >
                添加直播
            </i-button>
        </template>
        <template slot="header-search-bar">
            <i-form :label-width="80">
                <form-item label="直播名称">
                    <i-input v-model="form.name" />
                </form-item>
                <form-item label="直播状态">
                    <pull
                        v-model="form.status"
                        :list="eventStatus"
                        :use-type="false"
                    />
                </form-item>
                <!-- <form-item label="直播时间">
                    <DatePicker
                        type="daterange"
                        split-panels
                        placeholder="请选择直播起止时间"
                        @on-change="handleChange"
                    />
                </form-item> -->
            </i-form>
            <i-button @click="getEventList(1)">
                查询
            </i-button>
            <i-button @click="handleReset">
                重置
            </i-button>
        </template>
        <add-live
            ref="addLive"
            @on-end="getEventList(1)"
        />
    </page-list>
</template>
<script>
/* eslint-disable */
import { mapMutations } from "vuex";
import api from "@/api/live";
import { firstWordUpperCase } from "@/libs/utils";
import { eventStatus } from "@/libs/enum";
import PageList from "@/view/components/page/list.vue";
import Pull from "@/view/components/pull/index.vue";
import AddLive from "./components/add-live/index.vue";
import CONFIG from "./config";

const clientMap = {
    pc_show: "PC",
    app_show: "APP",
    mini_h5_show: "小程序 H5"
};

const confirmContent = {
    top: ["取消该直播的置顶显示！", "是否确认置顶该直播？"],
    show: ["是否确认下架该直播?", "是否确认上架该直播"]
};
export default {
    name: "Index",
    components: {
        PageList,
        pull: Pull,
        AddLive
    },
    data() {
        return {
            eventStatus,
            btnList: [
                {
                    name: "edit",
                    show(params) {
                        return true || params.status !== 3;
                    }
                },
                {
                    name: "delete",
                    show(params) {
                        return true;
                    }
                }
            ],
            columns: [
                {
                    title: "序号",
                    key: "id",
                    align: "center"
                },
                {
                    title: "直播名称",
                    key: "live_name",
                    align: "center"
                },
                {
                    title: "封面图",
                    slot: "img",
                    align: "center"
                },
                {
                    title: "直播时间",
                    key: "start_time",
                    align: "center"
                },
                {
                    title: "直播地址",
                    key: "live_page",
                    align: "center"
                },
                {
                    title: "直播状态",
                    key: "status",
                    align: "center"
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
                page_num: 1
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
            api.getList(this.form)
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
            api.updateInfo(data)
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
                case "edit":
                    this.$refs.addLive.handleShow(id);
                    break;
                case "delete":
                    this.$Modal.confirm({
                        title: "确定要删除吗？",
                        onOk: () => {
                            api.delete({ id }).then(() => {
                                this.$Message.success("操作成功！");
                                this.getEventList();
                            });
                        }
                    });
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
