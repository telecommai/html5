/*添加聊天记录action
author：xpf
*/
const AddChatRecordAction = (chatid, message, user) => {
	return {
		type: "AddChatRecord",
		chatid: chatid,
		message: message,
		chat: user
	}
};
export default AddChatRecordAction