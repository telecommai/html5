/*添加聊天列表action
author：xpf
*/
const LoadLoginUserInfo = (userinfo) => {
	return {
		type: "loaduserinfo",
		userInfo: userinfo,
	}
};
export default LoadLoginUserInfo