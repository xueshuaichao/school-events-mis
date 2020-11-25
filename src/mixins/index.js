export default {
    computed: {
        isSchool() {
            // 学校端
            return this.$store.state.user.userInfo.identity === 3;
        },
        isProvinceEdu() {
            // 省级教育厅
            const {
                is_province_edu: province,
                is_admin: admin,
            } = this.$store.state.user.userInfo;
            return province === 1 && province === admin;
        },
    },
};
