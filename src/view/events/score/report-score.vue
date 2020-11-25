<template>
    <page-edit
        save-text="提交审核"
        @on-save="handleSave"
    >
        <i-form
            id="report-score"
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="100"
        >
            <form-item
                label="活动名称"
                prop="resource_name"
            >
                <i-input
                    v-model="form.resource_name"
                    disabled
                />
            </form-item>
            <form-item
                label="项目范围"
                prop="resource_scope"
            >
                <RadioGroup
                    v-model="form.resource_scope"
                    @on-change="handleChangeRadio"
                >
                    <Radio
                        v-for="item in category"
                        :key="item.cat_id"
                        :label="item.cat_id"
                    >
                        {{ item.name }}
                    </Radio>
                </RadioGroup>
            </form-item>
            <form-item
                label="参赛项目"
                prop="cat_id"
            >
                <Select
                    v-model="form.one_cat_id"
                    @on-change="handleChangeSelect"
                >
                    <Option
                        v-for="item in matchItems"
                        :key="item.cat_id"
                        :value="item.cat_id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
                <Select
                    v-if="matchItemsOneChild.length"
                    v-model="form.two_cat_id"
                    @on-change="handleChangeOneChild"
                >
                    <Option
                        v-for="item in matchItemsOneChild"
                        :key="item.cat_id"
                        :value="item.cat_id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
                <Select
                    v-if="matchItemsTwoChild.length"
                    v-model="form.three_cat_id"
                    @on-change="handleChangeTwoChild"
                >
                    <Option
                        v-for="item in matchItemsTwoChild"
                        :key="item.cat_id"
                        :value="item.cat_id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="学段"
                prop="education_level"
            >
                <pull
                    v-model="form.education_level"
                    :list="learnSection"
                    placeholder="请选择学段"
                />
            </form-item>
            <form-item
                label="年级"
                prop="grade_id"
            >
                <Select
                    v-model="form.grade_id"
                    placeholder="请选择年级"
                    @on-change="handleChangeGrade"
                >
                    <Option
                        v-for="item in gradeList"
                        :key="item.grade_id"
                        :value="item.grade_id"
                    >
                        {{ item.grade_name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="班级"
                prop="class_id"
            >
                <Select
                    v-model="form.class_id"
                    @on-change="handleChangeClass"
                >
                    <Option
                        v-for="item in classList"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.class_name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="参赛者姓名"
                prop="create_info_array"
            >
                <Select
                    v-model="form.create_info"
                    :multiple="isMultiple"
                    @on-change="handleChangeUsersList"
                >
                    <Option
                        v-for="item in studentList"
                        :key="item.user_id"
                        :value="item.user_id"
                    >
                        {{ item.student_name }}
                    </Option>
                </Select>
            </form-item>
            <form-item
                label="成绩"
                prop="achievement"
            >
                <template v-if="date">
                    <i-input
                        v-model="achievementDateInfo.minutes"
                        :maxlength="2"
                        @on-change="handleChangeTime"
                    />分
                    <i-input
                        v-model="achievementDateInfo.seconds"
                        :maxlength="2"
                        @on-change="handleChangeTime"
                    />秒
                    <i-input
                        v-model="achievementDateInfo.millisecond"
                        :maxlength="3"
                        @on-change="handleChangeTime"
                    />
                </template>
                <template v-else>
                    <i-input
                        v-model="form.achievement"
                        :maxlength="10"
                    />
                    {{ form.achievement_unit }}
                </template>
            </form-item>
            <!-- <form-item
                label="成绩单位"
                prop="achievement_unit"
            >
                <i-input v-model="form.achievement_unit" />
            </form-item> -->
            <form-item
                label="指导教师"
                prop="teacher"
            >
                <i-input
                    v-model="form.teacher"
                    :maxlength="10"
                />
            </form-item>
            <form-item
                label="认证官姓名"
                prop="attestation_name"
            >
                <i-input v-model="form.attestation_name" />
            </form-item>
            <form-item
                label="上传视频"
                prop="video_id"
            >
                <upload @on-end="setVideoInfo" />
                <div
                    v-if="form.resource_id"
                    class="video-mes"
                >
                    {{ video_name }}
                </div>
            </form-item>
            <form-item
                label="视频封面"
                prop="video_img_url"
            >
                <file
                    v-model="form.video_img_url"
                    :max-size="5 * 1024 * 1024"
                >
                    <p slot="tips">
                        图片尺寸1024*768，大小不超过5M，格式为JPG、PNG等图片格式
                    </p>
                </file>
                <p class="warning">
                    若不上传，我们将截取视频的一帧作为封面图。
                </p>
                <div
                    v-if="form.video_img_url"
                    class="preview-img"
                >
                    <img
                        :src="form.video_img_url"
                        alt=""
                    >
                </div>
            </form-item>
        </i-form>
    </page-edit>
</template>

<script>
import { mapMutations } from 'vuex';
import Pull from '@/view/components/pull/index.vue';
import PageEdit from '@/view/components/page/edit.vue';
import api from '@/api/events';
import Upload from '@/view/components/upload/media/index.vue';
import File from '@/view/components/upload/file/index.vue';
import { learnSection } from '@/libs/enum';
import { extend, formateSeconds } from '@/libs/utils';
import './index.less';

export default {
    name: 'EditSchool',
    components: {
        'page-edit': PageEdit,
        pull: Pull,
        upload: Upload,
        file: File,
    },
    data() {
        return {
            learnSection,
            category: [],
            matchItems: [],
            matchItemsOneChild: [],
            matchItemsTwoChild: [],
            studentList: [],
            gradeList: [],
            classList: [],
            video_name: '',
            stage: '',
            achievementDateInfo: {
                minutes: '0',
                seconds: '0',
                millisecond: '0',
            },
            date: false,
            switchKey: true,
            isMultiple: false,
            form: {
                resource_id: this.$route.params.id,
                resource_name: '青少年爱挑战活动',
                resource_scope: '',
                one_cat_id: '',
                two_cat_id: '',
                three_cat_id: '',
                cat_id: '',
                cat_name: '',
                match_id: '',
                age: '',
                education_level: '1',
                grade_id: '',
                class_id: '',
                create_info: '',
                create_info_array: [],
                achievement: '',
                achievement_unit: '',
                attestation_name: '',
                video_id: '',
                video_img_url: '',
                file_name: '',
                file_size: '',
                file_suffix: '',
                teacher: '',
            },
            rules: {
                resource_name: {
                    required: true,
                    message: '请填写活动名称',
                    trigger: 'blur',
                },
                cat_id: {
                    required: true,
                    type: 'number',
                    message: '请选择参赛项目',
                    trigger: 'change',
                },
                match_id: {
                    required: true,
                    type: 'number',
                    message: '请选择参赛项目',
                    trigger: 'blur',
                },
                education_level: {
                    required: true,
                    message: '请选择学段',
                    trigger: 'change',
                },
                grade_id: {
                    required: true,
                    type: 'number',
                    message: '请选择年级',
                    trigger: 'change',
                },
                class_id: {
                    required: true,
                    type: 'number',
                    message: '请选择班级',
                    trigger: 'change',
                },
                create_info_array: {
                    required: true,
                    type: 'array',
                    min: 1,
                    message: '请选择参赛者姓名',
                    trigger: 'change',
                },
                achievement: {
                    required: true,
                    trigger: 'blur',
                    validator(rule, value, callback) {
                        if (value) {
                            // eslint-disable-next-line no-restricted-globals
                            if (isNaN(value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                        } else {
                            callback(new Error('请输入成绩'));
                        }
                    },
                },
                achievement_unit: {
                    required: true,
                    message: '请填写成绩',
                    trigger: 'blur',
                },
                attestation_name: {
                    required: true,
                    message: '请填写认证官姓名',
                    trigger: 'blur',
                },
                teacher: {
                    required: true,
                    message: '请填写指导教师',
                    trigger: 'blur',
                },
                video_img_url: {
                    required: false,
                    message: '请上传视频封面',
                    trigger: 'blur',
                },
                video_id: {
                    required: true,
                    message: '请上传视频',
                    trigger: 'blur',
                },
            },
        };
    },
    created() {
        this.loadData();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        async loadData() {
            let data = null;
            await this.getCategory();
            await this.getSchoolInfo();
            await this.getSchoolGrade();
            if (this.form.resource_id) {
                data = await this.getScoreInfo();
                this.parseData(data);
            } else {
                this.init();
            }
        },
        getSchoolInfo() {
            return api.getSchoolInfo().then(({ data: { stage } }) => {
                this.learnSection = [learnSection[stage - 1]];
                this.stage = stage;
            });
        },
        getSchoolGrade() {
            return api.getSchoolGrade().then(({ data }) => {
                this.gradeList = data;
                return data;
            });
        },
        getScoreInfo() {
            return api
                .getScoreList({ resource_id: this.form.resource_id })
                .then(({ data: { list } }) => list[0]);
        },
        getCategory() {
            return api.getCategory().then(({ data }) => {
                data.forEach((v, i) => {
                    // eslint-disable-next-line no-param-reassign
                    v.cat_id = i < 2 ? i + 1 : 6;
                });
                this.category = data;
            });
        },
        getSchoolClass(data) {
            return api.getSchoolClass(data).then(({ data }) => {
                this.classList = data;
            });
        },
        getStudent() {
            const { grade_id: gradeId, class_id: classId } = this.form;

            return api
                .getStudent({ grade_id: gradeId, class_id: classId })
                .then(({ data }) => {
                    this.studentList = data;
                    return data;
                });
        },
        init(catId = 1) {
            this.form.resource_scope = catId;
            this.handleChangeRadio(catId);
        },
        async parseData(data) {
            const {
                resource_scope: scope,
                grade_id: id,
                create_id: name,
                cat_id: catId,
                achievement,
                achievement_unit: unit,
            } = data;
            const info = data;
            await this.getSchoolClass({ grade_id: id });
            const studentList = await this.getStudent();
            const createInfo = studentList
                .filter(v => name.split(',').includes(String(v.user_id)))
                .map(v => v.user_id);
            info.education_level = '1';
            info.achievement = String(achievement);
            this.form = extend(this.form, info);
            this.video_name = info.file_name;
            this.form.create_info = scope === 1 ? createInfo[0] : createInfo;
            this.form.create_info_array = createInfo;
            this.init(scope === 6 ? 131 : scope);
            this.getCatId(catId, this.category);
            if (unit === '秒' || !unit) {
                this.achievementDateInfo = formateSeconds(achievement);
            }
        },
        getCatId(id, list) {
            const catTree = [id];
            const getCatTree = (data, id) => {
                data.forEach((v) => {
                    if (v.cat_id === id) {
                        if ('parent_id' in v && v.parent_id !== 0) {
                            catTree.push(v.parent_id);
                            getCatTree(list, v.parent_id);
                        }
                    } else if ('child' in v) {
                        getCatTree(v.child, id);
                    }
                });
            };
            getCatTree(list, id);
            const [two, three] = catTree.reverse().slice(2);
            this.handleChangeSelect(two);
            this.handleChangeOneChild(three);
            // this.handleChangeTwoChild(three);
            this.form = this.$assign(this.form, {
                one_cat_id: two,
                two_cat_id: three,
                three_cat_id: three,
            });
        },
        uploadScore(data) {
            this.openMainSpin(true);
            const { resource_id: id } = data;
            api[id ? 'updateScore' : 'uploadScore'](data)
                .then(() => {
                    this.openMainSpin(false);
                    this.$Message.success('上报成功');
                    this.$router.go(-1);
                })
                .catch(this.openMainSpin(false));
        },
        beforeUpload() {
            const form = JSON.parse(JSON.stringify(this.form));
            const {
                achievement,
                create_info_array: array,
                resource_scope: scope,
            } = form;
            form.achievement = Number(achievement);
            form.create_info_array = this.studentList.filter(v => array.includes(v.user_id));
            form.education_level = this.stage;
            if (this.date) {
                form.achievement = this.getTimeSeconds(
                    this.achievementDateInfo,
                );
            }
            form.resource_scope = scope === 131 ? 6 : scope;
            this.uploadScore(form);
        },
        setVideoInfo({ videoId, file: { name, size, type } }) {
            const { form } = this;
            form.video_id = videoId;
            form.file_name = name;
            form.file_size = size;
            form.file_suffix = type;
            this.video_name = '';
        },
        getSelectList(list, value) {
            return list.find(v => v.cat_id === value) || { child: [] };
        },
        getCatName(list, catId) {
            return catId ? list.find(v => v.cat_id === catId).name : '';
        },
        handleChangeGrade(value) {
            this.getSchoolClass({ grade_id: value });
        },
        handleChangeClass() {
            this.getStudent();
        },
        handleChangeRadio(value) {
            const { category } = this;
            const { child } = this.getSelectList(category, value);
            this.matchItems = child || [];
        },
        handleChangeSelect(value) {
            const { matchItems, form } = this;
            const { child } = this.getSelectList(matchItems, value);
            this.matchItemsOneChild = child || [];
            this.form = {
                ...form,
                cat_name: this.getCatName(matchItems, value),
                cat_id: child.length ? '' : value,
                two_cat_id: '',
                three_cat_id: '',
            };
            if (!child.length) {
                this.handleAchievement(
                    matchItems.find(v => v.cat_id === value),
                );
            }
        },
        handleChangeOneChild(value) {
            const { matchItemsOneChild, form } = this;
            const { child } = this.getSelectList(matchItemsOneChild, value);
            this.matchItemsTwoChild = child || [];
            this.form = {
                ...form,
                cat_name: this.getCatName(matchItemsOneChild, value),
                cat_id: child.length ? '' : value,
                three_cat_id: '',
            };
            if (!child.length) {
                this.handleAchievement(
                    matchItemsOneChild.find(v => v.cat_id === value),
                );
            }
        },

        handleChangeTwoChild(value) {
            const { matchItemsTwoChild, form } = this;
            if (value) {
                this.form = {
                    ...form,
                    cat_name: this.getCatName(matchItemsTwoChild, value),
                    cat_id: value,
                };
                this.handleAchievement(
                    matchItemsTwoChild.find(v => v.cat_id === value),
                );
            }
        },
        handleChangeUsersList(data) {
            const info = Array.isArray(data) ? data : [data];
            this.form.create_info_array = info;
        },
        handleAchievement(data) {
            if (data) {
                const { unit, more_people: more } = data;
                this.date = !unit || unit === '秒';
                this.form.achievement_unit = unit || '秒';
                this.isMultiple = more === 2;
            }
        },
        handleChangeTime(e) {
            this.form.achievement = e.target.value;
        },
        getTimeSeconds({ minutes, seconds, millisecond }) {
            return (minutes / 1) * 60 + seconds / 1 + millisecond / 1000;
        },
        handleSave() {
            this.$refs.form.validate((res) => {
                if (res && this.switchKey) {
                    this.switchKey = false;
                    this.beforeUpload();
                }
            });
        },
    },
};
</script>
