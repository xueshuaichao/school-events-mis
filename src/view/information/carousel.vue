<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        @btn-click="handleBtnClick"
    >
        <template slot="page-header">
            <Modal
                v-model="modal1"
                :title="title"
                @on-cancel="cancel"
            >
                <i-form
                    ref="formArticle"
                    :model="formArticle"
                    :label-width="80"
                    :rules="ruleArticle"
                >
                    <form-item
                        label="轮播图"
                        prop="image"
                    >
                        <upload-image
                            v-model="formArticle.image"
                            :file-list="fileList"
                            @onSuccess="handleSuccess"
                            @onRemove="handleRemove"
                        />
                        <p>支持jpg/png格式，大小不超过5M</p>
                    </form-item>
                    <form-item label="是否带链接">
                        <RadioGroup
                            v-model="isLink"
                            @on-change="handleRadioChange"
                        >
                            <Radio label="true">
                                <span>带链接</span>
                            </Radio>
                            <Radio label="false">
                                <span>不带链接</span>
                            </Radio>
                        </RadioGroup>
                    </form-item>
                    <form-item
                        v-show="isLink === 'true'"
                        label="链接地址"
                        prop="url"
                    >
                        <i-input v-model="formArticle.url" />
                    </form-item>
                </i-form>
                <template slot="footer">
                    <div>
                        <i-button @click="handleClickCancel">
                            取消
                        </i-button>
                        <i-button
                            type="primary"
                            @click="ok"
                        >
                            保存
                        </i-button>
                    </div>
                </template>
            </Modal>
            <Select
                v-model="formArticle.space_id"
                class="mar-r-10"
                style="width: 200px"
                @on-change="handleChange"
            >
                <Option
                    v-for="item in bannerTypeList"
                    :key="item.value"
                    :value="item.value"
                >
                    {{ item.label }}
                </Option>
            </Select>
            <i-button
                class="mar-r-10"
                @click="handleAddbanner"
            >
                新增轮播图
            </i-button>
            <i-button @click="handleSort">
                {{ sortTitle }}
            </i-button>
            <p :style="{ lineHeight: '36px' }">
                轮播图最多支持添加10条
            </p>
        </template>
        <div slot="footer" />
    </page-list>
</template>
<script>
/* eslint-disable */
import Vue from "vue";
import { mapMutations } from "vuex";
import PageList from "../components/page/list.vue";
import api from "../../api/information";
import "./addArticle.less";
import UploadImage from "../components/upload/image/index.vue";

export default {
    name: "Index",
    components: {
        PageList,
        UploadImage
    },
    data() {
        const validatorUrl = (rule, value, callback) => {
            if (!value && this.isLink === "true") {
                callback(new Error("请输入链接地址"));
            } else if (
                this.formArticle.space_id === 5 &&
                this.isLink === "true" &&
                value
            ) {
                callback();
            } else if (
                !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
                    value
                ) &&
                this.isLink === "true"
            ) {
                callback(new Error("链接地址格式不正确"));
            } else {
                callback();
            }
        };
        return {
            sortTitle: "排序",
            modal1: false,
            title: "",
            loading: false,
            pageNum: 10,
            isLink: "true",
            fileList: [],
            flag: true,
            ruleArticle: {
                image: [
                    {
                        required: true,
                        message: "请上传图片",
                        trigger: "blur"
                    }
                ],
                url: [
                    {
                        validator: validatorUrl,
                        trigger: "blur"
                    }
                ]
            },
            bannerTypeList: [
                {
                    value: 1,
                    label: "PC首页"
                },
                {
                    value: 3,
                    label: "PC-精彩活动"
                },
                {
                    value: 5,
                    label: "小程序Banner"
                },
                {
                    value: 6,
                    label: "H5Banner"
                },
                {
                    value: 4,
                    label: "APP"
                }
            ],
            formArticle: {
                image: "",
                url: "",
                space_id: 1 // 1 pc首页 2小程序首页 3精彩活动
            },
            btnList: [
                {
                    name: "edit"
                },
                {
                    name: "delete"
                }
            ],
            columns: [
                {
                    title: "序号",
                    key: "sort",
                    align: "center"
                },
                {
                    title: "轮播图",
                    key: "banner_image",
                    align: "center",
                    slot: "bannerImage"
                },
                {
                    title: "展示位置",
                    key: "show_name",
                    align: "center"
                },
                {
                    title: "链接地址",
                    key: "banner_url",
                    align: "center"
                },
                {
                    title: "发布时间",
                    key: "created_at",
                    align: "center"
                },
                {
                    title: "发布人",
                    key: "create_by_name",
                    align: "center"
                },
                {
                    title: "点击数",
                    key: "click_count",
                    align: "center"
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    slot: "action"
                }
            ],
            list: []
        };
    },
    created() {
        this.getCarouselList();
    },
    methods: {
        ...mapMutations(["openMainSpin"]),
        handleRadioChange(value) {
            if (value === "false") {
                this.formArticle.url = "";
            }
        },
        // 切换到排序模式
        handleSort() {
            if (this.sortTitle === "排序") {
                if (this.list.length === 1) {
                    this.$Modal.warning({
                        title: "提示",
                        content: "当前内容为一条不需要排序"
                    });
                    return;
                }
                this.sortTitle = "排序完成";
                this.btnList = [
                    {
                        name: "up"
                    },
                    {
                        name: "down"
                    }
                ];
            } else {
                this.$Modal.confirm({
                    title: "提示",
                    content: "<p>排序是否保存，保存后前台将更新排序</p>",
                    onOk: () => {
                        const data = this.list.map(item => item.id);
                        this.openMainSpin(true);

                        api.bannerSort({ ids: data })
                            .then(() => {
                                this.sortTitle = "排序";
                                this.btnList = [
                                    {
                                        name: "edit"
                                    },
                                    {
                                        name: "delete"
                                    }
                                ];
                                this.getCarouselList();
                                this.openMainSpin(false);
                            })
                            .catch(this.openMainSpin(false));
                    }
                });
            }
        },
        getCarouselList() {
            this.openMainSpin(true);
            api.bannerList({ space_id: this.formArticle.space_id })
                .then(({ data }) => {
                    this.openMainSpin(false);
                    data.forEach(v => {
                        v.show_name = this.bannerTypeList.find(
                            item => item.value === v.space_id
                        ).label;
                    });
                    this.list = data;
                })
                .catch(() => {
                    this.openMainSpin(false);
                });
        },
        // 触发编辑或删除按钮
        handleBtnClick(
            { name },
            { id, banner_image: bannerImage, banner_url: bannerUrl },
            index
        ) {
            if (name === "delete") {
                this.$Modal.confirm({
                    title: "删除提示",
                    content: "<p>删除后数据将无法恢复，是否确认删除？</p>",
                    onOk: () => {
                        this.deleteCarousel({ id });
                    }
                });
            }
            if (name === "edit") {
                this.isLink = bannerUrl ? "true" : "false";
                this.formArticle = {
                    ...this.formArticle,
                    image: bannerImage,
                    url: bannerUrl,
                    id
                };
                this.title = "banner编辑";
                this.modal1 = true;
            }
            if (name === "up") {
                const obj = this.list[index];
                this.list[index] = this.list[index - 1];
                Vue.set(this.list, index - 1, obj);
            }
            if (name === "down") {
                const obj = this.list[index];
                this.list[index] = this.list[index + 1];
                Vue.set(this.list, index + 1, obj);
            }
        },
        // 删除banner
        deleteCarousel(data) {
            this.openMainSpin(true);
            api.bannerDelete(data)
                .then(() => {
                    this.openMainSpin(false);
                    this.getCarouselList();
                })
                .catch(() => {
                    this.openMainSpin(false);
                });
        },
        // 点击新增banner按钮，弹出modal
        handleAddbanner() {
            if (this.list.length >= 10) {
                this.$Message.warning(
                    "轮播图最多支持添加10条，若要添加新的，请先删除"
                );
            } else {
                this.title = "banner新增";
                this.modal1 = true;
            }
        },
        // 删除已经添加的图片
        handleRemove() {
            this.formArticle.image = "";
            this.fileList = [];
        },

        handleSuccess({ name, url }) {
            this.formArticle.image = url;
            Vue.set(this.fileList, 0, {
                name,
                url
            });
        },
        // 新增banner提交
        ok() {
            this.$refs.formArticle.validate(valid => {
                if (valid && this.flag) {
                    this.flag = false;
                    this.openMainSpin(true);
                    if (this.title === "banner新增") {
                        this.formArticle.type = this.formArticle.url ? 1 : 2;
                        api.bannerAdd(this.formArticle)
                            .then(() => {
                                this.modal1 = false;
                                this.$refs.formArticle.resetFields();
                                this.formArticle = {
                                    ...this.formArticle,
                                    image: "",
                                    url: ""
                                };
                                this.fileList = [];
                                this.getCarouselList();
                                this.openMainSpin(false);
                                this.flag = true;
                            })
                            .catch(() => {
                                this.flag = true;
                                this.openMainSpin(false);
                            });
                    } else {
                        this.formArticle.type = this.formArticle.url ? 1 : 2;
                        api.bannerUpdate(this.formArticle)
                            .then(() => {
                                this.modal1 = false;
                                this.$refs.formArticle.resetFields();
                                this.formArticle = {
                                    space_id: this.formArticle.space_id,
                                    image: "",
                                    url: ""
                                };
                                this.fileList = [];
                                this.getCarouselList();
                                this.openMainSpin(false);
                                this.flag = true;
                            })
                            .catch(() => {
                                this.flag = true;
                                this.openMainSpin(false);
                            });
                    }
                }
            });
        },
        handleClickCancel() {
            this.$refs.formArticle.resetFields();
            this.fileList = [];
            this.modal1 = false;
            this.formArticle = {
                ...this.formArticle,
                image: "",
                url: ""
            };
            this.getCarouselList();
        },
        cancel() {
            this.$refs.formArticle.resetFields();
            this.fileList = [];
            this.modal1 = false;
            this.formArticle = {
                ...this.formArticle,
                image: "",
                url: ""
            };
            this.getCarouselList();
        },
        handleChange() {
            this.getCarouselList();
        }
    }
};
</script>

<style scoped>
.deleteMessage {
    font-weight: bold;
    line-height: 24px;
}
</style>
