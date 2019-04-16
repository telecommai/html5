/*我发送的消息状态的改变
author：xpf
*/
const MsgStateChangeAction = (message) => {
	return {
		type: "ChangeRecordState",
		message: message
	}
};
export default MsgStateChangeAction