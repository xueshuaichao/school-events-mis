<template>
    <div class="article-figure">
        <RadioGroup
            v-model="params.type"
            @on-change="handleChange"
        >
            <Radio
                v-for="item in mode"
                :key="item.key"
                :label="item.key"
            >
                {{ item.title }}
            </Radio>
        </RadioGroup>
        <div class="upload-wrapper flex-row">
            <div
                v-if="showUploadBtn"
                class="upload-btn"
                @click="handleUpload"
            >
                <Icon
                    type="ios-add"
                    size="30"
                />
                <p>上传图片</p>
                <loading v-model="loading" />
            </div>
            <div class="preview-image flex-row">
                <div
                    v-for="(item, index) in params.images"
                    :key="item"
                    class="image-item"
                >
                    <Icon
                        type="ios-close-circle"
                        color="#FF6849"
                        size="20"
                        @click="handleDelImage(index)"
                    />
                    <img
                        :src="item"
                        alt=""
                    >
                </div>
            </div>
        </div>
        <upload
            v-show="false"
            ref="upload"
            :on-before-upload="onBeforeUpload"
            @on-end="onUploadEnd"
        />
    </div>
</template>
<script>
import Upload from '@/view/components/upload/file/index.vue';
import Loading from '@/view/components/loading/index.vue';

export default {
    name: 'ArticleFigure',
    components: {
        Upload,
        Loading,
    },
    model: {
        prop: 'params',
    },
    props: {
        mode: {
            type: Array,
            default() {
                return [
                    {
                        key: 1,
                        title: '无图',
                        length: 0,
                    },
                    {
                        key: 2,
                        title: '单图',
                        length: 1,
                    },
                    {
                        key: 3,
                        title: '三图',
                        length: 3,
                    },
                ];
            },
        },
        params: {
            type: Object,
            default() {
                return {
                    type: 1,
                    images: [],
                };
            },
        },
    },
    data() {
        return {
            loading: false,
        };
    },
    computed: {
        showUploadBtn() {
            const { type, images } = this.params;
            return (
                type !== 1
                && images.length < this.mode.find(v => v.key === type).length
            );
        },
    },
    watch: {
        params: {
            handler(value) {
                this.$emit('input', value);
            },
            deep: true,
        },
    },
    methods: {
        onBeforeUpload() {
            this.loading = true;
            return true;
        },
        onUploadEnd([{ path }]) {
            this.params.images.push(path);
            this.loading = false;
        },
        handleDelImage(i) {
            this.params.images.splice(i, 1);
        },
        handleUpload() {
            if (!this.loading) {
                this.$refs.upload.handleClick();
            }
        },
        handleChange() {
            this.params.images = [];
        },
    },
};
</script>

<style lang="less">
@import "../../../../less/variables.less";
.article-figure {
    .upload-btn {
        position: relative;
        width: 80px;
        height: 80px;
        margin-top: 16px;
        margin-right: 16px;
        padding-top: 10px;
        text-align: center;
        border: 1px solid @borderColor;
        &:hover {
            cursor: pointer;
        }
        p {
            font-size: 12px;
            color: @fontColor;
        }
    }
    .image-item {
        position: relative;
        width: 120px;
        height: 80px;
        margin-right: 16px;
        margin-top: 16px;
        background-color: pink;
        .ivu-icon {
            position: absolute;
            right: -10px;
            top: -10px;
            &:hover {
                cursor: pointer;
            }
        }
        img {
            max-width: 100%;
            border-radius: 2px;
        }
    }
}
</style>
