/*添加系统消息action
author：xpf
*/
const AddSystemMsgAction = (message) => {
	return {
		type: "AddSystemMsg",
		systemMsg: message,
	}
};
export default AddSystemMsgAction