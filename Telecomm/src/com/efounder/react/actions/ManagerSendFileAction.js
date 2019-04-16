/*添加发送文件动作
author：xpf
*/
const ManagerSendFileAction = (type, fileinfo) => {
	return {
		type: type,
		fileinfo: fileinfo,
	}
};
export default ManagerSendFileAction