<template>
    <page-detail class="student-help">
        <div class="container">
            <h2 class="mar-b-24">
                学生信息导入操作步骤
            </h2>
            <p>
                1.创建学生信息第一步，首先需要在组织管理-班级管理中，通过下载的模板批量导入本校的年级，班级信息
            </p>
            <img
                src="../../../assets/images/personal/help-1.png"
                alt=""
            >

            <img
                src="../../../assets/images/personal/help-2.png"
                alt=""
            >
            <img
                src="../../../assets/images/personal/help-3.png"
                alt=""
            >
            <p class="tip">
                温馨提示：模板中年级，班级名称均为必填字段，班级别名为选填字段
            </p>
            <p class="mar-t-24">
                2.创建班级信息成功后，点击人员管理-学生管理，导入学生信息，可选择批量导入或单个新增操作
            </p>
            <img
                src="../../../assets/images/personal/help-4.png"
                alt=""
            >
            <img
                src="../../../assets/images/personal/help-5.png"
                alt=""
            >
            <img
                src="../../../assets/images/personal/help-6.png"
                alt=""
            >
            <p class="tip">
                温馨提示：模板中姓名，年级，班级均为必填字段，手机号为选填字段，建议您填写手机号，（每个手机号只能绑定一个用户哦！）
                导入成功后用户可使用两种登录方式！（可通过账户密码或手机号密码登录），一次最多可导入1000条数据，若数据量较大，请分批导入。
            </p>
            <p class="mar-t-24">
                3.学生信息导入成功后，即在学生列表中展示，您可以选择要导出的学生信息进行数据导出操作
            </p>
            <img
                src="../../../assets/images/personal/help-7.png"
                alt=""
            >
            <p class="mar-t-24">
                4.将导出表单中的信息直接下发给学生，导入时填写手机哈的学生可通过账户密码，或手机号密码登录，未绑定手机号的学生只能通过账户密码登录
            </p>
            <img
                src="../../../assets/images/personal/help-8.png"
                alt=""
            >
            <p class="mar-t-24">
                5.若学生登录成功后可在我的-设置页面重置密码
            </p>
            <div style="width:1074px; max-width: 100%">
                <img
                    src="../../../assets/images/personal/help-9.png"
                    alt=""
                >
                <img
                    src="../../../assets/images/personal/help-10.png"
                    alt=""
                >
            </div>

            <div class="top">
                <i-button
                    type="primary"
                    class="top"
                    @click="handleBackTop"
                >
                    返回顶部
                </i-button>
            </div>
        </div>
    </page-detail>
</template>

<script>
/* eslint-disable no-restricted-globals */
import './index.less';
import PageDetail from '@/view/components/page/detail.vue';

export default {
    name: 'StudentHelp',
    components: {
        PageDetail,
    },
    methods: {
        handleBackTop() {
            document.querySelector('#xmis-content').scrollTop = 0;
        },
    },
};
</script>
