<template>
    <page-edit
        :on-cancel="handleCancel"
        @on-save="handleSave"
    >
        <i-form
            id="change-password"
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="100"
        >
            <form-item label="账号">
                {{ account }}
            </form-item>
            <form-item
                label="旧密码"
                prop="old_password"
            >
                <i-input
                    v-model="form.old_password"
                    type="password"
                    placeholder="请输入旧密码"
                />
            </form-item>
            <form-item
                label="新密码"
                prop="first_password"
            >
                <i-input
                    v-model="form.first_password"
                    type="password"
                    placeholder="请输入新密码"
                />
            </form-item>
            <form-item
                label="确认密码"
                prop="second_password"
            >
                <i-input
                    v-model="form.second_password"
                    type="password"
                    placeholder="请再次输入新密码"
                />
            </form-item>
        </i-form>
    </page-edit>
</template>

<script>
import { mapMutations } from 'vuex';
import api from '@/api/account';
import PageEdit from '@/view/components/page/edit.vue';
import './index.less';

const PREV_ROUTER = { name: 'home' };

export default {
    name: 'Password',
    components: {
        'page-edit': PageEdit,
    },
    data() {
        return {
            form: {
                old_password: '',
                first_password: '',
                second_password: '',
            },
            rules: {
                old_password: {
                    required: true,
                    message: '请输入旧密码',
                    trigger: 'blur',
                },
                first_password: [
                    {
                        required: true,
                        message: '请输入新密码',
                        trigger: 'blur',
                    },
                    {
                        type: 'string',
                        min: 6,
                        message: '密码至少为6位',
                        trigger: 'blur',
                    },
                ],
                second_password: {
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请再次输入新密码'));
                        } else if (value !== this.form.first_password) {
                            callback(new Error('两次密码输入不一致'));
                        } else {
                            callback();
                        }
                    },
                },
            },
        };
    },
    computed: {
        account() {
            return this.$store.state.user.userInfo.user_account;
        },
    },
    beforeRouteEnter(to, form, next) {
        const { name, params } = form;

        if (name && name !== 'passportLogin') {
            PREV_ROUTER.name = name;
            PREV_ROUTER.params = params;
        }
        next();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        modifyPassword() {
            this.openMainSpin(true);
            api.modifyPassword(this.form)
                .then(() => {
                    this.$Message.success('修改成功');
                    this.$router.push(PREV_ROUTER);
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        handleCancel() {
            this.$router.push(PREV_ROUTER);
        },
        handleSave() {
            this.$refs.form.validate((data) => {
                if (data) {
                    this.modifyPassword();
                }
            });
        },
    },
};
</script>
