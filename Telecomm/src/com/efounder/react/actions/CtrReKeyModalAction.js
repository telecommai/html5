/*打开活关闭恢复私钥恢复钱包弹窗action
author：xpf
*/
const CtrReKeyModalAction = (status) => {
	return {
		type: "OpenReKeyModal",
		status: status,
	}
};
export default CtrReKeyModalAction