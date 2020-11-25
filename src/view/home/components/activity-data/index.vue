<template>
    <div class="panel mar-r-24 activity">
        <h4 class="panel-header">
            活动数据
        </h4>
        <div class="panel-body statistics">
            <div class="item flex-row">
                <div class="left">
                    昨日新增
                </div>
                <div class="right flex-row">
                    <div class="column">
                        <p>个人项目</p>
                        <span class="green">
                            {{ info.yesterday_add_personal_count }}
                        </span>
                    </div>
                    <div class="column">
                        <p>团队项目</p>
                        <span class="green">
                            {{ info.yesterday_add_team_count }}
                        </span>
                    </div>
                    <div class="column">
                        <p>才艺类</p>
                        <span class="green">
                            {{ info.yesterday_add_skill_count }}
                        </span>
                    </div>
                </div>
            </div>
            <div
                v-if="info.user_type === 3"
                class="item flex-row"
            >
                <div class="left">
                    待审核
                </div>
                <div class="right flex-row">
                    <div class="column">
                        <p>个人项目</p>
                        <span>
                            {{ info.un_audit_personal_count || 0 }}
                        </span>
                    </div>
                    <div class="column">
                        <p>团队项目</p>
                        <span>
                            {{ info.un_audit_add_team_count || 0 }}
                        </span>
                    </div>
                    <div class="column">
                        <p>才艺类</p>
                        <span>
                            {{ info.un_audit_add_skill_count || 0 }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="item flex-row">
                <div class="left">
                    作品累计
                </div>
                <div class="right flex-row">
                    <div class="column">
                        <p>个人项目</p>
                        <span class="red">
                            {{ info.audit_personal_count }}
                        </span>
                    </div>
                    <div class="column">
                        <p>团队项目</p>
                        <span class="red">
                            {{ info.audit_add_team_count }}
                        </span>
                    </div>
                    <div class="column">
                        <p>才艺类</p>
                        <span class="red">
                            {{ info.audit_add_skill_count }}
                        </span>
                    </div>
                </div>
            </div>
            <div
                v-if="info.user_type === 2"
                class="item flex-row"
            >
                <div class="left">
                    记录
                </div>
                <div class="right flex-row">
                    <div class="column">
                        <p>省级记录</p>
                        <span class="red">
                            {{ info.province_count }}
                        </span>
                    </div>
                    <div class="column">
                        <p>市/区级记录</p>
                        <span class="red">
                            {{ info.city_count }}
                        </span>
                    </div>
                    <div class="column">
                        <p>校级记录</p>
                        <span class="red">
                            {{ info.school_count }}
                        </span>
                    </div>
                </div>
            </div>
            <div
                v-if="info.user_type !== 3"
                class="item flex-row"
            >
                <div class="left">
                    浏览量
                </div>
                <div class="right flex-row">
                    <div class="column">
                        <p>昨日</p>
                        <span class="blue">
                            {{ info.yesterday_pv }}
                        </span>
                    </div>
                    <div class="column">
                        <p>今日</p>
                        <span class="blue">
                            {{ info.today_pv }}
                        </span>
                    </div>
                    <div class="column">
                        <p>平均值</p>
                        <span class="blue">
                            {{ info.avg_pv }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Index',
    props: {
        info: {
            type: Object,
            default() {
                return {};
            },
        },
    },
};
</script>

<style scoped></style>
