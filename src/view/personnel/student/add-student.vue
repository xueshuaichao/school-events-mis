<template>
    <page-edit @on-save="handleSave">
        <i-form
            ref="form"
            :model="form"
            :rules="rules"
            class="add-student"
            :label-width="90"
        >
            <h5 class="h5-title">
                基本信息
            </h5>
            <div class="flex-row">
                <div class="small">
                    <form-item
                        label="姓名"
                        prop="name"
                    >
                        <i-input
                            v-model="form.name"
                            :maxlength="10"
                        />
                    </form-item>
                </div>
                <div class="large">
                    <form-item
                        label="班级"
                        prop="class_id"
                    >
                        <i-class
                            ref="class"
                            @on-change="handleSelectClassChange"
                        />
                    </form-item>
                </div>
                <div class="large area">
                    <form-item label="户籍地">
                        <i-address
                            ref="address"
                            :resource="2"
                            @on-change="handleSelectAreaChange"
                        />
                    </form-item>
                </div>
            </div>
            <div class="flex-row">
                <div class="small">
                    <form-item
                        label="性别"
                        prop="sex"
                    >
                        <pull
                            v-model="form.sex"
                            :list="sex"
                        />
                    </form-item>
                </div>
                <div class="large">
                    <form-item
                        label="民族"
                        prop="nation"
                    >
                        <pull
                            v-model="form.nation"
                            :list="nations"
                        />
                    </form-item>
                </div>
                <div class="large">
                    <form-item
                        label="绑定手机号"
                        prop="mobile"
                    >
                        <i-input
                            v-model="form.mobile"
                            placeholder="请输入手机号"
                            :maxlength="11"
                        />
                    </form-item>
                </div>
            </div>
            <h5 class="h5-title">
                扩展信息 (选填项)
            </h5>
            <div class="flex-row">
                <div class="long">
                    <form-item label="家庭住址">
                        <i-input v-model="form.home_area" />
                    </form-item>
                </div>
                <div class="long">
                    <form-item
                        label="家长信息"
                        :label-width="120"
                    >
                        <i-input
                            v-model="form.parent_name"
                            :maxlength="10"
                        />
                    </form-item>
                </div>
            </div>
            <div class="flex-row">
                <div class="long">
                    <form-item label="住宿方式">
                        <pull
                            v-model="form.live_type"
                            :list="liveType"
                        />
                    </form-item>
                </div>
                <div class="long">
                    <form-item
                        label="家长联系方式"
                        :label-width="120"
                        prop="parent_phone"
                    >
                        <i-input
                            v-model="form.parent_phone"
                            :maxlength="11"
                        />
                    </form-item>
                </div>
            </div>
        </i-form>
        <!--   提交成功     -->
        <div
            ref="studentSuccess"
            class="student-success"
        >
            <p>姓名: {{ studentInfo.name }}</p>
            <p>学工号: {{ studentInfo.number }}</p>
            <p>密码: {{ studentInfo.pwd }}</p>
        </div>
    </page-edit>
</template>

<script>
/* eslint-disable no-restricted-globals */
import { mapMutations } from 'vuex';
import Pull from '@/view/components/pull/index.vue';
import PageEdit from '@/view/components/page/edit.vue';
import Class from '@/view/components/class/index.vue';
import api from '@/api/personnel';
import { mobileValidator } from '../../../libs/validator';
import {
    liveType, certificateType, sex, nations,
} from '@/libs/enum';
import Area from '@/view/components/area/index.vue';
import { numberToString, extend } from '@/libs/utils';
import './index.less';

export default {
    name: 'EditSchool',
    components: {
        'page-edit': PageEdit,
        pull: Pull,
        'i-address': Area,
        'i-class': Class,
    },
    data() {
        return {
            nations,
            liveType,
            certificateType,
            sex,
            form: {
                student_id: '',
                name: '',
                sex: '1',
                age: '',
                mobile: '',
                grade_id: '',
                class_id: '',
                nation: '1',
                register_time: '',
                // ID_type: '1',
                // ID_number: '',
                province: '',
                city: '',
                home_area: '',
                number: '',
                parent_name: '',
                parent_phone: '',
                live_type: '1',
            },
            studentInfo: {},
            rules: {
                name: {
                    required: true,
                    message: '请填写姓名',
                    trigger: 'blur',
                },
                class_id: {
                    required: true,
                    message: '请选择班级',
                    trigger: 'change',
                },
                sex: {
                    message: '请选择性别',
                    trigger: 'change',
                },
                nation: {
                    message: '请选择民族',
                    trigger: 'change',
                },
                number: {
                    message: '请填写学工号',
                    trigger: 'blur',
                },
                parent_phone: {
                    required: false,
                    trigger: 'change',
                    validator: mobileValidator(false),
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
        const { id } = this.$route.params;
        if (id) {
            this.getStudentInfo({ student_id: id });
            this.form.student_id = id;
        }
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getStudentInfo(data) {
            api.getStudentInfo(data).then(({ data }) => {
                const info = numberToString(data);
                const {
                    student_name: name,
                    student_sex: sex,
                    province,
                    city,
                    nation,
                    country,
                } = info;
                info.name = name;
                info.sex = sex === '1' ? '1' : '2';
                info.area = [province, city, country];
                info.nation = isNaN(nation)
                    ? String(nations.indexOf(nation) + 1)
                    : nation;
                this.form = extend(this.form, info);
                this.$refs.address.setDefaultArea(info.area);
                this.$refs.class.setDefaultClass([
                    info.grade_id,
                    info.class_id,
                ]);
            });
        },
        updateStudentInfo() {
            const info = JSON.parse(JSON.stringify(this.form));
            const { student_id: id, sex } = info;
            info.sex = sex === '1' ? 1 : 0;
            this.openMainSpin(true);
            api[id ? 'updateStudentInfo' : 'addStudent'](info)
                .then(({ data }) => {
                    this.openMainSpin(false);
                    this.studentInfo = data;
                    if (id) {
                        this.$router.go(-1);
                    } else {
                        this.$nextTick(this.handleSuccessInfo);
                    }
                })
                .catch(this.openMainSpin(false));
        },
        handleSave() {
            this.$refs.form.validate((res) => {
                if (res) {
                    this.updateStudentInfo();
                }
            });
        },
        handleSelectAreaChange([province, city, country]) {
            this.form = Object.assign({}, this.form, {
                province,
                city,
                country,
            });
        },
        handleSelectClassChange([gradeId, classId]) {
            this.form.grade_id = gradeId;
            this.form.class_id = classId;
        },
        handleSuccessInfo() {
            this.$Modal.success({
                title: '学生添加成功',
                content: this.$refs.studentSuccess.outerHTML,
                onOk: () => {
                    this.$router.go(-1);
                },
            });
        },
    },
};
</script>
