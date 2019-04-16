/*加载群组成员动作
 *author:xpf
 */
const LoadGroupUserListAction = (groupid, list) => {
	return {
		type: "LoadGroupUserList",
		groupid: groupid,
		list: list,
	}
};
export default LoadGroupUserListAction