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
                label="文章标题"
                prop="title"
            >
                <i-input
                    v-model="formArticle.title"
                    :maxlength="30"
                    :style="{ width: '260px' }"
                />
            </form-item>
            <form-item
                label="文章栏目"
                prop="column"
            >
                <i-select
                    v-model="formArticle.column"
                    :style="{ width: '260px' }"
                    placeholder="栏目"
                    class="common-list-name"
                    clearable
                >
                    <i-option
                        v-for="selectColumn in selectColumns"
                        :key="selectColumn.id"
                        :value="selectColumn.id"
                    >
                        {{ selectColumn.column_name }}
                    </i-option>
                </i-select>
            </form-item>
            <form-item
                v-if="formArticle.column !== '7'"
                label="文章标签"
                prop="mark"
            >
                <i-input
                    v-model="formArticle.mark"
                    :maxlength="10"
                    :style="{ width: '260px' }"
                />
            </form-item>
            <form-item
                v-if="formArticle.column === '7'"
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
                    @transformSrc="handleTransformSrc"
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
                <i-button
                    type="info"
                    class="mar-r-10"
                    ghost
                    @click="handlePreview('formArticle')"
                >
                    预览
                </i-button>

                <i-button @click="handleClickCancel">
                    取消
                </i-button>
            </div>
        </template>
    </page-edit>
</template>
<script>
import { mapMutations } from 'vuex';
import WdcEditor from 'wdc-vue-components/src/components/editor';
import PageEdit from '../components/page/edit.vue';
import ArticleFigure from './components/article-figure/index.vue';
import api from '../../api/information';
import './addArticle.less';

export default {
    name: 'Index',
    components: {
        PageEdit,
        WdcEditor,
        ArticleFigure,
    },
    data() {
        return {
            formArticle: {
                title: '',
                column: '',
                content: '',
                mark: '',
                type: 1,
                img: '',
                id: '',
            },
            paramsFigure: {
                type: 1,
                images: [],
            },
            ruleArticle: {
                title: [
                    {
                        required: true,
                        message: '请输入文章标题',
                        trigger: 'blur',
                    },
                ],
                column: [
                    {
                        required: true,
                        message: '请输入栏目',
                        trigger: 'blur',
                    },
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                ],
                mark: [
                    {
                        required: true,
                        message: '请输入文章标签',
                        trigger: 'blur',
                    },
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
            selectColumns: [],
            id: '',
            flag: true,
        };
    },
    created() {
        this.getColumnList();
        // 如果是从预览页面进来
        if (this.$route.params.from) {
            this.formArticle = this.$store.state.app.articleList;
            this.id = this.$store.state.app.articleList.id;
        } else if (this.$route.params.id) {
            // 如果是编辑
            this.getDetail(this.$route.params.id);
            this.id = this.$route.params.id;
            // 分两种情况：1. 如果是编辑进来的，进来后要请求数据，点击发布时，也要传相应的id，点击预览返回id
            // 2. 如果是新增进来的，没有id，发布时没有id，预览时生成id，发布时有id，点击返回
        }
    },
    methods: {
        ...mapMutations(['openMainSpin', 'setArticle']),
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
            api.articleGetinfo({ id })
                .then(
                    ({
                        data: {
                            title, column, content, mark, img, type,
                        },
                    }) => {
                        this.formArticle = {
                            title,
                            column: column.toString(),
                            content,
                            mark,
                            type,
                        };
                        this.paramsFigure = {
                            type,
                            images: img,
                        };
                        this.openMainSpin(false);
                    },
                )
                .catch(this.openMainSpin(false));
        },
        getColumnList() {
            this.openMainSpin(true);
            api.columnList()
                .then(({ data: { list } }) => {
                    this.selectColumns = list;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        // 发布
        handlePublish(name) {
            this.$refs[name].validate((valid) => {
                if (valid && this.flag) {
                    this.openMainSpin(true);
                    this.formArticle.id = this.id;
                    this.flag = false;
                    api.articleSave(this.formArticle)
                        .then(() => {
                            this.$router.push({
                                name: 'articleManage',
                            });
                            this.openMainSpin(false);
                        })
                        .catch(this.openMainSpin(false));
                }
            });
        },
        // 预览
        handlePreview(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.openMainSpin(true);
                    this.formArticle.id = this.id;
                    api.articlePreview(this.formArticle)
                        .then(({ data: { url, id } }) => {
                            this.formArticle.id = id;
                            this.setArticle(this.formArticle);
                            window.open(url);
                            this.openMainSpin(false);
                        })
                        .catch(this.openMainSpin(false));
                }
            });
        },
        handleClickCancel() {
            api.articleRemove({
                id: this.id,
            })
                .then(() => {
                    this.$router.push({
                        name: 'articleManage',
                    });
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleClickBack() {
            this.$router.push({
                name: 'articleManage',
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
