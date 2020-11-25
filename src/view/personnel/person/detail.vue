<template>
    <page-detail>
        <h5 class="h5-title">
            基本信息
        </h5>
        <div class="flex-row">
            <div class="item">
                <span class="label">
                    姓名
                </span>
                <span class="value">
                    {{ info.staff_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    部门
                </span>
                <span class="value">
                    {{ info.department_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    性别
                </span>
                <span class="value">
                    {{ info.staff_sex }}
                </span>
            </div>
        </div>
        <div class="flex-row">
            <div class="item">
                <span class="label">
                    年龄
                </span>
                <span class="value">
                    {{ info.staff_age }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    学工号
                </span>
                <span class="value">
                    {{ info.number }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    职称
                </span>
                <span class="value">
                    {{ info.staff_title }}
                </span>
            </div>
        </div>
        <div class="flex-row">
            <div class="item">
                <span class="label">
                    入职年份
                </span>
                <span>
                    {{ info.entry_date }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    学历
                </span>
                <span class="value">
                    {{ info.education_level }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    手机号
                </span>
                <span class="value">
                    {{ info.phone }}
                </span>
            </div>
        </div>
    </page-detail>
</template>

<script>
import { mapMutations } from 'vuex';
import PageDetail from '@/view/components/page/detail.vue';
import { teacherTitle, educationlevel, certificateType } from '@/libs/enum';
import api from '@/api/personnel';

export default {
    name: 'Detail',
    components: {
        'page-detail': PageDetail,
    },
    data() {
        return {
            info: {},
        };
    },
    created() {
        this.getTeacherInfo({ id: this.$route.params.id });
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getTeacherInfo(data) {
            this.openMainSpin(true);
            api.edustaffStaffdetail(data)
                .then(({ data }) => {
                    const info = data;
                    info.staff_sex = info.staff_sex ? '男' : '女';
                    info.staff_title = teacherTitle[info.staff_title - 1];
                    info.education_level = educationlevel[info.education_level - 1];
                    info.ID_type = certificateType[info.ID_type - 1];
                    this.info = info;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
    },
};
</script>
