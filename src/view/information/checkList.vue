<template>
    <page-list
        :columns="columns"
        :data="list"
        :page-params="{ total }"
        :btn-list="btnList"
        :checked-btn-list="checkedBtnList"
        @page-change="getList"
        @btn-click="handleBtnClick"
    >
        <template slot="header-btn">
            <Modal
                v-model="modal1"
                title="审核"
            >
                <p class="model-text">
                    {{ content }}
                </p>
                <template slot="footer">
                    <div>
                        <i-button @click="handleClickCancel">
                            取消
                        </i-button>
                        <i-button
                            type="primary"
                            @click="ok"
                        >
                            确定
                        </i-button>
                    </div>
                </template>
            </Modal>
            <i-button
                class="mar-b-24"
                @click="handleClickBack"
            >
                返回
            </i-button>
        </template>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '../components/page/list.vue';
import api from '../../api/information';

export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            modal1: false,
            isPass: '',
            id: '',
            content: '',
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '留言内容',
                    key: 'content',
                    align: 'center',
                },
                {
                    title: '留言者',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '状态',
                    key: 'status',
                    slot: 'checkStatus',
                    align: 'center',
                },
                {
                    title: '审核',
                    key: 'action',
                    width: 360,
                    slot: 'action',
                    align: 'center',
                },
            ],
            list: [],
            btnList: [
                {
                    name: 'pass',
                },
                {
                    name: 'unpass',
                },
            ],
            checkedBtnList: {
                2: {
                    name: 'pass',
                },
                1: {
                    name: 'unpass',
                },
            },
            params: {
                page_size: 10,
                page_num: 1,
            },
            total: 0,
        };
    },
    created() {
        this.getList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getList(pageNum = 1) {
            this.openMainSpin(true);
            this.params.page_num = pageNum;
            this.params.activity_id = this.$route.params.activity_id;
            this.params.status = this.$route.params.status;
            api.getcommentlist(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = list;
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleBtnClick({ name }, { id }) {
            const contentType = {
                pass: '审核通过',
                unpass: '审核不通过',
            };
            this.content = contentType[name];
            this.isPass = name;
            this.id = id;
            this.modal1 = true;
        },
        ok() {
            this.openMainSpin(true);
            this.modal1 = false;
            api.commentEdit({
                id: this.id,
                status: this.isPass === 'pass' ? '1' : '2',
            })
                .then(() => {
                    this.getList();

                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleClickBack() {
            this.$router.go(-1);
        },
        handleClickCancel() {
            this.modal1 = false;
        },
    },
};
</script>

<style scoped>
.model-text {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
}
</style>
