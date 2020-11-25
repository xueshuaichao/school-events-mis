<template>
    <div class="upload-video">
        <div class="upload-btn">
            <i-button
                type="primary"
                class="mar-r-10"
                @click="handleClick"
            >
                {{ name }}
            </i-button>
            <slot name="tips">
                <p>不支持大于1G的视频，支持MP4格式视频</p>
            </slot>
        </div>
        <input
            v-show="false"
            ref="file"
            type="file"
            accept="video/*"
            @change="handleChange"
        >
        <div
            v-if="show"
            class="video-info"
        >
            <div class="default-img">
                <img
                    src="../../../../assets/images/upload/video-default.png"
                    alt=""
                >
            </div>
            <div
                v-for="(item, index) in listFiles"
                :key="item.ri"
                class="progress"
            >
                <p class="video-name">
                    {{ item.name }}
                </p>
                <Progress :percent="item.percent">
                    <Icon
                        type="ios-close"
                        class="del"
                        size="26"
                        @click="handleClickDel(index)"
                    />
                </Progress>
                <div class="info">
                    已上传 {{ item.loadedSize }}M/ {{ item.size }}M
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable  */
import api from "@/api/common";
export default {
    name: "Index",
    props: {
        maxSize: {
            type: Number,
            default: 1024 * 1024 * 1024
        }
    },
    data() {
        return {
            show: false,
            name: "上传视频",
            listFiles: [],
            loading: false
        };
    },
    mounted() {},
    methods: {
        createUploader() {
            const self = this;
            let uploader = new AliyunUpload.Vod({
                timeout: 60000,
                partSize: 1048576,
                parallel: 5,
                retryCount: 3,
                retryDuration: 2,
                userId: 1923859927839944,
                addFileSuccess: function() {
                    this.loading = true;
                },
                onUploadstarted: function(uploadInfo) {
                    if (!uploadInfo.videoId) {
                        api.getUploadToken({
                            type: "media",
                            file_name: uploadInfo.file.name
                        }).then(({ data: { result } }) => {
                            let uploadAuth = result.upload_auth;
                            let uploadAddress = result.upload_address;
                            let videoId = result.video_id;
                            uploader.setUploadAuthAndAddress(
                                uploadInfo,
                                uploadAuth,
                                uploadAddress,
                                videoId
                            );
                        });
                    } else {
                        api.updateUploadToken({
                            video_id: uploadInfo.videoId
                        }).then(({ data: { result } }) => {
                            let uploadAuth = result.upload_auth;
                            let uploadAddress = result.upload_address;
                            let videoId = result.video_id;
                            uploader.setUploadAuthAndAddress(
                                uploadInfo,
                                uploadAuth,
                                uploadAddress
                                //videoId,
                            );
                        });
                    }
                },
                onUploadSucceed: function(uploadInfo) {
                    self.uploadSucceed(uploadInfo);
                },
                onUploadFailed: function() {
                    self.uploadFailed();
                },
                onUploadCanceled: function(uploadInfo, code, message) {
                    this.loading = false;
                },
                onUploadProgress: function(
                    uploadInfo,
                    totalSize,
                    loadedPercent
                ) {
                    self.setUploadProgress(
                        uploadInfo.ri,
                        loadedPercent,
                        totalSize
                    );
                },
                onUploadTokenExpired: function(uploadInfo) {
                    api.updateUploadToken({
                        video_id: uploadInfo.videoId
                    }).then(({ data: { result } }) => {
                        let uploadAuth = result.upload_auth;
                        uploader.resumeUploadWithAuth(uploadAuth);
                    });
                },
                onUploadEnd: function() {
                    self.uploadEnd();
                }
            });
            return uploader;
        },
        checkFile({ size }) {
            return new Promise((resolve, reject) => {
                if (size > this.maxSize) {
                    this.$Message.error("视频大小不能超过1G");
                    reject();
                }
                resolve();
            });
        },
        parseData(listFiles) {
            return listFiles.map(v => ({
                ri: v.ri,
                name: v.file.name,
                size: this.byteToM(v.file.size)
            }));
        },
        byteToM(byte) {
            return (byte / (1024 * 1024)).toFixed(2);
        },
        setUploadProgress(ri, loadedPercent) {
            const { listFiles } = this;
            let index = 0;
            let percent = loadedPercent;
            let loadedSize = 0;
            for (let i = 0; i < this.listFiles.length; i++) {
                if (listFiles[i].ri === ri) {
                    index = i;
                }
            }
            loadedSize = (listFiles[index].size * percent).toFixed(2);
            percent = Math.floor(percent * 100);
            this.$set(
                listFiles,
                index,
                Object.assign(listFiles[index], { percent, loadedSize })
            );
        },
        uploadSucceed(info) {
            this.$emit("on-end", info);
        },
        uploadFailed() {
            this.$Message.error("上传失败");
            this.loading = false;
            this.uploader.cleanList();
            this.listFiles = [];
        },
        uploadEnd() {
            this.loading = false;
            this.name = "重新上传";
            this.uploader.cleanList();
        },
        handleClickDel(index) {
            this.uploader.deleteFile(index);
            this.listFiles.splice(index, index + 1);
        },
        handleClick() {
            if (!this.loading) {
                this.$refs.file.click();
            }
        },
        handleChange(e) {
            const fileList = e.target.files;

            if (this.uploader) {
                this.uploader.stopUpload();
            }
            if (!fileList.length) return;
            this.uploader = this.createUploader();
            Array.prototype.slice.call(fileList).forEach(v => {
                this.uploader.addFile(v, null, null, null, '{"Vod":{}}');
            });
            this.checkFile(fileList[0]).then(() => {
                this.listFiles = this.parseData(this.uploader.listFiles());
                this.uploader.startUpload();
                this.loading = true;
                this.show = true;
            });
            e.target.value = null;
        }
    }
};
</script>

<style lang="less">
@import "../../../../less/variables";
.upload-video {
    .upload-btn {
        display: flex;
        flex-flow: row;
        align-items: center;
        p {
            font-size: 12px;
            color: #969799;
        }
    }
    .video-info {
        width: 328px;
        min-height: 242px;
        padding: 24px;
        border-radius: 4px;
        border: 1px solid rgba(237, 238, 240, 1);
        margin-top: 24px;
        .default-img {
            width: 280px;
            height: 158px;
            padding-top: 39px;
            text-align: center;
            background: rgba(242, 246, 252, 1);
            border-radius: 4px;
            img {
                width: 100px;
                height: 78px;
            }
        }
    }
    .video-name {
        margin-top: 16px;
        line-height: 1;
        font-size: 14px;
        color: #626366;
    }
    .progress {
        .info {
            line-height: 1;
            font-size: 12px;
            color: #969799;
        }
        .del {
            color: @grayOne;
            &:hover {
                cursor: pointer;
            }
        }
    }
}
</style>
