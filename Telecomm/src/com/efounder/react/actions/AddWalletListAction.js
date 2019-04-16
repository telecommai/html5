/*添加聊天列表action
author：xpf
*/
const AddWalletListAction = (wallettype, walletinfo) => {
	return {
		type: "AddWallet",
		walletinfo: walletinfo,
		wallettype: wallettype,
	}
};
export default AddWalletListAction