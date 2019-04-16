/*顶部菜单点击reducer
author:xpf
*/
function ThemeReducer(state = {
    theme: require("../style/theme.json")
}, action) {
    switch (action.type) {
        case 'loadtheme':
            state.theme = action.theme;
            return {
                ...state
            }
        default:
            return state
    }
}
export default ThemeReducer