<template>
    <page-edit @on-save="handleSave">
        <i-form
            ref="form"
            :model="form"
            :rules="rules"
            class="add-teacher"
            :label-width="90"
        >
            <h5 class="h5-title">
                基本信息
            </h5>
            <div class="flex-row">
                <form-item
                    label="姓名"
                    prop="name"
                >
                    <i-input
                        v-model="form.name"
                        :maxlength="10"
                    />
                </form-item>
                <!--                <form-item-->
                <!--                    label="部门"-->
                <!--                    prop="department_id"-->
                <!--                >-->
                <!--                    <department-->
                <!--                        v-model="form.department_id"-->
                <!--                        :select="form.department_id"-->
                <!--                    />-->
                <!--                </form-item>-->
                <form-item
                    v-if="!form.id"
                    label="手机号"
                    prop="phone"
                >
                    <i-input
                        v-model="form.phone"
                        :maxlength="11"
                    />
                </form-item>
                <form-item
                    label="学历"
                    prop="education_level"
                >
                    <pull
                        v-model="form.education_level"
                        :list="educationlevel"
                    />
                </form-item>
            </div>
            <div class="flex-row">
                <form-item
                    label="性别"
                    prop="sex"
                >
                    <pull
                        v-model="form.sex"
                        :list="sex"
                    />
                </form-item>
                <form-item
                    label="入职年份"
                    prop="entry_date"
                >
                    <DatePicker
                        type="year"
                        placeholder="请选择入职时间"
                        :value="form.entry_date"
                        @on-change="handleDateChange"
                    />
                </form-item>
                <form-item
                    label="年龄"
                    prop="age"
                >
                    <i-input
                        v-model="form.age"
                        :maxlength="2"
                    />
                </form-item>
            </div>
            <div class="flex-row">
                <form-item
                    label="任课科目"
                    prop="subject"
                >
                    <i-input
                        v-model="form.subject"
                        :maxlength="10"
                    />
                </form-item>
                <form-item
                    label="学工号"
                    prop="number"
                >
                    <i-input
                        v-model="form.number"
                        :maxlength="20"
                    />
                </form-item>
                <form-item
                    label="职称"
                    prop="teacher_title"
                >
                    <pull
                        v-model="form.teacher_title"
                        :list="teacherTitle"
                    />
                </form-item>
            </div>
            <div class="flex-row" />
        </i-form>
    </page-edit>
</template>

<script>
import { mapMutations } from 'vuex';
import Pull from '@/view/components/pull/index.vue';
import PageEdit from '@/view/components/page/edit.vue';
// import Depart from '@/view/components/department/index.vue';
import api from '@/api/personnel';
import { mobileValidator } from '../../../libs/validator';
import {
    teacherTitle,
    educationlevel,
    sex,
    certificateType,
} from '@/libs/enum';
import { numberToString } from '@/libs/utils';
import './index.less';

export default {
    name: 'EditSchool',
    components: {
        'page-edit': PageEdit,
        pull: Pull,
        // department: Depart,
    },
    data() {
        return {
            teacherTitle,
            educationlevel,
            certificateType,
            sex,
            form: {
                id: '',
                name: '',
                sex: '1',
                age: '',
                department_id: '',
                email: '',
                entry_date: '',
                ID_type: '1',
                ID_number: '',
                subject: '',
                number: '',
                teacher_title: '1',
                education_level: '1',
                phone: '',
            },
            rules: {
                name: {
                    required: true,
                    message: '请填写姓名',
                    trigger: 'blur',
                },
                department_id: {
                    required: true,
                    message: '请选择部门',
                    trigger: 'change',
                },
                sex: {
                    message: '请选择性别',
                    trigger: 'change',
                },
                entry_date: {
                    message: '请选择入职年份',
                    trigger: 'change',
                },
                age: [
                    {
                        message: '请填写年龄',
                        trigger: 'blur',
                    },
                ],
                subject: {
                    message: '请填写任课科目',
                    trigger: 'blur',
                },
                number: {
                    message: '请填写学工号',
                    trigger: 'blur',
                },
                teacher_title: {
                    message: '请选择职称',
                    trigger: 'blur',
                },
                education_level: {
                    message: '请选择学历',
                    trigger: 'blur',
                },
                phone: {
                    required: true,
                    trigger: 'blur',
                    validator: mobileValidator(),
                },
            },
        };
    },
    created() {
        const { id } = this.$route.params;
        if (id) {
            this.form.teacher_id = id;
            this.getTeacherInfo(id);
        }
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getTeacherInfo(teacherId) {
            const { form } = this;
            this.openMainSpin(true);
            api.getTeacherInfo({ teacher_id: teacherId })
                .then(({ data }) => {
                    const info = data;
                    const {
                        teacher_age: age,
                        teacher_name: name,
                        teacher_sex: sex,
                    } = data;
                    this.openMainSpin(false);
                    info.age = age;
                    info.name = name;
                    info.sex = sex === 1 ? '1' : '2';
                    this.form = Object.assign({}, form, numberToString(info));
                })
                .catch(this.openMainSpin(false));
        },
        updateTeacherInfo() {
            const info = JSON.parse(JSON.stringify(this.form));
            const { teacher_id: id, sex } = info;
            info.sex = sex === '1' ? 1 : 0;
            this.openMainSpin(true);
            api[id ? 'updateTeacherInfo' : 'addTeacher'](info)
                .then(() => {
                    this.openMainSpin(false);
                    this.$router.go(-1);
                })
                .catch(this.openMainSpin(false));
        },
        handleDateChange(data) {
            this.form.entry_date = data;
        },
        handleSave() {
            this.$refs.form.validate((res) => {
                if (res) {
                    this.updateTeacherInfo();
                }
            });
        },
    },
};
</script>
