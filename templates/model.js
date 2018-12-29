export default {
    namespace: 'model',
    state: {

    },
    reducers: {
        add(state) {
            return state;
        },
    },
    effects: {
        *addAfter1Second(action, { call, put }) {
            yield call(delay, 1000);
            yield put({
                type: 'add'
            });
        },
    },
}