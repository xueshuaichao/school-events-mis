<template>
    <page-list
        :page-params="{
            total,
            page_size: params.page_size,
            page_num: params.page_num
        }"
        :hide-page-hide="false"
        @page-change="getImagesList"
    >
        <template slot="header-btn">
            <file
                name="图片上传"
                class="pictures-upload"
                :max-size="5 * 1024 * 1024"
                :multiple="true"
                @on-end="onUploadEnd"
            >
                <p
                    slot="tips"
                    class="tips"
                >
                    上传的图片建议尺寸680*396，大小不超过5M
                </p>
            </file>
        </template>
        <template slot="header-search-bar">
            <i-input
                v-model="params.image_name"
                placeholder="请输入图片名称"
                clearable
                @on-enter="getImagesList(1)"
                @on-clear="getImagesList(1)"
            />
            <i-button
                class="mar-l-24"
                @click.native="getImagesList(1)"
            >
                搜索
            </i-button>
        </template>
        <template slot="table">
            <div class="pictures-wrapper">
                <div
                    v-for="item in list"
                    :key="item.id"
                    class="pictures-item"
                >
                    <img
                        :src="item.thumbnail_image_url"
                        alt=""
                    >
                    <p>{{ item.image_name }}</p>
                    <Icon
                        type="ios-close-circle"
                        color="#FF6849"
                        size="20"
                        @click="handleDeleteAction(item.id)"
                    />
                </div>
            </div>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import file from '@/view/components/upload/file/index.vue';
import api from '@/api/information';
import './addArticle.less';

export default {
    name: 'Index',
    components: {
        'page-list': PageList,
        file,
    },
    data() {
        return {
            list: [],
            total: 0,
            params: {
                page_num: 1,
                page_size: 20,
                image_name: '',
            },
        };
    },
    created() {
        this.getImagesList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getImagesList(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api.getImagesList(this.params)
                .then(({ data: { list, count } }) => {
                    this.list = list;
                    this.total = count;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        addImages(data) {
            api.addImages(data).then(() => {
                this.$Message.success('上传成功');
                this.getImagesList(1);
            });
        },
        deleteImages(id) {
            this.openMainSpin(true);
            api.deleteImages({ image_id: id })
                .then(() => {
                    this.$Message.success('删除成功');
                    this.getImagesList(1);
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        onUploadEnd(data) {
            const params = {};
            params.images = data.map(v => ({
                image_name: v.name,
                image_url: v.path,
            }));
            this.addImages(params);
        },
        handleDeleteAction(id) {
            this.$Modal.confirm({
                title: '删除提示',
                content: '<p>删除后数据将无法恢复，是否确认删除？</p>',
                onOk: () => {
                    this.deleteImages(id);
                },
            });
        },
    },
};
</script>
