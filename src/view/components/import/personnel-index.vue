<template>
    <div
        id="bath-import"
        class="content-wrapper"
    >
        <i-button
            class="mar-r-24"
            @click="$router.go(-1)"
        >
            返回
        </i-button>
        <i-button @click="handleClickDownload(false)">
            下载导入模板
        </i-button>
        <div class="content">
            <div
                v-if="status !== 3"
                class="import"
            >
                <template v-if="status === 1">
                    <i-button
                        type="primary"
                        class="btn-import"
                        :loading="loading"
                        @click="handleClickImport"
                    >
                        {{ loading ? "正在上传" : "选择导入excel" }}
                    </i-button>
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
            <page-list
                v-else
                :columns="columns"
                :page-params="{ total: info.error_count }"
                :data="list"
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
                    <a
                        class="operate"
                        @click="handleClearPerson"
                    >清空失败人员信息</a>
                </template>
                <div slot="footer" />
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

export default {
    name: 'BatchImport',
    components: {
        PageList,
    },
    data() {
        return {
            status: 1, // 未开始 1 导入完成 2 出错 3
            // columns: importConfig.columnsConfig[this.resource],
            columns: [],
            list: [],
            resource: this.$route.meta.resource,
            loading: false,
            info: {
                success_count: 0,
                error_count: 0,
                error_list: [],
            },
            templateRow: this.$route.name === 'personnelImport' ? 5 : 4,
        };
    },

    methods: {
        uploadFile(data) {
            this.loading = true;
            api[importConfig.uploadUrl[this.resource]](data)
                .then(({ data }) => {
                    this.loading = false;
                    const { error_count: error } = data;
                    this.info = Object.assign({}, this.info, data);
                    this.status = error ? 3 : 2;
                    if (error) {
                        for (let i = 0; i < this.templateRow; i += 1) {
                            this.columns.push({
                                title: this.info.error_list[0][i],
                                key: i,
                            });
                        }
                        for (
                            let i = 1;
                            i < this.info.error_list.length;
                            i += 1
                        ) {
                            const obj = {};
                            for (let j = 0; j < this.templateRow; j += 1) {
                                obj[j] = this.info.error_list[i][j];
                            }
                            this.list.push(obj);
                        }
                    }

                    this.$Message.success('上传成功');
                })
                .catch(() => {
                    this.loading = false;
                    this.$Message.error('导入失败');
                });
        },
        handleClickDownload(type) {
            const url = type
                ? this.info.error_excel_url
                : importConfig.download[this.resource];
            window.open(url);
        },
        handleClickImport() {
            this.$refs.file.click();
        },
        handleChange(e) {
            const file = e.target.files[0];
            this.uploadFile({ file });
        },
        handleClearPerson() {
            this.columns = [];
            this.list = [];
            this.info = {
                success_count: 0,
                error_count: 0,
                error_list: [],
            };
            this.status = 1;
        },
    },
};
</script>

<style lang="less">
@import "../../../less/variables";
#bath-import {
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
}
</style>
