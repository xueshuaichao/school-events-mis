<template>
    <div class="semis-editor">
        <div :id="id" />
    </div>
</template>
<script>
import '../../../../public/third-party/ueditor/ueditor.config';
import '../../../../public/third-party/ueditor/ueditor.all';
import '../../../../public/third-party/ueditor/lang/zh-cn/zh-cn';
import '../../../../public/third-party/ueditor/ueditor.parse';
import '../../../../public/third-party/ueditor/dialogs/xiumi/xiumi';
import './index.less';

export default {
    name: 'Editor',
    props: {
        value: {
            type: String,
            default: '',
        },
        config: {
            type: Object,
            required: false,
        },
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showModal: false,
            rawHTML: '',
            editor: null,
            ready: false,
        };
    },
    watch: {
        value() {
            if (this.ready) {
                this.editor.setContent(this.value);
            }
        },
    },
    mounted() {
        this.editor = window.UE.getEditor(this.id, this.config);
        this.editor.ready(() => {
            this.ready = true;
            this.editor.setContent(this.value);
        });
    },

    destroyed() {
        this.editor.destroy();
    },

    methods: {
        getUEContent() {
            return this.editor
                .getContent()
                .replace(/http:\/\/statics.xiumi.us/gi, '//statics.xiumi.us');
        },
        getUEContentTxt() {
            return this.editor.getContentTxt();
        },
        preview() {
            this.rawHTML = this.editor.getContent();
            this.showModal = true;
        },
    },
};
</script>
