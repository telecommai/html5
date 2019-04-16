/*添加聊天列表action
author：xpf
*/
const LoadChildrenWalletAction = (ChildrenWallet) => {
	return {
		type: "loadchildwallet",
		ChildrenWallet: ChildrenWallet,
	}
};
export default LoadChildrenWalletAction