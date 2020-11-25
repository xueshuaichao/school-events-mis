<template>
    <Modal
        v-model="show"
        title="作品数量排行祥情"
        width="1100"
        height="790"
        footer-hide
    >
        <page-list
            class="school-home-list school-home-list_small"
            :columns="columns"
            :data="list"
            :page-params="{ total, page_num: form.page_num }"
            :hide-header-btn="false"
            :hide-class="true"
            :hide-page-hide="false"
            @page-change="getSchoolWorksRanking"
        >
            <template slot="header-search-bar">
                <i-form :label-width="50">
                    <form-item label="项目">
                        <Select
                            v-model="form.resource_scope"
                            placeholder="请选择项目"
                        >
                            <Option
                                v-for="item in resourceMap"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item
                        v-if="form.resource_scope === 5"
                        label="活动"
                    >
                        <Select
                            v-model="form.activity_id"
                            placeholder="请选择活动"
                        >
                            <Option
                                v-for="item in activityMap"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item label="年级">
                        <Select
                            v-model="form.grade_id"
                            placeholder="请选择年级"
                            @on-change="handleGradeChange"
                        >
                            <Option
                                v-for="item in gradeList"
                                :key="item.grade_id"
                                :value="item.grade_id"
                            >
                                {{ item.grade_name }}
                            </Option>
                        </Select>
                    </form-item>
                    <form-item label="班级">
                        <Select
                            v-model="form.class_id"
                            placeholder="请选择班级"
                        >
                            <Option
                                v-for="item in classList"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.class_name }}
                            </Option>
                        </Select>
                    </form-item>
                    <div>
                        <i-button
                            type="primary"
                            @click="getSchoolWorksRanking(1)"
                        >
                            查询
                        </i-button>
                        <i-button
                            type="info"
                            @click="handleReset"
                        >
                            重置
                        </i-button>
                        <i-button @click="handleClickExport">
                            导出
                        </i-button>
                    </div>
                </i-form>
            </template>
        </page-list>
    </Modal>
</template>
<script>
import PageList from '@/view/components/page/list.vue';
import api from '@/api/home';
import school from '@/api/personnel';

export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            show: false,
            columns: [
                {
                    title: '排名',
                    key: 'student_name',
                    type: 'index',
                    align: 'center',
                },
                {
                    title: '年级',
                    key: 'grade_name',
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
            form: {
                grade_id: '',
                class_id: '',
                page_size: 10,
                page_num: 1,
                resource_scope: '',
                activity_id: '',
            },
            gradeList: [],
            classList: [],
            total: 0,
            list: [],
            resourceMap: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '爱挑战个人',
                },
                {
                    id: 2,
                    name: '爱挑战团体',
                },
                {
                    id: 3,
                    name: '才艺秀',
                },
                {
                    id: 5,
                    name: '新春活动',
                },
            ],
            activityMap: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '新春过大年',
                },
                {
                    id: 2,
                    name: 'dou说新年好',
                },
                {
                    id: 3,
                    name: '抗击疫情艺起来',
                },
            ],
        };
    },
    created() {
        this.getSchoolWorksRanking();
        this.getSchoolGrade();
    },
    methods: {
        getSchoolWorksRanking(pageNum = 1) {
            this.form.page_num = pageNum;
            if (this.form.resource_scope !== 5) {
                this.form.activity_id = 0;
            }
            api.getSchoolWorksRanking(this.form).then(
                ({ data: { list, count } }) => {
                    this.list = list;
                    this.total = count;
                },
            );
        },
        getSchoolGrade() {
            school.getSchoolGrade().then(({ data }) => {
                this.gradeList = data;
            });
        },
        getSchoolClass(data) {
            return school.getSchoolClass(data).then(({ data }) => {
                this.classList = data;
            });
        },
        handleShow() {
            this.show = true;
        },
        handleGradeChange(value) {
            if (value) {
                this.getSchoolClass({ grade_id: value });
            }
        },
        handleReset() {
            this.form = {
                ...this.form,
                grade_id: '',
                class_id: '',
                resource_scope: '',
                activity_id: '',
            };
            this.getSchoolWorksRanking();
        },
        handleClickExport() {
            const {
                class_id: classId,
                grade_id: grade,
                resource_scope: scope,
                activity_id: id,
            } = this.form;
            const url = `/api/index/exportworksranking?class_id=${classId}&grade_id=${grade}&resource_scope=${scope}&activity_id=${id}`;
            window.open(url);
        },
    },
};
</script>

<style scoped></style>
