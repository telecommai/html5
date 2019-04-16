/*删除系统消息action
author：xpf
*/
const DeleteSystemMsgAction = (message) => {
	return {
		type: "DeleteSystemMsg",
		systemMsg: message,
	}
};
export default DeleteSystemMsgAction