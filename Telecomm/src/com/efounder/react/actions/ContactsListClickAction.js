/*用户列表点击action
author:xpf
*/
const ContactsListClickAction = (selectRow, listtype) => {
	return {
		type: "ContactsListClick",
		selectRow: selectRow,
		listtype: listtype,
	}
};
export default ContactsListClickAction