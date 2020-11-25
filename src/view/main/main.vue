<template>
    <layout style="height: 100%">
        <sider
            :width="190"
            style="z-index:100"
        >
            <side-menu
                ref="menu"
                :active-name="activeName"
                :menu-list="menuList"
                :accordion="false"
                :open-names="openNames"
                @on-select="turnToPage"
            >
                <router-link
                    to="/"
                    class="app-logo"
                >
                    管理后台
                </router-link>
            </side-menu>
        </sider>

        <layout id="xmis-content">
            <i-header class="header-con">
                <header-bar>
                    <user :user-info="userInfo" />
                </header-bar>
            </i-header>
            <i-content style="position: relative;">
                <keep-alive :include="cacheComponentsList">
                    <router-view />
                </keep-alive>
                <spin
                    v-if="openSpin"
                    fix
                >
                    <icon
                        type="ios-loading"
                        size="24"
                        class="spin-icon-load"
                    />
                    <p class="spin-tips">
                        {{ mainSpinText }}
                    </p>
                </spin>
            </i-content>
        </layout>

        <!-- 新手引导 -->
        <newcomer-guide v-if="isNewUser" />
    </layout>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';
import mixin from '@/mixins/index';
import SideMenu from './components/side-menu';
import HeaderBar from './components/header-bar';
import User from './components/user';
import NewcomerGuide from './components/newcomer/index.vue';
import { getNewTagList } from '../../libs/utils';
import './main.less';

export default {
    name: 'Main',
    components: {
        SideMenu,
        HeaderBar,
        User,
        NewcomerGuide,
    },
    mixins: [mixin],
    data() {
        return {
            activeName: this.setActiveName(this.$route),
            isNewUser: false,
            cacheComponentsList: ['SchoolManage'],
        };
    },
    computed: {
        openSpin() {
            return this.$store.state.app.openMainSpin;
        },
        mainSpinText() {
            return this.$store.state.app.mainSpinText;
        },

        tagNavList() {
            return this.$store.state.app.tagNavList;
        },

        userInfo() {
            return this.$store.state.user.userInfo;
        },

        menuList() {
            return this.$store.getters.menuList;
        },
        openNames() {
            const [oneCat, twoCat] = this.$store.state.app.breadCrumbList;

            let openName = [];

            if (this.$route.name) {
                openName = [this.$route.name];
            }
            if (this.$route.meta) {
                openName = [oneCat] || [];
            }

            // 三级菜单
            if (twoCat && twoCat.length) {
                openName.push(...twoCat.map(v => v.i18n));
            }
            return openName;
        },
    },

    watch: {
        $route(newRoute) {
            this.setBreadCrumb(newRoute.matched);
            this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
            this.activeName = this.setActiveName(newRoute);
        },
    },
    mounted() {
        /**
         * @description 初始化设置面包屑导航和标签导航
         */
        this.setTagNavList();
        this.addTag(this.$store.state.app.homeRoute);
        this.setBreadCrumb(this.$route.matched);

        if (this.isSchool) {
            this.showNewcomerGuide();
        }
    },
    methods: {
        ...mapMutations(['setBreadCrumb', 'setTagNavList', 'addTag']),
        ...mapActions(['handleLogin']),
        turnToPage(name) {
            this.$router.push({
                name,
            });
            this.$nextTick(() => {
                this.activeName = this.setActiveName(this.$router);
                this.$refs.menu.updateActiveName();
            });
        },

        setActiveName(router) {
            if (router.mode === 'history') {
                return this.activeName;
            }

            const { meta } = router;
            const breadcrumb = meta && meta.breadcrumb;
            let { name } = router;

            if (!meta.show) {
                name = (breadcrumb && breadcrumb[breadcrumb.length - 1].name)
                    || name;
            }

            return name;
        },

        showNewcomerGuide() {
            if (!localStorage.IS_NEW_USER) {
                this.isNewUser = true;
                localStorage.IS_NEW_USER = true;
            }
        },
    },
};
</script>
