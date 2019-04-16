/*我接收的消息状态的改变
author：xpf
*/
const FileStateChangeAction = (message) => {
	return {
		type: "FileStateChange",
		message: message
	}
};
export default FileStateChangeAction