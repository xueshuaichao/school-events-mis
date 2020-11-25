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
                label="直播名称："
                prop="live_name"
            >
                <i-input v-model="form.live_name" />
            </form-item>
            <form-item
                label="直播时间："
                prop="time"
            >
                <date-picker
                    :value="form.start_time"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="请选择"
                    @on-change="handleStartTimeChange"
                />
                至
                <date-picker
                    :value="form.end_time"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="请选择"
                    @on-change="handleEndTimeChange"
                />
            </form-item>
            <form-item
                label="直播地址："
                prop="live_page"
            >
                <i-input v-model="form.live_page" />
            </form-item>
            <form-item
                label="直播封面："
                prop="detail"
            >
                <p
                    class="tip"
                    @click="uploadFile('image')"
                >
                    添加封面 建议尺寸 382 X 238
                </p>
                <app-img
                    v-if="uploadImgStatus.image || form.image"
                    :src="form.image"
                    info="image"
                    class="mar-b-24"
                    @on-close="handleDelete"
                />
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
import api from "@/api/live";
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
                image: ""
            },
            form: {},
            rules: {
                live_name: {
                    required: true,
                    message: "请填写直播名称",
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
                            callback(new Error("请选择直播起始时间"));
                        }
                    }
                },
                live_page: {
                    required: true,
                    message: "请填写直播地址",
                    trigger: "change"
                },
                detail: {
                    required: true,
                    trigger: "change",
                    validator: (rule, value, callback) => {
                        const { image: image } = this.form;

                        if (image) {
                            callback();
                        } else {
                            callback("请上传直播封面");
                        }
                    }
                }
            }
        };
    },
    methods: {
        getEventInfo(id) {
            api.getInfo({ id }).then(({ data }) => {
                const { img: image } = data;
                this.form = {
                    ...extend(this.form, data),
                    image
                };
            });
        },

        // 添加/修改
        updateEventInfo() {
            api.updateInfo(this.form).then(
                () => {
                    this.$Message.success("操作成功");
                    this.$emit("on-end");
                    this.show = false;
                },
                err => {
                    this.$Message.error(err);
                }
            );
        },
        uploadFile(img) {
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
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
                live_name: "",
                live_page: "",
                image: "",
                end_time: "",
                start_time: ""
            };
            this.uploadImgStatus = {
                image: ""
            };
            this.$refs.form.resetFields();
        },
        handleVisibleChange() {
            this.handleResetForm();
        }
    }
};
</script>
