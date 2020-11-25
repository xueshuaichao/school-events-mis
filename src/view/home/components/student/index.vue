<template>
    <Modal
        v-model="show"
        title="学生激活列表"
        width="848"
        height="790"
        footer-hide
    >
        <page-list
            class="school-home-list"
            :columns="columns"
            :data="list"
            :page-params="{
                total,
                page_num: form.page_num,
                page_size: form.page_size
            }"
            :hide-header-btn="false"
            :hide-class="true"
            :hide-page-hide="false"
            @page-change="getStudentList"
        >
            <template slot="header-search-bar">
                <i-form :label-width="50">
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
                            @click="getStudentList(1)"
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
import api from '@/api/personnel';

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
                    title: '姓名',
                    key: 'student_name',
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
                    title: '状态',
                    key: 'status_name',
                    align: 'center',
                },
            ],
            form: {
                grade_id: '',
                class_id: '',
                page_size: 5,
                page_num: 1,
            },
            gradeList: [],
            classList: [],
            total: 0,
            list: [],
        };
    },
    created() {
        this.getSchoolGrade();
    },
    methods: {
        handleShow() {
            this.show = true;
            this.handleReset();
        },
        getStudentList(pageNum = 1) {
            this.form.page_num = pageNum;
            api.getStudentList(this.form).then(({ data: { list, count } }) => {
                this.parseData(list);
                this.total = count;
            });
        },
        parseData(data) {
            const info = data;
            info.forEach((v) => {
                const item = v;
                item.status_name = v.mobile ? '激活' : '未激活';
            });
            this.list = info;
        },
        getSchoolGrade() {
            api.getSchoolGrade().then(({ data }) => {
                this.gradeList = data;
            });
        },
        getSchoolClass(data) {
            return api.getSchoolClass(data).then(({ data }) => {
                this.classList = data;
            });
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
            };
            this.getStudentList();
        },
        handleClickExport() {
            const { class_id: classId, grade_id: grade } = this.form;
            const url = `/api/student/export?type=1&class_id=${classId}&grade_id=${grade}`;
            window.open(url);
        },
    },
};
</script>

<style scoped></style>
