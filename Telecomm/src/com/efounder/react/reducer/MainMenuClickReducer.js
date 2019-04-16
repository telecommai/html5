/*顶部菜单点击reducer
author:xpf
*/
function MainMenuClickReducer(state = {
    menukey: "message",
    groupmenukey: "groupdetails",
    wallettabskey: "PWR",
}, action) {
    switch (action.type) {
        case 'MainMenuClick':
            state.menukey = action.menukey;
            return {
                ...state
            }
        case 'GroupCardMenuClick':
            state.groupmenukey = action.menukey;
            return {
                ...state
            }
        case 'WalletTabsClick':
            state.wallettabskey = action.key
            return {
                ...state
            }
        default:
            return state
    }
}
export default MainMenuClickReducer