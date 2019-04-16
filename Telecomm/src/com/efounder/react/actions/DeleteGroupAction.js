/*删除用户列表某个群组action
author：xpf
*/
const DeleteGroupAction = (groupId) => {
	return {
		type: "DeleteGroup",
		groupId: groupId,
	}
};
export default DeleteGroupAction