/*用户列表点击reducer
author:xpf
*/
function ContactsListClickReducer(state = {
    selectRow: null,
    listtype: null,
}, action) {
    switch (action.type) {
        case 'ContactsListClick':
            state.selectRow = action.selectRow;
            state.listtype = action.listtype;
            return {
                ...state
            }
        default:
            return state
    }
}
export default ContactsListClickReducer