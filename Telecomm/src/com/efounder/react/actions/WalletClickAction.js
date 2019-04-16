/*钱包左侧列表点击事件
author：xpf
*/
const WalletClickAction = (clickRowKey, clickRowInfo) => {
	return {
		type: "WalletClick",
		clickRowKey: clickRowKey,
		clickRowInfo: clickRowInfo,
	}
};
export default WalletClickAction