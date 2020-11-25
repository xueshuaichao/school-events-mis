<template>
    <Modal
        v-model="show"
        width="430"
        footer-hide
    >
        <div class="passport-modal">
            <i class="icon-exclam" />
            <p class="tip mar-b-24">
                忘记密码通过手机号重设密码
            </p>
            <i-form
                ref="form"
                :model="form"
                autocomplete="off"
                :rules="rules"
            >
                <template v-if="view === 'validatePhone'">
                    <form-item prop="phone">
                        <i-input
                            v-model.trim="form.phone"
                            :maxlength="11"
                            placeholder="请输入您的手机号"
                        />
                    </form-item>
                    <form-item
                        class="code"
                        prop="code"
                    >
                        <i-input
                            v-model="form.code"
                            :maxlength="4"
                            placeholder="请输入验证码"
                        />
                        <img
                            v-show="picCodeUrl"
                            class="mar-l-12"
                            width="128"
                            height="44"
                            :src="picCodeUrl"
                            @click="getPicCode()"
                        >
                    </form-item>
                </template>
                <template v-if="view === 'resetPassword'">
                    <form-item
                        class="code"
                        prop="mesCode"
                    >
                        <i-input
                            v-model="form.mesCode"
                            placeholder="动态码"
                            autocomplete="off"
                        />
                        <i-button
                            type="primary"
                            class="mar-l-12"
                            :disabled="disabled"
                            @click="getMesCode"
                        >
                            {{ time }}
                        </i-button>
                    </form-item>
                    <form-item prop="password">
                        <i-input
                            v-model="form.password"
                            type="password"
                            autocomplete="new-password"
                            placeholder="请输入密码"
                        />
                    </form-item>
                    <form-item prop="second_password">
                        <i-input
                            v-model="form.second_password"
                            type="password"
                            autocomplete="new-password"
                            placeholder="请输入确认密码"
                        />
                    </form-item>
                </template>
                <i-button
                    type="primary"
                    class="mar-b-24"
                    :loading="loading"
                    @click="handleSubmit"
                >
                    提交
                </i-button>
                <p
                    v-show="view === 'resetPassword'"
                    class="prev"
                >
                    返回 <a @click="handlePrev">修改手机</a>
                </p>
            </i-form>
        </div>
    </Modal>
</template>

<script>
import api from '@/api/passport';

export default {
    name: 'Index',
    data() {
        return {
            show: false,
            view: 'validatePhone',
            loading: false,
            rules: {
                phone: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (!Number(value)) {
                                callback(new Error('请输入手机号'));
                            } else if (!/^1\d{10}$/g.test(value)) {
                                callback(new Error('请输入正确的手机号'));
                            } else {
                                callback();
                            }
                        },
                    },
                ],
                code: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur',
                    },
                ],
                mesCode: [
                    {
                        required: true,
                        message: '请输入动态码',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur',
                    },
                ],
                second_password: {
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请再次输入新密码'));
                        } else if (value !== this.form.password) {
                            callback(new Error('两次密码输入不一致'));
                        } else {
                            callback();
                        }
                    },
                },
            },
            form: {
                phone: '',
                code: '',
                mesCode: '',
                password: '',
                second_password: '',
            },
            isValidate: '',
            picCodeUrl: '',
            time: '获取动态码',
            disabled: false,
        };
    },
    methods: {
        getPicCode() {
            api.getPicCode().then(
                ({
                    data: {
                        data: { img, phrase_id: id },
                    },
                }) => {
                    this.picCodeUrl = img;
                    this.phrase_id = id;
                },
            );
        },
        getMesCode() {
            this.sendModifyPassportMsg();
        },
        getTeacherInfoByMobile() {
            return api
                .getTeacherInfoByMobile({ phone: this.form.phone })
                .catch(() => {
                    this.$Message.error(
                        '您输入的手机号尚未注册，请联系管理员处理',
                    );
                    this.loading = false;
                });
        },
        sendModifyPassportMsg() {
            api.sendModifyPassportMsg({ phone: this.form.phone }).then(() => {
                this.$Message.success('发送成功');
                this.handleTimer();
            });
        },
        checkPicCode() {
            return api.checkPicCode({
                code: this.form.code,
                phrase_id: this.phrase_id,
            });
        },
        async validateMes() {
            const data = await this.getTeacherInfoByMobile();

            if (data) {
                this.checkPicCode()
                    .then(() => {
                        this.view = 'resetPassword';
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                        this.getPicCode();
                        this.form.code = '';
                    });
            }
        },
        updatePassword() {
            const form = JSON.parse(JSON.stringify(this.form));

            form.code = form.mesCode;
            delete form.mesCode;
            this.loading = true;
            api.forgetPassword(form)
                .then(() => {
                    this.$Message.success('修改成功');
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        handleTimer() {
            let time = 60;
            this.disabled = true;

            const timer = setInterval(() => {
                this.time = `${time}s`;

                time -= 1;
                if (time === -1) {
                    clearInterval(timer);
                    this.time = '获取动态码';
                    this.disabled = false;
                }
            }, 1000);
        },
        handleShow() {
            this.show = true;
            this.getPicCode();
            this.view = 'validatePhone';
            this.$refs.form.resetFields();
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.view === 'validatePhone') {
                        this.loading = true;
                        this.validateMes();
                    } else {
                        this.updatePassword();
                    }
                }
            });
        },
        handlePrev() {
            this.view = 'validatePhone';
            this.$refs.form.resetFields();
        },
    },
};
</script>

<style scoped></style>
