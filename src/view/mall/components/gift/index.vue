<template>
    <div>
        <Modal
            v-model="isModalShow"
            width="540"
            class="modal-select-gift"
            title="添加每日奖池"
            footer-hide
        >
            <div class="select-gift">
                <div class="mar-b-24">
                    <Select
                        v-model="form.prize_id"
                        style="width:164px"
                        class="mar-r-24"
                        placeholder="请选择奖品"
                        :disabled="!data.is_update"
                        @on-change="onSelectGift"
                    >
                        <Option
                            v-for="item in giftList"
                            :key="item.id"
                            :value="item.id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                    <Select
                        v-model="form.num"
                        placeholder="请选择奖品数量"
                        style="width:164px"
                        class="mar-r-24"
                        :disabled="!form.prize_id"
                    >
                        <Option
                            v-for="item in giftNumList"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                    <i-button
                        :disabled="!data.is_update"
                        @click="addGift()"
                    >
                        提交
                    </i-button>
                </div>

                <div class="mar-b-24 gift-list">
                    <div
                        v-for="(item, k) in data.prize"
                        :key="item.prize_id"
                        class="gift"
                    >
                        <div class="gift-name">
                            {{ item.prize_name }}*{{ item.num }}
                        </div>
                        <span
                            v-if="data.is_update"
                            class="icon-close"
                            @click="removeGift(k)"
                        >
                            <Icon type="md-close-circle" />
                        </span>
                    </div>
                </div>
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
import api from '@/api/mall';

export default {
    data() {
        return {
            isModalShow: false,
            data: {},
            refData: {},
            giftList: [],
            giftNumList: [],
            form: {
                prize_id: null,
                prize_name: '',
                num: null,
            },
        };
    },
    methods: {
        getGiftList(draw_id) {
            api.getGiftList({
                draw_id,
                page_size: 1000,
                page_num: 1,
                status: 0,
            }).then(({ data: { list } }) => {
                this.giftList = list;
            });
        },
        onSelectGift(prize_id) {
            // eslint-disable-next-line arrow-parens
            const gift = this.giftList.find(item => item.id === prize_id);
            const arr = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 0, l = gift.capacity; i < l; i++) {
                arr.push({
                    name: i + 1,
                    value: i + 1,
                });
            }
            this.giftNumList = arr;
            this.form.prize_name = gift.name;
        },
        addGift() {
            const isAdded = this.data.prize.find(
                item => item.prize_id === this.form.prize_id,
            );
            if (isAdded) {
                return this.$Message.info('已添加过该奖品！');
            }
            if (!this.form.num) {
                return this.$Message.info('请选择奖品数量！');
            }
            return this.data.prize.push({ ...this.form });
        },
        removeGift(i) {
            this.data.prize.splice(i, 1);
        },
        onOk() {
            // this.$emit('on-submit', this.data.prize);
            this.refData.prize = this.data.prize;
            this.hide();
        },

        show(draw_id, prize) {
            this.getGiftList(draw_id);
            this.data = JSON.parse(JSON.stringify(prize));
            this.refData = prize;
            this.form = {
                prize_id: null,
                prize_name: '',
                num: null,
            };
            this.isModalShow = true;
        },
        hide() {
            this.isModalShow = false;
        },
    },
};
</script>

<style lang="less">
.modal-select-gift {
    .select-gift {
        padding: 0 12px;
    }

    .gift-list {
        .gift {
            display: inline-block;
            margin-right: 16px;
            width: 136px;
            height: 36px;
            border-radius: 2px;
            border: 1px solid rgba(227, 228, 230, 1);
            position: relative;

            .icon-close {
                position: absolute;
                right: -13px;
                top: -15px;
                padding: 5px;
                color: #ff6849;
                cursor: pointer;
            }

            .gift-name {
                line-height: 36px;
                padding: 0 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
