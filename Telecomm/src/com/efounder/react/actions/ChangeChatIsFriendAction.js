/*添加好友后改变状态action
author：xpf
*/
const ChangeChatIsFriendAction = (userid) => {
	return {
		type: "ChangeChatIsFriend",
		id: userid,
	}
};
export default ChangeChatIsFriendAction