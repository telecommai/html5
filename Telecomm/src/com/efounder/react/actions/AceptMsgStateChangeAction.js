/*我接收的消息状态的改变
author：xpf
*/
const AceptMsgStateChangeAction = (message) => {
	return {
		type: "ChangeAceptState",
		message: message
	}
};
export default AceptMsgStateChangeAction