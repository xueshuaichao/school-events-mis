<template>
    <div
        class="register"
        @keydown.enter="submit"
    >
        <div class="register">
            <h1>{{ isRegister ? "新用户注册" : "重置密码" }}</h1>
            <i-form
                ref="form"
                :model="form"
                :rules="rules"
            >
                <form-item prop="mobile">
                    <i-input
                        v-model.trim="form.mobile"
                        placeholder="请输入11位手机号"
                        :maxlength="11"
                    />
                </form-item>

                <form-item prop="captcha">
                    <i-input
                        v-model.trim="form.captcha"
                        placeholder="手机短信验证码"
                        :maxlength="6"
                    >
                        <i-button
                            slot="append"
                            class="send-captcha"
                            @click="sendCaptcha"
                        >
                            <span v-show="!verifyDisable">获取验证码</span>
                            <span
                                v-show="verifyDisable"
                            >重新获取({{ count }})</span>
                        </i-button>
                    </i-input>
                </form-item>

                <form-item prop="password">
                    <i-input
                        v-model.trim="form.password"
                        type="password"
                        placeholder="请输入密码(6-16字母、数字、无空格)"
                    />
                </form-item>

                <form-item prop="password_confirm">
                    <i-input
                        v-model.trim="form.password_confirm"
                        type="password"
                        placeholder="请确认密码(6-16字母、数字、无空格)"
                    />
                </form-item>

                <p
                    v-if="isRegister"
                    class="agreement"
                >
                    <checkbox v-model="agree" />
                    我已阅读并同意 <a target="_blank">《服务协议》</a>
                </p>

                <form-item>
                    <i-button
                        v-if="isRegister"
                        type="primary"
                        long
                        :disabled="!agree"
                        @click="submit"
                    >
                        注册
                    </i-button>
                    <i-button
                        v-if="!isRegister"
                        type="primary"
                        long
                        @click="reset"
                    >
                        重置
                    </i-button>
                    <i-button
                        class="cancel"
                        long
                        :to="{ name: 'login' }"
                    >
                        取消
                    </i-button>
                </form-item>

                <div
                    v-if="isRegister"
                    class="footer"
                >
                    已有账号？
                    <router-link :to="{ name: 'login' }">
                        马上登录
                    </router-link>
                </div>
            </i-form>
        </div>
    </div>
</template>
<script>
import api from '../../../api/passport';
import { saveAction } from '../../../libs/utils';

export default {
    data() {
        return {
            form: {
                mobile: '',
                password: '',
                password_confirm: '',
                captcha: '',
            },
            isRegister: false,
            agree: false,
            count: 60,
            verifyDisable: false,
            rules: {
                mobile: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (
                                Number(value) === +value
                                && value.length === 11
                            ) {
                                callback();
                            } else {
                                callback('请输入正确的手机号码');
                            }
                        },
                        trigger: 'blur',
                    },
                ],

                password: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'change',
                    },
                ],

                password_confirm: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value !== this.form.password) {
                                callback('两次输入的密码不一致');
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur',
                    },
                ],

                captcha: [
                    {
                        required: true,
                        message: '验证码不能为空',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },

    created() {
        this.isRegister = this.$route.name === 'passportRegister';
    },

    methods: {
        sendCaptcha() {
            this.$refs.form.validateField('mobile', (res) => {
                if (!res && !this.verifyDisable) {
                    api.sendCaptcha({
                        mobile: this.form.mobile,
                        type: this.isRegister ? 1 : 3,
                    });
                    this.verifyDisable = true;
                    const interval = setInterval(() => {
                        this.count -= 1;
                        if (this.count === 0) {
                            clearInterval(interval);
                            this.verifyDisable = false;
                            this.count = 60;
                        }
                    }, 1000);
                }
            });
        },

        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    api.register(this.form).then(() => saveAction(this, { path: '/' }, '注册成功'));
                }
            });
        },

        reset() {
            this.$refs.resetForm.validate((valid) => {
                if (valid) {
                    api.resetPassword(this.form).then(() => saveAction(this, { name: 'passportLogin' }, '重置成功'));
                }
            });
        },
    },
};
</script>
