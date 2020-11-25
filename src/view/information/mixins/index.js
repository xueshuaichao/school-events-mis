/*
 * @des mixins
 * */
import { reportCategoryList } from '@/libs/enum';

export default {
    methods: {
        getReportCategoryNames(data = []) {
            return reportCategoryList
                .reduce((ac, cu, index) => {
                    const names = ac;
                    if (data.includes(String(index + 1))) {
                        names.push(cu);
                    }
                    return names;
                }, [])
                .toString();
        },
    },
};
