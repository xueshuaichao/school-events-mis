<template>
    <modal
        v-model="show"
        :title="form.id ? '编辑活动' : '添加活动'"
        width="600"
        class="app-modal"
        footer-hide
        :mask-closable="false"
        @on-visible-change="handleVisibleChange"
    >
        <i-form
            ref="form"
            :model="form"
            :label-width="140"
            class="add-event"
            :rules="rules"
        >
            <form-item
                label="活动名称："
                prop="activity_name"
            >
                <i-input
                    v-model="form.activity_name"
                    :maxlength="15"
                />
            </form-item>
            <form-item
                label="活动时间："
                prop="time"
            >
                <date-picker
                    :value="form.start_time"
                    type="date"
                    placeholder="请选择"
                    @on-change="handleStartTimeChange"
                />
                至
                <date-picker
                    :value="form.end_time"
                    type="date"
                    placeholder="请选择"
                    @on-change="handleEndTimeChange"
                />
            </form-item>
            <form-item
                label="初始关注人数："
                prop="base_count"
            >
                <i-input v-model="form.base_count" />
            </form-item>
            <form-item
                label="活动分享文案："
                prop="share_content"
            >
                <i-input v-model="form.share_content" />
            </form-item>
            <form-item
                label="小程序分享路径："
                prop="mini_path"
            >
                <i-input v-model="form.mini_path" />
            </form-item>
            <form-item
                label="H5链接："
                prop="h5_path"
            >
                <i-input v-model="form.h5_path" />
            </form-item>
            <form-item
                label="活动详情："
                prop="detail"
            >
                <p class="ivu-checkbox-wrapper">
                    PC
                </p>
                <p
                    class="tip"
                    @click="uploadFile('pc_show', 'pc_img')"
                >
                    添加封面 建议尺寸 382 X 238
                </p>
                <app-img
                    v-if="uploadImgStatus.pc_img || form.pc_img"
                    :src="form.pc_img"
                    info="pc_img"
                    class="mar-b-24"
                    @on-close="handleDelete"
                />
                <p class="ivu-checkbox-wrapper">
                    小程序、H5
                </p>
                <div class="mini-h5-img">
                    <div class="mar-r-24">
                        <p
                            class="tip"
                            @click="
                                uploadFile('mini_h5_show', 'mini_h5_hot_img')
                            "
                        >
                            添加热门活动封面 建议尺寸 254 X 160
                        </p>
                        <app-img
                            v-if="
                                uploadImgStatus.mini_h5_hot_img ||
                                    form.mini_h5_hot_img
                            "
                            info="mini_h5_hot_img"
                            class="mar-b-24"
                            :src="form.mini_h5_hot_img"
                            @on-close="handleDelete"
                        />
                    </div>
                    <div>
                        <p
                            class="tip"
                            @click="uploadFile('mini_h5_show', 'mini_h5_img')"
                        >
                            添加活动列表封面 建议尺寸 670 X 277
                        </p>
                        <app-img
                            v-if="
                                uploadImgStatus.mini_h5_img || form.mini_h5_img
                            "
                            :src="form.mini_h5_img"
                            class="mar-b-24"
                            info="mini_h5_img"
                            @on-close="handleDelete"
                        />
                    </div>
                </div>
                <p class="ivu-checkbox-wrapper">
                    APP
                </p>
                <div class="mini-h5-img">
                    <div class="mar-r-24">
                        <p
                            class="tip"
                            @click="uploadFile('app_show', 'app_hot_img')"
                        >
                            添加热门活动封面 建议尺寸 254 X 160
                        </p>
                        <app-img
                            v-if="
                                uploadImgStatus.app_hot_img || form.app_hot_img
                            "
                            info="app_hot_img"
                            class="mar-b-24"
                            :src="form.app_hot_img"
                            @on-close="handleDelete"
                        />
                    </div>
                    <div>
                        <p
                            class="tip"
                            @click="uploadFile('app_show', 'app_img')"
                        >
                            添加活动列表封面 建议尺寸 670 X 277
                        </p>
                        <app-img
                            v-if="uploadImgStatus.app_img || form.app_img"
                            :src="form.app_img"
                            info="app_img"
                            @on-close="handleDelete"
                        />
                    </div>
                </div>
            </form-item>
        </i-form>
        <div class="footer-wrapper">
            <i-button
                type="primary"
                class="mar-r-24"
                @click="handleAddEvent"
            >
                {{ form.id ? "保存" : "创建" }}
            </i-button>
            <i-button @click="handleCancel">
                取消
            </i-button>
        </div>
        <file
            v-show="false"
            ref="file"
            :on-before-upload="onBeforeUpload"
            @on-end="onUploadEnd"
        />
    </modal>
</template>
<script>
/* eslint-disable */
import api from "@/api/activity";
import File from "@/view/components/upload/file/index.vue";
import { extend } from "@/libs/utils";
import AppImg from "../img/index.vue";
import "../../index.less";

export default {
    name: "AddEvent",
    components: {
        File,
        AppImg
    },
    data() {
        return {
            show: false,
            loading: true,
            currentUploadImg: "",
            currentUploadingImg: "",
            uploadImgStatus: {
                pc_img: "",
                mini_h5_hot_img: "",
                mini_h5_img: "",
                app_hot_img: "",
                app_img: ""
            },
            form: {},
            rules: {
                activity_name: {
                    required: true,
                    message: "请填写活动名称",
                    trigger: "change"
                },
                time: {
                    required: true,
                    trigger: "change",
                    validator: (rule, value, callback) => {
                        const { start_time, end_time } = this.form;

                        if (start_time && end_time) {
                            if (
                                new Date(start_time).valueOf() >
                                new Date(end_time).valueOf()
                            ) {
                                callback(new Error("结束时间不能小于开始时间"));
                                return;
                            }
                            callback();
                        } else {
                            callback(new Error("请选择活动起始时间"));
                        }
                    }
                },
                base_count: {
                    required: true,
                    message: "请设置初始关注人数",
                    trigger: "change"
                },
                share_content: {
                    // required: true,
                    message: "请填写活动分享文案",
                    trigger: "change"
                },
                mini_path: {
                    // required: true,
                    message: "小程序分享路径",
                    trigger: "change"
                },
                h5_path: {
                    message: "H5 链接",
                    trigger: "change"
                },
                detail: {
                    required: true,
                    trigger: "change",
                    validator: (rule, value, callback) => {
                        const {
                            pc_img: pc,
                            mini_h5_img: mini,
                            mini_h5_hot_img: h5,
                            app_hot_img: app,
                            app_img: appList
                        } = this.form;

                        if (pc || (mini && h5) || (app && appList)) {
                            callback();
                        } else {
                            callback("PC、小程序和H5、App 必须上传完整的一项");
                        }
                        // if (pc && mini && h5 && app && appList) {
                        //     callback();
                        // } else {
                        //     if (!pc) {
                        //         callback(new Error("请上传PC封面图"));
                        //     } else if (!mini || !h5) {
                        //         callback(new Error("请上传小程序，H5封面图"));
                        //     } else {
                        //         callback(new Error("请上传APP封面图"));
                        //     }
                        // }
                    }
                }
            }
        };
    },
    methods: {
        getEventInfo(id) {
            api.getEventInfo({ id }).then(({ data }) => {
                const { pc_show, app_show, mini_h5_show } = data;

                this.form = {
                    ...extend(this.form, data),
                    base_count: data.activity_base_count.toString(),
                    pc_show: 1,
                    mini_h5_show: 1,
                    app_show: 1
                };
            });
        },

        // 添加/修改
        updateEventInfo() {
            this.show = false;
            try {
                const {
                    pc_img: pc,
                    mini_h5_img: mini,
                    mini_h5_hot_img: h5,
                    app_hot_img: app,
                    app_img: appList
                } = this.form;

                this.form.pc_show = 0;
                this.form.mini_h5_show = 0;
                this.form.app_show = 0;
                if (pc) {
                    this.form.pc_show = 1;
                }
                if (mini && h5) {
                    this.form.mini_h5_show = 1;
                }
                if (app && appList) {
                    this.form.app_show = 1;
                }
            } catch (e) {
                console.log(e);
            }

            api.updateEventInfo(this.form).then(() => {
                this.$Message.success("操作成功");
                this.$emit("on-end");
            });
        },
        uploadFile(type, img) {
            // if (this.form[type]) {
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
            // }
        },
        onBeforeUpload() {
            this.currentUploadingImg = this.currentUploadImg;
            this.uploadImgStatus[this.currentUploadImg] = true;
            return true;
        },
        onUploadEnd([{ path }]) {
            this.form[this.currentUploadingImg] = path;
        },
        handleShow(id) {
            this.show = true;
            if (id) {
                this.getEventInfo(id);
            }
        },
        handleDelete(info) {
            this.form[info] = "";
            this.uploadImgStatus[info] = false;
        },
        handleStartTimeChange(val) {
            this.form.start_time = val;
        },
        handleEndTimeChange(val) {
            this.form.end_time = val;
        },
        handleAddEvent() {
            this.$refs.form.validate(res => {
                if (res) {
                    this.updateEventInfo();
                }
            });
        },
        handleCancel() {
            this.handleResetForm();
            this.show = false;
        },
        handleResetForm() {
            this.form = {
                id: "",
                activity_name: "",
                base_count: "",
                pc_show: 1,
                app_show: 1,
                mini_h5_show: 1,
                end_time: "",
                start_time: "",
                share_content: "",
                pc_img: "",
                mini_h5_hot_img: "",
                mini_h5_img: "",
                app_hot_img: "",
                app_img: "",
                mini_path: "",
                h5_path: ""
            };
            this.uploadImgStatus = {
                pc_img: "",
                mini_h5_hot_img: "",
                mini_h5_img: "",
                app_hot_img: "",
                app_img: ""
            };
            this.$refs.form.resetFields();
        },
        handleVisibleChange() {
            this.handleResetForm();
        }
    }
};
</script>
