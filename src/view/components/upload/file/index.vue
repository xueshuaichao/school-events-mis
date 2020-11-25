<template>
    <div class="upload-file flex-row">
        <i-button
            type="primary"
            class="mar-r-10"
            :loading="loading"
            @click="handleClick"
        >
            {{ loading ? "上传中" : btnName }}
        </i-button>
        <slot name="tips">
            <p>
                图片尺寸1024*768，大小不超过5M，格式为JPG、PNG等图片格式
            </p>
        </slot>
        <input
            v-show="false"
            ref="file"
            :accept="accept"
            :multiple="multiple"
            type="file"
            @change="handleChange"
        >
        <!-- 批量上传 -->
        <Modal
            v-model="show"
            title="批量上传"
            width="680"
        >
            <div class="upload-preview-pictures">
                <div
                    v-for="(item, index) in filesList"
                    :key="index"
                    class="item-wrapper"
                >
                    <div class="item">
                        <img
                            :src="item.src"
                            alt=""
                        >
                        <div
                            v-if="item.status === 'loading'"
                            class="progress"
                        >
                            <Icon
                                type="ios-loading"
                                size="20"
                            />
                        </div>
                        <div
                            v-if="
                                item.status === 'preview' ||
                                    item.status === 'success'
                            "
                            class="cover"
                        >
                            <Icon
                                type="ios-trash-outline"
                                @click.native="handleRemove(index)"
                            />
                        </div>
                    </div>
                    <p calss="tips">
                        {{ item.statusText }}
                    </p>
                </div>
            </div>
            <template slot="footer">
                <i-button
                    type="primary"
                    :loading="loading"
                    @click="beforeUpload"
                >
                    {{ loading ? "上传中" : "确定上传" }}
                </i-button>
                <i-button>
                    取消
                </i-button>
            </template>
        </Modal>
    </div>
</template>

<script>
/* eslint-disable */
import api from "@/api/common";

export default {
    name: "Index",
    props: {
        name: {
            type: String,
            default: "上传图片"
        },
        accept: {
            type: String,
            default: "image/*"
        },
        multiple: {
            type: Boolean,
            default: false
        },
        maxSize: {
            type: Number,
            default: 5 * 1024 * 1024
        },

        onBeforeUpload: {
            type: Function,
            default() {
                return true;
            }
        }
    },
    data() {
        return {
            show: false,
            loading: false,
            btnName: "",
            filesList: []
        };
    },
    created() {
        this.btnName = this.name;
    },
    methods: {
        upload(data, index) {
            const { filesList } = this;
            filesList[index].status = "loading";
            return api
                .uploadFile(data)
                .then(({ data: { path } }) => {
                    this.uploadSuccess(path, index);
                })
                .catch(() => {
                    this.uploadError(index);
                });
        },
        checkFile(files) {
            const { maxSize } = this;

            return files.filter(({ size, name }) => {
                if (size <= maxSize) {
                    return true;
                } else {
                    this.$Message.error(`${name}超过5M，请压缩！`);
                    return false;
                }
            });
        },
        previewPictures(files) {
            this.filesList = files.map(v => {
                return {
                    file: v,
                    name: v.name,
                    size: v.size,
                    src: URL.createObjectURL(v),
                    status: "preview",
                    statusText: "未上传"
                };
            });
        },
        beforeUpload() {
            const { onBeforeUpload, filesList } = this;
            if (onBeforeUpload(filesList) && filesList.length) {
                this.loading = true;
                this.startUpload();
            }
        },
        startUpload(index = 0) {
            const { filesList } = this;
            if (index <= filesList.length - 1) {
                this.upload(
                    { file_type: 1, file: filesList[index].file },
                    index
                );
            } else {
                this.uploadEnd();
            }
        },
        uploadSuccess(path, index) {
            const { filesList } = this;
            let obj = filesList[index];
            obj = {
                ...obj,
                path,
                status: "success",
                statusText: "上传完成"
            };
            this.filesList[index] = obj;
            this.startUpload(index + 1);
        },
        uploadError(index) {
            const { filesList } = this;
            let obj = filesList[index];
            obj = {
                ...obj,
                error: true,
                status: "error",
                statusText: "上传失败"
            };
            this.filesList[index] = obj;
            this.startUpload(index + 1);
        },
        uploadEnd() {
            this.loading = false;
            this.btnName = "图片上传";
            this.show = false;
            this.$emit("on-end", this.getFilesList("success"));
            this.$emit("input", this.getFilesList("success")[0].path);
            this.clearFilesList();
        },
        getFilesList(status = "all") {
            const { filesList } = this;
            return status === "all"
                ? filesList
                : filesList.filter(v => v.status === status);
        },
        clearFilesList() {
            this.filesList = [];
        },
        handleChange(e) {
            const files = Array.prototype.slice.call(e.target.files);
            const { multiple } = this;
            const newFiles = this.checkFile(files);

            if (newFiles.length) {
                this.previewPictures(newFiles);
                multiple ? (this.show = multiple) : this.beforeUpload();
            }
            e.target.value = null;
        },
        handleClick() {
            this.$refs.file.click();
        },
        handleRemove(index) {
            this.filesList.splice(index, 1);
        }
    }
};
</script>

<style lang="less">
.upload-file {
    p {
        font-size: 12px;
        color: #969799;
    }
}
.upload-preview-pictures {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    .item {
        position: relative;
        width: 196px;
        height: 110px;
        margin: 6px;
        line-height: 110px;
        border-radius: 4px;
        background-color: pink;
        overflow: hidden;
        &:hover .cover {
            display: block;
        }
        img {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
        .tips {
            position: absolute;
            bottom: -30px;
            width: 100%;
            line-height: 30px;
        }
    }
    .item-wrapper {
        p {
            text-align: center;
        }
    }
    .cover,
    .progress {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        text-align: center;
        background: rgba(0, 0, 0, 0.6);
    }
    .progress,
    .error {
        display: block;
    }
    .error {
        font-size: 16px;
        color: red;
    }
    .cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
    }
    .progress i {
        color: white;
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
}
</style>
