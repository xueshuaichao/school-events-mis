<template>
    <wdc-editor
        v-model="content"
        :settings="config"
        @uploadMedia="handleUploadMedia"
        @transformSrc="handleTransformSrc"
        @transformSrcResult="handleTransformSrcResult"
    />
</template>

<script>
import WdcEditor from 'wdc-vue-components/src/components/editor';
import api from '@/api/information';

export default {
    name: 'Index',
    components: {
        WdcEditor,
    },
    props: {
        value: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            config: {
                width: '100%',
                toolbar: `undo redo | fontsizeselect | bold italic underline forecolor backcolor|
                alignleft aligncenter alignright alignjustify | outdent indent |lineheightselect indent2em | removeformat fullscreen |
                image | link unlink | searchreplace code
                     `,
                isTransformSrc: true,
                paste_form_word: 'clean',
            },
            content: this.value,
        };
    },
    watch: {
        content(data) {
            this.$emit('input', data);
        },
        value(data) {
            this.content = data;
        },
    },
    methods: {
        handleTransformSrcResult(msg) {
            if (msg.success !== 0 && msg.fail !== 0) {
                this.$Message.error(
                    `图片上传成功${msg.success}个，上传失败${msg.fail}个`,
                );
            } else if (msg.success !== 0 && msg.fail === 0) {
                this.$Message.success(`图片上传成功${msg.success}个`);
            } else if (msg.success === 0 && msg.fail !== 0) {
                this.$Message.error(`图片上传失败${msg.fail}个`);
            }
        },
        handleUploadMedia(data, type, callback) {
            api.fileUpload({
                file: data,
                file_type: '1',
            })
                .then(({ data }) => {
                    callback({
                        url: data.path,
                        title: '',
                    });
                    this.$Message.success('上传成功');
                })
                .catch(() => {
                    this.$Message.error('上传失败');
                });
        },
        handleTransformSrc(data, successCallback, errorCallback) {
            api.fileGetcontent(data)
                .then(({ data }) => {
                    successCallback({
                        url: data.path,
                    });
                })
                .catch(() => {
                    errorCallback();
                });
        },
    },
};
</script>

<style scoped></style>
