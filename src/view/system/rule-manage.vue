<template>
    <page-list
        :columns="columns"
        :data="list"
        :btn-list="btnList"
        :page-params="{ total }"
        :hide-page-hide="false"
        @btn-click="handleAction"
        @page-change="getRoleList"
    >
        <template slot="header-btn">
            <i-button
                type="primary"
                class="mar-b-24"
                @click="handleClickBtn"
            >
                添加角色
            </i-button>
        </template>
        <Modal
            v-model="show"
            width="902"
            title="管理成员"
            class-name="rule-modal"
        >
            <div class="member-manage">
                <div class="part">
                    <h5>可选择成员</h5>
                    <div class="search flex-row mar-b-24">
                        <i-input
                            v-model="userName"
                            placeholder="请输入姓名"
                            clearable
                            @on-change="handleChangeName('user')"
                        />
                        <i-button @click="handleClickSearch('user')">
                            搜索
                        </i-button>
                    </div>
                    <CheckboxGroup
                        v-model="user"
                        class="flex-column"
                    >
                        <Checkbox
                            v-for="item in member.user"
                            :key="item.user_id"
                            :label="item.user_id"
                        >
                            {{ item.name }}
                        </Checkbox>
                    </CheckboxGroup>
                </div>
                <div class="btn-center flex-column">
                    <i-button
                        class="mar-b-24"
                        @click="handleUserList('addedUser')"
                    >
                        <Icon
                            type="ios-arrow-back"
                            size="16"
                        /> 删除
                    </i-button>
                    <i-button @click="handleUserList('user')">
                        添加 <Icon
                            type="ios-arrow-forward"
                            size="16"
                        />
                    </i-button>
                </div>
                <div class="part">
                    <h5>可选择成员</h5>
                    <div class="search flex-row mar-b-24">
                        <i-input
                            v-model="addedUserName"
                            placeholder="请输入姓名"
                            clearable
                            @on-change="handleChangeName('addedUser')"
                        />
                        <i-button @click="handleClickSearch('addedUser')">
                            搜索
                        </i-button>
                    </div>
                    <CheckboxGroup
                        v-model="addedUser"
                        class="flex-column"
                    >
                        <Checkbox
                            v-for="item in member.addedUser"
                            :key="item.user_id"
                            :label="item.user_id"
                        >
                            {{ item.name }}
                        </Checkbox>
                    </CheckboxGroup>
                </div>
            </div>
            <template slot="footer">
                <i-button
                    class="mar-r-24"
                    type="primary"
                    @click="handleClickSure"
                >
                    确定
                </i-button>
                <i-button @click="handleToggleModal">
                    取消
                </i-button>
            </template>
        </Modal>
    </page-list>
</template>
<script>
import { mapMutations } from 'vuex';
import PageList from '@/view/components/page/list.vue';
import api from '@//api/system';
import { objectDiff } from '@/libs/utils';
import './index.less';

export default {
    name: 'Index',
    components: {
        'page-list': PageList,
    },
    data() {
        return {
            show: false,
            btnList: [
                {
                    name: 'member',
                },
                {
                    name: 'modifyPermission',
                },
            ],
            columns: [
                {
                    title: '角色名称',
                    key: 'role_name',
                    align: 'center',
                },
                {
                    title: '创建时间',
                    key: 'created_at',
                    align: 'center',
                },
                {
                    title: '创建人',
                    key: 'created_user',
                    align: 'center',
                },
                {
                    title: '成员数',
                    key: 'users_length',
                    align: 'center',
                },
                {
                    title: '成员详情',
                    key: 'users',
                    align: 'center',
                },
                {
                    title: '操作',
                    width: '200',
                    slot: 'action',
                    align: 'center',
                },
            ],
            params: {
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            list: [],
            userName: '',
            addedUserName: '',
            user: [],
            addedUser: [],
            member: {
                user: [],
                addedUser: [],
            },
            backupMember: {},
            copyMember: {},
            role_id: '',
        };
    },
    created() {
        this.getRoleList();
    },
    methods: {
        ...mapMutations(['openMainSpin']),
        getRoleList(pageNum = 1) {
            this.params.page_num = pageNum;
            this.openMainSpin(true);
            api.getRoleList(this.params)
                .then(({ data: { list, total } }) => {
                    this.list = this.parseData(list);
                    this.total = total;
                    this.openMainSpin(false);
                })
                .catch(this.openMainSpin(false));
        },
        parseData(list) {
            return list.map((v) => {
                const data = v;
                const { users } = data;
                const { length } = users;
                data.users = length
                    ? users.map(v => v.name).join(' | ')
                    : '暂无';
                data.users_length = length;
                return data;
            });
        },
        getRoleUserList(roleId) {
            this.role_id = roleId;
            api.getRoleUserList({ role_id: roleId }).then(({ data }) => {
                this.member = data;
                this.backupMember = JSON.parse(JSON.stringify(data));
                this.copyMember = JSON.parse(JSON.stringify(data));
            });
        },
        addUserToRole(params) {
            api.addUserToRole(params).then(() => {
                this.$Message.success('添加成功');
                this.getRoleList(1);
            });
        },
        handleAction({ name }, { role_id: roleId }) {
            if (name === 'member') {
                this.handleToggleModal();
                this.getRoleUserList(roleId);
            } else {
                this.$router.push(`/rule/edit/${roleId}`);
            }
        },
        handleClickSure() {
            const { member, copyMember } = this;
            const users = this.member.addedUser.map(v => v.user_id);
            const isDiff = objectDiff(member.addedUser, copyMember.addedUser);
            if (isDiff) {
                this.addUserToRole({ role_id: this.role_id, users });
            }
            this.handleToggleModal();
        },
        handleUserList(name) {
            const { member, backupMember } = this;
            const currentList = this[name];
            const other = name === 'user' ? 'addedUser' : 'user';
            if (currentList.length) {
                const userData = member[name].filter(v => currentList.includes(v.user_id));
                // FIXME (backupMember应独立出来)
                member[other].push(...userData);
                backupMember[other].push(...userData);
                member[name] = member[name].filter(
                    v => !currentList.includes(v.user_id),
                );
                backupMember[name] = backupMember[name].filter(
                    v => !currentList.includes(v.user_id),
                );
                this[name] = [];
            }
        },
        handleToggleModal() {
            this.show = !this.show;
            Object.assign(this, {
                user: [],
                addedUser: [],
                userName: '',
                addedUserName: '',
            });
        },
        handleClickBtn() {
            this.$router.push({ name: 'addRule' });
        },
        handleClickSearch(name) {
            const searchName = this[`${name}Name`];
            if (searchName) {
                this[name] = [];
                this.member[name] = this.backupMember[name].filter(
                    v => v.name.indexOf(searchName) !== -1,
                );
            } else {
                this[name] = [];
                this.member = JSON.parse(JSON.stringify(this.backupMember));
            }
        },
        handleChangeName(name) {
            if (!this[`${name}Name`]) {
                this.handleClickSearch(name);
            }
        },
    },
};
</script>

<style scoped></style>
