import React, { Component } from 'react';
import { Row, Col, Input, Button, Tag } from 'antd';
import * as CryptoJS from 'crypto-js';
var bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/dist/hdkey');
var ethUtil = require('ethereumjs-util');
var FileSaver = require('file-saver');
const { TextArea } = Input;
let wordsEncrypted;
let publicKeyEncrypted;
let addressEncrypted;
function onClick(e) {
    generateMnemonic();
}

function generateMnemonic() {
    // 生成12个助记词
    var  words = bip39.generateMnemonic();
    // 先将 mnemonic code 转成 binary 的 seed。
    var seed = bip39.mnemonicToSeed(words);
    // 使用 seed 产生 HD Wallet。如果要说更明确，就是产生 Master Key 并记录起来
    var hdWallet = hdkey.fromMasterSeed(seed);
    // 产生 Wallet 中第一个帐户的第一组 keypair。可以从 Master Key，根据其路径 m/44'/60'/0'/0/0 推导出来
    var key1 = hdWallet.derivePath("m/44'/60'/0'/0/0");

    var privateKey = key1._hdkey._privateKey;
    privateKey = privateKey.toString('hex');//ethUtil.toChecksumAddress(privateKey.toString('hex'));


    var a = key1._hdkey._privateKey;


    // 公钥
    var publicKey = key1._hdkey._publicKey;
    publicKey = ethUtil.toChecksumAddress(publicKey.toString('hex'));
    // 根据公钥产生地址
    var publicKey2Address = ethUtil.pubToAddress(publicKey, true);
    // 用 EIP55: Mixed-case checksum address encoding 再进行编码
    publicKey2Address = ethUtil.toChecksumAddress(publicKey2Address.toString('hex'));
    // 设置地址
    document.getElementById('addressTextArea01').value = publicKey2Address;
    // 设置 助记词
    var word = words.split(' ');
    for (var i = 0; i<word.length; i++) {
        var w = word[i];
        var id = 'mnemonicText' + (i+1);
        document.getElementById(id).innerText = w;
    }
    let AuthTokenKey = "1234567890123456"; //AES密钥
    let AuthTokenIv = '1234567890123456'; //AES向量

    wordsEncrypted = CryptoJS.AES.encrypt(words, CryptoJS.enc.Latin1.parse(AuthTokenKey), {
        iv: CryptoJS.enc.Latin1.parse(AuthTokenIv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    publicKeyEncrypted = CryptoJS.AES.encrypt(publicKey, CryptoJS.enc.Latin1.parse(AuthTokenKey), {
        iv: CryptoJS.enc.Latin1.parse(AuthTokenIv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    addressEncrypted = CryptoJS.AES.encrypt(publicKey2Address, CryptoJS.enc.Latin1.parse(AuthTokenKey), {
        iv: CryptoJS.enc.Latin1.parse(AuthTokenIv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
}
class CreateMnemonicPanel extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        // 设置地址框只读
        document.getElementById('addressTextArea01').setAttribute("readonly", true);
    }
    exportKey(){
        var text = {};
        text.mnemonic = wordsEncrypted.toString();
        text.publicKey = publicKeyEncrypted.toString();
        text.address = addressEncrypted.toString();
        //let dataStr = JSON.stringify(privateKey);

        var blob = new Blob([JSON.stringify(text)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "秘钥.txt");
    }
    render(){
        return(
            <div style={{width:450, height:500, textAlign:'center', padding:20,
                margin: 'auto', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
            }}>
                <Row style={{ height:55, textAlign:'center' }}>
                    <Button onClick={onClick}>创建账户</Button>
                </Row>

                <Row style={{textAlign:'left'}}>
                    <TextArea id='addressTextArea01' rows={3} style={{width:410 }}></TextArea>
                </Row>

                <Row style={{marginTop:20, textAlign:'left'}}>
                    <h5>助记词:</h5>
                </Row>

                <div style={{paddingLeft:10, paddingTop:20, height:200, width:410, border:'1px #ccc solid', borderRadius:'4px'}}>
                    <Row gutter={20} style={{textAlign:'left', width:400, height:45}}>
                        <Col span={8}>
                            <Tag id="mnemonicText1" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText2" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText3" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                    </Row>
                    <Row gutter={20} style={{textAlign:'left', width:400, height:45}}>
                        <Col span={8}>
                            <Tag id="mnemonicText4" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText5" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText6" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                    </Row>
                    <Row gutter={20} style={{textAlign:'left', width:400, height:45}}>
                        <Col span={8}>
                            <Tag id="mnemonicText7" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText8" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText9" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                    </Row>
                    <Row gutter={20} style={{textAlign:'left', width:400, height:45}}>
                        <Col span={8}>
                            <Tag id="mnemonicText10" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText11" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                        <Col span={8}>
                            <Tag id="mnemonicText12" style={{width:120, height:25}} color="geekblue"></Tag>
                        </Col>
                    </Row>
                    <Row gutter={20} style={{textAlign:'left', width:400, height:45}}>
                        <Col span={12}>
                            <Button onClick={this.exportKey}>导出</Button>
                        </Col>
                    </Row>
                </div>

            </div>
        );
    }
}

export default CreateMnemonicPanel;