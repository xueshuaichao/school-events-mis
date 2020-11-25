<template>
    <div
        id="login"
        @keydown.enter="submit"
    >
        <h1>
            <p>欢迎登录</p>
            活动平台管理系统
        </h1>
        <i-form
            ref="form"
            :model="form"
            :rules="rules"
        >
            <form-item prop="user_name">
                <i-input
                    v-model.trim="form.user_name"
                    :maxlength="11"
                    placeholder="请输入账号名称"
                >
                    <common-icon
                        slot="prefix"
                        name="icon10"
                    />
                </i-input>
            </form-item>
            <form-item prop="password">
                <i-input
                    v-model.trim="form.password"
                    :maxlength="20"
                    placeholder="请输入密码"
                    type="password"
                >
                    <common-icon
                        slot="prefix"
                        name="icon11"
                    />
                </i-input>
            </form-item>
            <p
                class="forget-password"
                @click="handleForgetPassword"
            >
                忘记密码
            </p>
            <form-item>
                <i-button
                    type="primary"
                    long
                    :loading="isLoading"
                    @click="submit"
                >
                    登录
                </i-button>
            </form-item>
        </i-form>
        <reset ref="reset" />
    </div>
</template>
<script>
import api from '@/api/passport';
import Reset from '../reset/index.vue';

export default {
    components: {
        Reset,
    },
    data() {
        return {
            isLoading: false,
            form: {
                user_name: '',
                password: '',
            },
            rules: {
                user_name: [
                    {
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur',
                    },
                ],
            },
            componentName: null,
        };
    },

    methods: {
        handleForgetPassword() {
            this.$refs.reset.handleShow();
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.isLoading = true;
                    api.login(this.form)
                        .then(({ data: { firstlogin } }) => {
                            this.$router.push({
                                name: firstlogin ? 'accountManage' : 'home',
                            });
                            this.isLoading = false;
                        })
                        .catch(() => {
                            this.isLoading = false;
                        });
                }
            });
        },
    },
};
</script>
