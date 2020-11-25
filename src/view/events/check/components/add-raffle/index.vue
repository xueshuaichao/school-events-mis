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
            :rules="rules"
        >
            <form-item
                label="活动名称"
                prop="activity_id"
            >
                <Select
                    v-model="form.activity_id"
                    style="width: 200px;"
                    @on-change="onSelectActivity"
                >
                    <Option
                        v-for="opt in activityList"
                        :key="opt.id"
                        :value="opt.id"
                    >
                        {{ opt.activity_name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="抽奖时间："
                prop="time"
            >
                <DatePicker
                    v-model="dateRange"
                    style="width: 300px"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    split-panels
                    placeholder="请选择抽奖起止时间"
                    @on-change="handleChange"
                />
            </form-item>
            <form-item
                label="每人中奖次数："
                prop="draw_user_limit"
            >
                每人最多可中奖
                <i-input
                    v-model="form.draw_user_limit"
                    style="width: 100px;"
                />
                次
            </form-item>
        </i-form>
        <div class="footer-wrapper">
            <i-button
                type="primary"
                @click="handleAddEvent"
            >
                确定
            </i-button>
            <!-- <i-button @click="handleCancel">
                取消
            </i-button> -->
        </div>
    </modal>
</template>
<script>
/* eslint-disable */
import api from "@/api/activity";
import raffleApi from "@/api/raffle";
import { extend } from "@/libs/utils";

export default {
    name: "AddEvent",
    data() {
        return {
            show: false,
            loading: true,
            currentUploadImg: "",
            currentUploadingImg: "",
            uploadImgStatus: {
                image: ""
            },
            form: {
                activity_id: "",
                draw_user_limit: "",
                start_time: "",
                end_time: ""
            },
            dateRange: [],
            activityList: [],
            rules: {
                activity_id: {
                    required: true,
                    type: "number",
                    message: "请选择对应的活动",
                    trigger: "change"
                },
                draw_user_limit: {
                    required: true,
                    trigger: "change",
                    validator: (rule, value, callback) => {
                        if (!/^\d+$/.test(value)) {
                            return callback(new Error("请输入数字"));
                        }
                        if (value - 0 <= 0) {
                            return callback(new Error("中奖次数必须大于 0"));
                        }
                        callback();
                    }
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
                }
            }
        };
    },
    methods: {
        getOptions() {
            api.getEventList({
                page_num: 1,
                page_size: 1000
            }).then(res => {
                this.activityList = res.data.list.filter(
                    item => item.status - 0 < 3
                );
            });
        },
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
            raffleApi.create(this.form).then(
                () => {
                    this.$Message.success("操作成功");
                    this.$emit("on-end");
                    this.show = false;
                },
                err => {
                    // this.$Message.error(err);
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
        handleChange(val) {
            [this.form.start_time, this.form.end_time] = val;
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
        },

        onSelectActivity(val) {
            const selectItem = this.activityList.find(
                item => item.id === val - 0
            );
            let { start_time, end_time } = selectItem;
            // start_time.split('/')
            start_time = start_time.replace(/\//g, "-");
            end_time = end_time.replace(/\//g, "-");
            this.form.start_time = `${start_time} 00:00`;
            this.form.end_time = `${end_time} 00:00`;

            this.dateRange = [this.form.start_time, this.form.end_time];
            console.log(this.dateRange);
        }
    },
    created() {
        this.getOptions();
    }
};
</script>
