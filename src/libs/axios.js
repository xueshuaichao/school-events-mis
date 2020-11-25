import Axios from 'axios';
import { Message } from 'view-design';
import URL from '../config/url';
import CONF from '../config';

const { STATUS_CODE } = CONF;
const NO_MESSAGE = [
    STATUS_CODE.NO_LOGIN,
    STATUS_CODE.NO_SELECT_SHOP,
    ...STATUS_CODE.WHITE_LIST,
];
const baseURL = URL.API;
const METHOD = {
    POST: 'post',
    GET: 'get',
};

// 请求拦截
const interceptors = (instance) => {
    instance.interceptors.request.use(
        config => config,
        error => Promise.reject(error),
    );

    // 添加响应拦截器
    instance.interceptors.response.use(
        (res) => {
            const { data } = res;
            if (!(data instanceof Blob)) {
                if (data.status !== STATUS_CODE.SUCCESS) {
                    if (data.msg && !NO_MESSAGE.includes(data.status)) {
                        Message.error(data.msg);
                    }
                    return Promise.reject(data);
                }
            }
            return data;
        },
        (error) => {
            // 对响应错误做点什么
            Message.error('服务器开小差啦');
            return Promise.reject(error);
        },
    );
};

// 创建实例
const create = () => {
    const conf = {
        baseURL,
        timeout: 0,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        withCredentials: true,
    };
    return Axios.create(conf);
};

export class HttpRequest {
    constructor() {
        // 存储请求队列
        this.queue = {};
    }

    // 销毁请求实例
    destroy(url) {
        delete this.queue[url];
        const queue = Object.keys(this.queue);
        return queue.length;
    }

    request(url, params) {
        const instance = create();
        const newOptions = { url, method: METHOD.GET, params };
        interceptors(instance, newOptions.url);
        this.queue[newOptions.url] = instance;
        return instance(newOptions);
    }

    post(url, params) {
        const data = params && JSON.parse(JSON.stringify(params));
        const instance = create();
        if (data) {
            Object.keys(data).forEach(
                key => data[key] !== 0 && !data[key] && delete data[key],
            );
        }
        const options = { url, data, method: METHOD.POST };
        interceptors(instance, options.url);
        this.queue[options.url] = instance;
        return instance(options);
    }

    file(url, params) {
        const formData = new FormData();
        const instance = create();
        Object.keys(params).forEach((v) => {
            formData.append(v, params[v]);
        });
        const options = {
            url,
            data: formData,
            method: METHOD.POST,
        };
        interceptors(instance, options.url);
        this.queue[options.url] = instance;
        return instance(options);
    }
}

export const axios = new HttpRequest();
