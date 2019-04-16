/*添加聊天列表action
author：xpf
*/
const WalletTabsClickAction = (WalletTabsKey) => {
	return {
		type: "WalletTabsClick",
		key: WalletTabsKey,
	}
};
export default WalletTabsClickAction