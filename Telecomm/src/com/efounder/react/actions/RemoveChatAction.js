/*移除聊天人action
author：xpf
reducer在ChatListReducer里面，用于删除聊天
*/
const RemoveChatAction = (chatinfo) => {
	return {
		type: "RemoveChat",
		chat: chatinfo,
	}
};
export default RemoveChatAction