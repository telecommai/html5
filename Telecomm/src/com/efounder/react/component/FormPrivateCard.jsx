/*书写组件的模板
 author:xpf
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import { Form,Input,Button,Row,Col,message } from 'antd';
import EncryptOrDecrypt from "../util/EncryptOrDecrypt.js";
import '../style/formInput.css';
import '../style/formItemLabelColor.css';
import '../style/formButton.css';
var bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/dist/hdkey');
var ethUtil = require('ethereumjs-util');
var FileSaver = require('file-saver');
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
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
class FormPrivateCard extends React.Component {
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
    recoverByPrivateKey=(e)=>{
        var privateKey = document.getElementById('privateKey').value;
        sessionStorage.setItem("ethPrivateKey",privateKeyEncrypted)
        privateKey = ethUtil.toChecksumAddress(privateKey.toString('hex'));
        //地址
        var privateKey2Address = ethUtil.privateToAddress(privateKey);
        privateKey2Address = ethUtil.toChecksumAddress(privateKey2Address.toString('hex'));
        //加密后的私钥
        var eod = new EncryptOrDecrypt()
        let privateKeyEncrypted = eod.encrypt(sessionStorage.getItem("password"),sessionStorage.getItem("password"),privateKey);
        message.success("恢复成功")
        //加密后的地址
        /*let addressEncrypted = this.Encrypt(privateKey2Address);*/

        /*var text = {};
        text.privateKey = privateKeyEncrypted;
        text.address = addressEncrypted;
        //导出本地文件
        var blob = new Blob([JSON.stringify(text)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "秘钥.txt");*/
    }

    //组件的渲染界面
    render() {
        return (
            <div>
                <Row style={{height:'100%',display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center'}}>
                    <Col span={24}>
                            <Row>
                                <Col span={20} offset={2}>
                                    <div style={{}}>
                                        请输入私钥
                                    </div>
                                    <div>
                                        <TextArea  id="privateKey"  style={{outline:"none",borderRadius:5,height:this.props.windowHeight*0.15,color:"#FFFFFF",width:this.props.windowWidth*0.2  ,border:"1px solid #354e72",backgroundColor:"transparent"}}/>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col>
                                    <Button onClick={this.recoverByPrivateKey} type="primary" htmlType="submit" className="next-step-btn">恢复</Button>
                                </Col>
                            </Row>
                    </Col>
                </Row>
            </div>
        )
    }

}
//类属性
FormPrivateCard.propTypes = {

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
)(FormPrivateCard);