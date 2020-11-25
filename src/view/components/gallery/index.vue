<template>
    <div
        v-if="gallerySlides.length"
        class="gallery-wrap"
    >
        <!-- 图集 -->
        <swiper
            ref="swiperTop"
            :options="swiperOptionTop"
            class="gallery-top"
        >
            <swiper-slide
                v-for="(item, index) in gallerySlides"
                :key="index"
            >
                <ossimg
                    class="swiper-lazy"
                    src-type="data-src"
                    :size="size"
                    :src="item"
                    :resize="{ m: 'pad' }"
                />
                <div
                    class="swiper-lazy-preloader swiper-lazy-preloader-white"
                />
            </swiper-slide>
            <div
                slot="button-next"
                class="swiper-button-next swiper-button-white"
            />
            <div
                slot="button-prev"
                class="swiper-button-prev swiper-button-white"
            />
        </swiper>
        <!-- 缩略图 -->
        <swiper
            ref="swiperThumbs"
            :options="swiperOptionThumbs"
            class="gallery-thumbs"
            :style="{
                height: thumbnailSize.h + 'px',
                bottom: thumbnailSize.h + 16 + 'px'
            }"
        >
            <swiper-slide
                v-for="(item, index) in gallerySlides"
                :key="index"
                :style="{
                    width: thumbnailSize.w + 'px',
                    height: thumbnailSize.h + 'px'
                }"
            >
                <ossimg
                    class="swiper-lazy"
                    src-type="data-src"
                    :src="item"
                    :size="thumbnailSize"
                    :resize="{ m: 'pad' }"
                />
                <div
                    class="swiper-lazy-preloader swiper-lazy-preloader-white"
                />
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ossimg from '../ossimg/index.vue';
import './index.less';

export default {
    name: 'Gallery',
    components: {
        swiper,
        swiperSlide,
        ossimg,
    },

    props: {
        gallerySlides: {
            type: Array,
            default() {
                return [];
            },
        },
        size: {
            type: Object,
            default() {
                return {
                    w: 700,
                    h: 400,
                };
            },
        },
        thumbnailSize: {
            type: Object,
            default() {
                return {
                    w: 106,
                    h: 61,
                };
            },
        },
    },
    data() {
        return {
            swiperOptionTop: {
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 2,
                },
            },
            swiperOptionThumbs: {
                spaceBetween: 10,
                freeMode: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                slidesPerView: 'auto',
                centeredSlides: true,
                slideToClickedSlide: true,
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 8,
                },
            },
        };
    },
    watch: {
        gallerySlides: {
            handler(val) {
                if (val.length) {
                    this.$nextTick(() => {
                        const swiperTop = this.$refs.swiperTop.swiper;
                        const swiperThumbs = this.$refs.swiperThumbs.swiper;
                        swiperTop.controller.control = swiperThumbs;
                        swiperThumbs.controller.control = swiperTop;
                    });
                }
            },
            immediate: true,
        },
    },
};
</script>
<style lang="less" scoped>
@import "../../../libs/third-party/swiper.css";
</style>
