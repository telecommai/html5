/*PWR的转出
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,Avatar,Badge,Input,Row,Col,Button,Slider,Modal,message,Tabs} from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import LoadCoinCountAction from "../../../actions/LoadCoinCountAction.js";
import tcrequest from "../../../request/tcrequest.js";
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
class TurnOut extends React.Component {
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
      dealDetailsVisible:false,
      transactionHash:"",
      time:"",
    }
  }
  //组件挂载完成后回调
  componentDidMount(){
    var privateKeyEncrypted = sessionStorage.getItem("ethPrivateKey")
    if (privateKeyEncrypted != "" && privateKeyEncrypted != null && privateKeyEncrypted != undefined&&privateKeyEncrypted !=  "undefined") {
      var eod = new EncryptOrDecrypt()
      let privateKey = eod.decrypt(sessionStorage.getItem("password"), sessionStorage.getItem("password"), privateKeyEncrypted);
      this.setState({
        privatekey: privateKey,
      })
    }
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
    var yspwd = sessionStorage.getItem("password").toUpperCase();
    var srpwd = this.state.pwd.toUpperCase();
    if(yspwd==srpwd){
      //message.success('验证通过');
      
      this.state.pwd = ""
      if(this.state.toUserId==""){
        message.error("请先输入对方星际ID")
        return;
      }
      if(this.state.toEthAddress==""){
        message.error("请先输入对方基地ID")
        return;
      }
      if (this.state.dataValue==0) {
        message.error("请先输入能量数量")
        return;
      }
      if (this.state.privatekey=="") {
        message.error("请先输入私钥信息")
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
  //获取取nonce
  getNonce(){
    var body = "ethAddress="+sessionStorage.getItem("ethAddress");
    tcrequest("/tcserver/eth/ethGetTransactionCount", body).then(response => response.json()).then(data => {
      if(data.result=="success"){
        var dataNonce = data.transactionCount;
        var priveKey = this.state.privatekey;
        var toEthAddress = this.state.toEthAddress;
        var dataValue = this.state.dataValue;
        if(priveKey.substring(0,2)=="0x"){
          priveKey = priveKey.substring(2,priveKey.length)
        }

        this.GeneralSignTransaction(dataNonce,18000000000,21000,toEthAddress,dataValue,priveKey)
      }else{
        message.error('转账失败,请稍后再试');
        return;
      }
    })
  }
  //生成签名
  /*
  dataNonce Nonce
  dataGasPrice 固定18000000000
  dataGasLimit 固定21000
  toEthAddress 接收的eth地址
  dataValue 数量
  priveKey 私钥
  */
  GeneralSignTransaction(dataNonce, dataGasPrice, dataGasLimit, toEthAddress, dataValue, priveKey) {
    var bignumber = new BigNumber(Number(dataValue) * 1.0e18);
    var data_nonce = Web3.toHex(dataNonce);
    var data_gasprice = Web3.toHex(dataGasPrice);
    var data_gasLimit = Web3.toHex(dataGasLimit);
    var data_value = Web3.toHex(bignumber);
    var rawTx = {
      nonce: data_nonce,
      gasPrice: data_gasprice,
      gasLimit: data_gasLimit,
      to: toEthAddress,
      value: data_value
    };
    var jsonData;
    var tx = new Tx(rawTx);
    const privateKey = Buffer.from(priveKey, 'hex')

    //验证私钥的合法性
    if (ethUtil.isValidPrivate(privateKey)) {
      //签名
      tx.sign(privateKey);
      var serializedHexTx = '0x' + tx.serialize().toString('hex');
      //执行转账
      this.transaction(serializedHexTx);
    } else {
      message.error("私钥不正确，转账失败")
    }
  }
  //transaction转账
  transaction(signedTransactionData){
    var body = "fromUserId="+sessionStorage.getItem("imUserId")
    +"&toUserId="+this.state.toUserId
    +"&fromEthAddress="+sessionStorage.getItem("ethAddress")
    +"&toEthAddress="+this.state.toEthAddress
    +"&value="+this.state.dataValue
    +"&signedTransactionData="+signedTransactionData
    tcrequest("/tcserver/eth/ethSendRawTransaction", body).then(response => response.json()).then(data => {
      if(data.result=="success"){
        this.setState({
          dealDetailsVisible:true,
          transactionHash:data.transactionHash,
          time:data.time,
        })
      }else{
        message.error("转账失败,请稍后再试");
      }
    })
  }
  dealDetailsOk(){
    this.setState({
      dealDetailsVisible:false,
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
  fomartETHAddress(){
    var ethAddress = sessionStorage.getItem("ethAddress")
    var eth = "";
    var ethlen = ethAddress.length;
    var beforstr = ethAddress.substring(0,6);
    var endstr = ethAddress.substring(ethlen-4,ethlen)
    eth = beforstr+"******"+endstr;
    return eth;
  }
  //矿工费用滑动条改变
  minerCostChange(value){
    this.setState({
      minerCost:value,
    })
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
    if (privateKeyEncrypted != "" && privateKeyEncrypted != null && privateKeyEncrypted != undefined && privateKeyEncrypted != "undefined") {
      var eod = new EncryptOrDecrypt()
      let privateKey = eod.decrypt(sessionStorage.getItem("password"), sessionStorage.getItem("password"), privateKeyEncrypted);
      if (privateKey == "") {
        message.warning("未恢复钱包，请手动输入私钥")
        this.setState({
          recovervisible: false,
        })
      }
      this.setState({
        recovervisible: false,
        privatekey: privateKey,
      })
    } else {
      message.warning("未恢复钱包，请手动输入私钥")
      this.setState({
        recovervisible: false,
      })
    }
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
  //输入星际id
  xjidChange=(e)=>{
    this.state.toUserId = e.target.value;
  }
  //输入基地id
  jdidChange=(e)=>{
    this.state.toEthAddress = e.target.value;
  }
  //要转换的能量数量
  outpwrChange=(e)=>{
    
    this.state.dataValue = e.target.value;
  }
  outpwrBlur=(e)=>{
    if(e.target.value>this.props.balance){
      message.error("超过持有数量，请重新输入")
    }
  }
  //私钥
  privatekeyChange=(e)=>{
    this.setState({
      privatekey:e.target.value
    })
  }
  privateKeyBlur=(e)=>{
    var eod = new EncryptOrDecrypt()
    var ethPrivateKey = eod.encrypt(sessionStorage.getItem("password"), sessionStorage.getItem("password"), e.target.value);
    sessionStorage.setItem("ethPrivateKey",ethPrivateKey)
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
        <div style={{width:this.props.windowWidth,height:this.props.windowHeight,backgroundColor:this.props.theme.wllistcolor,border:"1px solid #62799c",borderRadius:4,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
          <div style={{width:this.props.windowWidth*0.8}}>
            <Row style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>接收星际ID</span>
              </Col>
              <Col  span={18}>
                <input placeholder="请输入对方星际ID" onChange={this.xjidChange.bind(this)} style={{fontSize:this.props.windowHeight*0.03,outline:"none",borderRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.6,border:"1px solid #354e72",backgroundColor:"transparent"}}/>
              </Col>
            </Row>
            <Row style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>接收基地ID</span>
              </Col>
              <Col  span={18}>
                <input placeholder="请输入对方基地ID" onChange={this.jdidChange.bind(this)} style={{fontSize:this.props.windowHeight*0.03,outline:"none",borderRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.6,border:"1px solid #354e72",backgroundColor:"transparent"}}/>
              </Col>
            </Row>
            <Row style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>转出能量</span>
              </Col>
              <Col  span={18}>
                <input placeholder="请输入能量数量" onBlur={this.outpwrBlur.bind(this)} onChange={this.outpwrChange.bind(this)} style={{fontSize:this.props.windowHeight*0.03,outline:"none",borderRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.6,border:"1px solid #354e72",backgroundColor:"transparent"}}/>
              </Col>
            </Row>
            <Row style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={6}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>私钥</span>
              </Col>
              <Col  span={18}>
                <input  placeholder="请注意周围人员，防止私钥泄露" value={this.state.privatekey} onChange={this.privatekeyChange.bind(this)} onBlur={this.privateKeyBlur.bind(this)} type="password" style={{fontSize:this.props.windowHeight*0.03,outline:"none",borderTopLeftRadius:5,borderBottomLeftRadius:5,height:this.props.windowHeight*0.06,color:"#FFFFFF",width:this.props.windowWidth*0.45,borderStyle:"solid none  solid solid  ",borderColor:"#354e72 #354e72 #354e72 #354e72",borderWidth:1,backgroundColor:"transparent"}}/>
                <input type="button" value="恢复钱包" onClick={this.recoverClick.bind(this)} style={{color:"#108ee9",outline:"none",cursor: "pointer",height:this.props.windowHeight*0.06,border:"1px solid #354e72",borderTopRightRadius:5,borderBottomRightRadius:5,backgroundColor:"#0a182d",width:this.props.windowWidth*0.15}}/>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div style={{height:this.props.windowHeight*0.02,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:this.props.windowWidth*0.8,borderBottom:"1px solid "+this.props.theme.fontcolor}}></div>
                </div>
              </Col>
            </Row>
            <Row style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={12}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>转出基地ID</span>
              </Col>
              <Col span={12} style={{float:"right",color:this.props.theme.fontcolor}}>
                <div style={{fontSize:this.props.windowHeight*0.03,float:"right",color:this.props.theme.fontcolor}}>
                  {this.fomartETHAddress()}
                </div>
              </Col>
            </Row>
            <Row style={{height:this.props.windowHeight*0.05,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={12}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>矿工费用</span>
              </Col>
              <Col span={12} style={{float:"right",color:this.props.theme.fontcolor}}>
                <div style={{fontSize:this.props.windowHeight*0.03,float:"right",color:this.props.theme.fontcolor}}>
                  {this.state.minerCost}PWR
                </div>
              </Col>
            </Row>
            <Row style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={3} style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9"}}>0.0004</Col>
              <Col span={18}>
                <Slider defaultValue={0.0004} step={0.0001} min={0.0004} max={0.006} onChange={this.minerCostChange.bind(this)}  />
              </Col>
              <Col span={3} style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9"}}>0.006</Col>
            </Row>
            <Row style={{height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <Col span={12}>
                <span style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.fontcolor}}>能量余额</span>
              </Col>
              <Col span={12} >
                <div style={{fontSize:this.props.windowHeight*0.03,float:"right",color:this.props.theme.wlmoneycolor}}>
                {this.props.balance}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'flex-end',justifyContent:'center'}}>
                <Button onClick={this.pwrTransferClick.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>能量交换</Button>
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
                      <div style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'flex-end',}}>
                        <input onChange={this.pwdChange.bind(this)} type="password" style={{width:this.props.windowWidth*0.8,fontSize:this.props.windowHeight*0.06,color:"#FFFFFF",backgroundColor:"#183257",borderStyle:"none none solid none",borderColor:"#6A82A5",borderWidth:2,outline:"none",height:this.props.windowHeight*0.08,textAlign:"center"}}/>
                      </div>
                      <div style={{height:this.props.windowHeight*0.2,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:'center',alignItems:'center',}}>
                        <Button onClick={this.handleOk.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
                      </div>
                </Modal>
              </Col>
            </Row>
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
              
              <div style={{height:this.props.windowHeight*0.2,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:'center',alignItems:'center',}}>
                <Button onClick={this.recoverOK.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
              </div>
            </Modal>
            <Modal
                visible={this.state.dealDetailsVisible}
                onCancel={this.dealDetailsOk.bind(this)}
                bodyStyle={{backgroundColor:"#183257"}}
                footer={null}
                width={this.props.windowWidth}
              >
              <div style={{width:"100%",color:"#4c6889",fontSize:this.props.windowHeight*0.03}}>交易详情</div>  
              <div style={{width:"100%",height:this.props.windowHeight*0.08,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:"center"}}>
                <Row style={{width:"100%"}}>
                  <Col span={10}>
                    <div style={{width:"100%",textAlign:"right"}}>
                      <img src={require('../../../resources/ewallet/transSuccess.png')} style={{height:this.props.windowHeight*0.08}}/>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{width:"100%",height:this.props.windowHeight*0.08,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"center",fontSize:this.props.windowHeight*0.035,color:"#4c6889"}}>
                      &nbsp;&nbsp;交易成功
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{width:"100%",height:this.props.windowHeight*0.08,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:"center",alignItems:"center"}}>
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
              <div style={{width:"100%",height:this.props.windowHeight*0.03,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:"center",alignItems:"center"}}>
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
              <div style={{width:"100%",height:this.props.windowHeight*0.03,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:"center",alignItems:"center"}}>
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
              <div style={{width:"100%",height:this.props.windowHeight*0.03,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:"center",alignItems:"center"}}>
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
              <div style={{width:"100%",height:this.props.windowHeight*0.03,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:"center",alignItems:"center"}}>
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
              <div style={{height:this.props.windowHeight*0.2,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:'center',alignItems:'center',}}>
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
TurnOut.propTypes = {
    
}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight *0.7,
    windowWidth: state.WindowSizeReducer.windowWidth * 0.35,
    theme: state.ThemeReducer.theme,
    balance:state.CoinCountReducer.balance,
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
)(TurnOut); 