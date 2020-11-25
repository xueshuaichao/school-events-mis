<template>
    <page-edit>
        <Card dis-hover>
            <h3 :style="{ marginBottom: '25px' }">
                学校信息
            </h3>
            <div class="school-info">
                <img
                    class="school-info-avatar"
                    :src="data.logo"
                    alt
                >
                <div
                    v-if="data.system"
                    class="school-info-content"
                >
                    <div :style="{ width: '100%' }">
                        <div><span>学校名称：</span>{{ data.name }}</div>
                        <div><span>学段：</span>{{ stage(data.stage) }}</div>
                        <div><span>学制：</span>{{ system(data.system) }}</div>
                        <div><span>学校地址：</span>{{ data.area }}</div>
                    </div>
                    <div :style="{ width: '100%' }">
                        <div><span>联系人：</span>{{ data.contacts }}</div>
                        <div><span>联系电话：</span>{{ data.phone }}</div>
                    </div>
                    <div :style="{ width: '100%' }">
                        <div>
                            <span>学校简介：</span>{{ data.school_introduction }}
                        </div>
                    </div>
                </div>
            </div>
        </Card>

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
                        申请时间
                    </div>
                    <div class="time">
                        {{
                            item[0].created_at
                                ? item[0].created_at
                                : item[1].created_at
                        }}
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
                    <p class="checkName">
                        {{ item[1] ? `审核人:${item[1].name} ` : "" }}
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
        <div class="verify-step" />

        <i-form
            v-if="path === 'schoolVerify'"
            ref="verifyRemark"
            :label-width="100"
            :model="verifyRemark"
            :rules="ruleRemark"
            :style="{ marginTop: '30px' }"
        >
            <form-item
                label="审核备注"
                prop="remark"
            >
                <i-input
                    v-model="verifyRemark.remark"
                    type="textarea"
                    :maxlength="50"
                    :autosize="{ minRows: 4, maxRows: 5 }"
                    :style="{ maxWidth: '800px' }"
                    placeholder="请输入备注信息(50字以内)"
                />
            </form-item>
        </i-form>
        <div slot="footer">
            <div
                v-if="path === 'schoolVerify'"
                class="footer"
            >
                <i-button
                    type="primary"
                    class="mar-r-10"
                    @click="handleVerify('verifyRemark', '1')"
                >
                    审核通过
                </i-button>
                <i-button
                    type="info"
                    class="mar-r-10"
                    ghost
                    @click="handleVerify('verifyRemark', '2')"
                >
                    审核驳回
                </i-button>
            </div>
        </div>
    </page-edit>
</template>
<script>
import { mapMutations } from 'vuex';
import './school-detail.less';
import PageEdit from '../components/page/edit.vue';
import api from '../../api/organization';

export default {
    name: 'Index',
    components: {
        'page-edit': PageEdit,
    },
    data() {
        return {
            verifyRemark: {
                remark: '',
            },
            data: {},
            systems: [],
            stages: [],
            auditLog: [],
            path: '',
            ruleRemark: {
                remark: [
                    {
                        required: true,
                        message: '请输入备注信息',
                        trigger: 'blur',
                    },
                ],
            },
            arrangeLog: [], // 整理auditLog之后的数据
            checkPending: {}, // 最近一次待审核数据备份
            checkRecord: [], // 一条完整的审核记录
        };
    },
    created() {
        this.getSchoolDetail();
        this.getStageList();
        this.path = this.$route.name;
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
        getStageList() {
            this.openMainSpin(true);
            api.schoolEduschoolstage()
                .then(({ data: { stage, system } }) => {
                    this.stages = stage;
                    this.systems = system;
                    // 获取学校详情

                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        getSchoolDetail() {
            this.openMainSpin(true);

            api.schoolEduschooldetail({
                school_id: this.$route.params.id,
            })
                .then(({ data }) => {
                    this.data = data;
                    this.auditLog = data.auditLog;

                    // 分三种情况 1. 有多条状态是0 2. 连续多条非0， 3. 一条0一条非0

                    this.auditLog.forEach((item, index) => {
                        if (item.status === 0) {
                            // 如果又连续多条未审核
                            if (this.checkRecord.length > 0) {
                                this.arrangeLog.push(
                                    JSON.parse(JSON.stringify(this.checkRecord)),
                                );
                                this.checkRecord = [];
                            }
                            this.checkPending = item;
                            this.checkRecord.push(item);
                            if (index === this.auditLog.length - 1) {
                                this.arrangeLog.push([this.checkPending]);
                            }
                        } else {
                            this.arrangeLog.push([this.checkPending, item]);
                            this.checkRecord = [];
                        }
                    });
                    console.log(this.arrangeLog);
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
        handleVerify(name, status) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.openMainSpin(true);
                    api.schoolAuditschool({
                        school_id: this.$route.params.id,
                        status,
                        remark: this.verifyRemark.remark,
                    })
                        .then(() => {
                            this.$router.go(-1);
                            this.openMainSpin(false);
                        })
                        .catch(this.openMainSpin(false));
                }
            });
        },
    },
};
</script>

<style lang="less">
.oneline {
    width: "100%";
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
</style>
