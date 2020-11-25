<template>
    <page-detail
        class-name="school-mes-wrapper"
        btn-name="编辑"
        path="/school/edit"
    >
        <!--0 审核中 1 审核通过 2 审核未通过-->
        <h5
            v-if="info.status !== 1"
            class="h5-title"
        >
            学校信息
            <p v-if="info.status === 2">
                信息审核不通过，请修改后提交。{{
                    info.memo ? `原因：${info.memo}` : ""
                }}
            </p>
            <p v-else>
                信息审核中，审核期间禁止上报成绩操作，审核通过后即可正常操作.
            </p>
        </h5>
        <div class="item flex-row">
            <span class="label">
                学校
            </span>
            <div class="logo">
                <img
                    :src="info.logo"
                    alt=""
                >
            </div>
        </div>
        <div class="item flex-row">
            <span class="label">
                学校名称
            </span>
            <span class="value">
                {{ info.name }}
            </span>
        </div>
        <div class="item flex-row">
            <span class="label">
                学段
            </span>
            <span class="value">
                {{ info.stage }}
            </span>
        </div>
        <div class="item flex-row">
            <span class="label">
                学制
            </span>
            <span class="value">
                {{ info.system }}
            </span>
        </div>
        <div class="item flex-row">
            <span class="label">
                学校地址
            </span>
            <span class="value">
                {{ info.address }}
            </span>
        </div>
        <div class="item flex-row">
            <span class="label">
                详细地址
            </span>
            <span class="value">
                {{ info.area }}
            </span>
        </div>
        <div class="item flex-row">
            <span class="label">
                联系人
            </span>
            <span class="value">
                {{ info.contacts }}
            </span>
        </div>
        <div class="item flex-row">
            <span class="label">
                联系电话
            </span>
            <span class="value">
                {{ info.phone }}
            </span>
        </div>
        <div class="item flex-row">
            <span class="label">
                学校简介
            </span>
            <span class="value">
                {{ info.school_introduction }}
            </span>
        </div>
    </page-detail>
</template>

<script>
import { mapMutations } from 'vuex';
import './index.less';
import PageDetail from '@/view/components/page/detail.vue';
import { learnSection, learnSystem } from '@/libs/enum';
import { getAddress } from '@/libs/address';
import api from '@/api/organization';

export default {
    name: 'SchoolManage',
    components: {
        'page-detail': PageDetail,
    },
    data() {
        return {
            info: {
                status: 1,
            },
        };
    },
    mounted() {
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
            const info = data;
            const {
                stage, system, province, city, county,
            } = info;
            info.stage = learnSection[stage - 1];
            info.system = learnSystem.find(v => v.value - 0 === system).label || '';
            info.address = getAddress([province, city, county]);
            this.info = info;
        },
    },
};
</script>
