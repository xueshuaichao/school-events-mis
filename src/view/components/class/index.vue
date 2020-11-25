<template>
    <div class="common-area">
        <Select
            :value="grade_id"
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
        <Select
            :value="class_id"
            placeholder="请选择班级"
            @on-change="handleClassChange"
        >
            <Option
                v-for="item in classList"
                :key="item.id"
                :value="item.id"
            >
                {{ item.class_name }}
            </Option>
        </Select>
    </div>
</template>

<script>
import api from '@/api/organization';

export default {
    name: 'Class',
    data() {
        return {
            gradeList: [],
            classList: [],
            grade_id: '',
            class_id: '',
        };
    },
    created() {
        this.getSchoolGrade();
    },
    methods: {
        setDefaultClass([gradeId, classId]) {
            this.grade_id = Number(gradeId);
            this.getSchoolClass({ grade_id: gradeId }).then(() => {
                this.class_id = Number(classId);
            });
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
            this.classList = [];
            this.getSchoolClass({ grade_id: value });
            this.grade_id = value;
            this.$emit('on-change', [this.grade_id]);
        },
        handleClassChange(value) {
            if (value) {
                this.$emit('on-change', [
                    this.grade_id.toString(),
                    value.toString(),
                ]);
            }
        },
    },
};
</script>

<style scoped></style>
