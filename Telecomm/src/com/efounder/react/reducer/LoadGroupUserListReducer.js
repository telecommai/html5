/*用户列表点击reducer
author:xpf
*/
function LoadGroupUserListReducer(state = {
    groupuserlist: [],
    adminlist: [],
    userself: [],
}, action) {
    switch (action.type) {
        case 'LoadGroupUserList':
            var newstate = Object.assign({}, state);
            var userlisttmp = [];
            var adminlisttmp = [];
            var userselftmp = [];
            for (var value of newstate.groupuserlist) {
                if (value.groupid != action.groupid) {
                    userlisttmp.push(value);
                }
            }
            for (var value of newstate.adminlist) {
                if (value.groupid != action.groupid) {
                    adminlisttmp.push(value);
                }
            }
            for (var value of newstate.userself) {
                if (value.groupid != action.groupid) {
                    userselftmp.push(value);
                }
            }
            newstate.groupuserlist = userlisttmp;
            newstate.adminlist = adminlisttmp;
            newstate.userself = userselftmp;
            var qz = [];
            var gly = [];
            var cy = [];
            var me = null;
            for (var value of action.list) {
                if (value.mana == 9) {
                    qz.push(value);
                }
                if (value.mana == 1) {
                    gly.push(value);
                }
                if (value.userId == sessionStorage.getItem("imUserId")) {
                    me = value;
                }
                if (value.mana == 0) {
                    cy.push(value);
                }
            }
            var userlist = [];
            userlist.push(...qz);
            userlist.push(...gly);
            userlist.push(...cy);
            var adminlist = [];
            adminlist.push(...qz);
            adminlist.push(...gly);
            newstate.groupuserlist.push({
                groupid: action.groupid,
                list: userlist,
            })
            newstate.adminlist.push({
                groupid: action.groupid,
                list: adminlist,
            })
            newstate.userself.push({
                groupid: action.groupid,
                user: me,
            })
            state.groupuserlist = newstate.groupuserlist;
            state.adminlist = newstate.adminlist;
            state.userself = newstate.userself;
            return {
                ...state
            }
        default:
            return state
    }
}
export default LoadGroupUserListReducer