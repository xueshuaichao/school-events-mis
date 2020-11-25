<template>
    <page-edit>
        <div slot="backBtn">
            <i-button
                class="btn-prev"
                @click="handleClickCancel"
            >
                返回
            </i-button>
        </div>
        <Card dis-hover>
            <div class="school-info">
                <div class="school-info-image">
                    <template v-if="data.resource_type === 1">
                        <w-video :options="options" />
                    </template>
                    <gallery
                        v-else
                        :gallery-slides="data.img_url"
                    />
                    <h2 :style="{ fontSize: '20px' }">
                        {{ data.category_name }}
                    </h2>
                    <div class="school-info-rules">
                        {{ data.category_rules }}
                    </div>
                </div>
                <div class="school-info-content">
                    <template>
                        <p>
                            <span>参赛者：</span><span>{{ data.create_name }}</span>
                        </p>
                        <p v-if="currentIndex === 3 && isProvinceEdu">
                            <span>绑定手机号：</span><span>{{ data.mobile || "暂无" }}</span>
                        </p>
                        <p>
                            <span>学校：</span><span>{{ data.school_name }}</span>
                        </p>
                        <p>
                            <span>年级：</span><span>{{ data.grade_name }}</span>
                        </p>
                        <p>
                            <span>班级：</span><span>{{ data.class_name }}</span>
                        </p>
                        <p>
                            <span>作品名称：</span><span>{{ data.name }}</span>
                        </p>
                        <p>
                            <span>上报时间：</span><span>{{ data.created_at }}</span>
                        </p>
                        <p>
                            <span>成绩：</span><span>{{ formateAchievement(data) }}</span>
                        </p>
                        <p>
                            <span>认证官：</span><span>{{ data.attestation_name }}</span>
                        </p>
                        <template
                            v-if="
                                $route.name === 'checkDetail' &&
                                    data.status === 1 &&
                                    !isSchool
                            "
                        >
                            <p>
                                <span>作品等级：</span>
                                <RadioGroup
                                    v-model="data.grade"
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
                            <p>
                                <span>添加首页：</span>
                                <RadioGroup
                                    v-model="data.is_home"
                                    type="button"
                                    @on-change="handleChangeSort"
                                >
                                    <Radio :label="1">
                                        是
                                    </Radio>
                                    <Radio :label="0">
                                        否
                                    </Radio>
                                </RadioGroup>
                            </p>
                        </template>
                    </template>
                    <!-- <template v-else>
                        <p>
                            <span>视频名称：</span><span>{{ data.name }}</span>
                        </p>
                        <p>
                            <span>视频分类：</span><span>{{ data.category_name }}</span>
                        </p>
                        <p v-if="data.object_type && data.describe_object">
                            <span>
                                {{ data.object_type === 1 ? "学校" : "教师" }}：
                            </span>
                            <span>{{ data.describe_object }}</span>
                        </p>
                        <p>
                            <span>视频介绍：</span><span>{{ data.introduce }}</span>
                        </p>
                    </template> -->
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

                    <div
                        v-if="this.$route.name === 'checkEvent'"
                        class="footer"
                    >
                        <i-button
                            type="primary"
                            class="mar-r-10"
                            @click="handleVerify('确认通过', '1')"
                        >
                            审核通过
                        </i-button>
                        <i-button
                            type="info"
                            class="mar-r-10"
                            ghost
                            @click="handleVerify('确认不通过', '2')"
                        >
                            审核驳回
                        </i-button>
                        <i-button
                            type="error"
                            ghost
                            @click="handleAccount"
                        >
                            封禁用户
                        </i-button>
                    </div>
                </div>
            </div>
        </Card>
        <!-- <h3 :style="{ marginTop: '20px' }">
            审核记录
        </h3>
        <div v-if="arrangeLog.length > 0">
            <template v-for="(item, index) in arrangeLog">
                <div
                    :key="index"
                    class="oneline"
                >
                    <div class="first-point">
                        <Icon
                            class="icon"
                            type="ios-radio-button-off"
                        />
                        <div class="title">
                            上报时间
                        </div>
                        <div class="time">
                            {{ item[0].created_at }}
                        </div>
                    </div>
                    <div class="first-point">
                        <Icon
                            class="icon"
                            type="ios-radio-button-off"
                        />
                        <div class="title">
                            审核时间
                        </div>
                        <div class="time">
                            {{ item[1] ? `${item[1].created_at}` : "未审核" }}
                        </div>
                    </div>
                    <div class="first-point">
                        <Icon
                            class="icon"
                            type="ios-radio-button-off"
                        />
                        <div class="title">
                            审核人
                        </div>

                        <p class="checkName">
                            {{ item[1] ? `审核人:${item[1].name} ` : "未审核" }}
                        </p>
                    </div>
                    <div class="first-point">
                        <Icon
                            class="icon"
                            type="ios-radio-button-off"
                        />
                        <div class="title">
                            审核结果
                        </div>
                        <div
                            class="time"
                            v-html="auditResult(item[1])"
                        />
                        <p class="checkName">
                            {{ item[1] ? `备注:${item[1].memo} ` : "" }}
                        </p>
                    </div>
                </div>
            </template>
        </div>
        <div v-else>
            <p>暂无数据</p>
        </div> -->
        <!-- <div class="verify-step" /> -->
        <h3 class="examine-title">
            审核记录
        </h3>
        <div class="school-info-content examine-info">
            <p>
                <span>上报时间：</span><span>{{ data.created_at }}</span>
            </p>
            <p>
                <span>初审时间：</span><span>{{ data.machine_time || "暂无" }}</span>
            </p>
            <p>
                <span>复审意见：</span><span>{{ auditLog.memo || "暂无" }}</span>
            </p>
            <p>
                <span>复审时间：</span><span>{{ auditLog.created_at || "暂无" }}</span>
            </p>
            <p>
                <span>审核人：</span><span>{{ auditLog.name || "暂无" }}</span>
            </p>
            <p>
                <span>审核结果：</span><span>{{ activityStatus[data.status] }}</span>
            </p>
        </div>
        <Modal
            v-model="modal1"
            title="提示"
            width="490"
            :ok-text="okText"
            @on-ok="ok"
            @on-cancel="cancel"
        >
            <i-form
                ref="verifyRemark"
                :model="verifyRemark"
                :rules="ruleRemark"
                label-position="top"
            >
                <template v-if="currentIndex !== 4 && !isSchool">
                    <form-item
                        v-if="status === '1'"
                        label="添加首页"
                    >
                        <RadioGroup v-model="verifyRemark.is_home">
                            <Radio :label="1">
                                是
                            </Radio>
                            <Radio :label="0">
                                否
                            </Radio>
                        </RadioGroup>
                    </form-item>
                    <form-item
                        v-if="status === '1'"
                        label="作品等级"
                    >
                        <RadioGroup v-model="verifyRemark.grade">
                            <Radio :label="1">
                                优秀
                            </Radio>
                            <Radio :label="0">
                                其他
                            </Radio>
                        </RadioGroup>
                    </form-item>
                </template>
                <form-item
                    label="审核备注 （选填，30字以内）"
                    prop="remark"
                >
                    <i-input
                        v-model="verifyRemark.remark"
                        type="textarea"
                        :maxlength="30"
                        :autosize="{ minRows: 4, maxRows: 5 }"
                        :style="{ maxWidth: '442px' }"
                        placeholder="请输入备注信息(30字以内)"
                    />
                </form-item>
            </i-form>
        </Modal>

        <div slot="footer" />
    </page-edit>
</template>
<script>
import { mapMutations } from 'vuex';
import mixin from '@/mixins/index';
import './school-detail.less';
import { formateSeconds } from '@/libs/utils';
import { activityStatus } from '@/libs/enum';
import Video from '@/view/components/video/index.vue';
import Gallery from '@/view/components/gallery/index.vue';
import api from '../../../api/events';
import PageEdit from '../../components/page/edit.vue';

const GRADE_MAP = ['其他', '优秀'];
export default {
    name: 'Index',
    components: {
        'page-edit': PageEdit,
        'w-video': Video,
        Gallery,
    },
    mixins: [mixin],
    data() {
        return {
            activityStatus,
            verifyRemark: {
                remark: '',
                is_home: 0,
                grade: 0,
            },
            defaultTab: this.$route.params.defaultTab,
            currentIndex: this.$route.params.index,
            okText: '',
            modal1: false,
            data: {},
            systems: [],
            stages: [],
            auditLog: [],
            path: '',
            ruleRemark: {
                remark: [
                    {
                        required: false,
                        message: '请输入备注信息',
                        trigger: 'blur',
                    },
                ],
            },
            arrangeLog: [], // 整理auditLog之后的数据
            checkPending: {}, // 最近一次待审核数据备份
            checkRecord: [], // 一条完整的审核记录
            status: '',
            options: null,
        };
    },
    created() {
        this.getDetail();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        auditResult(data) {
            if (data) {
                if (data.status === 1) {
                    return "<p class='checkPass'>审核通过</p>";
                }
                return "<p class='checkunPass'>审核未通过</p>";
            }
            return '未审核';
        },
        formateAchievement({ achievement, achievement_unit: unit }) {
            if (unit === '秒' || !unit) {
                return formateSeconds(achievement, true);
            }
            return achievement + unit;
        },
        getDetail() {
            this.openMainSpin(true);
            let url = 'educationResourcedetail';
            if (this.isSchool && !this.currentIndex) {
                url = 'getResourceDetail';
            }
            api[url]({
                resource_id: this.$route.params.id,
            })
                .then(({ data }) => {
                    const { img_url: img } = data;
                    this.data = { grade: 0, is_home: 0, ...data };
                    this.auditLog = data.audit_log.pop();
                    // 分三种情况 1. 有多条状态是0 2. 连续多条非0， 3. 一条0一条非0

                    // this.auditLog.forEach((item, index) => {
                    //     if (item.status === 0) {
                    //         // 如果又连续多条未审核
                    //         if (this.checkRecord.length > 0) {
                    //             this.arrangeLog.push(
                    //                 JSON.parse(JSON.stringify(this.checkRecord)),
                    //             );
                    //             this.checkRecord = [];
                    //         }
                    //         this.checkPending = item;
                    //         this.checkRecord.push(item);
                    //         if (index === this.auditLog.length - 1) {
                    //             this.arrangeLog.push([this.checkPending]);
                    //         }
                    //     } else {
                    //         this.arrangeLog.push([this.checkPending, item]);
                    //         this.checkRecord = [];
                    //     }
                    // });
                    const source = JSON.stringify({
                        LD: data.cloud_path_ld,
                        SD: data.cloud_path_sd,
                        HD: data.cloud_path_hd,
                    });
                    this.options = {
                        source,
                        cover: data.video_img_url,
                    };
                    if (img) {
                        this.data.img_url = JSON.parse(img);
                    }
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        system(system) {
            let systemname;
            this.systems.forEach((item) => {
                if (item.id === system.toString()) {
                    systemname = item.name;
                }
            });
            return systemname;
        },
        stage(stage) {
            let stagename;
            this.stages.forEach((item) => {
                if (item.id === stage.toString()) {
                    stagename = item.name;
                }
            });
            return stagename;
        },
        handleVerify(okText, status) {
            this.okText = okText;
            this.modal1 = true;
            this.status = status;
        },
        handleClickCancel() {
            this.$router.go(-1);
        },
        handleChangeGrade(val) {
            this.$Modal.confirm({
                title: '作品等级',
                content: `<p>确认将该作品设置为${GRADE_MAP[val]}</p>`,
                onOk: () => {
                    this.updateResourceInfo({ type: 3, grade: val });
                },
                onCancel: () => {
                    this.$nextTick(() => {
                        this.data.grade = val ? 0 : 1;
                    });
                },
            });
        },
        handleChangeSort(val) {
            this.$Modal.confirm({
                title: '添加首页',
                content: `<p>确认将该作品${
                    val ? '添加' : '取消'
                }首页展示！</p>`,
                onOk: () => {
                    this.updateResourceInfo({ type: 2, is_home: val });
                },
                onCancel: () => {
                    this.$nextTick(() => {
                        this.data.is_home = val ? 0 : 1;
                    });
                },
            });
        },
        updateAccountStatus() {
            this.openMainSpin(true);
            api.closeAccount({ user_id: this.data.create_by })
                .then(() => {
                    this.$Message.success('封禁成功');
                    this.openMainSpin(false);
                    this.handleClickCancel();
                })
                .catch(this.openMainSpin(false));
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
        updateResourceInfo(data) {
            api.educationResourceaudit({
                resource_id: this.$route.params.id,
                ...data,
            }).then(() => {
                this.$Message.success('操作成功');
            });
        },
        ok() {
            this.openMainSpin(true);
            const params = {
                resource_id: this.$route.params.id,
                status: this.status,
            };
            if ([1, 4].includes(this.data.parent_scope)) {
                if (this.$store.state.user.userRole === 'school_admin') {
                    if (this.status === '1') {
                        params.status = '2';
                    }
                    if (this.status === '2') {
                        params.status = '3';
                    }
                }
                if (this.$store.state.user.userRole === 'edu_pro_admin') {
                    params.is_province = 1;
                }
            }
            api.educationResourceaudit({
                ...params,
                memo: this.verifyRemark.remark,
                type: 1,
                is_home: this.verifyRemark.is_home,
                grade: this.verifyRemark.grade,
            })
                .then(() => {
                    this.verifyRemark.remark = '';
                    this.$router.go(-1);
                    this.openMainSpin(false);
                })
                .catch(() => {
                    this.verifyRemark.remark = '';
                    this.openMainSpin(false);
                });
        },
        cancel() {
            this.verifyRemark.remark = '';
        },
    },
};
</script>

<style lang="less">
.oneline {
    width: 100%;
    border-top: 1px solid #ccc;
    margin-top: 50px;
    display: flex;
    justify-content: space-around;

    .first-point {
        width: 200px;
        text-align: center;
        .icon {
            transform: translate(0, -10px);
            background: #fff;
        }
        .title {
            font-weight: bold;
            transform: translate(0, -40px);
        }
        .time {
            transform: translate(0px, -25px);
        }
        .checkName {
            transform: translate(0px, -21px);
        }
    }
}
.verify-step {
    margin-bottom: 100px;
}
.checkPass {
    color: #19ca6c;
}
.checkunPass {
    color: #ff6849;
}
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
