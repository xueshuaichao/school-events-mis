<template>
    <div>
        <component
            :is="componentName"
            :info="info"
        />
    </div>
</template>

<script>
import Edu from './components/education/index.vue';
import Sch from './components/school/index.vue';
import api from '@/api/home';
import './index.less';

export default {
    name: 'Index',
    components: {
        edu: Edu,
        sch: Sch,
    },
    data() {
        return {
            info: {},
            componentName: '',
        };
    },
    created() {
        this.getHomeData();
    },
    methods: {
        getHomeData() {
            api.getHomeData().then(({ data, data: { user_type: type } }) => {
                this.info = data;
                this.componentName = type === 2 ? 'edu' : 'sch';
            });
        },
    },
};
</script>

<style scoped></style>
