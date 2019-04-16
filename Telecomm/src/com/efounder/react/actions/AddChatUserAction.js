/*添加聊天列表action
author：xpf
*/
const AddChatUserAction = (chat) => {
	return {
		type: "AddChatUser",
		chat: chat,
	}
};
export default AddChatUserAction