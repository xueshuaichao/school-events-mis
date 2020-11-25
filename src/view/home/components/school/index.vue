<template>
    <div class="school-home">
        <Row class="school-student">
            <i-col span="9">
                <div class="panel mar-r-8">
                    <div class="panel-title">
                        学生总量
                    </div>
                    <div class="panel-body flex-row grade-info">
                        <div class="chart-wrapper">
                            <div class="total-info">
                                <b>{{ studentTotal }}</b>
                                <p>学生 (人)</p>
                            </div>
                            <chart
                                :options="gradeInfoOption"
                                style="width: 150px;height: 150px"
                            />
                        </div>
                        <div class="grade-wrapper mar-l-24">
                            <div
                                class="grade-content"
                                :style="animationStyle"
                            >
                                <ul
                                    v-for="(ele, index) in gradeInfo"
                                    :key="index"
                                    class="student-tips mar-r-24"
                                >
                                    <li
                                        v-for="item in ele"
                                        :key="item.grade_name"
                                        class="flex-row"
                                    >
                                        <p>
                                            <span
                                                class="radio"
                                                :style="{
                                                    background: item.color
                                                }"
                                            />
                                            <span class="grade-name">
                                                {{ item.grade_name }}
                                            </span>
                                            {{ item.num }}人
                                        </p>
                                        <p class="rate">
                                            {{ item.percentage }}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div class="grade-radio flex-row">
                                <div
                                    v-for="(item, index) in gradeInfo"
                                    :key="index"
                                    :class="[
                                        'item',
                                        currentGradeIndex === index
                                            ? 'active'
                                            : ''
                                    ]"
                                    @click="handleClickRadio(index)"
                                >
                                    {{ index + 1 }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col span="5">
                <div class="panel mar-r-8">
                    <div class="panel-title flex-row">
                        学生激活比
                        <a @click="handleShow('student')">
                            更多<Icon
                                type="ios-arrow-forward"
                                size="16"
                            />
                        </a>
                    </div>
                    <div class="panel-body active-info flex-row">
                        <div class="chart-wrapper">
                            <div
                                class="total-info"
                                style="padding-top: 45px"
                            >
                                <b>{{ activityStudentRate }}%</b>
                            </div>
                            <chart
                                :options="activityInfoOption"
                                style="width: 150px;height: 150px"
                            />
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col span="10">
                <div class="panel">
                    <div class="panel-title">
                        通知公告
                    </div>
                    <div class="panel-body">
                        <ul class="student-tips news-list">
                            <li
                                v-for="(item, index) in newsList"
                                :key="index"
                                class="flex-row"
                            >
                                <p
                                    class="title"
                                    @click="handleClickArticlesItem(item.id)"
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
            </i-col>
        </Row>
        <Row class="school-works">
            <i-col span="14">
                <div class="panel mar-r-8">
                    <div class="panel-titlell works-info-footer flex-row">
                        <div>
                            作品上传
                        </div>
                        <div class="item">
                            <span>作品上传总量</span>
                            <span>{{ worksTotalInfo.resource_count }}</span>
                        </div>
                        <div class="item">
                            <span>挑战类项目</span>
                            <span>{{ worksTotalInfo.atz_count }}</span>
                        </div>
                        <div class="item">
                            <span>才艺秀项目</span>
                            <span>{{ worksTotalInfo.cyx_count }}</span>
                        </div>
                        <div class="item">
                            <span>吉尼斯项目</span>
                            <span>{{ worksTotalInfo.guinness_count }}</span>
                        </div>
                        <div class="item">
                            <span>教育短视频</span>
                            <span>{{ worksTotalInfo.jiaoyu_count }}</span>
                        </div>
                    </div>
                    <div class="panel-body works-info">
                        <div class="works-info-header flex-row">
                            <p>作品上传日增</p>
                            <div class="flex-row">
                                <a
                                    :class="1 === currentIndex ? 'active' : ''"
                                    @click="handleSearch(1)"
                                >
                                    本周
                                </a>
                                <a
                                    :class="2 === currentIndex ? 'active' : ''"
                                    @click="handleSearch(2)"
                                >
                                    本月
                                </a>
                                <DatePicker
                                    type="daterange"
                                    split-panels
                                    placeholder="请选择时间"
                                    @on-change="handleSearch"
                                />
                            </div>
                        </div>
                        <chart
                            :options="worksInfoOption"
                            style="width: 100%; height: 240px"
                        />
                        <!--<div class="works-info-footer flex-row">
                            <div class="item">
                                <p>作品上传总量</p>
                                <p>{{ worksTotalInfo.resource_count }}</p>
                            </div>
                            <div class="item">
                                <p>竞技类</p>
                                <p>{{ worksTotalInfo.atz_count }}</p>
                            </div>
                            <div class="item">
                                <p>才艺类</p>
                                <p>{{ worksTotalInfo.cyx_count }}</p>
                            </div>
                        </div>-->
                    </div>
                </div>
            </i-col>
            <i-col span="10">
                <div class="panel">
                    <div class="panel-title flex-row">
                        作品数量排行TOP5
                        <a @click="handleShow('works')">
                            更多<Icon
                                type="ios-arrow-forward"
                                size="16"
                            />
                        </a>
                    </div>
                    <div class="panel-body school-home-list">
                        <i-table
                            :columns="worksColumns"
                            :data="worksList"
                        />
                    </div>
                </div>
            </i-col>
        </Row>
        <Row class="school-ranking-wrapper school-works">
            <i-col span="14">
                <div class="panel mar-r-8">
                    <div class="panel-title">
                        学校作品量排行
                    </div>
                    <div class="panel-body school-home-list school-ranking">
                        <i-table
                            :row-class-name="rowClassName"
                            :columns="schoolsColumns"
                            :data="schoolsList"
                        />
                    </div>
                </div>
            </i-col>
            <i-col span="10">
                <div class="panel">
                    <div class="panel-title flex-row">
                        项目记录
                        <a @click="handleShow('resource')">
                            更多<Icon
                                type="ios-arrow-forward"
                                size="16"
                            />
                        </a>
                    </div>
                    <div class="panel-body school-home-list">
                        <Tabs
                            value="province"
                            @on-click="handleClickTabs"
                        >
                            <TabPane
                                label="省记录"
                                name="province"
                            />
                            <TabPane
                                label="市记录"
                                name="city"
                            />
                            <TabPane
                                label="校记录"
                                name="school"
                            />
                        </Tabs>
                        <i-table
                            :columns="resourceColumns"
                            :data="resourceList"
                        />
                    </div>
                </div>
            </i-col>
        </Row>
        <student ref="student" />
        <works ref="works" />
    </div>
</template>

<script>
import { formateSeconds } from '@/libs/utils';
import CONFIG from '@/config/index';
import api from '@/api/home';
import Works from '../works/index.vue';
import Student from '../student/index.vue';

const COLORS_MAP = [
    '#FFC600',
    '#19CA6C',
    '#0895FF',
    '#332AFF',
    '#FF6849',
    '#FF9D29',
];
export default {
    name: 'Index',
    components: {
        Student,
        Works,
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
            gradeInfoOption: {
                series: [
                    {
                        name: '学生总量',
                        type: 'pie',
                        hoverAnimation: false,
                        color: COLORS_MAP,
                        radius: ['75%', '100%'],
                        data: [],
                        itemStyle: {
                            color: params => COLORS_MAP[params.dataIndex % 6],
                        },
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                            },
                        },
                    },
                ],
            },
            activityInfoOption: {
                series: [
                    {
                        name: '学生总量',
                        type: 'pie',
                        hoverAnimation: false,
                        color: ['#D9E6FF', '#1166FF'],
                        radius: ['75%', '100%'],
                        data: [1, 3],
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                            },
                        },
                    },
                ],
            },
            worksInfoOption: {
                grid: {
                    top: 20,
                    left: 30,
                    bottom: 30,
                    right: 30,
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: [20, 32, 1, 34, 90, 30, 20],
                        type: 'line',
                        itemStyle: {
                            color: '#1166FF',
                        },
                        lineStyle: {
                            color: '#1166FF',
                        },
                        areaStyle: {
                            color: 'rgba(17, 102, 255, 0.1)',
                        },
                    },
                ],
            },
            colors: COLORS_MAP,
            gradeInfo: [],
            studentTotal: 0,
            activityStudentRate: 0,
            currentIndex: 1,
            currentGradeIndex: 0,
            animationStyle: {
                transform: 'translateX(0px)',
            },
            newsList: [],
            worksInfo: {},
            worksColumns: [
                {
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '班级',
                    key: 'class_name',
                    align: 'center',
                },
                {
                    title: '作品数量',
                    key: 'num',
                    align: 'center',
                },
            ],
            schoolsColumns: [
                {
                    type: 'index',
                    title: '排名',
                    align: 'center',
                },
                {
                    title: '学校',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '作品数量',
                    key: 'num',
                    align: 'center',
                },
                {
                    title: '挑战类',
                    key: 'atznum',
                    align: 'center',
                },
                {
                    title: '吉尼斯',
                    key: 'gennisnum',
                    align: 'center',
                },
                {
                    title: '才艺秀',
                    key: 'cyxnum',
                    align: 'center',
                },
                {
                    title: '教育短视频',
                    key: 'eduvideonum',
                    align: 'center',
                },
            ],
            resourceColumns: [
                {
                    title: '参赛项目',
                    key: 'category_name',
                },
                {
                    title: '记录保持者',
                    key: 'create_name',
                    align: 'center',
                },
                {
                    title: '成绩/单位',
                    key: 'achievement',
                    align: 'center',
                },
                {
                    title: '年级',
                    key: 'grade_name',
                    align: 'center',
                },
            ],
            worksList: [],
            schoolsList: [],
            resourceList: [],
            worksTotalInfo: [],
        };
    },
    created() {
        this.getSchoolRanking();
        this.getStudentInfo();
        this.getSchoolNewsList();
        this.getResourceInfo();
        this.getSchoolWorksRanking();
        this.getResourceList();
        this.getResourceTotalInfo();
    },
    mounted() {
        const {
            activation_student: activityStudent,
            student_num: num,
        } = this.info;
        this.activityInfoOption.series[0].data = [
            num - activityStudent,
            activityStudent,
        ];
        if (activityStudent && num) {
            this.activityStudentRate = parseInt(
                (activityStudent / num) * 100,
                10,
            );
        }
    },
    methods: {
        getResourceList(type = 'province') {
            api.getSchoolResourceList({ [`${type}_record`]: 1 }).then(
                ({ data: { list } }) => {
                    this.resourceList = this.parseData(list.slice(0, 5));
                },
            );
        },
        getSchoolRanking() {
            api.getSchoolRanking().then(({ data: { list } }) => {
                this.schoolsList = list.slice(0, 6);
            });
        },
        getStudentInfo() {
            api.getStudentInfo().then(
                ({ data: { grade_info: info, total } }) => {
                    this.studentTotal = total;
                    this.parseGradeInfo(info.slice(0, 12));
                    this.gradeInfoOption.series[0].data = info.map(v => v.num);
                },
            );
        },
        getSchoolNewsList() {
            api.getSchoolNews().then(({ data }) => {
                this.newsList = data.slice(0, 6);
            });
        },
        getResourceInfo(data = { type: 1 }) {
            api.getResourceInfo(data).then(({ data }) => {
                this.worksInfo = data;
                this.worksInfoOption.xAxis.data = data.map(v => v.day);
                this.worksInfoOption.series[0].data = data.map(v => v.count);
            });
        },
        getResourceTotalInfo() {
            api.getResourceInfo().then(({ data }) => {
                this.worksTotalInfo = data;
            });
        },
        getSchoolWorksRanking() {
            return api
                .getSchoolWorksRanking({ page_size: 10, page_num: 1 })
                .then(({ data: { list } }) => {
                    const rankList = list.map((v) => {
                        const info = v;
                        info.class_name = v.grade_name + v.class_name;
                        return info;
                    });
                    this.worksList = rankList;
                });
        },
        parseGradeInfo(info) {
            const result = [];
            let num = 0;
            info.forEach((v, index) => {
                const item = v;
                item.color = COLORS_MAP[index % 6];
                if (index % 4 === 0 && index !== 0) {
                    result.push(info.slice(num, index));
                    num = index;
                }
                if (index + 1 === info.length) {
                    result.push(info.slice(num, index + 1));
                }
            });
            // console.log(result);
            this.gradeInfo = result;
        },
        parseData(data) {
            data.forEach((v) => {
                const { achievement, achievement_unit: unit } = v;
                const info = v;

                if (unit === '秒' || !unit) {
                    info.achievement = formateSeconds(achievement, true);
                } else {
                    info.achievement = achievement + unit;
                }
            });
            return data;
        },
        rowClassName({ is_red: isRed }) {
            let className = '';
            if (isRed === 1) {
                className = 'active';
            }
            return className;
        },
        handleClickArticlesItem(id) {
            const url = `${CONFIG.PC_URL}/information/preview/detail/${id}`;
            window.open(url);
        },
        handleShow(ref) {
            if (ref === 'resource') {
                this.$router.push('/events');
            } else {
                this.$refs[ref].handleShow();
            }
        },
        handleSearch(data) {
            if (Number.isInteger(data)) {
                this.currentIndex = data;
                this.getResourceInfo({ type: data });
            } else {
                const [start, end] = data;
                this.getResourceInfo({
                    type: 3,
                    date_start: start,
                    end_start: end,
                });
                this.currentIndex = null;
            }
        },
        handleClickTabs(name) {
            this.getResourceList(name);
        },
        handleClickRadio(index) {
            this.currentGradeIndex = index;
            this.animationStyle.transform = `translateX(${-193 * index}px)`;
        },
    },
};
</script>

<style scoped></style>
