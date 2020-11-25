<template>
    <Modal
        id="modal-import"
        v-model="show"
        title="批量导入"
        width="596"
        footer-hide
    >
        <div
            v-if="status === 1"
            class="import flex-row"
        >
            选择要导入的文件
            <i-button
                :loading="loading"
                @click="handleClickImport"
            >
                上传文件
            </i-button>
            <p class="file-info">
                支持扩展名:excel
            </p>
            <a @click="handleClickDownload">点击下载导入模板</a>
        </div>
        <div
            v-if="status === 2"
            class="import-success"
        >
            <template v-if="fatalCount">
                <p class="tip">
                    <span>温馨提示：</span>一个手机号只能绑定一个用户，部分手机号重复或手机号格式错误的用户已将绑定手机号置空，用户可在UP青少年爱挑战小程序自行绑定！
                </p>
            </template>
            <template v-else>
                <p>
                    <Icon
                        type="ios-checkmark-circle"
                        color="#3DD22C"
                        size="20"
                    />
                    导入成功
                </p>
                此次共导入学生数量{{ successCount }}条，请返回列表确认
            </template>
        </div>
        <div
            v-if="status === 3"
            class="import-error"
        >
            <!-- <p>
                <Icon
                    type="ios-close-circle"
                    color="#FF6849"
                    size="20"
                />
                导入失败
            </p> -->
            共有{{ successCount }}条数据导入成功，{{
                errorCount
            }}数据导入失败，点击
            <a
                :href="errorUrl"
                target="_bank"
            >导出失败人员信息</a>
            <p
                v-if="fatalCount"
                class="tip"
            >
                <span>温馨提示：</span>一个手机号只能绑定一个用户，部分手机号重复或手机号格式错误的用户已将绑定手机号置空，用户可在UP青少年爱挑战小程序自行绑定！
            </p>
        </div>
        <template slot="footer">
            <i-button
                type="primary"
                @click="handlClickSave"
            >
                确认
            </i-button>
            <i-button
                v-if="status === 1"
                @click="show = !show"
            >
                取消
            </i-button>
        </template>
        <input
            v-show="false"
            ref="file"
            type="file"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            @change="handleChange"
        >
    </Modal>
</template>

<script>
import importConfig from './config';
import api from '@/api/import';

const DEFAULT_MAX_SIZE = 1024 * 1024 * 10;
export default {
    name: 'ModalImport',
    data() {
        return {
            show: false,
            status: 1, // 1 未开始 2 成功 3失败
            resource: '',
            loading: false,
            successCount: 0,
            errorCount: 0,
            fatalCount: 0,
            errorUrl: '',
        };
    },
    methods: {
        uploadFile(data) {
            this.loading = true;
            api[importConfig.uploadUrl[this.resource]](data)
                .then(({ data }) => {
                    this.loading = false;
                    const {
                        error_count: error,
                        success_count: count,
                        error_excel_url: url,
                        fatal_count: fatal,
                    } = data;
                    this.status = error ? 3 : 2;
                    this.errorCount = error;
                    this.successCount = count;
                    this.fatalCount = fatal;
                    this.errorUrl = url;
                    if (this.show) {
                        this.$Message.success('上传成功');
                    }
                    if (count) {
                        this.$emit('on-success');
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
            this.$refs.file.value = '';
        },
        handleShow(resource = 'student', status = 1) {
            this.resource = resource;
            this.status = status;
            this.show = true;
        },
        handleHide() {
            this.show = false;
            this.status = 1;
        },
        handleClickDownload() {
            const url = importConfig.download[this.resource];
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
        handlClickSave() {
            if (this.successCount) {
                this.$emit('on-success');
            }
            // this.handleHide();
        },
    },
};
</script>

<style lang="less">
@import "../../../less/variables";
#modal-import {
    .import {
        font-size: 14px;
        color: @black;
        a {
            color: @blue;
            margin-left: 24px;
        }
        .file-info {
            font-size: 12px;
            color: @grayOne;
        }
        .ivu-btn {
            margin: 0 8px;
        }
    }
    .import-success,
    .import-error {
        text-align: center;
        font-size: 14px;
        color: @fontColor;
        p {
            font-size: 14px;
            color: @black;
            margin-bottom: 16px;
        }
        .tip {
            margin-top: 12px;
            margin-bottom: 0;
            text-align: center;
            font-size: 14px;
            color: #626366;
            span {
                color: #ff6849;
            }
        }
    }
}
</style>
