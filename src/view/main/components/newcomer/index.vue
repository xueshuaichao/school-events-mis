<template>
    <div
        v-if="show"
        class="newcomer-wrap"
    >
        <div class="ivu-modal-mask" />
        <div
            v-if="currentStep > 0 && currentStep < 5"
            class="newcomer-sider"
            :class="`newcomer-sider-${currentStep}`"
        >
            <img
                :src="require(`@/assets/images/home/sider-${currentStep}.png`)"
                alt=""
            >
        </div>
        <div
            class="newcomer-content"
            :class="`newcomer-content-${currentStep + 1}`"
            :style="styleObject"
        >
            <p
                class="skip"
                @click="hide"
            >
                跳过
            </p>
            <img
                :src="
                    require(`@/assets/images/home/newcomer-${currentStep +
                        1}.png`)
                "
                alt=""
            >
            <p class="mar-b-24">
                {{ list[currentStep] }}
            </p>
            <i-button
                type="primary"
                @click="handleStep"
            >
                {{ currentStep === 5 ? "好的" : "下一步" }}
            </i-button>
        </div>
    </div>
</template>

<script>
import './index.less';

export default {
    name: 'NewcomerGuide',
    data() {
        return {
            show: true,
            list: [
                '欢迎来到爱挑战管理后台，让我带您熟悉下操作界面吧，帮助您更快上手工作哦！',
                '左侧为主要功能区域，您可以进行活动管理，人员管理，组织管理哦！',
                '必须要在班级管理中导入本校的班级信息，才能够在人员管理中导入学生信息哦！',
                '在人员管理中导入本校学生和老师信息，可自动实时生成账号及初始密码，可批量导出信息下发给学生及老师！',
                '在活动管理中可查看本校活动作品，创造的各级纪录作品，进行上报成绩、活动审核等操作哦！',
                '恭喜您已经掌握了管理后台的操作，快来动手创建本校班级吧！',
            ],
            currentStep: 0,
            styleObject: {
                animation: 'fadeIn .3s',
            },
        };
    },
    methods: {
        handleStep() {
            if (this.currentStep === 5) {
                this.hide();
                this.currentStep = 0;
                return;
            }
            this.currentStep += 1;
        },
        hide() {
            this.show = false;
        },
    },
};
</script>
