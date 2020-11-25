<template>
    <modal
        v-model="show"
        :title="form.id ? '编辑主题' : '添加主题'"
        width="600"
        class="app-modal"
        footer-hide
        :mask-closable="false"
    >
        <i-form
            ref="form"
            :model="form"
            :label-width="140"
            :rules="rules"
        >
            <form-item
                label="主题名称"
                prop="title"
            >
                <i-input
                    v-model="form.title"
                    style="width: 330px;"
                />
            </form-item>
            <form-item
                label="启用时间："
                prop="time"
            >
                <DatePicker
                    v-model="dateRange"
                    style="width: 330px"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    split-panels
                    placeholder="请选择启用时间"
                    @on-change="handleChange"
                />
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
import api from "@/api/poem";
import { extend } from "@/libs/utils";

export default {
    name: "AddEvent",
    data() {
        return {
            show: false,
            loading: true,
            form: {
                id: "",
                title: "",
                start_time: "",
                end_time: ""
            },
            dateRange: [],
            activityList: [],
            rules: {
                title: {
                    required: true,
                    // type: "number",
                    message: "请填写主题名称",
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
        // 添加/修改
        updateEventInfo() {
            let fn;
            if (this.form.id) {
                fn = api.update;
            } else {
                fn = api.create;
            }

            fn(this.form).then(
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
        handleShow(params = {}) {
            if (params.id) {
                console.log(params.title);
                this.form.id = params.id;
                this.form.start_time = params.start_time;
                this.form.end_time = params.end_time;
                this.form.title = params.title;
                this.dateRange = [params.start_time, params.end_time];
            } else {
                this.handleResetForm();
            }
            this.show = true;
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
                title: "",
                start_time: "",
                end_time: ""
            };
        },
        handleVisibleChange() {
            this.handleResetForm();
        }
    },
    created() {}
};
</script>
