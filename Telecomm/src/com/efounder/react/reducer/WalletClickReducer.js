/*钱包左侧Row点击reducer
author:xpf
*/
function WalletClickReducer(state = {
    clickRowKey: "",
    clickRowInfo: [],
}, action) {
    switch (action.type) {
        case 'WalletClick':
            state.clickRowKey = action.clickRowKey;
            state.clickRowInfo = action.clickRowInfo;
            return {
                ...state
            }
        default:
            return state
    }
}
export default WalletClickReducer