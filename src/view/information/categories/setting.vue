<template>
    <Modal
        v-model="show"
        title="设置子分类"
        width="686"
        class="set-child-categories"
    >
        <h5 class="flex-row">
            热门分类
            <p>最多可选择9个分类展示</p>
        </h5>
        <div class="categories flex-row">
            <div
                v-for="(item, index) in category"
                :key="item.id"
                class="item"
                :class="item.active && 'active'"
                @click="handleClickItem(item, index)"
            >
                {{ item.name }}
            </div>
        </div>
        <template slot="footer">
            <i-button
                type="primary"
                @click="handleClickSave"
            >
                确认
            </i-button>
            <i-button @click="show = !show">
                取消
            </i-button>
        </template>
    </Modal>
</template>

<script>
import api from '@/api/information';

export default {
    name: 'AddSearchLabel',
    data() {
        return {
            show: false,
            category: [],
            form: {
                id: '',
                child_category: '',
            },
            flag: false,
        };
    },
    methods: {
        updateHotChildCategories(res) {
            this.show = false;
            this.form.child_category = res;
            api.updateHotChildCategories(this.form).then(() => {
                this.$Message.success('操作成功');
                this.$emit('on-success');
            });
        },
        setDefaultSelected(child, category, id) {
            if (child) {
                category.forEach((v) => {
                    // eslint-disable-next-line no-param-reassign
                    v.active = child.findIndex(item => item.id === v.id) > -1;
                });
            }
            this.form = {
                id,
                child_category: '',
            };
        },
        handleMaxCategories(item) {
            const { category } = this;
            const activedCategories = category.filter(v => v.active);

            return new Promise((reslove, reject) => {
                if (item && !item.active && activedCategories.length > 8) {
                    this.$Message.error('最多可选择9个分类展示');
                    reject();
                }
                reslove(activedCategories);
            });
        },
        handleShow({ category, id, child_category: child }) {
            this.show = true;
            this.category = category;
            this.setDefaultSelected(child, category, id);
        },
        handleClickSave() {
            this.handleMaxCategories().then((res) => {
                if (res.length) {
                    this.updateHotChildCategories(res);
                } else {
                    this.$Message.error('至少选择一个分类');
                }
            });
        },
        handleClickItem(item, index) {
            this.handleMaxCategories(item).then(() => {
                this.$set(this.category, index, {
                    ...item,
                    active: !item.active,
                });
            });
        },
    },
};
</script>

<style lang="less">
.set-child-categories {
    h5 {
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 500;
        color: #313233ff;
        p {
            margin-left: 8px;
            font-size: 12px;
            color: #969799ff;
        }
    }
    .categories {
        max-height: 400px;
        overflow-y: auto;
        flex-wrap: wrap;
        .item {
            height: 38px;
            padding: 0 5px;
            margin-bottom: 16px;
            font-size: 14px;
            line-height: 38px;
            margin-right: 8px;
            border-radius: 2px;
            border: 1px solid rgba(227, 228, 230, 1);
            transition: all 0.6s ease;
            &:hover {
                cursor: pointer;
            }
        }
        .active {
            background: #1166ffff;
            color: white;
            border: 1px solid #1166ffff;
        }
    }
}
</style>
