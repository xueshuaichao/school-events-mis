<!--suppress ALL -->
<template>
    <page-edit :footer="false">
        <Card dis-hover>
            <div class="school-info">
                <div class="school-info-image">
                    <w-video
                        v-if="options"
                        :options="options"
                    />
                </div>
                <div class="school-info-content examine-info mar-l-24">
                    <p>
                        <span>视频名称：</span><span>{{ data.resource_name }}</span>
                    </p>
                    <p>
                        <span>视频分类：</span><span>{{ data.category_name || "暂无" }}</span>
                    </p>
                    <p>
                        <span>上传时间：</span><span>{{ data.created_at || "暂无" }}</span>
                    </p>
                    <p>
                        <span>作品简介：</span><span>{{ data.introduce || "暂无" }}</span>
                    </p>
                    <p>
                        <span>封面图：</span>
                        <img
                            :src="data.video_img_url"
                            alt=""
                            width="160"
                            height="90"
                            :style="{ 'vertical-align': 'top' }"
                        >
                    </p>
                    <div class="footer">
                        <i-button
                            type="error"
                            class="mar-r-10"
                            @click="handleAccount"
                        >
                            封禁用户
                        </i-button>
                    </div>
                </div>
            </div>
        </Card>
        <h3 class="examine-title">
            举报记录
        </h3>
        <div class="school-info-content examine-info">
            <p>
                <span>举报分类：</span><span>{{ data.cat_name }}</span>
            </p>
            <p>
                <span>举报描述：</span><span>{{ data.content }}</span>
            </p>
            <p class="report-images">
                <span>证明材料：</span>
                <template v-if="data.attachment_img">
                    <img
                        v-for="item in data.attachment_img"
                        :key="item"
                        :src="item"
                        alt=""
                    >
                </template>
                <template v-else>
                    <span>暂无</span>
                </template>
            </p>
        </div>
    </page-edit>
</template>
<script>
import { mapMutations } from 'vuex';
import '../../events/components/school-detail.less';
import PageEdit from '@/view/components/page/edit.vue';
import api from '@/api/information';
import Video from '@/view/components/video/index.vue';
import mixin from '../mixins';

export default {
    name: 'Index',
    components: {
        'page-edit': PageEdit,
        'w-video': Video,
    },
    mixins: [mixin],
    data() {
        return {
            data: {},
            resource_name: 'spring',
            options: null,
        };
    },
    created() {
        this.getDetail();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getDetail() {
            this.openMainSpin(true);

            api.getInformInfo({ id: this.$route.params.id })
                .then(({ data }) => {
                    const info = data;
                    const source = JSON.stringify({
                        FD: info.cloud_path_fd,
                    });
                    this.options = {
                        source,
                        cover: info.video_img_url,
                    };

                    info.cat_name = this.getReportCategoryNames(data.cat_id);
                    this.data = { ...info };
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        updateAccountStatus() {
            this.openMainSpin(true);

            api.closeAccount({ user_id: this.$route.params.user })
                .then(() => {
                    this.$Message.success('封禁成功');
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleAccount() {
            this.$Modal.confirm({
                title: '封禁用户',
                content: '是否确认封禁该用户?',
                onOk: () => {
                    this.updateAccountStatus();
                },
            });
        },
    },
};
</script>

<style lang="less">
.examine-title {
    margin-top: 16px;
    margin-bottom: 24px;
}
.examine-info {
    margin-left: 0;
    .footer {
        margin-bottom: 24px;
    }
}
.school-info-image {
    .categpry-name {
        font-size: 20px;
        margin-top: 16px;
    }
}
.examine-info p > span:first-child {
    width: 110px;
    font-weight: normal;
    flex-shrink: 0;
}
.report-images {
    img {
        width: 100px;
        height: 60px;
        margin-right: 8px;
        border-radius: 4px;
    }
}
</style>
