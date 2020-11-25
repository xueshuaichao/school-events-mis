<template>
    <page-edit>
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
                    prop="staff_name"
                >
                    <i-input
                        v-model="form.staff_name"
                        :maxlength="10"
                    />
                </form-item>
                <form-item
                    label="部门"
                    prop="department_id"
                >
                    <department
                        v-model="form.department_id"
                        :select="form.department_id"
                    />
                </form-item>
                <form-item
                    label="手机号"
                    prop="phone"
                >
                    <i-input
                        v-model="form.phone"
                        :disabled="!!form.id"
                        :maxlength="11"
                    />
                </form-item>
            </div>
            <div class="flex-row">
                <form-item label="性别">
                    <i-select
                        v-model="form.staff_sex"
                        clearable
                    >
                        <i-option
                            v-for="selectColumn in selectColumns"
                            :key="selectColumn.id"
                            :value="selectColumn.id"
                        >
                            {{ selectColumn.name }}
                        </i-option>
                    </i-select>
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
                    prop="staff_age"
                >
                    <i-input
                        v-model="form.staff_age"
                        :maxlength="3"
                    />
                </form-item>
            </div>
            <div class="flex-row">
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
                    prop="staff_title"
                >
                    <pull
                        v-model="form.staff_title"
                        :list="teacherTitle"
                        :select="form.staff_title"
                    />
                </form-item>
                <form-item
                    label="学历"
                    prop="education_level"
                >
                    <pull
                        v-model="form.education_level"
                        :list="educationlevel"
                        :select="form.education_level"
                    />
                </form-item>
            </div>
        </i-form>
        <div
            slot="footer"
            class="footer"
        >
            <i-button
                type="primary"
                class="mar-r-16"
                @click="handleSave"
            >
                保存
            </i-button>
        </div>
    </page-edit>
</template>

<script>
import { mapMutations } from 'vuex';
import Pull from '@/view/components/pull/index.vue';
import PageEdit from '@/view/components/page/edit.vue';
import Depart from './personIndex.vue';
import api from '@/api/personnel';
import { teacherTitle, educationlevel, certificateType } from '@/libs/enum';
import { mobileValidator } from '../../../libs/validator';
import './index.less';

export default {
    name: 'EditSchool',
    components: {
        'page-edit': PageEdit,
        pull: Pull,
        department: Depart,
    },
    data() {
        return {
            teacherTitle,
            educationlevel,
            certificateType,
            selectColumns: [
                {
                    id: '0',
                    name: '女',
                },
                {
                    id: '1',
                    name: '男',
                },
            ],
            form: {
                id: '',
                staff_name: '',
                staff_sex: '1',
                staff_age: '',
                department_id: '',
                email: '',
                entry_date: '',
                ID_type: '1',
                ID_number: '',
                number: '',
                staff_title: '1',
                education_level: '1',
                phone: '',
            },
            rules: {
                staff_name: {
                    required: true,
                    message: '请填写姓名',
                    trigger: 'blur',
                },
                department_id: {
                    required: true,
                    message: '请选择部门',
                    trigger: 'change',
                },
                entry_date: {
                    message: '请选择入职年份',
                    trigger: 'change',
                },
                // staff_age: [
                //     {
                //         // message: '请填写年龄',
                //         trigger: 'blur',
                //         validator: staffAge(),
                //     },
                // ],
                number: {
                    message: '请填写学工号',
                    trigger: 'blur',
                },
                staff_title: {
                    message: '请选择职称',
                    trigger: 'blur',
                },
                education_level: {
                    message: '请选择学历',
                    trigger: 'blur',
                },
                phone: {
                    required: !this.$route.params.id,
                    // message: '请输入手机号',
                    trigger: 'blur',
                    validator: mobileValidator(),
                },
            },
        };
    },

    created() {
        const { id } = this.$route.params;

        if (id) {
            this.form.id = id;
            this.getTeacherInfo(id);
        }
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getTeacherInfo(teacherId) {
            this.openMainSpin(true);
            api.edustaffStaffdetail({ id: teacherId })
                .then(({ data }) => {
                    this.openMainSpin(false);
                    Object.keys(data).forEach((key) => {
                        this.form[key] = data[key] ? data[key].toString() : '';
                    });
                })
                .catch(this.openMainSpin(false));
        },
        handleDateChange(data) {
            this.form.entry_date = data;
        },
        handleSave() {
            if (!this.form.staff_sex) {
                this.form.staff_sex = '0';
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { form } = this;
                    this.openMainSpin(true);
                    api.addAndEditPerson(form)
                        .then(() => {
                            this.openMainSpin(false);
                            this.$router.go(-1);
                        })
                        .catch(this.openMainSpin(false));
                }
            });
        },
    },
};
</script>
