/*emmm，用于在聊天界面添加聊天人action
author:xpf
*/
function SystemMsgReducer(state = {
	systemMsgList: [],
}, action) {
	switch (action.type) {
		case 'AddSystemMsg':
			var newState = null;
			newState = Object.assign({}, state);
			newState.systemMsgList.push(action.systemMsg);
			var list = [];
			for (var value of newState.systemMsgList) {
				list.push(value);
			}
			state.systemMsgList = list
			return {
				...state
			}
		case "DeleteSystemMsg":
			var newState = null;
			newState = Object.assign({}, state);
			var flag = false
			var list = [];
			for (var value of newState.systemMsgList) {
				if (value.guid != action.systemMsg.guid) {
					list.push(value);
				}
			}
			state.systemMsgList = list;
			return { ...state
			}
		default:
			return state;
	}
}
export default SystemMsgReducer