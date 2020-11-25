export default {
    state: {
        searchParams: {},
    },
    mutations: {
        setSearchParams(state, data) {
            state.searchParams = data;
        },
    },
};
