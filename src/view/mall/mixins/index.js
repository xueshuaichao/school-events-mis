/*
 * @des mixins
 * */
import api from '@/api/mall';

export const updateExchangeStatus = {
    methods: {
        updateExchangeStatus(data, callback) {
            api.updateExchangeStatus(data).then(() => {
                this.$Message.success('发货成功！');
                callback();
            });
        },
        handleExchangeStatus(id, callback) {
            this.$Modal.confirm({
                title: '提示',
                content: '当前礼品已经发货？',
                onOk: () => {
                    this.updateExchangeStatus({ id }, callback);
                },
            });
        },
    },
};

export default {};
