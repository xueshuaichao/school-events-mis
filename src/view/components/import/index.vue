<template>
    <div
        id="bath-import"
        class="content-wrapper"
        :class="{
            'import-student': resource === 'student'
        }"
    >
        <i-button
            class="mar-r-24"
            @click="handlePrev()"
        >
            返回{{ resource === "student" ? "学生管理" : "" }}
        </i-button>
        <i-button
            v-if="resource !== 'student'"
            @click="handleClickDownload(false)"
        >
            下载导入模板
        </i-button>
        <div class="content">
            <div
                v-if="status !== 3"
                class="import"
            >
                <template v-if="status === 1">
                    <div
                        v-if="resource === 'student'"
                        style="font-size: 20px; margin-bottom: 32px;font-weight: bold;"
                    >
                        *批量导入前请确认<span
                            class="em"
                        >是否在后台创建班级</span>, 若未创建请
                        <router-link
                            to="/class-manage"
                            style="text-decoration: underline;"
                        >
                            点击这里
                        </router-link>
                        前往创建
                    </div>
                    <div class="hook">
                        <div class="tip">
                            支持扩展名:xls
                        </div>
                        <i-button
                            type="primary"
                            class="btn-import"
                            :loading="loading"
                            @click="handleClickImport"
                        >
                            {{ loading ? "正在上传" : "选择导入文件" }}
                        </i-button>
                        <i-button
                            v-if="resource === 'student'"
                            @click="handleClickDownload(false)"
                        >
                            下载导入模板
                        </i-button>
                    </div>

                    <div
                        v-if="resource === 'student'"
                        class="tip-board"
                    >
                        <div class="em">
                            <Icon type="ios-alert" />很重要！常见导入失败原因：
                        </div>
                        <div>
                            1.未使用要求下载的模板文件 <br>
                            2.模板文件中的表头以及格式有修改行为（表头和格式不能有任何的修改）<br>
                            3.导入学生前未提前创建学生的班级，导致导入时学生的班级与班级管理中的班级不匹配
                            <br>
                            4.单次导入模板中的学生数据超过了1000条 <br>
                        </div>
                    </div>
                </template>
                <template v-if="status === 2">
                    <div class="info">
                        已成功导入{{ info.success_count }}条
                    </div>
                    <i-button
                        type="primary"
                        class="default"
                        @click="$router.go(-1)"
                    >
                        返回列表
                    </i-button>
                    <i-button
                        class="default"
                        :loading="loading"
                        @click="handleClickImport"
                    >
                        {{ loading ? "正在上传" : "继续导入" }}
                    </i-button>
                </template>
            </div>
            <!-- status === 3 上传结束 -->
            <page-list
                v-else
                :columns="info.columns"
                :page-params="{ total }"
                :data="list"
                @page-change="getErrorList"
            >
                <template slot="header-btn">
                    <div class="info">
                        <p>
                            已成功导入{{ info.success_count }}条，失败{{
                                info.error_count
                            }}条
                        </p>
                    </div>
                </template>
                <template slot="header-search-bar">
                    <a
                        class="operate"
                        @click="handleClickDownload('error')"
                    >导出失败人员信息</a>
                    <!-- <a
                        class="operate"
                        @click="handleClickClear"
                    >清空失败人员信息</a> -->
                </template>
            </page-list>
        </div>
        <input
            v-show="false"
            ref="file"
            type="file"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            @change="handleChange"
        >
    </div>
</template>

<script>
import PageList from '@/view/components/page/list.vue';
import importConfig from './config';
import api from '@/api/import';

const DEFAULT_MAX_SIZE = 1024 * 1024 * 10;
export default {
    name: 'BatchImport',
    components: {
        PageList,
    },
    data() {
        return {
            status: 1, // 未开始 1 导入完成 2 出错 3
            columns: importConfig.columnsConfig[this.resource],
            resource: this.$route.meta.resource,
            loading: false,
            info: {
                success_count: 0,
                error_count: 0,
                error_list: [],
            },
            list: [],
            total: 0,
        };
    },
    watch: {
        $route() {
            this.resource = this.$route.meta.resource;
            this.init();
        },
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            switch (this.resource) {
                case 'student':
                    this.getSchoolGrade();
                    break;
                default:
                    break;
            }
        },
        getSchoolGrade() {
            api.getSchoolGrade().then(({ data }) => {
                if (!data.length) {
                    this.handleClass();
                }
            });
        },
        uploadFile(data) {
            this.loading = true;
            api[importConfig.uploadUrl[this.resource]](data)
                .then(({ data }) => {
                    this.loading = false;
                    const { error_count: error } = data;
                    this.status = error ? 3 : 2;
                    this.$Message.success('上传成功');
                    this.parseData(data, error);
                })
                .catch(() => {
                    this.loading = false;
                });
            this.$refs.file.value = '';
        },
        parseData(data, error) {
            let columns;
            const info = data;
            const list = [];
            if (error) {
                columns = data.error_list
                    .shift()
                    .filter(v => v)
                    .map((v, index) => ({
                        title: v,
                        key: `name${index}`,
                        align: 'center',
                    }));
                info.error_list.forEach((v) => {
                    const obj = {};
                    const arr = v.slice(0, columns.length);
                    arr.forEach((v, index) => {
                        if (index < arr.length - 1) {
                            obj[`name${index}`] = v;
                        } else {
                            obj.err = v;
                        }
                    });
                    list.push(obj);
                });
                columns[columns.length - 1].slot = 'err';
                info.error_list = list;
                info.columns = columns;
            }
            this.info = Object.assign({}, this.info, info);
            this.total = list.length;
            this.getErrorList(1);
        },
        getErrorList(num) {
            this.list = this.info.error_list.slice((num - 1) * 10, num * 10);
        },
        handleClickDownload(type) {
            let url = '';
            if (type) {
                url = this.info.error_excel_url;
            } else {
                url = importConfig.download[this.resource];
            }
            window.open(url);
        },
        handleClickImport() {
            this.$refs.file.click();
        },
        handleChange(e) {
            const file = e.target.files[0];

            if (file) {
                if (file.size < DEFAULT_MAX_SIZE) {
                    this.uploadFile({ file });
                } else {
                    this.$Message.error(`${file.name}超过10M，请重新上传！`);
                }
                e.target.value = null;
            }
        },
        handleClickClear() {
            this.status = 1;
        },
        handleClass() {
            this.$Modal.confirm({
                title: '提示',
                content:
                    '您还没有创建班级，请先在【组织管理】-【班级管理】中创建班级。',
                okText: '创建班级',
                cancelText: '暂不导入',
                onOk: () => {
                    this.$router.push({ name: 'classImport' });
                },
                onCancel: () => {
                    this.$router.go(-1);
                },
            });
        },
        handlePrev() {
            if (this.status === 3) {
                return this.handleClickClear();
            }
            if (this.resource === 'class') {
                this.$router.push({ name: 'classManage' });
            } else {
                this.$router.go(-1);
            }
            return false;
        },
    },
};
</script>

<style lang="less">
@import "../../../less/variables";
#bath-import {
    &.import-student {
        .import {
            margin-top: 50px;

            .btn-import {
                font-size: 14px;
                width: auto;
                height: auto;
                margin-right: 16px;
            }
        }

        .hook {
            position: relative;
            margin-bottom: 60px;

            .tip {
                position: absolute;
                bottom: -20px;
                text-align: center;
                width: 100%;
                transform: translateX(-66px);
                color: #969799;
            }
        }

        .tip-board {
            font-size: 14px;
            color: #626366;
            width: 610px;
            box-sizing: border-box;
            padding: 24px;
            margin: 0 auto;
            background: #f5f6f7;
            text-align: left;

            .em {
                color: #ff6849;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 8px;

                .ivu-icon {
                    font-size: 20px;
                    margin-right: 4px;
                    position: relative;
                    top: -3px;
                }
            }
        }
    }

    .content-wrapper {
        padding: 0;
        margin: 0;
    }
    .info {
        margin-top: 16px;
        margin-bottom: 30px;
        font-size: 14px;
        color: @fontColor;
    }
    .operate {
        margin-top: 16px;
        font-size: 14px;
        color: @blue;
        margin-right: 24px;
    }
    .ivu-btn {
        min-width: 120px;
    }
    .import {
        margin-top: 300px;
        text-align: center;
        .btn-import {
            width: 150px;
            height: 48px;
            font-size: 16px;
        }
        .default {
            width: 90px;
        }
    }

    .em {
        color: red;
    }
}
</style>
