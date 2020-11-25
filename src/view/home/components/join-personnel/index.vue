<template>
    <div
        class="panel chart-wrapper"
        :style="{ height }"
    >
        <h4 class="panel-header">
            参与人员
        </h4>
        <div class="panel-body flex-row">
            <chart :options="option" />
            <div class="info">
                <p>
                    <span class="icon" />
                    学生: {{ info.student_login_count }} 人
                </p>
                <p>
                    <span class="icon" />
                    教师: {{ info.teacher_login_count }} 人
                </p>
                <p>
                    <span class="icon" />
                    其他: {{ info.other_login_count }} 人
                </p>
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
    data() {
        const {
            student_login_count: student,
            teacher_login_count: teacher,
            other_login_count: other,
        } = this.info;
        return {
            option: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                color: ['#FF6849', '#19CA6C', '#1166FF'],
                series: [
                    {
                        name: '参与人员',
                        type: 'pie',
                        radius: '80%',
                        selectedMode: 'multiple',
                        selectedOffset: 5,
                        label: {
                            normal: {
                                show: false,
                                position: 'inner',
                                formatter: '{b} {d}%',
                            },
                        },
                        data: [
                            { value: teacher, name: '教师', selected: true },
                            { value: other, name: '其他', selected: true },
                            { value: student, name: '学生', selected: true },
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            },
            height: '',
        };
    },
    created() {
        this.height = this.info.user_type === 3 ? '372px' : '430px';
    },
};
</script>

<style scoped></style>
