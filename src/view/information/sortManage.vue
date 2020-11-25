<template>
    <div>
        <Modal
            v-model="modal1"
            title="排序"
            width="490"
            @on-cancel="cancel"
        >
            <i-form
                ref="formArticle"
                :label-width="80"
                :model="formArticle"
                :rules="ruleArticle"
                label-position="left"
            >
                <form-item label="栏目">
                    <label for="">{{ column_name }}</label>
                </form-item>

                <form-item
                    label="排序"
                    prop="sort"
                >
                    <i-input
                        v-model="formArticle.sort"
                        :style="{ width: '354px' }"
                    />
                    <p class="mention">
                        填写文章序号，用逗号隔开，最多可添加5篇文章
                    </p>
                </form-item>
                <p
                    class="errorMessage"
                    v-html="error"
                />
            </i-form>
            <template slot="footer">
                <div>
                    <i-button
                        type="primary"
                        @click="handleClickSave"
                    >
                        保存
                    </i-button>
                    <i-button @click="handleClickReset">
                        重置
                    </i-button>
                </div>
            </template>
        </Modal>
        <page-list
            :columns="columns"
            :data="list"
            :hide-header-btn="false"
            :btn-list="btnList"
            @btn-click="handleBtnClick"
        >
            <div slot="footer" />
        </page-list>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '../components/page/list.vue';
import api from '../../api/information';
import './addArticle.less';

const validateSort = (rule, value, callback) => {
    if (!/^(\d+[',','，']){0,4}\d+$/.test(value)) {
        callback(new Error('输入格式错误'));
    } else {
        callback();
    }
};
export default {
    name: 'Index',
    components: {
        PageList,
    },
    data() {
        return {
            modal1: false,
            formArticle: {
                sort: '',
            },
            column_name: '',
            id: '',
            ruleArticle: {
                sort: [
                    {
                        required: true,
                        message: '请输入排序号',
                        trigger: 'blur',
                    },
                    { validator: validateSort, trigger: 'blur' },
                ],
            },
            btnList: [
                {
                    name: 'sort',
                },
            ],
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: '栏目',
                    key: 'column_name',
                    align: 'center',
                },
                {
                    title: '排序内容',
                    key: 'sort_ids',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 360,
                    slot: 'action',
                    align: 'center',
                },
            ],
            list: [],
            error: '',
        };
    },
    created() {
        this.getList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getList() {
            this.openMainSpin(true);
            api.columnList()
                .then(({ data: { list } }) => {
                    this.list = list;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        cancel() {
            this.error = '';
            this.formArticle.sort = '';
        },
        handleBtnClick(...args) {
            const { id, column_name: columnName } = args[1];
            this.id = id;
            this.column_name = columnName;
            this.modal1 = true;
        },
        handleClickSave() {
            this.error = '';
            this.$refs.formArticle.validate((valid) => {
                if (valid) {
                    this.openMainSpin(true);
                    const sortIds = this.formArticle.sort.replace(/，/g, ',');
                    api.columnUpdate({
                        id: this.id,
                        sort_ids: sortIds,
                    })
                        .then(() => {
                            this.formArticle.sort = '';
                            this.modal1 = false;
                            this.getList();
                            this.openMainSpin(false);
                        })
                        .catch(({ msg }) => {
                            this.error = msg;
                            this.openMainSpin(false);
                        });
                }
            });
        },
        handleClickReset() {
            this.$refs.formArticle.resetFields();
            this.error = '';
        },
    },
};
</script>

<style scoped></style>
