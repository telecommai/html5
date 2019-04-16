/*添加聊天列表action
author：xpf
*/
const AddChatAction = (chatinfo) => {
	return {
		type: "AddChat",
		chat: chatinfo,
	}
};
export default AddChatAction