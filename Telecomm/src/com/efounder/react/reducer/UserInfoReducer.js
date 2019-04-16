/*顶部菜单点击reducer
author:xpf
*/
function UserInfoReducer(state = {
    userInfo: null
}, action) {
    switch (action.type) {
        case 'loaduserinfo':
            state.userInfo = action.userInfo;
            return {
                ...state
            }
        default:
            return state
    }
}
export default UserInfoReducer