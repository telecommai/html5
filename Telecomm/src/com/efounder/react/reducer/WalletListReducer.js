/*存储不同的钱包地址
author:xpf
*/
function WalletListReducer(state = {
    ChildrenWallet: [],
    BTCWalletInfo: {},
    EOSWalletInfo: {},
    BTCWalletList: [],
    BTCTokensWalletList: [],
    BTCCurrentWallet: {},
    EOSWalletList: [],
    EOSTokensWalletList: [],
    ETHWalletList: [],
    ETHTokensWalletList: [],
    ETHCurrentWallet: {},
}, action) {
    switch (action.type) {
        case 'loadchildwallet':
            var newState = Object.assign({}, state);
            newState.BTCTokensWalletList = []
            newState.EOSTokensWalletList = []
            var BTCWalletList = newState.BTCWalletList;
            var ETHWalletList = newState.ETHWalletList;
            for (var value of action.ChildrenWallet) {
                if (value.blockChainName == "BTC") {
                    if (BTCWalletList.length != 0) {
                        var flag = false;
                        for (var i = 0; i < BTCWalletList.length; i++) {
                            if (BTCWalletList[i].accountAddress == value.accountAddress) {
                                BTCWalletList[i] = value;
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            BTCWalletList.push(value)
                        }
                    } else {
                        BTCWalletList.push(value)
                    }
                }
                if (value.blockChainName == "ETH") {
                    if (ETHWalletList.length != 0) {
                        var flag = false;
                        for (var i = 0; i < ETHWalletList.length; i++) {
                            if (ETHWalletList[i].accountAddress == value.accountAddress) {
                                ETHWalletList[i] = value;
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            ETHWalletList.push(value)
                        }
                    } else {
                        ETHWalletList.push(value)
                    }
                }
                if (value.blockChainName == "EOSTEST") {
                    newState.EOSWalletInfo = value;

                    newState.EOSTokensWalletList.push(value)
                }

            }
            newState.BTCCurrentWallet = BTCWalletList[0];
            newState.BTCTokensWalletList.push(BTCWalletList[0])
            return {
                ...newState
            }
        case 'AddWallet':
            var newState = Object.assign({}, state);
            var wallettype = action.wallettype;
            var address = action.walletinfo.accountAddress;
            var ETHWalletList = newState.ETHWalletList;

            if (wallettype == "ETH") {
                if (ETHWalletList.length != 0) {
                    var flag = false;
                    for (var i = 0; i < ETHWalletList.length; i++) {
                        if (ETHWalletList[i].accountAddress == address) {
                            ETHWalletList[i] = action.walletinfo;
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        ETHWalletList.push(action.walletinfo)
                    }
                } else {
                    ETHWalletList.push(action.walletinfo)
                }
            }
            if (ETHWalletList.length != 0) {
                for (var value of ETHWalletList) {
                    if (value.accountAddress == value.mainAccountAddress) {
                        newState.ETHCurrentWallet = value;
                        break;
                    }
                }
            }
            return {
                ...newState
            }
        case 'SwitchWallet':
            if (action.waltype == "ETH") {
                var newState = Object.assign({}, state);
                newState.ETHCurrentWallet = action.walletinfo;
                return {
                    ...newState
                }
            }
            if (action.waltype == "BTC") {
                var newState = Object.assign({}, state);
                newState.BTCCurrentWallet = action.walletinfo;
                newState.BTCTokensWalletList = [];
                newState.BTCTokensWalletList.push(action.walletinfo);
                return {
                    ...newState
                }
            }
        default:
            return state
    }
}
export default WalletListReducer