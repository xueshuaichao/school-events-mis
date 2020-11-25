<template>
    <editor
        id="tinymce"
        v-model="value"
        :init="init"
    />
</template>
<script>
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/tinymce';
import 'tinymce/themes/silver';

export default {
    name: 'PageEdit',
    components: {
        Editor,
    },
    data() {
        return {
            init: {
                language: 'zh_CN', // 语言
                language_url: '/third-party/tinymce/langs/zh_CN.js', // 语言包的路径
                content_css: '/third-party/tinymce/content/content.min.css', // content css 路径
                skin_url: '/third-party/tinymce/skin/', // skin路径
                height: 300, // 编辑器高度
                branding: false, // 是否禁用“Powered by TinyMCE”
                menubar: true, // 顶部菜单栏显示
            },
            value: '',
        };
    },
};
</script>
