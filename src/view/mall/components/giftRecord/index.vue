<template>
    <div>
        <Modal
            v-model="isModalShow"
            width="540"
            title="中奖详情"
            footer-hide
            class="modal-gift-record"
        >
            <div class="hd">
                实物中奖
            </div>
            <div>
                <div
                    v-for="item in list"
                    :key="item.id"
                    class="item"
                >
                    <div style="display: flex;">
                        <div style="flex: 1;">
                            {{ item.user_name }}
                        </div>
                        <div style="flex: 1; text-align: right;">
                            {{ item.prize_name }}
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="!isLoading && list.length === 0"
                class="no-result"
            >
                暂无中奖
            </div>

            <div class="hd">
                虚拟中奖
            </div>
            <div>
                <div
                    v-for="item in virtualList"
                    :key="item.id"
                    class="item"
                >
                    <div style="display: flex;">
                        <div style="flex: 1;">
                            {{ item.user_name }}
                        </div>
                        <div style="flex: 1; text-align: right;">
                            {{ item.prize_name }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="!isLoading && virtualList.length === 0"
                class="no-result"
            >
                暂无中奖
            </div>

            <div
                class="footer-wrapper"
                style="text-align: center;"
            >
                <i-button
                    type="primary"
                    class="mar-r-24"
                    @click="onOk"
                >
                    确定
                </i-button>
                <i-button @click="hide">
                    取消
                </i-button>
            </div>
        </Modal>
    </div>
</template>

<script>
import mallApi from '@/api/mall';

export default {
    data() {
        return {
            isModalShow: false,
            isLoading: false,
            data: {},
            list: [],
            virtualList: [],
            form: {
                type: 'times',

                val_times: '',
                val_users: '',
                val_probability: '',
            },
        };
    },
    methods: {
        onSelect() {
            this.form.value = null;
        },
        onOk() {
            return this.hide();
        },
        getData(draw_id, data) {
            mallApi
                .getGiftRecord({
                    draw_id,
                    date: data.date,
                })
                .then((res) => {
                    this.list = res.data.filter(item => item.user_id !== 0);
                    this.virtualList = res.data.filter(
                        item => item.user_id === 0,
                    );
                    this.isLoading = false;
                });
        },
        show(draw_id, data) {
            this.data = data;
            this.getData(draw_id, data);
            this.isModalShow = true;
            this.isLoading = true;
        },
        hide() {
            this.isModalShow = false;
        },
    },
};
</script>

<style lang="less">
.modal-gift-record {
    .hd {
        font-size: 14px;
        color: #313233;
        line-height: 24px;
        padding: 16px 0;
        font-weight: bold;
        border-bottom: 1px solid rgba(237, 238, 240, 1);
    }

    .item {
        color: #626366;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid rgba(237, 238, 240, 1);
    }
    // .item:first-child {
    //     border-top: 1px solid rgba(237,238,240,1);
    // }

    .footer-wrapper {
        margin-top: 24px;
    }

    .no-result {
        color: #c8c9cc;
        font-size: 14px;
        text-align: center;
        padding: 80px 0;
    }
}
</style>
