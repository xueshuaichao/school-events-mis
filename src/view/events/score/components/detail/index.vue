<template>
    <Modal
        v-model="show"
        title="详情"
        width="600"
    >
        <div class="score-detail">
            <div class="item">
                <span class="label">
                    活动名称：
                </span>
                <span class="value">
                    {{ info.resource_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    参赛项目：
                </span>
                <span class="value">
                    {{ info.category_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    项目范围：
                </span>
                <span class="value">
                    {{ info.resource_scope }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    学段年级：
                </span>
                <span class="value">
                    {{ info.education_level }}{{ info.grade_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    参赛者姓名：
                </span>
                <span class="value">
                    {{ info.create_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    成绩：
                </span>
                <span class="value">
                    {{ info.achievement }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    指导教师：
                </span>
                <span class="value">
                    {{ info.teacher }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    认证官：
                </span>
                <span class="value">
                    {{ info.attestation_name }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    封面图：
                </span>
                <img
                    :src="info.video_img_url"
                    alt=""
                >
            </div>
        </div>
    </Modal>
</template>

<script>
export default {
    name: 'Index',
    data() {
        return {
            show: false,
            info: {},
        };
    },
    methods: {
        handleShow(data) {
            this.info = data;
            this.show = true;
        },
    },
};
</script>

<style lang="less">
@import "../../../../../less/variables.less";
.score-detail {
    font-size: 14px;
    .item {
        width: 300px;
        margin-bottom: 8px;
        img {
            width: 160px;
            height: 90px;
            border-radius: 2px;
        }
    }
    .label {
        display: inline-block;
        width: 90px;
        text-align: right;
        margin-right: 6px;
        color: @black;
    }
    .value {
        color: @fontColor;
    }
    .flex-row {
        margin-bottom: 44px;
    }
    .content {
        padding-left: 72px;
    }
    .btn-prev {
        margin-bottom: 32px;
    }
}
</style>
