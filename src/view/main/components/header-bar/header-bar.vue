<template>
    <div class="header-bar">
        <breadcrumb>
            <breadcrumb-item v-if="breadcrumb[0]">
                {{ $t(breadcrumb[0]) }}
            </breadcrumb-item>
            <template v-for="item in breadcrumb[1]">
                <breadcrumb-item
                    v-if="!item.isVisited"
                    :key="item.name"
                    :to="{ name: item.name }"
                >
                    {{ $t(item.i18n) }}
                </breadcrumb-item>
                <breadcrumb-item
                    v-else
                    :key="item.name"
                >
                    {{ $t(item.i18n) }}
                </breadcrumb-item>
            </template>
            <breadcrumb-item v-if="breadcrumb[2]">
                {{ $t(breadcrumb[2]) }}
            </breadcrumb-item>
        </breadcrumb>
        <div class="custom-content-con">
            <slot />
        </div>
    </div>
</template>
<script>
import './header-bar.less';

export default {
    name: 'HeaderBar',
    computed: {
        breadcrumb() {
            return this.$store.state.app.breadCrumbList;
        },
    },
    methods: {
        switchLang() {
            this.$i18n.locale = this.$i18n.locale === 'zh-CN' ? 'en-US' : 'zh-CN';
        },
    },
};
</script>
