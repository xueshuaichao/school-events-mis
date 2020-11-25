const RESOURCE_TYPE = {
    person: 1,
    group: 2,
    sports: 1, // 爱挑战竞技
    talent: 2, // 才艺秀
    education: 3, // 教育抖音
    guinness: 4, // 爱挑战吉尼斯
    live: 1001, // 网络直播塞
    spring: 5,
    festival: 6,
    epidemic: 7,
    read: 8,
    teenagers: 10,
    childhood: 11,
};

const COLUMNS_MAP = {
    default_columns: [
        {
            title: '参赛项目',
            key: 'category_name',
            align: 'center',
        },
        {
            title: '作品封面',
            slot: 'bannerImage',
            align: 'center',
        },
        {
            title: '成绩/单位',
            key: 'achievement',
            align: 'center',
        },
        {
            title: '参赛者',
            key: 'create_name',
        },
        {
            title: '学校名称',
            key: 'school_name',
        },
        {
            title: '学段',
            key: 'education_level',
            align: 'center',
        },
        {
            title: '年级',
            key: 'grade_name',
            align: 'center',
        },
        {
            title: '上报时间',
            key: 'created_at',
            align: 'center',
        },
        // {
        //     title: '审核时间',
        //     key: 'created_at',
        //     align: 'center',
        // },
        // {
        //     title: '状态',
        //     key: 'status',
        //     align: 'center',
        //     slot: 'checkStatus',
        // },
        {
            title: '初审状态',
            key: 'machine_status_name',
            align: 'center',
        },
        {
            title: '初审意见',
            key: 'machine_reason',
            align: 'center',
        },
        {
            title: '复审状态',
            key: 'user_status_name',
            align: 'center',
        },
        {
            title: '操作',
            slot: 'action',
            align: 'center',
        },
    ],
    education_columns: [
        {
            title: '视频名称',
            key: 'name',
            align: 'center',
        },
        {
            title: '分类',
            key: 'category_name',
            align: 'center',
        },
        {
            title: '提交时间',
            key: 'created_at',
            align: 'center',
        },
        {
            title: '审核时间',
            key: 'created_at',
            align: 'center',
        },
        {
            title: '状态',
            key: 'status',
            align: 'center',
            slot: 'checkStatus',
        },
        {
            title: '操作',
            slot: 'checkAction',
            align: 'center',
        },
    ],
    talent_columns: [
        {
            title: '作品名称',
            key: 'name',
            align: 'center',
        },
        {
            title: '作品封面',
            slot: 'bannerImage',
            align: 'center',
        },
        {
            title: '作品分类',
            key: 'category_name',
            align: 'center',
        },
        {
            title: '参赛者',
            key: 'create_name',
            align: 'center',
        },
        {
            title: '学校',
            key: 'school_name',
            align: 'center',
        },
        {
            title: '年级',
            key: 'grade_name',
            align: 'center',
        },
        {
            title: '上报时间',
            key: 'created_at',
            align: 'center',
        },
        // {
        //     title: '审核时间',
        //     key: 'audit_time',
        //     align: 'center',
        // },
        // {
        //     title: '状态',
        //     key: 'status',
        //     align: 'center',
        //     slot: 'checkStatus',
        // },
        {
            title: '初审状态',
            key: 'machine_status_name',
            align: 'center',
        },
        {
            title: '复审状态',
            key: 'user_status_name',
            align: 'center',
        },
        {
            title: '操作',
            slot: 'action',
            align: 'center',
        },
    ],
    spring_columns: [
        {
            title: '作品名称',
            key: 'resource_name',
            align: 'center',
        },
        {
            title: '作品封面',
            slot: 'bannerImage',
            align: 'center',
        },
        {
            title: '参赛者',
            key: 'user_name',
            align: 'center',
        },
        {
            title: '作品分类',
            key: 'cat_name',
            align: 'center',
        },
        {
            title: '形式',
            key: 'resource_type',
            align: 'center',
        },
        {
            title: '票数',
            key: 'thumb',
            align: 'center',
            sortable: 'custom',
        },
        {
            title: '上报时间',
            width: 160,
            key: 'created_at',
            align: 'center',
            sortable: 'custom',
        },
        {
            title: '初审状态',
            key: 'machine_status_name',
            align: 'center',
        },
        {
            title: '初审意见',
            key: 'machine_reason',
            align: 'center',
        },
        {
            title: '复审状态',
            key: 'user_status_name',
            align: 'center',
        },
        {
            title: '操作',
            slot: 'action',
            width: 140,
            align: 'center',
        },
    ],
};

const SPRING_CATEGORY = [
    {
        cat_id: 16,
        name: '歌唱表演',
    },
    {
        cat_id: 17,
        name: '舞蹈表演',
    },
    {
        cat_id: 18,
        name: '口才表演',
    },
    {
        cat_id: 19,
        name: '乐器演奏',
    },
    {
        cat_id: 20,
        name: '创意制作',
    },
    {
        cat_id: 21,
        name: '书法与绘画',
    },
    {
        cat_id: 23,
        name: '杂技魔术',
    },
    // {
    //     cat_id: 24,
    //     name: '魔术',
    // },
    {
        cat_id: 101,
        name: '摄影',
    },
];

const EPIDEMIC_CATEGORY = [
    {
        cat_id: 21,
        name: '书法绘画',
    },
    {
        cat_id: 18,
        name: '朗诵',
    },
    {
        cat_id: 16,
        name: '歌唱',
    },
    {
        cat_id: 17,
        name: '舞蹈',
    },
    {
        cat_id: 101,
        name: '摄影',
    },
    {
        cat_id: 102,
        name: '创意设计',
    },
    {
        cat_id: 25,
        name: '其他',
    },
];

const EPIDEMIC_GROUP = [
    {
        id: 1,
        name: '青少年',
    },
    {
        id: 2,
        name: '成年',
    },
];

const READ_GROUP = [
    {
        id: 1,
        name: '中文组',
    },
    {
        id: 2,
        name: '英文组',
    },
];

const CHILDHOOD_CATEGORY = [
    {
        cat_id: 1,
        name: '歌舞表演',
    },
    {
        cat_id: 2,
        name: '舞蹈表演',
    },
];
const EVENT_BTN_LIST = {
    defaultBtnList: [
        {
            name: 'resourceDetail',
            show(params) {
                return params.status !== 1;
            },
        },
        {
            name: 'edit',
            show(params) {
                return true || params.status !== 3;
            },
        },
        {
            name: 'top',
            show(params) {
                return (
                    params.status !== 3
                    && params.show === 1
                    && params.is_top === 0
                );
            },
        },
        {
            name: 'unTop',
            show(params) {
                return (
                    params.status !== 3
                    && params.show === 1
                    && params.is_top === 1
                );
            },
        },
        {
            name: 'upperShelf',
            show(params) {
                return params.show === 0;
            },
        },
        {
            name: 'lowerShelf',
            show(params) {
                return params.show === 1;
            },
        },
    ],
    topBtnList: [
        {
            name: 'up',
            show(params) {
                return params.index > 1;
            },
        },
        {
            name: 'down',
            show(params) {
                return params.index < params.total;
            },
        },
    ],
};
export default {
    RESOURCE_TYPE,
    COLUMNS_MAP,
    SPRING_CATEGORY,
    EPIDEMIC_CATEGORY,
    EPIDEMIC_GROUP,
    READ_GROUP,
    CHILDHOOD_CATEGORY,
    EVENT_BTN_LIST,
};
