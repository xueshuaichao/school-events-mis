/**
 * @file
 * @author tanghao
 * @date 2019-07-24
 */

export const hasPermission = (permissionList, permissionCode) => {
    if (permissionCode) {
        return permissionList.includes(permissionCode);
    }
    return true;
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, permissionList) => {
    const res = [];
    const hasChild = item => item.children && item.children.length > 0;
    list.forEach((item) => {
        if (item.meta && item.meta.show) {
            const obj = {
                name: item.name,
                icon: (item.meta && item.meta.icon) || '',
                i18n: (item.meta && item.meta.i18n) || '',
                meta: item.meta,
                redirect: !!item.redirect,
            };
            if (hasChild(item)) {
                obj.children = getMenuByRouter(item.children, permissionList);
            }
            if (hasPermission(permissionList, obj.meta.permission)) {
                res.push(obj);
            }
        }
    });
    return res;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched) => {
    const res = [];
    const parent = routeMetched[0];
    const parentMeta = parent.meta;
    const child = routeMetched.slice(-1)[0];
    const childMeta = child.meta;
    if (parentMeta && parentMeta.show) {
        if (parent.redirect) {
            res.push('');
        } else {
            res.push(parentMeta.i18n || '');
        }

        res.push(childMeta.breadcrumb || []);
        res.push(childMeta.i18n || '');
    }

    return res;
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = (list) => {
    localStorage.tagNaveList = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList;
    return list ? JSON.parse(list) : [];
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers) => {
    let homeRoute = {};
    routers.forEach((item) => {
        if (item.children && item.children.length) {
            const res = getHomeRoute(item.children);
            if (res.name) {
                return res;
            }
        } else if (item.name === 'home') {
            homeRoute = item;
        }
        return false;
    });

    return homeRoute;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
    const { name, path, meta } = newRoute;
    const newList = [...list];
    if (newList.findIndex(item => item.name === name) >= 0) {
        return newList;
    }
    newList.push({
        name,
        path,
        meta,
    });
    return newList;
};

export const saveAction = (me, to, slogan = '保存成功', callback) => {
    me.$Message.success({
        content: slogan,
        onClose: () => {
            me.$router.push(to);
            if (callback) {
                callback();
            }
        },
    });
};

/*
 * @des 权限列表
 * @param { Array } list 用户 menus
 * */
export const parsePermissionList = list => list.map(v => v.menu_id);

/*
 * @des number to string
 * */
export const numberToString = (data) => {
    const info = {};
    Object.keys(data).forEach((v) => {
        const value = data[v];
        info[v] = typeof value === 'number' ? value.toString() : value;
    });
    return info;
};

/*
 * @des 对象赋值
 * */
export const extend = (target, resource) => {
    const obj = {};
    Object.keys(target).forEach((v) => {
        if (v in resource) {
            obj[v] = resource[v];
        } else {
            obj[v] = target[v];
        }
    });
    return obj;
};

/*
 * @des 对象差异
 * @return Boolean
 * */
export const objectDiff = (oldObject, newObject) => JSON.stringify(oldObject) !== JSON.stringify(newObject);

/*
 * @des 获取当前时间
 * @return String
 * */
export const getCurrentTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return {
        year,
        month,
        day,
        hours,
        minutes,
    };
};

/*
 * @des 格式化时间（秒）
 * @return Object
 * */
export const formateSeconds = (seconds, isString = false) => {
    const intNum = Math.floor(seconds);
    const fraNum = (seconds * 1000 - intNum * 1000).toFixed(0) - 0;

    const timeObj = {
        minutes: Math.floor(intNum / 60),
        seconds: intNum % 60,
        millisecond: fraNum,
    };

    if (isString) {
        return `${timeObj.minutes}分${timeObj.seconds}秒${timeObj.millisecond}`;
    }
    return timeObj;
};

/*
 * @des 首字母大写
 * @param {String} str
 * @return String
 * */
export const firstWordUpperCase = str => str.charAt(0).toLocaleUpperCase() + str.substr(1);
