<template>
    <modal
        v-model="show"
        title="网络证书"
        width="1008"
    >
        <div class="certificate-wrapper">
            <div id="certificate">
                <div class="content">
                    <div class="header">
                        <img
                            class="title"
                            src="../../../assets/images/events/title.png"
                            alt="网络记录证书"
                        >
                    </div>
                    <div class="body">
                        <div class="name">
                            <b class="text-decoration">
                                {{ info.school_name }}
                            </b>
                            学校
                            <b class="text-decoration">
                                {{ info.create_name }}
                            </b>
                            同学:
                        </div>
                        <div class="info">
                            于
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ time.year }}
                            </b>
                            年
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ time.month }}
                            </b>
                            月
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ time.day }} </b>日参加青少年“爱挑战”网络竞赛
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ info.category_name }}
                            </b>
                            项目，成绩为
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ info.achievement }}
                                {{ info.achievement_unit }} </b>，创造了
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ TYPE_NAME[info.group_type] }}
                            </b>
                            组
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ info.recoed_name }}
                            </b>
                            纪录，特发此证！该纪录由认证官
                            <b
                                class="text-decoration"
                                style="padding: 0 10px"
                            >
                                {{ info.attestation_name }} </b>现场验证。
                        </div>
                        <div class="body-time">
                            截至
                            <b class="text-decoration">
                                {{ time.year }}
                            </b>
                            年
                            <b class="text-decoration">
                                {{ time.month }}
                            </b>
                            月
                            <b class="text-decoration">
                                {{ time.day }}
                            </b>
                            日
                            <b class="text-decoration">
                                {{ time.hours }}
                            </b>
                            时
                            <b class="text-decoration">
                                {{ time.minutes }}
                            </b>
                            分， 该记录目前尚未打破。
                        </div>
                    </div>
                    <div class="footer">
                        <div class="seal-wrapper">
                            <img
                                src="../../../assets/images/events/seal.png"
                                alt=""
                            >
                            <p>第二届青少年“爱挑战”活动组委会（盖章）</p>
                        </div>
                        <div class="sign">
                            <p>
                                指导老师：<b>{{ info.teacher }}</b>
                            </p>
                            <p>
                                认证官：<b> {{ info.attestation_name }} </b>
                            </p>
                            <p>
                                <b> {{ time.year }} </b>年
                                <b> {{ time.month }} </b>月
                                <b> {{ time.day }} </b>日
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template slot="footer">
            <i-button
                type="primary"
                :loading="loading"
                style="width: 120px"
                @click="handleClickDownload"
            >
                下载证书
            </i-button>
        </template>
    </modal>
</template>

<script>
import html2canvas from '@/libs/third-party/html2canvas.esm';
import { getCurrentTime } from '@/libs/utils';

const RECORD_SET = ['校内', '市内', '省内'];
const TYPE_NAME = {
    1: '1-3年级',
    2: '4-6年级',
    3: '7-9年级',
    4: '高一-高三',
};

export default {
    name: 'Certificate',
    data() {
        return {
            show: false,
            info: {},
            time: getCurrentTime(),
            loading: false,
            TYPE_NAME,
        };
    },
    methods: {
        handleShow(data) {
            this.info = {
                ...data,
                recoed_name: RECORD_SET[data.record - 1],
            };
            this.show = true;
        },
        handleClickDownload() {
            this.loading = true;
            html2canvas(document.querySelector('.certificate-wrapper'), {
                backgroundColor: null,
            }).then((canvas) => {
                this.loading = false;
                this.$download(canvas.toDataURL(), '网络记录证书');
            });
        },
    },
};
</script>
