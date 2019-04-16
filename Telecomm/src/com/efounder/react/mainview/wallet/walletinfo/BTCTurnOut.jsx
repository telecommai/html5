/*PWR的转出
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Layout,Icon,Input,Row,Col,Button,Slider,Modal,message,Tabs,Spin,List} from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import LoadCoinCountAction from "../../../actions/LoadCoinCountAction.js";
import btcrequest from "../../../request/btcrequest.js";
import FormMnemonicCard from '../../../component/FormMnemonicCard.jsx';
import FormPrivateCard from '../../../component/FormPrivateCard.jsx';
import EncryptOrDecrypt from "../../../util/EncryptOrDecrypt.js";
import "../../../style/TableList.css"
const TabPane = Tabs.TabPane;
const sha1 = require('js-sha1');
var Web3 = require('web3');
var BigNumber = require('bignumber.js');
var Tx = require('ethereumjs-tx');
var ethUtil = require('ethereumjs-util');
//最好类名跟文件名对应
class BTCTurnOut extends React.Component {
  constructor(props){
    super(props);
    this.state={
      minerCost:0.0004,
      visible:false,
      pwd:"",
      toUserId:"",
      toEthAddress:"",
      dataValue:0,
      privatekey:"",
      recovervisible:false,
      selectCoin:{},
      remark:"",
      dealDetailsVisible:false,
      transactionHash:"",
      time:"",
    }
  }
  //组件挂载完成后回调
  componentDidMount() {
    var privateKeyEncrypted = sessionStorage.getItem("ethPrivateKey")
    if (privateKeyEncrypted != "" && privateKeyEncrypted != null && privateKeyEncrypted != undefined && privateKeyEncrypted != "undefined") {
      var eod = new EncryptOrDecrypt()
      let privateKey = eod.decrypt(sessionStorage.getItem("password"), sessionStorage.getItem("password"), privateKeyEncrypted);
      this.setState({
        privatekey: privateKey,
      })
    }
    this.setState({
      selectCoin: {
        "balance": this.props.AllETHBalance,
        "blockChainID": "2",
        "tokenAddress": `${sessionStorage.getItem("ethAddress")}`,
        "tokenDecimals": 0,
        "tokenFullName": "ETH",
        "tokenID": "",
        "tokenIcon": `${require("../../../resources/ewallet/eth.png")}`,
        "tokenName": "ETH"
      }
    })
    this.getUtxo()
  }
  
  //组件有更新后回调
  componentDidUpdate(){}
  //组件将要挂载时回调
  componentWillMount(){}
  //组件销毁时回调
  componentWillUnmount(){}
  //props改变回调函数
  componentWillReceiveProps(nextProps){}
  //验证基地地址确定
  handleOk(){
    message.warning("该功能正在添加，请等待");
    return;
    var yspwd = sessionStorage.getItem("password").toUpperCase();
    var srpwd = this.state.pwd.toUpperCase();
    if(yspwd==srpwd){
      //message.success('验证通过');
      
      this.state.pwd = ""

      if(this.state.toEthAddress==""){
        message.error("请先输入对方钱包地址")
        return;
      }
      if (this.state.dataValue==0) {
        message.error("请先输入金额")
        return;
      }
      if (this.state.privatekey=="") {
        message.error("请先恢复私钥信息")
        return;
      }
      this.getNonce();
    }else{
      message.error('密码错误');
      return;
    }
    this.setState({
      visible:false,
    })
  }
  //验证基地地址取消
  handleCancel(){
    this.setState({
      visible:false,
    })
  }
  //能量转换按钮
  pwrTransferClick(){
    this.setState({
      visible:true,
    })
  }
  //千分符
  toThousands(num){
    var result = '', counter = 0;
    num = (num || 0).toString();
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result = num.charAt(i) + result;
        if (!(counter % 3) && i != 0) { result = ',' + result; }
    }
    return result;
  }
  //格式化一下地址
  fomartETHAddress(ethAddress){
    var eth = "";
    var ethlen = ethAddress.length;
    var beforstr = ethAddress.substring(0,6);
    var endstr = ethAddress.substring(ethlen-4,ethlen)
    eth = beforstr+"******"+endstr;
    return eth;
  }
  //恢复钱包弹出
  recoverClick() {
    this.setState({
      recovervisible: true,
    })
  }
  //恢复钱包确定
  recoverOK() {
    var privateKeyEncrypted = sessionStorage.getItem("ethPrivateKey")
    if (privateKeyEncrypted != "" && privateKeyEncrypted != null && privateKeyEncrypted != undefined&&privateKeyEncrypted !=  "undefined") {
      var eod = new EncryptOrDecrypt()
      let privateKey = eod.decrypt(sessionStorage.getItem("password"), sessionStorage.getItem("password"), privateKeyEncrypted);
      this.setState({
        recovervisible: false,
        privatekey: privateKey,
      })
    } else {
      message.error("未恢复钱包，请手动输入私钥")
      this.setState({
        recovervisible: false,
      })
    }
  }

  //1.获取utxo
  getUtxo(){
    /*var body = "BtcAddress="+this.props.BTCCurrentWallet.accountAddress*/
    var body = "BtcAddress=" + "mhiU57RkjiXQTx7xQqY8vszGNKyJqbpvmt"
        +"&type="+"test";
    btcrequest("/btc/btcGetUtxo", body,"GET").then(response => response.json()).then(data => {
    })
  }

















  //恢复钱包取消
  recoverConcel(){
    this.setState({
      recovervisible:false,
    })
  }
  //输入密码
  pwdChange=(e)=>{
    this.state.pwd=sha1(e.target.value).toUpperCase();
  }
  //输入基地id
  toEthAddressChange=(e)=>{
    this.state.toEthAddress = e.target.value;
  }
  //要转换的能量数量
  outpwrChange=(e)=>{
    this.state.dataValue = e.target.value;
  }
  //备注
  remarkChange=(e)=>{
    this.state.remark = e.value;
  }
  //私钥
  privatekeyChange=(e)=>{
    this.setState({
      privatekey:e.target.value
    })
  }
  //格式化币
  fomartCoin(coinCount){
    var balance = coinCount/1000000000000000000;
    var newbalance = Math.round(balance*100000000)/100000000;
    return newbalance;
  }
  dealDetailsOk(){
    this.setState({
      dealDetailsVisible:false,
    })
  }
  //格式化日期
  fmartTime(time){
    var year = time.substring(0,4)
    var month = time.substring(4,6)
    var day = time.substring(6,8)
    var hour = time.substring(8,10)
    var minute = time.substring(10,12)
    var second = time.substring(12,14)
    var fmtime = year+"-"+month+"-"+day+"  "+hour+":"+minute+":"+second;
    return fmtime
  }
  //组件的渲染界面
  render() {
    return (
      <div>
        <div className="vertically-horizontally-center" style={{width:this.props.windowWidth,height:this.props.windowHeight,backgroundColor:this.props.theme.wllistcolor,border:"1px solid #62799c",borderRadius:4}}>
          <div style={{width:this.props.windowWidth*0.8}}>
            <Row className="vertically-center" style={{height:this.props.windowHeight*0.12}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>BTC余额</span>
              </Col>
              <Col  span={18}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>{this.fomartCoin(this.state.selectCoin.balance)}</span>
              </Col>
            </Row>
            <Row className="vertically-center" style={{height:this.props.windowHeight*0.12}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>转出金额</span>
              </Col>
              <Col  span={18}>
                <input placeholder="输入金额"  onChange={this.outpwrChange.bind(this)} style={{outline:"none",borderRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.6,border:"1px solid #354e72",backgroundColor:"transparent"}}/>
              </Col>
            </Row>
            <Row className="vertically-center" style={{height:this.props.windowHeight*0.12}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>备注(选填)</span>
              </Col>
              <Col  span={18}>
                <input placeholder="输入备注"  onChange={this.remarkChange.bind(this)} style={{outline:"none",borderRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.6,border:"1px solid #354e72",backgroundColor:"transparent"}}/>
              </Col>
            </Row>
            <Row className="vertically-center" style={{height:this.props.windowHeight*0.12}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>收款地址</span>
              </Col>
              <Col  span={18}>
                <input placeholder="请输入对方账号" onChange={this.toEthAddressChange.bind(this)} style={{fontSize:this.props.windowHeight*0.03,outline:"none",borderRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.6,border:"1px solid #354e72",backgroundColor:"transparent"}}/>
              </Col>
            </Row>
            <Row className="vertically-center" style={{height:this.props.windowHeight*0.12}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>私钥</span>
              </Col>
              <Col  span={18}>
              <input  
                placeholder="请注意周围人员，防止私钥泄露" 
                value={this.state.privatekey} 
                onChange={this.privatekeyChange.bind(this)} 
                type="password" 
                style={{
                  outline:"none",
                  borderRadius:5,
                  height:this.props.windowHeight*0.06,
                  color:"#FFFFFF",
                  width:this.props.windowWidth*0.6,
                  borderStyle:"solid solid  solid solid  ",
                  borderColor:"#354e72 #354e72 #354e72 #354e72",
                  borderWidth:1,
                  backgroundColor:"transparent"
                  }}
                />
                {/*<input  placeholder="请注意周围人员，防止私钥泄露" value={this.state.privatekey} onChange={this.privatekeyChange.bind(this)} type="password" style={{outline:"none",borderTopLeftRadius:5,borderBottomLeftRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.45,borderStyle:"solid none  solid solid  ",borderColor:"#354e72 #354e72 #354e72 #354e72",borderWidth:1,backgroundColor:"transparent"}}/>
                <input type="button" value="恢复钱包" onClick={this.recoverClick.bind(this)} style={{color:"#108ee9",outline:"none",cursor: "pointer",height:this.props.windowHeight*0.06,border:"1px solid #354e72",borderTopRightRadius:5,borderBottomRightRadius:5,backgroundColor:"#0a182d",width:this.props.windowWidth*0.15}}/>*/}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.02}}>
                  <div style={{width:this.props.windowWidth*0.8,borderBottom:"1px solid "+this.props.theme.fontcolor}}></div>
                </div>
              </Col>
            </Row>
            <Row className="vertically-center" style={{height:this.props.windowHeight*0.12}}>
              <Col span={12}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>付款地址</span>
              </Col>
              <Col span={12} style={{float:"right",color:this.props.theme.fontcolor}}>
                <div style={{float:"right",color:this.props.theme.fontcolor}}>
                  {this.fomartETHAddress(this.props.BTCCurrentWallet.accountAddress)}
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="vertically-flex-end-horizontally-center" span={24} style={{height:this.props.windowHeight*0.1}}>
                <Button onClick={this.pwrTransferClick.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
              </Col>
            </Row>
          {/*验证密码modal*/}
            <Modal
              visible={this.state.visible}
              onCancel={this.handleCancel.bind(this)}
              bodyStyle={{backgroundColor:"#183257"}}
              footer={null}
              width={this.props.windowWidth*0.8}
            >
              <div style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>
                请输入基地密码
              </div>
              <div className="vertically-flex-end" style={{height:this.props.windowHeight*0.12}}>
                <input onChange={this.pwdChange.bind(this)} type="password" style={{width:this.props.windowWidth*0.8,fontSize:this.props.windowHeight*0.06,color:"#FFFFFF",backgroundColor:"#183257",borderStyle:"none none solid none",borderColor:"#6A82A5",borderWidth:2,outline:"none",height:this.props.windowHeight*0.08,textAlign:"center"}}/>
              </div>
              <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.2}}>
                <Button onClick={this.handleOk.bind(this)} style={{width:this.props.windowWidth*0.3,height:this.props.windowHeight*0.08,fontSize:this.props.windowHeight*0.03,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
              </div>
            </Modal>
          {/*恢复钱包modal*/}
            <Modal
                visible={this.state.recovervisible}
                onCancel={this.recoverConcel.bind(this)}
                bodyStyle={{backgroundColor:"#183257"}}
                footer={null}
                width={this.props.windowWidth*0.8}
              >

              <Tabs defaultActiveKey="1" tabBarStyle={{width:this.props.windowWidth,color:"#6A82A5",border:"none"}}>
                <TabPane style={{color:'#FFF'}} tab="助记词" key="1">
                    <FormMnemonicCard ></FormMnemonicCard>
                </TabPane>
                <TabPane tab="私钥" key="2">
                    <FormPrivateCard></FormPrivateCard>
                </TabPane>
              </Tabs>
              <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.2}}>
                <Button onClick={this.recoverOK.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
              </div>
            </Modal>
          {/*交易成功modal*/}
            <Modal
                visible={this.state.dealDetailsVisible}
                onCancel={this.dealDetailsOk.bind(this)}
                bodyStyle={{backgroundColor:"#183257"}}
                footer={null}
                width={this.props.windowWidth}
              >
              <div style={{width:"100%",color:"#4c6889",fontSize:this.props.windowHeight*0.03}}>交易详情</div>  
              <div className="horizontally-center" style={{width:"100%",height:this.props.windowHeight*0.08}}>
                <Row style={{width:"100%"}}>
                  <Col span={10}>
                    <div style={{width:"100%",textAlign:"right"}}>
                      <img src={require('../../../resources/ewallet/transSuccess.png')} style={{height:this.props.windowHeight*0.08}}/>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="vertically-center" style={{width:"100%",height:this.props.windowHeight*0.08,fontSize:this.props.windowHeight*0.035,color:"#4c6889"}}>
                      &nbsp;&nbsp;交易成功
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="vertically-horizontally-center" style={{width:"100%",height:this.props.windowHeight*0.08}}>
                <Row style={{width:"100%"}}>
                  <Col span={10}>
                    <div style={{width:"100%",textAlign:"right"}}>
                      <span style={{fontSize:this.props.windowHeight*0.04,color:"#F7931E"}}>-&nbsp;{this.state.dataValue}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{width:"100%"}}>
                      <span style={{fontSize:this.props.windowHeight*0.035,color:"#4c6889"}}>&nbsp;&nbsp;能量</span>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="vertically-horizontally-center" style={{width:"100%",height:this.props.windowHeight*0.03}}>
                <div style={{border:"0.5px solid #4c6889",width:"100%"}}>
                </div>
              </div>
              <div>
                <Row>
                  <Col span={5} style={{fontSize:this.props.windowHeight*0.035,color:"#4c6889"}}>
                    交易ID
                  </Col>
                  <Col span={19} style={{wordWrap:"break-word",fontSize:this.props.windowHeight*0.03,color:"#4c6889"}}>
                    {this.state.transactionHash}
                  </Col>
                </Row>
              </div>
              <div className="vertically-horizontally-center" style={{width:"100%",height:this.props.windowHeight*0.03}}>
                <div style={{border:"0.5px solid #4c6889",width:"100%"}}>
                </div>
              </div>
              <div>
                <Row>
                  <Col span={5} style={{fontSize:this.props.windowHeight*0.035,color:"#4c6889"}}>
                    交易时间
                  </Col>
                  <Col span={19} style={{wordWrap:"break-word",fontSize:this.props.windowHeight*0.03,color:"#4c6889"}}>
                    {this.fmartTime(this.state.time)}
                  </Col>
                </Row>
              </div>
              <div className="vertically-horizontally-center" style={{width:"100%",height:this.props.windowHeight*0.03}}>
                <div style={{border:"0.5px solid #4c6889",width:"100%"}}>
                </div>
              </div>
              <div>
                <Row>
                  <Col span={5} style={{fontSize:this.props.windowHeight*0.035,color:"#4c6889"}}>
                    转出账户
                  </Col>
                  <Col span={19} style={{wordWrap:"break-word",fontSize:this.props.windowHeight*0.03,color:"#4c6889"}}>
                    {sessionStorage.getItem("ethAddress")}
                  </Col>
                </Row>
              </div>
              <div className="vertically-horizontally-center" style={{width:"100%",height:this.props.windowHeight*0.03}}>
                <div style={{border:"0.5px solid #4c6889",width:"100%"}}>
                </div>
              </div>
              <div>
                <Row>
                  <Col span={5} style={{fontSize:this.props.windowHeight*0.035,color:"#4c6889"}}>
                    接收账户
                  </Col>
                  <Col span={19} style={{wordWrap:"break-word",fontSize:this.props.windowHeight*0.03,color:"#4c6889"}}>
                    {this.state.toEthAddress}
                  </Col>
                </Row>
              </div>
              <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.2}}>
                <Button onClick={this.dealDetailsOk.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    )
  }
          
}
//类属性
BTCTurnOut.propTypes = {
    
}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight *0.7,
    windowWidth: state.WindowSizeReducer.windowWidth * 0.35,
    theme: state.ThemeReducer.theme,
    BTCCurrentWallet:state.WalletListReducer.BTCCurrentWallet,
    AllETHBalance:state.CoinCountReducer.AllETHBalance,
  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {
    LoadCoinCountAction: (type,count) => {
      dispatch(LoadCoinCountAction(type,count));
    },
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BTCTurnOut); 