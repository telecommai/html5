import React, { Component } from 'react';

var bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/dist/hdkey');
var ethUtil = require('ethereumjs-util');

class WalletMnemonic extends Component {
    constructor(props){
        super(props);

        this.bip39Test();
    }

    bip39Test() {
        // 生成12个助记词
        var  words = bip39.generateMnemonic();

        // 先将 mnemonic code 转成 binary 的 seed。
        var seed = bip39.mnemonicToSeed(words);

        // 使用 seed 产生 HD Wallet。如果要说更明确，就是产生 Master Key 并记录起来
        var hdWallet = hdkey.fromMasterSeed(seed);

        // 产生 Wallet 中第一个帐户的第一组 keypair。可以从 Master Key，根据其路径 m/44'/60'/0'/0/0 推导出来
        var key1 = hdWallet.derivePath("m/44'/60'/0'/0/0");

        // 私钥
        var privateKey = key1._hdkey._privateKey;
        privateKey = ethUtil.toChecksumAddress(privateKey.toString('hex'));


        // 根据私钥产生地址
        var privateKey2Address = ethUtil.privateToAddress(privateKey);
        privateKey2Address = ethUtil.toChecksumAddress(privateKey2Address.toString('hex'));


        // 公钥
        var publicKey = key1._hdkey._publicKey;
        publicKey = ethUtil.toChecksumAddress(publicKey.toString('hex'));

        // 根据公钥产生地址
        var publicKey2Address = ethUtil.pubToAddress(publicKey, true);
        // 用 EIP55: Mixed-case checksum address encoding 再进行编码
        publicKey2Address = ethUtil.toChecksumAddress(publicKey2Address.toString('hex'));

    }


    //组件的渲染界面
    render() {
        return (
            <div style={{height:'100%'}}>
            </div>
        )
    }
}

export default WalletMnemonic;