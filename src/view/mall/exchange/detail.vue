<template>
    <page-detail class="exchange-detail">
        <div class="info">
            <!--  兑换记录信息  -->
            <div>
                <h5 class="h5-title">
                    基本信息
                </h5>
                <div class="item">
                    <span class="label">
                        记录ID:
                    </span>
                    <span class="value">
                        {{ info.show_id }}
                    </span>
                </div>
                <div class="item">
                    <span class="label">
                        记录状态:
                    </span>
                    <span class="value">
                        {{ info.status_name }}
                    </span>
                </div>
                <div class="item">
                    <span class="label">
                        创建时间:
                    </span>
                    <span class="value">
                        {{ info.created_at }}
                    </span>
                </div>
                <div class="item">
                    <span class="label">
                        礼品名称:
                    </span>
                    <span class="value">
                        {{ info.gift_name }}
                    </span>
                </div>
                <div
                    v-if="info.gift_img"
                    class="item"
                >
                    <span class="label">
                        礼品图片:
                    </span>
                    <div class="gift-images">
                        <img
                            v-for="item in info.gift_img"
                            :key="item"
                            class="item"
                            :src="item"
                        >
                    </div>
                </div>
                <div class="item">
                    <span class="label">
                        礼品数量:
                    </span>
                    <span class="value">
                        {{ info.pay_num }}
                    </span>
                </div>
                <div class="item">
                    <span class="label">
                        礼品单价:
                    </span>
                    <span class="value">
                        {{ info.price }}
                    </span>
                </div>
                <div class="item">
                    <span class="label">
                        礼品总价:
                    </span>
                    <span class="value">
                        {{ info.total_price }}
                    </span>
                </div>
            </div>

            <!--    收货信息  -->
            <div>
                <h5 class="h5-title">
                    收货信息
                </h5>
                <div class="item">
                    <span class="label">
                        收货人:
                    </span>
                    <span class="value">
                        {{ info.user_name }}
                    </span>
                </div>
                <div class="item">
                    <span class="label">
                        联系方式:
                    </span>
                    <span class="value">
                        {{ info.phone }}
                    </span>
                </div>
                <div class="item">
                    <span class="label">
                        收货地址:
                    </span>
                    <span class="value">
                        {{ info.address }}
                    </span>
                </div>
            </div>
        </div>
        <h5 class="h5-title">
            发货信息
        </h5>
        <template v-if="info.status === 2">
            <div class="item">
                <span class="label">
                    确认人:
                </span>
                <span class="value">
                    {{ info.confirm_user }}
                </span>
            </div>
            <div class="item">
                <span class="label">
                    确认时间:
                </span>
                <span class="value">
                    {{ info.confirm_time }}
                </span>
            </div>
        </template>
        <template v-else>
            <i-button
                type="primary"
                @click="handleExchangeStatus(info.id, getExchangeInfo)"
            >
                确认发货
            </i-button>
        </template>
    </page-detail>
</template>

<script>
import PageDetail from '@/view/components/page/detail.vue';
import api from '@/api/mall';
import { updateExchangeStatus } from '../mixins';
import './index.less';

export default {
    name: 'Detail',
    components: {
        'page-detail': PageDetail,
    },
    mixins: [updateExchangeStatus],
    data() {
        return {
            info: {},
        };
    },
    created() {
        this.getExchangeInfo();
    },
    methods: {
        getExchangeInfo() {
            api.getExchangeInfo({ id: this.$route.params.id }).then(
                ({ data }) => {
                    this.info = data;
                },
            );
        },
    },
};
</script>
