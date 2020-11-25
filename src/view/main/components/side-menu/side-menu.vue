<template>
    <div class="side-menu-wrapper">
        <slot />
        <i-menu
            ref="menu"
            :active-name="activeName"
            :open-names="openedNames"
            :theme="theme"
            width="auto"
            class="side-menu"
            :accordion="accordion"
            @on-select="handleSelect"
            @on-open-change="handleOpenChange"
        >
            <template v-for="item in menuList">
                <!-- 显示二级菜单 -->
                <submenu
                    v-if="showChildren(item)"
                    :key="item.i18n"
                    :name="item.i18n"
                >
                    <template slot="title">
                        <common-icon
                            v-if="item.icon"
                            :name="item.icon"
                        />
                        <span>{{ showTitle(item) }}</span>
                    </template>
                    <template v-for="child in item.children">
                        <!--  三级菜单(后期render)  -->
                        <submenu
                            v-if="showChildren(child)"
                            :key="child.i18n"
                            class="menu"
                            :name="child.i18n"
                        >
                            <template slot="title">
                                <common-icon
                                    v-if="child.icon"
                                    :name="child.icon"
                                />
                                <span>{{ showTitle(child) }}</span>
                            </template>
                            <menu-item
                                v-for="child1 in child.children"
                                :key="child1.name"
                                :name="child1.name"
                            >
                                <icon
                                    v-if="child1.icon"
                                    :type="child1.icon"
                                />
                                <span style="padding-left: 9px;">{{
                                    showTitle(child1)
                                }}</span>
                            </menu-item>
                        </submenu>

                        <menu-item
                            v-else
                            :key="child.name"
                            :name="child.name"
                        >
                            <icon
                                v-if="child.icon"
                                :type="child.icon"
                            />
                            <span style="padding-left: 9px;">{{
                                showTitle(child)
                            }}</span>
                        </menu-item>
                    </template>
                </submenu>

                <!-- 隐藏二级菜单 -->
                <menu-item
                    v-else
                    :key="item.i18n"
                    :name="item.i18n"
                >
                    <icon
                        v-if="item.icon"
                        :type="item.icon"
                    />
                    <span>{{ showTitle(item) }}</span>
                </menu-item>
            </template>
        </i-menu>
    </div>
</template>
<script>
import './side-menu.less';
// import { constants } from 'crypto';

export default {
    name: 'SideMenu',
    props: {
        menuList: {
            type: Array,
            default() {
                return [];
            },
        },
        accordion: {
            type: Boolean,
            default: true,
        },
        theme: {
            type: String,
            default: 'light',
        },
        iconSize: {
            type: Number,
            default: 16,
        },

        activeName: {
            type: String,
            default: '',
        },
        openNames: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            openedNames: this.openNames,
            storeInfo: '',
        };
    },

    watch: {
        openNames(newNames) {
            this.openedNames = this.openedNames.concat(newNames);
        },

        openedNames() {
            this.$nextTick(() => {
                this.$refs.menu.updateOpened();
            });
        },
    },

    created() {},

    mounted() {},

    methods: {
        handleSelect(name) {
            this.$emit('on-select', name);
        },

        handleOpenChange(name) {
            this.openedNames = name;
        },

        showTitle(item) {
            return item.i18n ? this.$t(item.i18n) : this.$t(item.name);
        },

        showChildren(item) {
            return (
                !item.redirect && item.meta && item.meta.show && item.children
            );
        },

        updateActiveName() {
            this.$refs.menu.updateActiveName();
        },
    },
};
</script>
