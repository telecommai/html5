/*updateUserListInfo
author：xpf
*/
const UpdateUserListInfoAction = (userinfo) => {
	return {
		type: "UpdateUserListInfo",
		user: userinfo,
	}
};
export default UpdateUserListInfoAction