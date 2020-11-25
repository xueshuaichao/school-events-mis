<template>
    <page-edit @on-save="handleSave">
        <i-form
            id="edit-school"
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="90"
        >
            <h5 class="h5-title">
                学校信息
            </h5>
            <form-item prop="logo">
                <file v-model="form.logo">
                    <p slot="tips">
                        请上传学校风景图片格式：png、jpg等，大小不超过5M
                        图片尺寸：建议尺寸216*122像素
                    </p>
                </file>
                <img
                    :src="form.logo"
                    alt=""
                    class="school-logo"
                >
            </form-item>
            <form-item
                label="学校名称"
                prop="name"
            >
                <i-input
                    v-model="form.name"
                    :maxlength="20"
                />
                {{ form.name.length }}/20
            </form-item>
            <form-item
                label="学段"
                prop="stage"
            >
                <pull
                    v-model="form.stage"
                    :list="learnSection"
                    placeholder="学段"
                />
            </form-item>
            <form-item
                label="学制"
                prop="system"
            >
                <pull
                    v-model="form.system"
                    :list="learnSystem"
                    placeholder="学制"
                />
            </form-item>
            <form-item
                label="学校地址"
                prop="address"
            >
                <i-address
                    ref="address"
                    @on-change="handleAreaChange"
                />
            </form-item>
            <form-item
                label="详细地址"
                prop="area"
            >
                <i-input
                    v-model="form.area"
                    :maxlength="100"
                />
                {{ form.area.length }}/100
            </form-item>
            <form-item
                label="联系人"
                prop="contacts"
            >
                <i-input
                    v-model="form.contacts"
                    :maxlength="10"
                />
                {{ form.contacts.length }}/10
            </form-item>
            <form-item
                label="联系电话"
                prop="phone"
            >
                <i-input
                    v-model="form.phone"
                    :maxlength="11"
                />
            </form-item>
            <form-item
                label="学校简介"
                prop="school_introduction"
                class="textarea"
            >
                <i-input
                    v-model="form.school_introduction"
                    type="textarea"
                    :rows="10"
                    :maxlength="300"
                />
                {{ form.school_introduction.length }}/300
            </form-item>
        </i-form>
    </page-edit>
</template>

<script>
import { mapMutations } from 'vuex';
import Pull from '@/view/components/pull/index.vue';
import PageEdit from '@/view/components/page/edit.vue';
import UploadFile from '@/view/components/upload/file/index.vue';
import Area from '@/view/components/area/index.vue';
import api from '@/api/organization';
import { numberToString, extend } from '@/libs/utils';
import { mobileValidator } from '@/libs/validator';
import './index.less';
import { learnSection, learnSystem } from '@/libs/enum';

export default {
    name: 'EditSchool',
    components: {
        'page-edit': PageEdit,
        'i-address': Area,
        file: UploadFile,
        pull: Pull,
    },
    data() {
        return {
            learnSection,
            learnSystem,
            form: {
                logo: '',
                name: '',
                stage: 1,
                system: 1,
                address: [],
                province: '610000',
                city: '',
                county: '',
                area: '',
                contacts: '',
                phone: '',
                school_introduction: '',
            },
            rules: {
                logo: {
                    required: true,
                    message: '请上传logo',
                    trigger: 'change',
                },
                name: {
                    required: true,
                    message: '请输入学校名称',
                    trigger: 'blur',
                },
                stage: {
                    required: true,
                    message: '请选择学段',
                    trigger: 'blur',
                },
                system: {
                    required: true,
                    message: '请选择学制',
                    trigger: 'change',
                },
                area: {
                    required: true,
                    message: '请选择输入详细地址',
                    trigger: 'change',
                },
                contacts: {
                    required: true,
                    message: '请输入联系人',
                    trigger: 'blur',
                },
                phone: {
                    required: true,
                    trigger: 'blur',
                    validator: mobileValidator(),
                },
                address: {
                    required: true,
                    type: 'array',
                    min: 3,
                    message: '请选择学校地址',
                    trigger: 'change',
                },
            },
        };
    },
    created() {
        this.getSchoolInfo();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getSchoolInfo() {
            this.openMainSpin(true);
            api.getSchoolInfo()
                .then(({ data }) => {
                    this.openMainSpin(false);
                    this.parseData(data);
                })
                .catch(this.openMainSpin(false));
        },
        parseData(data) {
            const info = numberToString(data);
            info.address = [info.province, info.city, info.county];
            info.school_introduction = info.school_introduction || '';
            this.form = extend(this.form, info);
            this.$refs.address.setDefaultArea(info.address);
        },
        updateSchoolInfo() {
            const { form } = this;
            this.openMainSpin(true);
            api.schoolUpdateInfo(form)
                .then(() => {
                    this.openMainSpin(false);
                    this.$router.go(-1);
                })
                .catch(this.openMainSpin(false));
        },
        handleSave() {
            this.$refs.form.validate((res) => {
                if (res) {
                    this.updateSchoolInfo();
                }
            });
        },
        handleAreaChange(data) {
            const { form } = this;
            const [province, city, county] = data;
            this.form = Object.assign({}, form, {
                province,
                city,
                county,
                address: data,
            });
        },
    },
};
</script>
