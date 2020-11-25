/*
 * @des 验证
 * */

export const mobileValidator = (isMust = true) => (rule, value, callback) => {
    if (value) {
        if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    } else if (isMust) {
        callback(new Error('请填写手机号'));
    } else {
        callback();
    }
};

export const idNumber = (isMust = true) => (rule, value, callback) => {
    if (value) {
        if (value.length < 7) {
            callback(new Error('证件号码格式不正确'));
        } else {
            callback();
        }
    } else if (isMust) {
        callback(new Error('请填写证件号码'));
    } else {
        callback();
    }
};

export const staffAge = (isMust = true) => (rule, value, callback) => {
    if (value) {
        if (!/^\d+$/.test(value)) {
            callback(new Error('年龄格式不正确'));
        } else {
            callback();
        }
    } else if (isMust) {
        callback(new Error('请填写年龄'));
    } else {
        callback();
    }
};

/*
 * @des 整数
 * @params { Number } num 位数
 * */
export const isInteger = (number, num = 5) => {
    const reg = new RegExp(`^[0-9]{1,${num - 1}}$`, 'g');
    return reg.test(number);
};
