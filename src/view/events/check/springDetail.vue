<!--suppress ALL -->
<template>
    <page-edit :footer="false">
        <Card dis-hover>
            <div class="school-info">
                <div class="school-info-image">
                    <template v-if="[1, 3].includes(data.resource_type)">
                        <w-video :options="options" />
                    </template>
                    <gallery
                        v-else
                        :gallery-slides="data.img_url"
                    />
                    <h2 class="categpry-name">
                        {{ data.category_name }}
                    </h2>
                    <div class="school-info-rules">
                        {{ data.category_rules }}
                    </div>
                </div>
                <div class="school-info-content examine-info mar-l-24">
                    <p>
                        <span>参赛者：</span><span>{{ data.create_name }}</span>
                    </p>
                    <p v-if="isProvinceEdu">
                        <span>绑定手机号：</span><span>{{ data.mobile || "暂无" }}</span>
                    </p>
                    <p>
                        <span>学校：</span><span>{{ data.school_name || "暂无" }}</span>
                    </p>
                    <p>
                        <span>年级：</span><span>{{ data.grade_name || "暂无" }}</span>
                    </p>
                    <p>
                        <span>班级：</span><span>{{ data.class_name || "暂无" }}</span>
                    </p>
                    <p>
                        <span>作品名称：</span><span>{{ data.name }}</span>
                    </p>
                    <p>
                        <span>上报时间：</span><span>{{ data.created_at }}</span>
                    </p>
                    <p>
                        <span>作品简介：</span><span>{{ data.introduce || "暂无" }}</span>
                    </p>
                    <template v-if="resource_name === 'spring'">
                        <p>
                            <span>推荐机构名称：</span><span>{{ data.recommend || "暂无" }}</span>
                        </p>
                        <p>
                            <span>指导老师姓名：</span><span>{{ data.teacher || "暂无" }}</span>
                        </p>
                    </template>
                    <p>
                        <span>封面图：</span>
                        <img
                            :src="data.video_img_url"
                            alt=""
                            width="160"
                            height="90"
                            :style="{ 'vertical-align': 'top' }"
                        >
                    </p>
                    <p v-if="data.user_status === 2">
                        <span>作品等级：</span>
                        <RadioGroup
                            v-model="data.grade"
                            class="flex-row"
                            type="button"
                            @on-change="handleChangeGrade"
                        >
                            <Radio :label="1">
                                优秀
                            </Radio>
                            <Radio :label="0">
                                其他
                            </Radio>
                        </RadioGroup>
                    </p>
                    <div
                        v-if="data.user_status === 1"
                        class="footer"
                    >
                        <i-button
                            type="primary"
                            class="mar-r-10"
                            @click="
                                $refs.examine.handleResolve($route.params.id)
                            "
                        >
                            审核通过
                        </i-button>
                        <i-button
                            class="mar-r-10"
                            @click="
                                $refs.examine.handleReject($route.params.id)
                            "
                        >
                            审核驳回
                        </i-button>
                        <i-button
                            type="error"
                            class="mar-r-10"
                            @click="handleAccount"
                        >
                            封禁用户
                        </i-button>
                    </div>
                </div>
            </div>
        </Card>
        <h3 class="examine-title">
            审核记录
        </h3>
        <div class="school-info-content examine-info">
            <p>
                <span>上报时间：</span><span>{{ data.created_at }}</span>
            </p>
            <p>
                <span>初审时间：</span><span>{{ data.machine_time }}</span>
            </p>
            <p>
                <span>复审意见：</span><span>{{ data.user_reason || "暂无" }}</span>
            </p>
            <p>
                <span>复审时间：</span><span>{{ data.audit_time || "暂无" }}</span>
            </p>
            <p>
                <span>审核人：</span><span>{{ data.audit_user || "暂无" }}</span>
            </p>
            <p>
                <span>审核结果：</span><span>{{ data.user_status_name }}</span>
            </p>
        </div>
        <examine
            ref="examine"
            @on-end="handleActivityStatus"
        />
    </page-edit>
</template>
<script>
import { mapMutations } from 'vuex';
import mixin from '@/mixins/index';
import Examine from './components/examine/index.vue';
import '../components/school-detail.less';
import PageEdit from '../../components/page/edit.vue';
import { activityStatus } from '@/libs/enum';
import api from '@/api/activity';
import Video from '@/view/components/video/index.vue';
import Gallery from '@/view/components/gallery/index.vue';

const GRADE_MAP = ['其他', '优秀'];
export default {
    name: 'Index',
    components: {
        'page-edit': PageEdit,
        'w-video': Video,
        Gallery,
        Examine,
    },
    mixins: [mixin],
    data() {
        return {
            data: {},
            resource_name: 'spring',
            options: null,
        };
    },
    created() {
        const { name } = this.$route.query;

        this.resource_name = name || 'spring';
        this.getDetail();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getDetail() {
            this.openMainSpin(true);

            api.getActivityDetail({ id: this.$route.params.id })
                .then(({ data }) => {
                    const info = data;
                    const { img_url: img, user_status: status } = info;
                    let source;
                    if (data.resource_type === 3) {
                        source = info.play_url;
                    } else {
                        source = JSON.stringify({
                            LD: info.cloud_path_ld,
                            SD: info.cloud_path_sd,
                            HD: info.cloud_path_hd,
                        });
                    }

                    this.options = {
                        source,
                        cover: info.video_img_url,
                    };
                    if (img) {
                        info.img_url = JSON.parse(img);
                    }

                    info.user_status_name = activityStatus[status - 1];
                    this.data = { grade: 0, ...info };
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        updateAccountStatus() {
            this.openMainSpin(true);
            api.closeAccount({ user_id: this.data.create_user_id })
                .then(() => {
                    this.$Message.success('封禁成功');
                    this.openMainSpin(false);
                    this.handleClickCancel();
                })
                .catch(this.openMainSpin(false));
        },
        updateResourceInfo(data) {
            api.updateActivityStatus({
                activity_id: this.$route.params.id,
                ...data,
            }).then(() => {
                this.$Message.success('操作成功');
            });
        },
        handleAccount() {
            this.$Modal.confirm({
                title: '封禁用户',
                content: '是否确认封禁该用户?',
                onOk: () => {
                    this.updateAccountStatus();
                },
            });
        },
        handleClickCancel() {
            this.$router.go(-1);
        },
        handleActivityStatus() {
            this.getDetail();
        },
        handleChangeGrade(val) {
            this.$Modal.confirm({
                title: '作品等级',
                content: `<p>确认将该作品设置为${GRADE_MAP[val]}</p>`,
                onOk: () => {
                    this.updateResourceInfo({ type: 2, grade: val });
                },
                onCancel: () => {
                    this.$nextTick(() => {
                        this.data.grade = val ? 0 : 1;
                    });
                },
            });
        },
    },
};
</script>

<style lang="less">
.examine-title {
    margin-top: 16px;
    margin-bottom: 24px;
}
.examine-info {
    margin-left: 0;
    .footer {
        margin-bottom: 24px;
    }
}
.school-info-image {
    .categpry-name {
        font-size: 20px;
        margin-top: 16px;
    }
}
.examine-info p > span:first-child {
    width: 110px;
    font-weight: normal;
    flex-shrink: 0;
}
</style>
