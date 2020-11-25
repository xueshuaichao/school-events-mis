<template>
    <Modal
        v-model="show"
        title="添加学生"
        width="435"
    >
        <i-form
            ref="form"
            :model="form"
            :rules="rules"
            class="modal-student"
            :label-width="60"
        >
            <form-item
                label="姓名"
                prop="name"
            >
                <i-input
                    v-model="form.name"
                    :maxlength="10"
                />
            </form-item>
            <form-item
                label="年级"
                prop="grade_id"
            >
                <Select
                    v-model="form.grade_id"
                    placeholder="请选择年级"
                    @on-change="handleGradeChange"
                >
                    <Option
                        v-for="item in gradeList"
                        :key="item.grade_id"
                        :value="item.grade_id"
                    >
                        {{ item.grade_name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="班级"
                prop="class_id"
            >
                <Select
                    v-model="form.class_id"
                    placeholder="请选择班级"
                >
                    <Option
                        v-for="item in classList"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.class_name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="手机号"
                prop="mobile"
            >
                <i-input
                    v-model="form.mobile"
                    :maxlength="11"
                />
            </form-item>
        </i-form>
        <template slot="footer">
            <i-button
                type="primary"
                @click="handleClickSave"
            >
                保存
            </i-button>
            <i-button @click="show = !show">
                取消
            </i-button>
        </template>
    </Modal>
</template>

<script>
import api from '@/api/personnel';
import { mobileValidator } from '@/libs/validator';

export default {
    name: 'AddStudent',
    data() {
        return {
            show: false,
            form: {
                name: '',
                grade_id: '',
                class_id: '',
                mobile: '',
            },
            gradeList: [],
            classList: [],
            rules: {
                name: {
                    required: true,
                    message: '请填写姓名',
                    trigger: 'blur',
                },
                grade_id: {
                    required: true,
                    type: 'number',
                    message: '请选择年级',
                    trigger: 'change',
                },
                class_id: {
                    required: true,
                    type: 'number',
                    message: '请选择班级',
                    trigger: 'change',
                },
                mobile: {
                    required: false,
                    trigger: 'change',
                    validator: mobileValidator(false),
                },
            },
        };
    },
    created() {
        this.getSchoolGrade();
    },
    methods: {
        getSchoolGrade() {
            api.getSchoolGrade().then(({ data }) => {
                this.gradeList = data;
            });
        },
        getSchoolClass(data) {
            return api.getSchoolClass(data).then(({ data }) => {
                this.classList = data;
            });
        },
        handleShow() {
            this.$refs.form.resetFields();
            this.show = true;
        },
        handleHide() {
            this.show = false;
        },
        handleGradeChange(value) {
            if (value) {
                this.getSchoolClass({ grade_id: value });
            }
        },
        handleClickSave() {
            this.$refs.form.validate((res) => {
                if (res) {
                    this.handleAddStudent();
                    this.handleHide();
                }
            });
        },
        handleAddStudent() {
            api.addStudent(this.form).then(() => {
                this.$Message.success('添加学生成功');
                this.$emit('on-success');
            });
        },
    },
};
</script>

<style scoped></style>
