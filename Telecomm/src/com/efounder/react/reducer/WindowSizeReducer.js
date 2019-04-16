/*获取浏览器宽高reducer
author:xpf
*/
function WindowSizeReducer(state = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    fontSize: null,
}, action) {
    switch (action.type) {
        case 'loadWindowSize':
            if (action.height > 615) {
                state.windowHeight = action.height;
            } else {
                state.windowHeight = 615;
            }
            if (action.width > 1000) {
                state.windowWidth = action.width;
            } else {
                state.windowWidth = 1000;
            }
            return {
                ...state
            }
        default:
            return state
    }
}
export default WindowSizeReducer