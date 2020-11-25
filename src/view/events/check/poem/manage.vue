<template>
    <page-list
        class="poem-manage"
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        @btn-click="handleAction"
        @page-change="getPoemList"
    >
        <template>
            <template slot="page-header">
                <div>
                    <div class="top-btn">
                        <i-button
                            type="default"
                            @click="$router.back()"
                        >
                            返回
                        </i-button>
                        <i-button
                            type="primary"
                            @click="handleAction({ name: 'add' })"
                        >
                            单个添加
                        </i-button>
                        <i-button
                            type="primary"
                            @click="handleAction({ name: 'import' })"
                        >
                            批量导入
                        </i-button>
                    </div>
                    <div>
                        <i-form :label-width="80">
                            <form-item label="诗词名称">
                                <i-input
                                    v-model="params.title"
                                    placeholder="请输入诗词名称"
                                    clearable
                                />
                            </form-item>
                            <form-item label="诗人">
                                <i-input
                                    v-model="params.author"
                                    placeholder="请输入诗人姓名"
                                    clearable
                                />
                            </form-item>
                            <form-item label="朝代">
                                <i-input
                                    v-model="params.dynasty"
                                    placeholder="请输入朝代"
                                    clearable
                                />
                            </form-item>
                            <form-item label="诗词等级">
                                <Select
                                    v-model="params.type"
                                    placeholder="请选择诗词等级"
                                >
                                    <Option
                                        :key="-1"
                                        :value="-1"
                                    >
                                        全部
                                    </Option>
                                    <Option
                                        v-for="item in status"
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </form-item>
                            <i-button
                                type="primary"
                                @click="getPoemList(1)"
                            >
                                查询
                            </i-button>
                            <i-button @click="handleReset">
                                重置
                            </i-button>
                        </i-form>
                    </div>
                </div>
            </template>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import api from '@/api/poem';

export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            isModalShow: false,
            status: [
                {
                    name: '容易',
                    id: '0',
                },
                {
                    name: '一般',
                    id: '1',
                },
                {
                    name: '困难',
                    id: '2',
                },
            ],
            btnList: [
                {
                    name: 'edit',
                },
                {
                    name: 'delete',
                },
            ],
            giftTypeList: [],
            total: 0,
            list: [],
            error: false,
            giftInfo: {
                add: 0,
            },
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '诗词名称',
                    key: 'title',
                    align: 'center',
                },
                {
                    title: '朝代',
                    key: 'dynasty',
                    align: 'center',
                },
                {
                    title: '诗人',
                    key: 'author',
                    align: 'center',
                },
                {
                    title: '诗词内容',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        return h(
                            'span',
                            {
                                class: 'content-holder',
                            },
                            params.row.content,
                        );
                    },
                },
                {
                    title: '注解',
                    key: 'annotate',
                    align: 'center',
                },
                {
                    title: '展示方式',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const typeToText = {
                            0: '居中',
                            1: '居左',
                        };
                        return h(
                            'span',
                            {},
                            typeToText[params.row.display_type],
                        );
                    },
                },
                {
                    title: '诗词等级',
                    align: 'center',
                    // eslint-disable-next-line arrow-body-style
                    render: (h, params) => {
                        const typeToText = {
                            0: '容易',
                            1: '一般',
                            2: '困难',
                        };
                        return h('span', {}, typeToText[params.row.type]);
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: '240',
                    align: 'center',
                },
            ],
            params: {
                page_num: 1,
                page_size: 10,
                title: '',
                dynasty: '',
                author: '',
                theme_id: this.$route.params.id,
            },

            uploadImgStatus: {
                image: '',
            },
            rules: {
                detail: {
                    required: true,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        const { image } = this.form;

                        if (image) {
                            callback();
                        } else {
                            callback('请上传直播封面');
                        }
                    },
                },
            },
            form: {
                image:
                    'http://img3.imgtn.bdimg.com/it/u=2688606261,2573311828&fm=26&gp=0.jpg',
                name: '',
                unit: '',
                capacity: 0,
                is_virtual: false,
                draw_id: this.$route.params.id,
            },
            raffleInfo: {},
        };
    },
    created() {
        this.getPoemList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getPoemList(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api.poemList(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleConfirmModal(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除该诗词吗',
                onOk: () => {
                    api.delPoem({
                        id,
                    }).then(() => {
                        this.$Message.success('删除成功！');
                        this.getPoemList(this.form.page_num);
                    });
                },
            });
        },
        handleAction({ name }, params) {
            switch (name) {
                case 'edit':
                    this.$router.push(
                        `/check/poem/edit/${this.$route.params.id}/${params.id}`,
                    );
                    break;
                case 'delete':
                    this.handleConfirmModal(params.id);
                    break;
                case 'import':
                    this.$router.push(
                        `/check/poem/import/${this.$route.params.id}`,
                    );
                    break;
                case 'add':
                    this.$router.push(
                        `/check/poem/edit/${this.$route.params.id}/add`,
                    );
                    break;
                case 'detail':
                    this.$router.push(`/present/detail/${params.id}`);
                    break;
                default:
                    break;
            }
        },
        handleCancel() {
            this.isModalShow = false;
        },
        handleReset() {
            const { params } = this;
            this.params = {
                ...params,
                title: '',
                dynasty: '',
                author: '',
                type: 0,
            };
            this.getPoemList();
        },
        uploadFile(img) {
            this.$refs.file.handleClick();
            this.currentUploadImg = img;
        },
        onBeforeUpload() {
            this.currentUploadingImg = this.currentUploadImg;
            this.uploadImgStatus[this.currentUploadImg] = true;
            return true;
        },
        onUploadEnd([{ path }]) {
            this.form[this.currentUploadingImg] = path;
        },
        handleDelete(info) {
            this.form[info] = '';
            this.uploadImgStatus[info] = false;
        },
    },
};
</script>

<style lang="less">
.poem-manage {
    .page-header {
        display: flex;
        flex-flow: row;
        justify-content: space-between;

        .top-btn {
            margin-bottom: 24px;
        }
    }
    .ivu-form {
        display: flex;
        flex-flow: row wrap;
    }
    .ivu-form-item {
        margin-bottom: 24px;
        margin-right: 24px;
    }
    .ivu-tabs {
        width: 100%;
    }
    .common-list-search {
        width: 100%;
    }
    .ivu-input-wrapper,
    .ivu-select {
        width: 240px;
    }

    .content-holder {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>
