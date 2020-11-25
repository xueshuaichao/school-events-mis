<template>
    <img
        v-if="lazyLoad"
        v-lazy="imgSrc"
        :alt="alt"
    >
    <img
        v-else
        :[srcType]="imgSrc"
        :alt="alt"
    >
</template>
<script>
export default {
    name: 'OssImg',
    props: {
        srcType: {
            type: String,
            default: 'src',
        },
        lazyLoad: {
            type: Boolean,
            default: false,
        },
        src: {
            type: String,
            required: true,
        },
        size: {
            type: Object,
            default() {
                return {};
            },
        },
        resize: {
            type: Object,
            default() {
                return {};
            },
        },
        interlace: {
            type: Number,
            default: 1,
        },
        quality: {
            type: Number,
            default: 80,
        },
        format: {
            type: String,
            default: 'jpg',
        },
        circle: {
            type: Number,
        },
        watermark: {
            type: Object,
            default() {
                return {};
            },
        },
        alt: {
            type: [Boolean, String],
            default: false,
        },
        other: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            setting: '',
        };
    },
    computed: {
        imgSrc() {
            return `${this.src}${this.setting}`;
        },
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            let size = '';
            let resize = '';
            let watermark = '';
            let format = '';
            let other = '';

            // 渐进显示 质量 内切圆
            const interlace = this.format === 'jpg' ? `/interlace,${this.interlace}` : '';
            const quality = `/quality,Q_${this.quality}`;
            const circle = this.circle ? `/circle,r_${this.circle}` : '';

            // 缩放
            const ratio = window.devicePixelRatio;
            size = Object.keys(this.size)
                .map(key => `${key}_${Math.floor(this.size[key] * ratio)}`)
                .join(',');

            resize = Object.keys(this.resize)
                .map(key => `${key}_${this.resize[key]}`)
                .join(',');
            if (resize || size) {
                resize = `/resize,${resize && size ? `${resize},` : ''}${size}`;
            }
            // 水印
            if (this.watermark.image) {
                Object.keys(this.watermark).forEach((key) => {
                    watermark += `${key}_${this.watermark[key]},`;
                });
                watermark = `/watermark,image_${this.watermark.image},${watermark}`;
            }
            // 格式
            if (
                document
                    .createElement('canvas')
                    .toDataURL('image/webp')
                    .indexOf('data:image/webp') === 0
            ) {
                format = '/format,webp';
            } else {
                format = `/format,${this.format}`;
            }
            other = this.other !== '' ? `,${other}` : '';
            this.setting = `?x-oss-process=image${format}${interlace}${quality}${circle}${watermark}${resize}${other}`;
        },
    },
};
</script>
