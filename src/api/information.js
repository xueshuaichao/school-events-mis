/**
 * @des 系统管理
 */

import { axios } from '../libs/axios';
import account from './account';

export default {
    ...account,
    // 获取文章列表
    getList(data) {
        return axios.post('/article/getlist', data);
    },
    updateArticleHotStatus(data) {
        return axios.post('/article/sethot', data);
    },
    updateArticleTopStatus(data) {
        return axios.post('/article/settop', data);
    },
    // 发布
    articleSave(data) {
        return axios.post('/article/save', data);
    },
    // 获取栏目列表
    columnList() {
        return axios.request('/column/getlist');
    },
    // 删除文章
    articleDelete(data) {
        return axios.post('/article/delete', data);
    },
    // 文章详情
    articleGetinfo(data) {
        return axios.post('/article/getinfo', data);
    },
    // 预览
    articlePreview(data) {
        return axios.post('/article/preview', data);
    },
    // 取消
    articleRemove(data) {
        return axios.post('/article/remove', data);
    },
    // 获取留言板列表
    messageBoardList(data) {
        return axios.post('/comment/getactivitylist', data);
    },
    // 获取已经审核和未审核的留言列表
    getcommentlist(data) {
        return axios.post('/comment/getcommentlist', data);
    },
    // 审核通过或不通过
    commentEdit(data) {
        return axios.post('/comment/edit', data);
    },
    // 修改文章排序的顺序
    columnUpdate(data) {
        return axios.post('/column/update', data);
    },
    getRoleList(data) {
        return axios.post('/role/list', data);
    },
    getRoleUserList(data) {
        return axios.post('/role/userlist', data);
    },
    addUserToRole(data) {
        return axios.post('/role/addusertorole', data);
    },
    addRole(data) {
        return axios.post('/role/addRole', data);
    },
    // 图片上传
    fileUpload(data) {
        return axios.file('/file/uploadfile', data);
    },
    // url地址和base64路径转换
    fileGetcontent(data) {
        return axios.file('/file/getcontent', data);
    },
    // 添加banner
    bannerAdd(data) {
        return axios.post('/banner/add', data);
    },
    // 修改banner
    bannerUpdate(data) {
        return axios.post('/banner/update', data);
    },
    // 获取banner列表
    bannerList(data) {
        return axios.request('/banner/list', data);
    },
    // 删除banner
    bannerDelete(data) {
        return axios.post('/banner/delete', data);
    },
    bannerSort(data) {
        return axios.post('/banner/sort', data);
    },
    // 活动图片列表
    getImagesList(data) {
        return axios.post('images/list', data);
    },
    // 活动图片删除
    deleteImages(data) {
        return axios.post('images/delete', data);
    },
    addImages(data) {
        return axios.post('images/add', data);
    },
    // 今日问道 列表
    getQuestionList(data) {
        return axios.post('question/list', data);
    },
    // 删除
    deleteQuestion(data) {
        return axios.post('question/delete', data);
    },
    // 置顶
    questionTop(data) {
        return axios.post('question/top', data);
    },
    // 今日问道发布
    questionAdd(data) {
        return axios.post('/question/add', data);
    },
    // 今日问道编辑
    questionUpdate(data) {
        return axios.post('/question/update', data);
    },
    // 今日问道获取详情
    questionDetail(data) {
        return axios.post('/question/detail', data);
    },
    getCommentList(data) {
        return axios.post('/comment/commentlist', data);
    },
    updateCommentStatus(data) {
        return axios.post('/comment/setcommentstatus', data);
    },
    updateCommentsStatus(data) {
        return axios.post('/comment/setcommentsstatus', data);
    },
    // 举报内容列表
    getInformList(data) {
        return axios.post('/inform/list', data);
    },
    // 举报内容详情
    getInformInfo(data) {
        return axios.post('/inform/info', data);
    },
    // 举报内容下架
    updateInformStatus(data) {
        return axios.post('/inform/setresourcestatus', data);
    },
    // 搜索关键词列表
    getSearchLabelList(data) {
        return axios.post('/common/searchlist', data);
    },
    addSearchLabel(data) {
        return axios.post('/common/searchadd', data);
    },
    deleteSearchLabel(data) {
        return axios.post('/common/searchdel', data);
    },
    updateSearchLabelInfo(data) {
        return axios.post('/common/searchup', data);
    },
    getSearchLabelInfo(data) {
        return axios.post('/common/searchone', data);
    },
    updateSearchLabelStatus(data) {
        return axios.post('/common/searchstatus', data);
    },
    // 热门分类
    getHotList(data) {
        return axios.request('/hot/list', data);
    },
    updateHotChildCategories(data) {
        return axios.post('/hot/save', data);
    },
};
