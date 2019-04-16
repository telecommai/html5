/*切换钱包的action
author：xpf
*/
const SwitchWalletAction = (walletinfo, waltype) => {
	return {
		type: "SwitchWallet",
		walletinfo: walletinfo,
		waltype: waltype,
	}
};
export default SwitchWalletAction