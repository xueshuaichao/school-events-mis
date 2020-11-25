<template>
    <div>
        <div
            id="J_prismPlayer"
            class="prism-player"
        />
    </div>
</template>

<script>
/* eslint-disable */

export default {
    name: "Index",
    props: {
        options: {
            type: Object,
            default() {
                return {
                    source:
                        "https://aitiaozhan.oss-cn-beijing.aliyuncs.com/videos/2.mp4",
                    cover:
                        "http://open-storage-wd-dev.oss-cn-beijing.aliyuncs.com/12000/school_events/2019-09-17/image/30/65ba0a43b8672c63b2870d1630b52e59.jpg"
                };
            }
        }
    },
    watch: {
        options(val) {
            if (val) {
                this.initPlayer();
            }
        }
    },
    mounted() {
        this.initPlayer();
    },
    methods: {
        initPlayer() {
            const { source, cover } = this.options;
            const player = new Aliplayer(
                {
                    id: "J_prismPlayer",
                    source,
                    autoplay: false,
                    width: "100%",
                    height: "400px",
                    cover,
                    skinLayout: [
                        {
                            name: "bigPlayButton",
                            align: "cc",
                            x: 0,
                            y: 0
                        },
                        {
                            name: "controlBar",
                            align: "blabs",
                            x: 0,
                            y: 0,
                            children: [
                                {
                                    name: "progress",
                                    align: "blabs",
                                    x: 0,
                                    y: 44
                                },
                                {
                                    name: "playButton",
                                    align: "tl",
                                    x: 15,
                                    y: 12
                                },
                                {
                                    name: "timeDisplay",
                                    align: "tl",
                                    x: 10,
                                    y: 7
                                },
                                {
                                    name: "fullScreenButton",
                                    align: "tr",
                                    x: 10,
                                    y: 12
                                },
                                {
                                    name: "volume",
                                    align: "tr",
                                    x: 5,
                                    y: 10
                                }
                            ]
                        }
                    ]
                },
                player => {
                    console.log("播放器创建了", player);
                }
            );
        }
    }
};
</script>

<style scoped></style>
