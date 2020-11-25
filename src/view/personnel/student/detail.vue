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
                    {{ info.student_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    班级
                </span>
                <span class="value">
                    {{ info.grade_name }}{{ info.class_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    民族
                </span>
                <span class="value">
                    {{ info.nation }}
                </span>
            </div>
            <!--            <div class="item">-->
            <!--                <span class="label">-->
            <!--                    学工号-->
            <!--                </span>-->
            <!--                <span class="value">-->
            <!--                    {{ info.number }}-->
            <!--                </span>-->
            <!--            </div>-->
        </div>
        <div class="flex-row">
            <div class="item">
                <span class="label">
                    姓别
                </span>
                <span class="value">
                    {{ info.student_sex }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    入学年份
                </span>
                <span class="value">
                    {{ info.register_time }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    户籍地
                </span>
                <span class="value"> {{ info.address || "暂无" }} </span>
            </div>
        </div>
        <h5 class="h5-title">
            扩展信息
        </h5>
        <div class="flex-row">
            <div class="item">
                <span class="label">
                    家庭住址
                </span>
                <span class="value">
                    {{ info.home_area || "暂无" }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    家长信息
                </span>
                <span class="value">
                    {{ info.parent_name || "暂无" }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    住宿方式
                </span>
                <span class="value">
                    {{ info.live_type }}
                </span>
            </div>
        </div>
        <div class="flex-row">
            <div class="item">
                <span class="label large-label">
                    家长联系方式
                </span>
                <span>
                    {{ info.parent_phone || "暂无" }}
                </span>
            </div>
        </div>
    </page-detail>
</template>

<script>
/* eslint-disable no-restricted-globals */
import PageDetail from '@/view/components/page/detail.vue';
import api from '@/api/personnel';
import { certificateType, nations, liveType } from '@/libs/enum';
import { getAddress } from '@/libs/address';

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
        this.getStudentInfo({ student_id: this.$route.params.id });
    },
    methods: {
        getStudentInfo(data) {
            api.getStudentInfo(data).then(({ data }) => {
                this.info = this.parseData(data);
            });
        },
        parseData(data) {
            const info = data;
            info.ID_type = certificateType[info.ID_type - 1];
            info.student_sex = info.student_sex ? '男' : '女';
            info.nation = isNaN(info.nation)
                ? info.nation
                : nations[Number(info.nation - 1)];
            info.live_type = liveType[info.live_type - 1];
            if (info.province && info.city) {
                info.address = getAddress([
                    info.province,
                    info.city,
                    info.county,
                ]);
            } else {
                info.address = '暂无';
            }
            return info;
        },
    },
};
</script>
