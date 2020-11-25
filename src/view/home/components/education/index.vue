<template>
    <div class="home">
        <div class="flex-row">
            <div
                v-if="info.edu_level === 1"
                class="panel-wrapper complete"
            >
                <!--v-if="info.is_province_edu === 1"-->
                <div
                    style="height: 56px;background-color: white;
                border-bottom: 1px solid #F5F6F7;font-size: 16px;padding: 16px"
                >
                    数据概览
                </div>
                <div class="flex-row mar-b-24 xin">
                    <div class="item flex-row mar-r-24 ">
                        <img
                            src="../../../../assets/images/home/xuex.png"
                            alt=""
                        >
                        <div class="info">
                            <p>学校总数</p>
                            <p>{{ info.all_school_count }}</p>
                        </div>
                    </div>
                    <div class="item flex-row mar-r-24">
                        <img
                            src="../../../../assets/images/home/xueSchool.png"
                            alt=""
                        >
                        <div class="info">
                            <p>用户总数</p>
                            <p>{{ info.all_user_count }}</p>
                        </div>
                    </div>
                    <div class="item flex-row mar-r-24">
                        <img
                            src="../../../../assets/images/home/Dstudent.png"
                            alt=""
                        >
                        <div class="info">
                            <p>学生总数</p>
                            <p>{{ info.all_student_count }}</p>
                        </div>
                    </div>
                    <div class="item flex-row">
                        <img
                            src="../../../../assets/images/home/Dworks.png"
                            alt=""
                        >
                        <div class="info">
                            <p>作品总数</p>
                            <p>{{ info.all_work_count }}</p>
                        </div>
                    </div>
                </div>
                <!--<i-menu :info="info" />-->
            </div>
            <!--系统公告注释，这版本不用-->
            <!--  <div class="panel system">
                <h4 class="panel-header">
                    系统公告
                </h4>
                <div class="panel-body">
                    <div class="system-mes">
                        <img
                            src="../../../../assets/images/home/system.png"
                            alt=""
                        >
                        <p>暂无公告</p>
                    </div>
                    <Divider dashed />
                    <div class="login-info">
                        <p>上次登录时间: {{ info.last_login_time || "&#45;&#45;" }}</p>
                    </div>
                </div>
            </div>-->
        </div>
        <!--市级和区县数据和公告-->
        <div v-if="info.edu_level !== 1">
            <Row :gutter="16">
                <i-col span="18">
                    <div class="panel-wrapper complete">
                        <div
                            style="height: 56px;background-color: white;
                border-bottom: 1px solid #F5F6F7;font-size: 16px;padding: 16px"
                        >
                            数据概览
                        </div>
                        <div class="flex-row mar-b-24 xin">
                            <div class="item flex-row mar-r-24 ">
                                <img
                                    src="../../../../assets/images/home/xuex.png"
                                    alt=""
                                >
                                <div class="info">
                                    <p>学校总数</p>
                                    <p>{{ info.all_school_count }}</p>
                                </div>
                            </div>
                            <div class="item flex-row mar-r-24">
                                <img
                                    src="../../../../assets/images/home/Dstudent.png"
                                    alt=""
                                >
                                <div class="info">
                                    <p>学生总数</p>
                                    <p>{{ info.all_student_count }}</p>
                                </div>
                            </div>
                            <div class="item flex-row">
                                <img
                                    src="../../../../assets/images/home/Dworks.png"
                                    alt=""
                                >
                                <div class="info">
                                    <p>作品总数</p>
                                    <p>{{ info.all_work_count }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </i-col>
                <i-col span="6">
                    <div class="panel-wrapper complete">
                        <div
                            style="height: 56px;background-color: white;
                border-bottom: 1px solid #F5F6F7;font-size: 16px;padding: 16px"
                        >
                            通知公告
                        </div>
                        <div class="flex-row mar-b-24 xin">
                            <div
                                class="itemCity mar-r-24 "
                                style="overflow-y: auto;margin-right: 4px"
                            >
                                <div class="panel-body">
                                    <ul class="student-tips news-list">
                                        <li
                                            v-for="(item, index) in newsList"
                                            :key="index"
                                            class="flex-row"
                                        >
                                            <p
                                                class="title"
                                                @click="
                                                    handleClickArticlesItem(
                                                        item.id
                                                    )
                                                "
                                            >
                                                {{ item.title }}
                                            </p>
                                            <p class="rate">
                                                {{ item.created_at }}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
        <!--市级排行-->
        <div
            v-if="info.edu_level === 2"
            style="margin: 0 0 20px;"
        >
            <Row :gutter="16">
                <i-col span="8">
                    <div class="panel-body shicity">
                        <div class="panell">
                            <div class="headText">
                                各区开通学校排行top5
                            </div>
                            <div class="panel-body school-home-list">
                                <i-table
                                    :columns="areaNumberqu"
                                    :data="info.county_open_rank"
                                />
                            </div>
                        </div>
                    </div>
                </i-col>
                <i-col span="8">
                    <div class="panel-body shicity">
                        <div class="panell">
                            <div class="headText">
                                各区参与学生排行top5
                            </div>
                            <div class="panel-body school-home-list">
                                <i-table
                                    :columns="areaNumber"
                                    :data="info.county_join_rank"
                                />
                            </div>
                        </div>
                    </div>
                </i-col>
                <i-col span="8">
                    <div class="panel-body shicity">
                        <div class="panell">
                            <div class="headText">
                                各市开通学校数量排行top5
                            </div>
                            <div class="panel-body school-home-list ranking">
                                <i-table
                                    :row-class-name="rowClassName"
                                    :columns="schoolNumber"
                                    :data="info.city_open_rank"
                                />
                            </div>
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
        <!--区县级排行-->
        <div
            v-if="info.edu_level === 3"
            style="margin: 0 0 20px;"
        >
            <Row :gutter="16">
                <i-col span="7">
                    <div class="panel-body shicity">
                        <div class="panell">
                            <div class="headText">
                                各学校作品数量排行top5
                            </div>
                            <div class="panel-body school-home-list">
                                <i-table
                                    :columns="schoolWorkNumber"
                                    :data="info.school_work_count"
                                />
                            </div>
                        </div>
                    </div>
                </i-col>
                <i-col span="7">
                    <div class="panel-body shicity">
                        <div class="panell">
                            <div class="headText">
                                其他区县作品数量排行top5
                            </div>
                            <div class="panel-body school-home-list ranking">
                                <i-table
                                    :row-class-name="rowClassName"
                                    :columns="areaWorkNumber"
                                    :data="info.other_county_work_count"
                                />
                            </div>
                        </div>
                    </div>
                </i-col>
                <i-col span="10">
                    <div class="panel-body shicity">
                        <div class="panell">
                            <div class="headText">
                                项目纪录
                                <a
                                    style="float: right;font-size: 14px;"
                                    @click="handleShow('resource')"
                                >
                                    更多<Icon
                                        type="ios-arrow-forward"
                                        size="16"
                                    />
                                </a>
                            </div>
                            <div class="panel-body school-home-list">
                                <Tabs
                                    style="margin-bottom: 4px;"
                                    value="province"
                                    @on-click="handleClickTabs"
                                >
                                    <TabPane
                                        label="省纪录"
                                        name="province"
                                    />
                                    <TabPane
                                        label="市纪录"
                                        name="city"
                                    />
                                    <TabPane
                                        label="校纪录"
                                        name="school"
                                    />
                                </Tabs>
                                <i-table
                                    height="280"
                                    :columns="resourceColumns"
                                    :data="resourceList"
                                />
                            </div>
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
        <!--教育局首页-->
        <div
            v-if="info.edu_level === 1"
            class="flex-row"
        >
            <div
                class="panel mar-r-24 activity"
                style="width: 50%"
            >
                <h4 class="panel-header">
                    数据统计
                </h4>
                <div class="panel-body statistics">
                    <div
                        v-show="isShow"
                        class="item flex-row"
                    >
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
                        v-show="isShow"
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
                        <div
                            style="font-size: 16px"
                            class="left"
                        >
                            作品分布
                        </div>
                        <div class="right flex-row">
                            <div class="column">
                                <p>挑战类项目</p>
                                <span class="green">
                                    {{ info.tiaozhan_count }}
                                </span>
                            </div>
                            <div class="column">
                                <p>吉尼斯项目</p>
                                <span class="green">
                                    {{ info.gennis_count }}
                                </span>
                            </div>
                            <div class="column">
                                <p>才艺秀项目</p>
                                <span class="green">
                                    {{ info.skill_count }}
                                </span>
                            </div>
                            <div class="column">
                                <p>教育短视频</p>
                                <span class="green">
                                    {{ info.edu_video_count }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- v-if="info.user_type === 2"-->
                    <div class="item flex-row">
                        <div
                            class="left"
                            style="font-size: 16px"
                        >
                            挑战纪录
                        </div>
                        <div class="right flex-row">
                            <div class="column">
                                <p>省级纪录</p>
                                <span class="red">
                                    {{ info.province_count }}
                                </span>
                            </div>
                            <div class="column">
                                <p>市/区级纪录</p>
                                <span class="red">
                                    {{ info.city_count }}
                                </span>
                            </div>
                            <div class="column">
                                <p>校级纪录</p>
                                <span class="red">
                                    {{ info.school_count }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- v-if="info.user_type !== 3"-->
                    <div
                        v-show="isShow"
                        class="items flex-row"
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
                    <div class="flex-row">
                        <div
                            class="panel-wrapper complete"
                            style="padding-bottom: 10px"
                        >
                            <div class="flex-row">
                                <div
                                    class="itemX flex-row mar-r-24 "
                                    @click="handleClick(0)"
                                >
                                    <div class="info">
                                        <p>待审核学校</p>
                                        <p>{{ info.school_un_audit_count }}</p>
                                    </div>
                                    <img
                                        src="../../../../assets/images/home/Dschool.png"
                                        alt=""
                                    >
                                </div>
                                <div
                                    class="itemX flex-row mar-r-24"
                                    @click="handleClick(1)"
                                >
                                    <div class="info">
                                        <p>待审核视频</p>
                                        <p>{{ info.video_un_audit_count }}</p>
                                    </div>
                                    <img
                                        src="../../../../assets/images/home/video.png"
                                        alt=""
                                    >
                                </div>
                                <div
                                    class="itemX flex-row"
                                    @click="handleClick(2)"
                                >
                                    <div class="info">
                                        <p>待审核留言</p>
                                        <p>
                                            {{ info.leave_msg_un_audit_count }}
                                        </p>
                                    </div>
                                    <img
                                        src="../../../../assets/images/home/message.png"
                                        alt=""
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="activity"
                style="width: 50%;padding: 0"
            >
                <div class="panel-body rankingList">
                    <Row>
                        <i-col span="12">
                            <div class="panell">
                                <div class="headText">
                                    各市开通学校排行top5
                                    <!--<a @click="handleShow('works')">
                                        更多<Icon
                                            type="ios-arrow-forward"
                                            size="16"
                                        />
                                    </a>-->
                                </div>
                                <div class="panel-body school-home-list">
                                    <i-table
                                        :columns="worksColumns"
                                        :data="info.city_open_rank"
                                    />
                                </div>
                            </div>
                        </i-col>
                        <i-col span="12">
                            <div class="panell">
                                <div class="headText">
                                    各市参与学生排行top5
                                    <!--<a @click="handleShow('works')">
                                        更多<Icon
                                            type="ios-arrow-forward"
                                            size="16"
                                        />
                                    </a>-->
                                </div>
                                <div class="panel-body school-home-list">
                                    <i-table
                                        :columns="worksStudents"
                                        :data="info.city_join_rank"
                                    />
                                </div>
                            </div>
                        </i-col>
                    </Row>
                </div>
            </div>
        </div>
        <Row
            v-if="info.edu_level !== 3"
            class="school-works xin_zx"
        >
            <i-col span="12">
                <div class="panel mar-r-8">
                    <div class="panel-title">
                        新增用户统计
                    </div>
                    <div class="panel-body works-info">
                        <div class="works-info-header flex-row">
                            <div>
                                <span style="font-size: 15px;color: #969799">
                                    新增用户
                                </span>
                                <span
                                    style="font-size: 16px;
                                           padding-left: 10px;
                                           font-weight: 600"
                                >
                                    {{ worksInfo.total }}
                                </span>
                            </div>
                            <div
                                v-if="worksInfo.total === 0"
                                class=" lineChart"
                            >
                                暂无数据
                            </div>
                            <div class="flex-row">
                                <a
                                    :class="1 === currentIndex ? 'active' : ''"
                                    @click="handleSearch(1)"
                                >
                                    最近7天
                                </a>
                                <a
                                    :class="2 === currentIndex ? 'active' : ''"
                                    @click="handleSearch(2)"
                                >
                                    最近30天
                                </a>
                                <DatePicker
                                    type="daterange"
                                    split-panels
                                    placeholder="请选择时间"
                                    placement="bottom-end"
                                    :value="userValue"
                                    @on-change="handleSearch"
                                />
                            </div>
                        </div>
                        <chart
                            :options="worksInfoOption"
                            style="width: 100%; height: 240px"
                        />
                    </div>
                </div>
            </i-col>
            <i-col span="12">
                <div class="panel mar-r-8">
                    <div class="panel-title">
                        新增作品统计
                    </div>
                    <div class="panel-body works-info">
                        <div class="works-info-header flex-row">
                            <div>
                                <span style="font-size: 15px;color: #969799">
                                    新增作品
                                </span>
                                <span
                                    style="font-size: 16px;
                                           padding-left: 10px;
                                           font-weight: 600"
                                >
                                    {{ worksInfoXin.total }}
                                </span>
                            </div>
                            <div
                                v-if="worksInfoXin.total === 0"
                                class="lineChart"
                            >
                                暂无数据
                            </div>
                            <div class="flex-row">
                                <a
                                    :class="
                                        1 === currentIndexXin ? 'active' : ''
                                    "
                                    @click="handleSearchXin(1)"
                                >
                                    最近7天
                                </a>
                                <a
                                    :class="
                                        2 === currentIndexXin ? 'active' : ''
                                    "
                                    @click="handleSearchXin(2)"
                                >
                                    最近30天
                                </a>
                                <DatePicker
                                    type="daterange"
                                    split-panels
                                    placement="bottom-end"
                                    :value="worksValue"
                                    placeholder="请选择时间"
                                    @on-change="handleSearchXin"
                                />
                            </div>
                        </div>
                        <chart
                            :options="worksInfoOptiongreen"
                            style="width: 100%; height: 240px"
                        />
                    </div>
                </div>
            </i-col>
        </Row>
        <!--区县新增作品统计-->
        <Row
            v-if="info.edu_level === 3"
            class="school-works xin_zx"
        >
            <i-col span="24">
                <div class="panel mar-r-1">
                    <div class="panel-title">
                        新增作品统计
                    </div>
                    <div class="panel-body works-info">
                        <div class="works-info-header flex-row">
                            <div>
                                <span style="font-size: 15px;color: #969799">
                                    新增作品
                                </span>
                                <span
                                    style="font-size: 16px;
                                           padding-left: 10px;
                                           font-weight: 600"
                                >
                                    {{ worksInfoXin.total }}
                                </span>
                            </div>
                            <div
                                v-if="worksInfoXin.total === 0"
                                class=" lineChart"
                            >
                                暂无数据
                            </div>
                            <div class="flex-row">
                                <a
                                    :class="
                                        1 === currentIndexXin ? 'active' : ''
                                    "
                                    @click="handleSearchXin(1)"
                                >
                                    最近7天
                                </a>
                                <a
                                    :class="
                                        2 === currentIndexXin ? 'active' : ''
                                    "
                                    @click="handleSearchXin(2)"
                                >
                                    最近30天
                                </a>
                                <DatePicker
                                    type="daterange"
                                    split-panels
                                    placement="bottom-end"
                                    :value="worksValue"
                                    placeholder="请选择时间"
                                    @on-change="handleSearchXin"
                                />
                            </div>
                        </div>
                        <chart
                            :options="worksInfoOptiongreen"
                            style="width: 100%; height: 240px"
                        />
                    </div>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
// import ActivityData from '../activity-data/index.vue';
// import ShortcutMenu from '../shortcut-menu/index.vue';
// import JoinPersonnel from '../join-personnel/index.vue';
import { formateSeconds } from '@/libs/utils';
import CONFIG from '@/config/index';
import api from '@/api/home';

const EXAMINE_ROUTES = [
    {
        name: 'schoolManage',
        permission: 1204,
    },
    {
        name: 'eventCheckSports',
        permission: 10030,
    },
    {
        name: 'uncompletedList',
        permission: 1107,
    },
];

export default {
    name: 'Index',
    components: {
        // 'i-menu': ShortcutMenu,
        // 'i-activity': ActivityData,
        // 'i-join': JoinPersonnel,
    },
    props: {
        info: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            isShow: false,
            newCity: true,
            worksList: [],
            worksopenList: [],
            worksStudents: [
                {
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '市',
                    key: 'city',
                    align: 'center',
                },
                {
                    title: '学生',
                    key: 'school_count',
                    align: 'center',
                },
            ],
            areaNumber: [
                {
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '区',
                    key: 'city',
                    align: 'center',
                },
                {
                    title: '学生',
                    key: 'school_count',
                    align: 'center',
                },
            ],
            areaNumberqu: [
                {
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '区',
                    key: 'city',
                    align: 'center',
                },
                {
                    title: '学校',
                    key: 'school_count',
                    align: 'center',
                },
            ],
            schoolNumber: [
                {
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '市',
                    key: 'city',
                    align: 'center',
                },
                {
                    title: '开通学校',
                    key: 'school_count',
                    align: 'center',
                },
            ],
            worksColumns: [
                {
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                // {
                //     key: 'rank',
                //     title: '排名',
                //     align: 'center',
                // },
                {
                    title: '市',
                    key: 'city',
                    align: 'center',
                    // overflow: 'hidden',
                    // textOverflow: 'ellipsis',
                    // whiteSpace: 'nowrap',
                },
                {
                    title: '学校',
                    key: 'school_count',
                    align: 'center',
                },
            ],
            // 区县
            schoolWorkNumber: [
                {
                    width: '80px',
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '学校名称',
                    key: 'city',
                    align: 'center',
                },
                {
                    title: '作品数量',
                    key: 'school_count',
                    align: 'center',
                },
            ],
            areaWorkNumber: [
                {
                    width: '80px',
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '区',
                    key: 'city',
                    align: 'center',
                },
                {
                    title: '作品数量',
                    key: 'school_count',
                    align: 'center',
                },
            ],
            resourceColumns: [
                {
                    title: '项目',
                    key: 'category_name',
                },
                {
                    title: '纪录保持者',
                    key: 'create_name',
                    align: 'center',
                },
                {
                    title: '所在学校',
                    key: 'school_name',
                    align: 'center',
                },
                {
                    title: '成绩',
                    key: 'achievement',
                    align: 'center',
                },
            ],
            /**
             * 新增用户统计
             * */
            worksInfoOption: {
                grid: {
                    top: 20,
                    left: 40,
                    bottom: 30,
                    right: 30,
                },
                xAxis: {
                    type: 'category',
                    // boundaryGap: false, // 是否起点开始
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisLine: {
                        lineStyle: {
                            color: '#E6E6E6', // x轴的颜色
                        },
                    },
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        textStyle: {
                            color: '#969799',
                        },
                    },
                    axisTick: {
                        show: false, // 去掉刻度
                    },
                },
                tooltip: {
                    trigger: 'axis',
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        type: 'dashed',
                        color: '#1166FF',
                    },
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        // 网格颜色
                        show: true,
                        lineStyle: {
                            color: ['#F0F0F0'],
                            width: 1,
                            type: 'dashed',
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#E6E6E6', // Y轴的颜色
                        },
                    },
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        textStyle: {
                            color: '#969799',
                        },
                        /*eslint-disable*/
                        formatter(value) {
                            if (value >= 1000) {
                                value = `${value / 1000}k`;
                            } else if (value < 1000) {
                                value = value;
                            }
                            return value;
                        }
                        /* eslint-disable */
                    },
                    axisTick: {
                        show: false // 去掉刻度
                    }
                },
                series: [
                    {
                        name: "新增用户",
                        data: [20, 320000, 1, 34, 90, 30, 20000],
                        type: "line",
                        itemStyle: {
                            color: "#1166FF"
                        },
                        lineStyle: {
                            color: "#1166FF"
                        },
                        areaStyle: {
                            color: "rgba(17, 102, 255, 0.1)"
                        }
                    }
                ]
            },
            /**
             * 新增作品统计
             * */
            worksInfoOptiongreen: {
                grid: {
                    top: 20,
                    left: 40,
                    bottom: 30,
                    right: 30
                },
                xAxis: {
                    type: "category",
                    // boundaryGap: false, // 是否起点开始
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    axisLine: {
                        lineStyle: {
                            color: "#E6E6E6" // x轴的颜色
                        }
                    },
                    axisLabel: {
                        show: true,
                        interval: "auto",
                        textStyle: {
                            color: "#969799"
                        }
                    },
                    axisTick: {
                        show: false // 去掉刻度
                    }
                },
                yAxis: {
                    type: "value",
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ["#F0F0F0"],
                            width: 1,
                            type: "dashed"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#E6E6E6" // y轴的颜色
                        }
                    },
                    axisLabel: {
                        show: true,
                        interval: "auto",
                        textStyle: {
                            color: "#969799"
                        },
                        /*eslint-disable*/
                        formatter(value) {
                            if (value >= 1000) {
                                value = `${value / 1000}k`;
                            } else if (value < 1000) {
                                value = value;
                            }
                            return value;
                        }
                        /* eslint-disable */
                    },
                    axisTick: {
                        show: false // 去掉刻度
                    }
                },
                tooltip: {
                    trigger: "axis"
                },
                axisPointer: {
                    type: "line",
                    lineStyle: {
                        type: "dashed",
                        color: "#19CA6C"
                    }
                },
                series: [
                    {
                        name: "新增作品",
                        data: [20, 32, 1, 34, 90, 30, 20],
                        type: "line",
                        itemStyle: {
                            color: "#19CA6C"
                        },
                        lineStyle: {
                            color: "#19CA6C"
                        },
                        areaStyle: {
                            color: "rgba(25, 202, 108, 0.1)"
                        }
                    }
                ]
            },
            currentIndex: 1,
            currentIndexXin: 1,
            worksTotalInfo: [],
            worksInfo: {},
            worksInfoXin: {},
            starts: "",
            ends: "",
            weekbegin: "",
            weekend: "",
            worksValue: [],
            userValue: [],
            // 市区
            newsList: [],
            resourceList: [],
            qq: "",
            ininfor: ""
        };
    },
    computed: {
        permission() {
            return this.$store.state.user.permission;
        }
    },
    created() {
        this.currentWeek(7);
        this.getNowMonthDate();
        this.getResourceInfo();
        this.getResourceInfoXin();
        this.getSchoolNewsList();
        if (this.info.edu_level === 3) {
            this.getResourceList();
        }
    },
    methods: {
        // 过去七天和过去30天可通用
        currentWeek(newParameter) {
            const dateFirst = new Date();
            this.weekend = `${dateFirst.getFullYear()}-${dateFirst.getMonth() +
                1}-${dateFirst.getDate()}`; // weekend表示当前时间
            const dateBegin = new Date(dateFirst);
            dateBegin.setDate(dateFirst.getDate() - newParameter);
            this.weekbegin = `${dateBegin.getFullYear()}-${dateBegin.getMonth() +
                1}-${dateBegin.getDate()}`;
        },
        // 前一个月时间
        getNowMonthDate() {
            const nowDate = new Date();
            this.ends = `${nowDate.getFullYear()}-${nowDate.getMonth() +
                1}-${nowDate.getDate()}`;
            const date = new Date(nowDate);
            date.setDate(date.getDate() - 30);
            const seperator1 = "-";
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = `0${month}`;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = `0${strDate}`;
            }
            this.starts = year + seperator1 + month + seperator1 + strDate;
            return this.starts;
        },
        handleClick(index) {
            const { permission, name } = EXAMINE_ROUTES[index];

            if (this.permission.includes(permission)) {
                this.$router.push({ name });
                console.log(name);
            } else {
                this.$Message.error("没有权限");
            }
        },
        /**
         * 新增用户统计
         * */
        getResourceInfo(
            data = {
                type: "user",
                start_date: this.weekbegin,
                end_date: this.weekend
            }
        ) {
            api.newGetResourceInfo(data).then(({ data }) => {
                this.worksInfo = data;
                this.worksInfoOption.xAxis.data = data.list.map(
                    v => v.created_at
                );
                this.worksInfoOption.series[0].data = data.list.map(
                    v => v.count
                );
            });
        },
        handleSearch(data) {
            this.currentWeek(7);
            this.getNowMonthDate();
            // if (Number.isInteger(data)) {
            //     this.currentIndex = data;
            //     this.getResourceInfo({ type: data });
            // }
            if (data === 1) {
                this.currentIndex = data;
                this.getResourceInfo({
                    type: "user",
                    start_date: this.weekbegin,
                    end_date: this.weekend
                });
                this.userValue = [];
            } else if (data === 2) {
                this.currentIndex = data;
                this.getResourceInfo({
                    type: "user",
                    start_date: this.starts,
                    end_date: this.ends
                });
                this.userValue = [];
            } else {
                this.userValue = data;
                const [start, end] = data;
                this.getResourceInfo({
                    type: "user",
                    start_date: start,
                    end_date: end
                });
                this.currentIndex = null;
            }
        },
        /**
         * 新增作品统计
         * */
        getResourceInfoXin(
            data = {
                type: "resource",
                start_date: this.weekbegin,
                end_date: this.weekend
            }
        ) {
            api.newGetResourceInfo(data).then(({ data }) => {
                this.worksInfoXin = data;
                this.worksInfoOptiongreen.xAxis.data = data.list.map(
                    v => v.created_at
                );
                this.worksInfoOptiongreen.series[0].data = data.list.map(
                    v => v.count
                );
            });
        },
        handleSearchXin(data) {
            this.currentWeek(7);
            this.getNowMonthDate();
            if (data === 1) {
                this.currentIndexXin = data;
                this.getResourceInfoXin({
                    type: "resource",
                    start_date: this.weekbegin,
                    end_date: this.weekend
                });
                this.worksValue = [];
            } else if (data === 2) {
                this.currentIndexXin = data;
                this.getResourceInfoXin({
                    type: "resource",
                    start_date: this.starts,
                    end_date: this.ends
                });
                this.worksValue = [];
            } else {
                this.worksValue = data;
                const [start, end] = data;
                this.getResourceInfoXin({
                    type: "resource",
                    start_date: start,
                    end_date: end
                });
                this.currentIndexXin = null;
            }
        },
        /**
         * 项目纪录更多
         * */
        handleShow(ref) {
            if (ref === "resource") {
                this.$router.push("/events");
            } else {
                this.$refs[ref].handleShow();
            }
        },
        /**
         * 公告展示及点击跳转
         * */
        getSchoolNewsList() {
            api.getSchoolNews().then(({ data }) => {
                this.newsList = data.slice(0, 20);
            });
        },
        handleClickArticlesItem(id) {
            const url = `${CONFIG.PC_URL}/information/preview/detail/${id}`;
            window.open(url);
        },
        /**
         * 省,市,校纪录
         * */
        handleClickTabs(name) {
            this.getResourceList(name);
        },
        getResourceList(type = "province") {
            api.getSchoolResource({ [`${type}_record`]: 1 }).then(
                ({ data: { list } }) => {
                    this.resourceList = this.parseData(list.slice(0, 20));
                }
            );
        },
        parseData(data) {
            data.forEach(v => {
                const { achievement, achievement_unit: unit } = v;
                const info = v;

                if (unit === "秒" || !unit) {
                    info.achievement = formateSeconds(achievement, true);
                } else {
                    info.achievement = achievement + unit;
                }
            });
            return data;
        },
        rowClassName({ self_city: isRed }) {
            let className = "";
            if (isRed === 1) {
                className = "active";
            }
            return className;
        }
    }
};
</script>

<style scoped></style>
