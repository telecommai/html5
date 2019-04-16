/*书写组件的模板
 author:xpf
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import { Form,Input,Button,Row,Col,message } from 'antd';
import EncryptOrDecrypt from "../util/EncryptOrDecrypt.js";
var bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/dist/hdkey');
var ethUtil = require('ethereumjs-util');
var FileSaver = require('file-saver');
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
    display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'flex-end'
};
const labelLayout = {
    color:'#000'
};
//最好类名跟文件名对应
class FormMnemonicCard extends React.Component {
    constructor(props){
        super(props);
    }
    //组件挂载完成后回调
    componentDidMount(){}
    //组件有更新后回调
    componentDidUpdate(){}
    //组件将要挂载时回调
    componentWillMount(){}
    //组件销毁时回调
    componentWillUnmount(){}
    //props改变回调函数
    componentWillReceiveProps(nextProps){}
    //点击下一步执行
    nextHandler=(e)=>{
        var words = '';
        for(let i = 0; i < 12; i++){
            var value = document.getElementById('mnemonic-'+(i+1)).value;
            if(value==""||value==null||value==undefined||value=="undefined"){
                message.error("有未输入的助记词，请输入")
                return;
            }
            if (i >= 11){
                words = words + value;
            }else {
                words = words + value + ' ';
            }
        }
        this.createWalletByMnemonic(words);
    }
    createWalletByMnemonic(words) {
        // 先将 mnemonic code 转成 binary 的 seed。
        var seed = bip39.mnemonicToSeed(words);

        // 使用 seed 产生 HD Wallet。如果要说更明确，就是产生 Master Key 并记录起来
        var hdWallet = hdkey.fromMasterSeed(seed);

        // 产生 Wallet 中第一个帐户的第一组 keypair。可以从 Master Key，根据其路径 m/44'/60'/0'/0/0 推导出来
        var key1 = hdWallet.derivePath("m/44'/60'/0'/0/0");

        // 私钥
        var privateKey = key1._hdkey._privateKey;
        privateKey = ethUtil.bufferToHex(privateKey);
        //privateKey = ethUtil.toChecksumAddress(privateKey.toString('hex'));

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


        //加密后的私钥
        var eod = new EncryptOrDecrypt()

        let privateKeyEncrypted = eod.encrypt(sessionStorage.getItem("password"),sessionStorage.getItem("password"),privateKey);

        sessionStorage.setItem("ethPrivateKey",privateKeyEncrypted)
        sessionStorage.setItem("ethAddress",publicKey2Address.toLowerCase())
        message.success("恢复成功")
        /*//加密后的公钥
        let publicKeyEncrypted =this.Encrypt(publicKey);*/
        //加密后的地址
        /*let addressEncrypted = this.Encrypt(publicKey2Address);*/

        /*var text = {};
        text.privKey = privateKeyEncrypted;
        text.publicKey = publicKeyEncrypted;
        text.address = addressEncrypted;*/
        //let dataStr = JSON.stringify(privateKey);

        // var text = "私钥:"+encrypted;
        //导出本地文件
        /*var blob = new Blob([JSON.stringify(text)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "秘钥.txt");*/
    }

    //组件的渲染界面
    render() {
        const inputStyle={outline:"none",borderRadius:5,height:this.props.windowHeight*0.05,color:"#FFFFFF",width:this.props.windowWidth*0.1,border:"1px solid #354e72",backgroundColor:"transparent"}
        return (
            <div>
                <Row style={{backgroundColor:'transparent',display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center'}}>
                    <Col span={24}>
                            <Row style={{paddingBottom:this.props.windowHeight*0.015}}>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-1" placeholder="1." style={inputStyle} />
                                </Col>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-2" placeholder="2." style={inputStyle} />
                                </Col>
                            </Row>
                            <Row style={{paddingBottom:this.props.windowHeight*0.015}}>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-3" placeholder="3." style={inputStyle} />
                                </Col>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-4" placeholder="4." style={inputStyle} />
                                </Col>
                            </Row>
                            <Row style={{paddingBottom:this.props.windowHeight*0.015}}>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-5" placeholder="5." style={inputStyle} />
                                </Col>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-6" placeholder="6." style={inputStyle} />
                                </Col>
                            </Row>
                            <Row style={{paddingBottom:this.props.windowHeight*0.015}}>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-7" placeholder="7." style={inputStyle} />
                                </Col>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-8" placeholder="8." style={inputStyle} />
                                </Col>
                            </Row>
                            <Row style={{paddingBottom:this.props.windowHeight*0.015}}>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-9" placeholder="9." style={inputStyle} />
                                </Col>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-10" placeholder="10." style={inputStyle} />
                                </Col>
                            </Row>
                            <Row style={{paddingBottom:this.props.windowHeight*0.015}}>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-11" placeholder="11." style={inputStyle} />
                                </Col>
                                <Col span={10} offset={1}>
                                    <input id="mnemonic-12" placeholder="12." style={inputStyle} />
                                </Col>
                            </Row>
                            <Row style={{marginBottom:10}}>
                                <Button onClick={this.nextHandler} type="primary" htmlType="submit" className="next-step-btn">恢复</Button>
                            </Row>
                    </Col>
                </Row>
            </div>
        )
    }

}
//类属性
FormMnemonicCard.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {

  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormMnemonicCard);