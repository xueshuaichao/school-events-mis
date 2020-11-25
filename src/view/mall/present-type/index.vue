<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-page-hide="false"
        @btn-click="handleAction"
    >
        <template slot="header-btn">
            <i-button
                type="primary"
                class="mar-b-24"
                @click="handleSortModal('addType')"
            >
                添加分类
            </i-button>
        </template>
        <sort
            ref="sort"
            @on-save="updateSort"
        />
        <sort
            ref="addType"
            :info="info"
            @on-save="addType"
        />
        <modal
            ref="edit"
            @on-save="updateType"
        >
            <template slot="content">
                <div class="item">
                    <div class="label">
                        分类ID:
                    </div>
                    <div class="value">
                        {{ giftTypeInfo.show_id }}
                    </div>
                </div>
                <div class="item">
                    <div class="label">
                        分类名称:
                    </div>
                    <div class="value">
                        <i-input
                            v-model="giftTypeInfo.name"
                            :maxlength="10"
                            placeholder="请输入礼品分类名称"
                        />
                    </div>
                </div>
                <div class="item">
                    <div class="label">
                        创建人:
                    </div>
                    <div class="value">
                        {{ giftTypeInfo.creater }}
                    </div>
                </div>
                <div class="item">
                    <div class="label">
                        创建时间:
                    </div>
                    <div class="value">
                        {{ giftTypeInfo.create_time }}
                    </div>
                </div>
            </template>
        </modal>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import Sort from '@/view/components/sort/index.vue';
import Modal from '@/view/components/modal/index.vue';
import api from '@/api/mall';
import './index.less';

export default {
    name: 'Index',
    components: {
        'page-list': PageList,
        Sort,
        Modal,
    },
    data() {
        return {
            show: false,
            btnList: [
                {
                    name: 'sort',
                },
                {
                    name: 'edit',
                },
                {
                    name: 'delete',
                },
            ],
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '权重',
                    key: 'sort',
                    align: 'center',
                },
                {
                    title: '分类ID',
                    key: 'show_id',
                    align: 'center',
                },
                {
                    title: '分类名称',
                    key: 'type_name',
                    align: 'center',
                },
                {
                    title: '创建人',
                    key: 'creater',
                    align: 'center',
                },
                {
                    title: '创建时间',
                    key: 'created_at',
                    align: 'center',
                },
                {
                    title: '操作',
                    width: '200',
                    slot: 'action',
                    align: 'center',
                },
            ],
            params: {
                page_size: 10,
                page_num: 1,
            },
            info: {
                title: '添加分类',
                tips: '分类名称',
                placeholder: '请输入礼品分类名称',
                type: 'text',
                maxlength: 10,
            },
            giftTypeInfo: {},
            total: 0,
            list: [],
        };
    },
    created() {
        this.getGiftTypeList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getGiftTypeList(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api.getGiftTypeList(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        deleteGiftType(id) {
            api.deleteGiftType({ id }).then(() => {
                this.$Message.success('分类删除成功');
                this.getGiftTypeList();
            });
        },
        updateSort(sort, { id }) {
            if (!sort) {
                this.$Message.error('请输入序号');
                return;
            }
            this.$refs.sort.hideModal();
            api.updateGiftTypeSort({ sort, id }).then(() => {
                this.handleSortSuccess();
            });
        },
        addType(name, id) {
            if (!name.trim()) {
                this.$Message.error('请输入分类名称');
                return;
            }
            this.$refs.addType.hideModal();
            this.$refs.edit.handleHide();
            api.addGiftType({ name, id }).then(() => {
                this.$Message.success(`分类${id ? '名称修改' : '创建'}成功`);
                this.getGiftTypeList();
            });
        },
        updateType() {
            const { name, id } = this.giftTypeInfo;
            this.addType(name, id);
        },
        handleAction({ name }, params) {
            switch (name) {
                case 'sort':
                    this.handleSortModal('sort', params);
                    break;
                case 'edit':
                    this.handleEditModal(params.id);
                    break;
                case 'delete':
                    this.handleDelete(params.id);
                    break;
                default:
                    break;
            }
        },
        handleSortModal(name, params) {
            this.$refs[name].showModal(params);
        },
        handleEditModal(id) {
            this.openMainSpin(true);
            api.getGiftTypeInfo({ id }).then(({ data }) => {
                this.giftTypeInfo = data;
                this.$refs.edit.handleShow();
                this.openMainSpin(false);
            });
        },
        handleDelete(id) {
            this.$Modal.confirm({
                title: '删除',
                content:
                    '删除当前分类后对应分类的商品将变为未分类状态无法再前台展示确定删除当前分类吗?',
                onOk: () => {
                    this.deleteGiftType(id);
                },
            });
        },
        handleSortSuccess() {
            this.$Modal.confirm({
                title: '提示',
                content: '礼品列表排列顺序发生变更是否发布新的礼品列表顺序？',
                onOk: () => {
                    this.getGiftTypeList();
                },
            });
        },
    },
};
</script>

<style scoped></style>
