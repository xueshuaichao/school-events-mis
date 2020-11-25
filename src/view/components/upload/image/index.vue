<template>
    <div>
        <template v-if="this.$route.name === 'addNews'">
            <Upload
                :show-upload-list="false"
                :before-upload="handleBeforeUpload"
                accept="image/*"
                action
                style="display: inline-block;width:58px;position:relative;top:-11px;vertical-align: top;"
            >
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Button :loading="loading">
                        上传头像
                    </Button>
                </div>
            </Upload>
            <div
                v-for="item in fileList"
                :key="item.url"
                class="demo-upload-list"
            >
                <template>
                    <img :src="fileList[0].url">
                    <div class="demo-upload-list-cover">
                        <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemove"
                        />
                    </div>
                </template>
            </div>
        </template>
        <Upload
            v-else
            :before-upload="handleBeforeUpload"
            :default-file-list="fileList"
            :on-remove="handleRemove"
            :accept="accept"
            action
        >
            <Button :loading="loading">
                上传图片
            </Button>
        </Upload>
    </div>
</template>

<script>
import api from '@/api/information';

export default {
    name: 'Index',
    props: {
        fileList: Array,
    },
    data() {
        return {
            maxSize: 5 * 1024 * 1024,
            accept: 'image/jpeg,image/jpg,image/png',
            loading: false,
        };
    },
    created() {},
    methods: {
        // 手动上传图片
        handleBeforeUpload(data) {
            this.checkFile(data).then(() => {
                this.uploadImage(data);
            });
            return false;
        },
        handleRemove() {
            this.$emit('onRemove');
        },
        checkFile(data) {
            return new Promise((resolve, reject) => {
                if (data.size > this.maxSize) {
                    this.$Message.error('请上传合适大小的图片');
                    reject();
                } else if (!data.type.startsWith('image')) {
                    this.$Message.error('图片格式不正确');
                    reject();
                } else {
                    resolve();
                }
            });
        },
        // 上传图片函数
        uploadImage(file) {
            this.loading = true;
            api.fileUpload({
                file,
                file_type: '1',
            })
                .then(({ data }) => {
                    this.loading = false;
                    this.$emit('onSuccess', {
                        name: file.name,
                        url: data.path,
                    });
                    this.$Message.success('上传成功');
                })
                .catch(() => {
                    this.loading = false;
                    this.$Message.error('上传失败');
                });
        },
    },
};
</script>

<style>
.demo-upload-list {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
    margin-left: 50px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
