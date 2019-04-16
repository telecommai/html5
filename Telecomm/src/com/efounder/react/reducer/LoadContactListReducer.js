/*将联系人列表持久化到store
author：xpf
*/
function LoadContactListReducer(state = {
	userlist: [],
	userlistresult: "",
	userlistcount: 0,
	orguserlist: [],
	grouplist: [],
	grouplistresult: "",
	grouplistcount: 0,
	publiclist: [],
	publiclistresult: "",
	publiclistcount: 0,
}, action) {
	switch (action.type) {
		case 'UserListLoad':
			state.userlist = action.list;
			state.userlistresult = action.result;
			state.userlistcount = action.count;
			state.orguserlist = getOrgUserList(action.list)
			return {
				...state
			}
		case 'GroupListLoad':
			state.grouplist = action.list;
			state.grouplistresult = action.result;
			state.grouplistcount = action.count;
			return {
				...state
			}
		case 'PublicListLoad':
			state.publiclist = action.list;
			state.publiclistresult = action.result;
			state.publiclistcount = action.count;
			return {
				...state
			}
		case 'UpdateUserListInfo':
			var newState = Object.assign({}, state)
			var userlist = newState.userlist;
			for (var i = userlist.length - 1; i >= 0; i--) {
				if (userlist[i].imUserId == action.user.imUserId) {
					userlist[i] = action.user;
					break;
				}
			}
			newState.orguserlist = getOrgUserList(userlist)
			newState.userlist = userlist;
			return {
				...newState
			}
		case 'DeleteGroup':
			var newState = Object.assign({}, state)
			var grouplist = newState.grouplist;
			var newgrouplist = [];
			for (var i = grouplist.length - 1; i >= 0; i--) {
				if (grouplist[i].groupId != action.groupId) {
					newgrouplist.push(grouplist[i])
				}
			}
			newState.grouplist = newgrouplist;
			return {
				...newState
			}
		default:
			return state
	}
}

function getOrgUserList(userlist) {
	var orgUserList = [];
	for (var i = userlist.length - 1; i >= 0; i--) {
		if (userlist[i].ZMNO == undefined) {
			orgUserList.push(userlist[i])
		}
	}
	return orgUserList
}
export default LoadContactListReducer