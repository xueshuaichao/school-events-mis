<template>
    <div
        id="user-info"
        class="flex-row"
    >
        <router-link :to="{ name: 'home' }">
            <common-icon name="icon8" />首页
        </router-link>
        <a
            :href="url"
            target="_blank"
        >
            <common-icon name="icon9" />
            进入大赛频道
        </a>
        <div class="flex-row">
            <avatar
                :src="
                    userInfo.img ||
                        require('../../../../assets/images/passport/avatar.png')
                "
            />
            <div class="account-info">
                {{ userInfo.name }}
                <router-link to="/account/change">
                    修改密码
                </router-link>
            </div>
            <p class="user-label">
                {{ identityList[userInfo.identity - 1] }}
            </p>
        </div>
        <i-button @click="handleClick">
            退出
        </i-button>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import CONFIG from '@/config/index';
import './user.less';

export default {
    name: 'User',
    props: {
        userInfo: {
            type: [String, Object],
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            identityList: CONFIG.USER_IDENTITY,
            url: CONFIG.PC_URL,
        };
    },
    methods: {
        ...mapActions(['handleLogOut']),
        handleClick() {
            this.handleLogOut().then(() => {
                this.$router.push({
                    path: '/passport',
                });
            });
        },
    },
};
</script>
