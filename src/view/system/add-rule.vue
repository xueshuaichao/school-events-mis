<template>
    <page-edit @on-save="handleSave">
        <i-form
            id="add-rule"
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="90"
        >
            <form-item
                label="角色名称"
                prop="role_name"
            >
                <i-input v-model="form.role_name" />
            </form-item>
            <form-item
                label="权限设置"
                prop="menus"
            >
                <CheckboxGroup
                    v-model="form.menus"
                    @on-change="handleCheckboxChange"
                >
                    <template v-for="(item, index) in menu">
                        <div
                            :key="index"
                            class="flex-row"
                        >
                            <h5 class="h5-title mar-r-24">
                                {{ $t(item.i18n) }}
                            </h5>
                            <Checkbox :label="item.permission">
                                全部
                            </Checkbox>
                        </div>
                        <Divider :key="item.i18n" />
                        <template v-for="ele in item.children">
                            <Checkbox
                                :key="ele.permission"
                                :label="ele.permission"
                                class="checkbox mar-r-24"
                            >
                                {{ $t(ele.i18n) }}
                            </Checkbox>
                        </template>
                    </template>
                </CheckboxGroup>
            </form-item>
        </i-form>
    </page-edit>
</template>

<script>
import { mapMutations } from 'vuex';
import PageEdit from '@/view/components/page/edit.vue';
import CONF from '@/config/permission';
import api from '@/api/system';
import { parsePermissionList } from '../../libs/utils';
import './index.less';

export default {
    name: 'AddRule',
    components: {
        'page-edit': PageEdit,
    },
    data() {
        return {
            menu: CONF.EDU,
            form: {
                role_name: '',
                role_id: this.$route.params.id,
                menus: [],
            },
            rules: {
                role_name: {
                    required: true,
                    message: '请输入角色名称',
                    trigger: 'blur',
                },
                menus: {
                    required: true,
                    type: 'array',
                    min: 1,
                    message: '至少选择一个',
                    trigger: 'blur',
                },
            },
            oldData: [],
        };
    },
    created() {
        const { role_id: roleId } = this.form;
        if (roleId) {
            this.getMenu({ role_id: roleId });
        }
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getMenu(data) {
            api.getMenuByRoleId(data).then(({ data }) => {
                this.form.role_name = data[0].role_name;
                this.form.menus = parsePermissionList(data[0].menus).filter(
                    v => v > 100,
                );
            });
        },
        addRole() {
            const form = JSON.parse(JSON.stringify(this.form));
            form.menus = this.pushDefaultMenus([...new Set(form.menus)]);
            this.openMainSpin(true);
            api.addRole(form)
                .then(() => {
                    this.openMainSpin(false);
                    this.$router.go(-1);
                })
                .catch(this.openMainSpin(false));
        },
        pushDefaultMenus(menus) {
            const list = [];
            menus.forEach((v) => {
                const parentPermission = this.getRouteParentPermission(v);
                if (v > 100 && !menus.includes(parentPermission)) {
                    list.push(parentPermission);
                }
            });
            return menus.concat(...list);
        },
        getRouteParentPermission(permission) {
            return Number(permission.toString().slice(0, 2));
        },
        diff(oldData, newData) {
            let code;
            let isAdd;
            if (oldData.length < newData.length) {
                // 增加
                [code] = newData.filter(v => !oldData.includes(v));
                isAdd = true;
            } else {
                // 减少
                [code] = oldData.filter(v => !newData.includes(v));
                isAdd = false;
            }
            return {
                isAdd,
                code,
            };
        },
        handleCheckboxChange(data) {
            const { code, isAdd } = this.diff(this.oldData, data);
            const {
                menu,
                form: { menus },
            } = this;
            const key = code < 100;
            if (isAdd) {
                this.form.menus.push(
                    ...(key
                        ? menu
                            .filter(v => v.permission === code)[0]
                            .children.map(v => v.permission)
                        : []),
                );
            } else {
                this.form.menus = menus.filter(
                    v => (key ? Number(v.toString().slice(0, 2)) : v) !== code,
                );
            }
            this.oldData = this.form.menus;
        },
        handleSave() {
            this.$refs.form.validate((data) => {
                if (data) {
                    this.addRole();
                }
            });
        },
    },
};
</script>
