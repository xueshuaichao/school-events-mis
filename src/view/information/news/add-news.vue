<template>
    <page-edit>
        <i-button
            slot="backBtn"
            class="btn-prev"
            @click="handleClickBack"
        >
            返回
        </i-button>
        <i-form
            ref="formArticle"
            :label-width="180"
            :model="formArticle"
            :rules="ruleArticle"
        >
            <form-item
                label="问题详情"
                prop="title"
            >
                <i-input
                    v-model="formArticle.title"
                    :maxlength="30"
                    :style="{ width: '260px' }"
                />
            </form-item>
            <form-item
                label="回答者昵称"
                prop="nickname"
            >
                <i-input
                    v-model="formArticle.nickname"
                    :maxlength="30"
                    :style="{ width: '260px' }"
                />
            </form-item>
            <form-item
                label="回答者简介"
                prop="answerer_introduce"
            >
                <i-input
                    v-model="formArticle.answerer_introduce"
                    :maxlength="30"
                    :style="{ width: '260px' }"
                />
            </form-item>
            <form-item
                label="头像"
                prop="image"
            >
                <upload-image
                    v-model="formArticle.image"
                    :file-list="fileList"
                    @onSuccess="handleSuccess"
                    @onRemove="handleRemove"
                />
                <!-- <p :style="{paddingLeft:'100px'}">支持jpg/png格式，大小不超过5M</p> -->
            </form-item>
            <form-item
                label="配图模式"
                prop="img"
            >
                <article-figure v-model="paramsFigure" />
            </form-item>
            <form-item
                label="内容"
                prop="content"
            >
                <wdc-editor
                    v-model="formArticle.content"
                    :settings="settings"
                    @uploadMedia="handleUploadMedia"
                    @transformSrc="transformSrc"
                    @transformSrcResult="handleTransformSrcResult"
                />
            </form-item>
        </i-form>
        <template slot="footer">
            <div class="footer">
                <i-button
                    type="primary"
                    class="mar-r-10"
                    @click="handlePublish('formArticle')"
                >
                    发布
                </i-button>
                <i-button @click="handleClickCancel">
                    取消
                </i-button>
            </div>
        </template>
    </page-edit>
</template>
<script>
import Vue from 'vue';
import { mapMutations } from 'vuex';
import WdcEditor from 'wdc-vue-components/src/components/editor';
import PageEdit from '../../components/page/edit.vue';
import ArticleFigure from '../components/article-figure/index.vue';
import api from '../../../api/information';
import UploadImage from '../../components/upload/image/index.vue';

import '../addArticle.less';

export default {
    name: 'Index',
    components: {
        'page-edit': PageEdit,
        WdcEditor,
        UploadImage,
        ArticleFigure,
    },
    data() {
        return {
            fileList: [],
            formArticle: {
                title: '',
                content: '',
                id: '',
                answerer_introduce: '',
                nickname: '',
                image: '',
                type: 1,
                img: [],
            },
            paramsFigure: {
                type: 1,
                images: [],
            },
            ruleArticle: {
                title: [
                    {
                        required: true,
                        message: '请输入问题详情',
                        trigger: 'blur',
                    },
                ],
                answerer_introduce: [
                    {
                        required: true,
                        message: '请输入回答者简介',
                        trigger: 'blur',
                    },
                ],
                image: [
                    {
                        required: true,
                        message: '请上传头像',
                        trigger: 'blur',
                    },
                ],
                nickname: [
                    {
                        required: true,
                        message: '请输入回答者昵称',
                        trigger: 'blur',
                    },
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                ],
                img: {
                    required: false,
                    trigger: 'blur',
                    validator: (rule, value, cb) => {
                        const {
                            paramsFigure: { type, images },
                        } = this;
                        if (type === 1) {
                            cb();
                        } else if (type === 2 && images.length < 1) {
                            cb(Error('请上传配图'));
                        } else if (type === 3 && images.length < 3) {
                            cb(Error('请上传配图'));
                        } else {
                            this.formArticle.type = type;
                            this.formArticle.img = images;
                            cb();
                        }
                    },
                },
            },
            settings: {
                width: '100%',
                toolbar: `undo redo | fontsizeselect | bold italic underline forecolor backcolor|
                alignleft aligncenter alignright alignjustify | outdent indent |lineheightselect indent2em | removeformat fullscreen |
                image | link unlink | searchreplace code
                     `,
                isTransformSrc: true,
                paste_form_word: 'clean',
            },
            id: '',
        };
    },
    created() {
        if (this.$route.params.id) {
            // 如果是编辑
            this.getDetail(this.$route.params.id);
            this.id = this.$route.params.id;
            // 分两种情况：1. 如果是编辑进来的，进来后要请求数据，点击发布时，也要传相应的id，点击预览返回id
            // 2. 如果是新增进来的，没有id，发布时没有id，预览时生成id，发布时有id，点击返回
        }
    },
    methods: {
        ...mapMutations(['openMainSpin']),
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
        getDetail(id) {
            api.questionDetail({ question_id: id })
                .then(
                    ({
                        data: {
                            title,
                            answerer_introduce: answererIntroduce,
                            image,
                            nickname,
                            content,
                            type,
                            img,
                        },
                    }) => {
                        Vue.set(this.fileList, 0, {
                            url: image,
                        });
                        this.formArticle = {
                            title,
                            answerer_introduce: answererIntroduce,
                            content,
                            image,
                            nickname,
                            type,
                        };
                        this.paramsFigure = {
                            type,
                            images: JSON.parse(img),
                        };
                        this.openMainSpin(false);
                    },
                )
                .catch(this.openMainSpin(false));
        },
        handleSuccess({ name, url }) {
            this.formArticle.image = url;
            Vue.set(this.fileList, 0, {
                name,
                url,
            });
        },
        // 删除已经添加的图片
        handleRemove() {
            this.formArticle.image = '';
            this.fileList = [];
        },
        // 发布
        handlePublish(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.openMainSpin(true);
                    if (this.id) {
                        this.formArticle.question_id = this.id;
                        api.questionUpdate(this.formArticle)
                            .then(() => {
                                this.$router.push({
                                    name: 'news',
                                });
                                this.openMainSpin(false);
                            })
                            .catch(this.openMainSpin(false));
                    } else {
                        api.questionAdd(this.formArticle)
                            .then(() => {
                                this.$router.push({
                                    name: 'news',
                                });
                                this.openMainSpin(false);
                            })
                            .catch(this.openMainSpin(false));
                    }
                }
            });
        },
        handleClickCancel() {
            this.$router.push({
                name: 'news',
            });
        },
        handleClickBack() {
            this.$router.push({
                name: 'news',
            });
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
        transformSrc(data, callback, errorCallback) {
            api.fileGetcontent(data)
                .then(({ data }) => {
                    callback({
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
