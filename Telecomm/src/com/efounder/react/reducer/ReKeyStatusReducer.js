/*钱包左侧Row点击reducer
author:xpf
*/
function ReKeyStatusReducer(state = {
    status: false,
}, action) {
    switch (action.type) {
        case 'OpenReKeyModal':
            state.status = action.status;
            return {
                ...state
            }
        default:
            return state
    }
}
export default ReKeyStatusReducer