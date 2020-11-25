<template>
    <div class="content-wrapper page-poem-add">
        <div>
            <i-button
                class="mar-r-24"
                @click="handlePrev()"
            >
                返回
            </i-button>
        </div>
        <div class="add-form">
            <Form
                ref="form"
                :model="form"
                :label-width="150"
                :rules="rules"
            >
                <FormItem
                    label="诗词等级"
                    prop="type"
                >
                    <Select
                        v-model="form.type"
                        style="width: 340px;"
                    >
                        <Option value="0">
                            容易
                        </Option>
                        <Option value="1">
                            一般
                        </Option>
                        <Option value="2">
                            困难
                        </Option>
                    </Select>
                </FormItem>
                <FormItem
                    prop="title"
                    label="诗词名称"
                >
                    <Input
                        v-model="form.title"
                        placeholder="请输入诗词名称"
                        maxlength="30"
                        show-word-limit
                        style="width: 340px;"
                    />
                </FormItem>
                <FormItem
                    label="朝代"
                    prop="dynasty"
                >
                    <Input
                        v-model="form.dynasty"
                        placeholder="请输入诗人朝代"
                        maxlength="5"
                        show-word-limit
                        style="width: 340px;"
                    />
                </FormItem>
                <FormItem
                    label="诗人姓名"
                    prop="author"
                >
                    <Input
                        v-model="form.author"
                        placeholder="请输入诗人姓名"
                        maxlength="30"
                        show-word-limit
                        style="width: 340px;"
                    />
                </FormItem>
                <FormItem
                    label="诗词内容"
                    prop="content"
                >
                    <Input
                        v-model="form.content"
                        type="textarea"
                        placeholder="请输入诗词内容，段落请隔行输入"
                        class="lg-textarea"
                    />
                </FormItem>
                <FormItem label="展示方式">
                    <RadioGroup v-model="form.display_type">
                        <Radio label="0">
                            居中
                        </Radio>
                        <Radio label="1">
                            居左
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label="注释"
                    prop="annotate"
                >
                    <Input
                        v-model="form.annotate"
                        type="textarea"
                        placeholder="请输入诗词内容，段落请隔行输入"
                        class="mid-textarea"
                    />
                </FormItem>
                <FormItem
                    label="测验题目"
                    prop="q_title"
                >
                    <Input
                        v-model="form.q_title"
                        type="textarea"
                        placeholder="请输入诗词内容，段落请隔行输入"
                        class="mid-textarea"
                    />
                </FormItem>
                <FormItem
                    label="测验选项"
                    prop="extra"
                >
                    <div
                        class="add-answer"
                        @click="addQuestion"
                    >
                        添加选项
                    </div>
                    <RadioGroup v-model="form.i_answer">
                        <div
                            v-for="(item, k) in qs"
                            :key="item.ts"
                            class="answer"
                        >
                            <Input
                                v-model="item.val"
                                type="textarea"
                                placeholder="请输入诗词内容，段落请隔行输入"
                                class="mid-textarea"
                                maxlength="50"
                                show-word-limit
                            />
                            <div class="opr">
                                <Radio :label="k + 1">
                                    正确答案
                                </Radio>
                                <!--<span class="del">删除</span>-->
                            </div>
                        </div>
                    </RadioGroup>
                </FormItem>
            </Form>
        </div>
        <div class="action">
            <i-button
                type="primary"
                class="mar-r-24"
                @click="onSave"
            >
                保存
            </i-button>
            <i-button
                class="mar-r-24"
                @click="onPreview"
            >
                预览
            </i-button>
            <i-button
                class="mar-r-24"
                @click="onReset"
            >
                取消
            </i-button>
        </div>

        <!-- preview modal -->
        <modal
            v-model="isModalShow.preview"
            width="425"
            height="667"
        >
            <iframe
                width="375"
                height="667"
                :src="previewUrl"
                frameborder="0"
            />
        </modal>
    </div>
</template>

<script>
import api from '@/api/poem';

export default {
    data() {
        const { tid, id } = this.$route.params;
        return {
            isModalShow: {
                preview: false,
            },
            previewUrl: '',
            id,
            qs: [
                {
                    val: '',
                    ts: new Date() - 0,
                },
            ],
            form: {
                theme_id: tid,
                title: '',
                type: '',
                dynasty: '',
                author: '',
                content: '',
                annotate: '',
                display_type: '0',
                q_title: '',
                q_type: '1',
                extra: [],
                i_answer: 1,
            },
            rules: {
                type: {
                    required: true,
                    message: '请选择难易程度',
                    trigger: 'blur',
                },
                title: {
                    required: true,
                    message: '请填写主题名称',
                    trigger: 'blur',
                },
                dynasty: {
                    required: true,
                    message: '请填写诗词朝代',
                    trigger: 'blur',
                },
                author: {
                    required: true,
                    message: '请填写作者',
                    trigger: 'blur',
                },
                content: {
                    required: true,
                    message: '请填写诗词内容',
                    trigger: 'blur',
                },
                q_title: {
                    required: true,
                    message: '请填写测验题目',
                    trigger: 'blur',
                },
                extra: {
                    required: true,
                    trigger: 'blur',
                    // eslint-disable-next-line consistent-return
                    validator: (rule, value, callback) => {
                        if (value.includes('')) {
                            return callback(new Error('选项内容必须填写'));
                        }
                        callback();
                    },
                },
            },
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            if (this.id !== 'add') {
                api.detail({
                    id: this.id,
                }).then((res) => {
                    const { data } = res;
                    this.qs = data.qextra.map((item, i) => ({
                        val: item,
                        ts: new Date() - 0 + i,
                    }));
                    this.form = {
                        ...this.form,
                        title: data.title,
                        type: `${data.type}`,
                        display_type: `${data.display_type}`,
                        annotate: data.annotate,
                        content: data.content,
                        author: data.author,
                        i_answer: data.qanswer,
                        q_title: data.qtitle,
                        dynasty: data.dynasty,
                    };
                });
            }
        },
        handlePrev() {
            this.$router.go(-1);
            return false;
        },
        addQuestion() {
            this.qs.push({
                val: '',
                ts: new Date() - 0,
            });
        },
        onReset() {
            this.form = {
                ...this.form,
                title: '',
                type: '',
                dynasty: '',
                author: '',
                content: '',
                annotate: '',
                display_type: '0',
                q_title: '',
                q_type: '1',
                extra: [],
                i_answer: 1,
            };
            this.qs = [
                {
                    val: '',
                    ts: Date.now(),
                },
            ];
        },
        onSave() {
            this.form.extra = this.qs.map(item => item.val);

            this.$refs.form.validate((res) => {
                if (res) {
                    let call;
                    if (this.id !== 'add') {
                        call = api.updatePoem({
                            ...this.form,
                            id: this.id,
                        });
                    } else {
                        call = api.addPoem(this.form);
                    }
                    call.then(
                        () => {
                            this.$Message.success('保存成功！');
                        },
                        (err) => {
                            this.$Message.error(err.Message);
                        },
                    );
                }
            });
        },
        onPreview() {
            const params = {
                title: this.form.title,
                content: this.form.content,
                display_type: this.form.display_type,
                dynasty: this.form.dynasty,
                author: this.form.author,
                annotate: this.form.annotate,
            };
            const querys = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const key in params) {
                // eslint-disable-next-line no-prototype-builtins
                if (params.hasOwnProperty(key)) {
                    querys.push(`${key}=${encodeURIComponent(params[key])}`);
                }
            }
            const query = querys.join('&');
            this.previewUrl = `http://aitiaozhan.dev.wdyclass.com/activity/pages/poetry/record?${query}`;

            this.isModalShow.preview = true;
        },
    },
};
</script>

<style lang="less">
.page-poem-add {
    .add-form {
        margin-top: 24px;
    }

    .lg-textarea .ivu-input {
        width: 606px;
        height: 160px !important;
    }

    .mid-textarea {
        width: 606px;
        .ivu-input {
            height: 61px !important;
        }
    }

    .ivu-form-item-label {
        font-weight: bold;
    }

    .add-answer {
        color: #1166ff;
        font-size: 14px;
        margin-bottom: 14px;
        cursor: pointer;
    }

    .answer {
        .opr {
            padding-left: 10px;
            margin-bottom: 16px;
            color: #626366;
        }

        .del {
            color: #1166ff;
            font-size: 14px;
            cursor: pointer;
            position: relative;
            top: 2px;
        }
    }

    .action {
        text-align: center;
    }
}
</style>
