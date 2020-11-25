<template>
    <div
        class="panel menu"
        :style="{ height }"
    >
        <h4 class="panel-header">
            快捷菜单
        </h4>
        <div class="panel-body flex-row">
            <div
                v-for="(item, index) in menus"
                :key="index"
                class="menu-item"
                @click="handleMenusItemClick(index)"
            >
                <img
                    :src="
                        require(`@/assets/images/menu/${icon}/${index + 1}.png`)
                    "
                    alt=""
                >
                <p>{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>

<script>
const MENUS_LIST = {
    edu: [
        {
            name: '学校审核',
            path: 'schoolManage',
            permission: 1204,
        },
        {
            name: '留言板内容查询',
            path: 'messageBoardManage',
            permission: 1103,
        },
        {
            name: '排序管理',
            path: 'sortManage',
            permission: 1102,
        },
        {
            name: '文章管理',
            path: 'articleManage',
            permission: 1101,
        },
        {
            name: '人员管理',
            path: 'personnelManage',
            permission: 1301,
        },
    ],

    sch: [
        {
            name: '成绩管理',
            path: 'scoreManage',
        },
        {
            name: '学校信息查询',
            path: 'schoolMes',
        },
        {
            name: '上报成绩',
            path: 'reportScore',
        },
        {
            name: '学生管理',
            path: 'studentManage',
        },
        {
            name: '教师管理',
            path: 'teacherManage',
        },
        {
            name: '班级管理',
            path: 'classManage',
        },
    ],
};
export default {
    name: 'Index',
    props: {
        info: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            menus: [],
            icon: '',
            height: '',
        };
    },
    computed: {
        permission() {
            return this.$store.state.user.permission;
        },
    },
    created() {
        const {
            info: { user_type: type, is_province_edu: isEdu },
        } = this;
        if (type === 2) {
            this.menus = MENUS_LIST.edu;
            this.icon = 'edu';
        } else {
            this.menus = MENUS_LIST.sch;
            this.icon = 'sch';
        }
        if (isEdu !== 1) {
            this.height = '346px';
        }
    },
    methods: {
        handleMenusItemClick(index) {
            const { permission, menus, $router } = this;
            const { permission: perm, path } = menus[index];
            const hasPermission = perm ? permission.includes(perm) : true;
            if (hasPermission) {
                $router.push({ name: path });
            } else {
                this.$Message.error('没有权限');
            }
        },
    },
};
</script>

<style scoped></style>
