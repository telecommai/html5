/*ETH的转入
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import {Layout,Icon,Input,Row,Col,Button,message,Modal,Spin,List} from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import copy from 'copy-to-clipboard';
import tcrequest from "../../../request/tcrequest.js";
import WalletClickAction from "../../../actions/WalletClickAction.js";
const QRCode = require('qrcode.react');
import "../../../style/TableList.css"
//最好类名跟文件名对应
class ETHTurnIn extends React.Component {
  constructor(props){
    super(props);
    this.state={
      code:"{}",
      visible:false,
      tokenvisible:false,
      money:"0",
      tokenName:"ETH",
      AllTokenByChain:[],
      AllTokenByChainStatus:"fail",
    }
  }
  //组件挂载完成后回调
  componentDidMount(){
    this.getQRCode();
  }
  getQRCode() {
    var code = {
      "amount": this.state.money,
      "contractAddress": "",
      "isTokenAccount": false,
      "tokenId": "",
      "tokenUnit": "ETH",
      "type": "tokenTrade",
      "walletAddress": this.props.ETHCurrentWallet.accountAddress
    }
    this.setState({
      code: JSON.stringify(code)
    })
  }
  //组件有更新后回调
  componentDidUpdate(){}
  //组件将要挂载时回调
  componentWillMount(){}
  //组件销毁时回调
  componentWillUnmount(){}
  //props改变回调函数
  componentWillReceiveProps(nextProps){}
  pwdChange=(e)=>{
    this.state.money=e.target.value
  }
  countClick=(e)=>{
    this.setState({
      visible:true,
    })
  }
  handleOk(){
    var code = JSON.parse(this.state.code)
    code.amount = this.state.money;
    this.setState({
      code:JSON.stringify(code),
      visible:false,
    })
  }
  handleCancel(){
    this.setState({
      visible:false,
    })
  }
  changeTokenCancel(){
    this.setState({
      tokenvisible:false,
    })
  }
  changeTokenOk = (item, e) => {
    var code = {
      "amount": this.state.money,
      "contractAddress": item.tokenAddress,
      "isTokenAccount": false,
      "tokenId": item.tokenID,
      "tokenUnit": item.tokenName,
      "type": "tokenTrade",
      "walletAddress": sessionStorage.getItem("ethAddress")
    }
    this.setState({
      tokenName:item.tokenName,
      code: JSON.stringify(code),
      tokenvisible: false,
    })
  }
  changeTokenClick=(e)=>{
    this.setState({
      AllTokenByChain:[],
      AllTokenByChainStatus:"fail",
      tokenvisible:true,
    })
    this.getAllTokenByChain()
  }
  getAllTokenByChain(){
    var ethAddress = sessionStorage.getItem("ethAddress")
    if(ethAddress==null||ethAddress==""||ethAddress==undefined||ethAddress=="undefined"){
      return;
    }
    var body = "chainID=2"
                +"&userAddress="+ethAddress;
    tcrequest("/tcserver/chain/getAllTokenByChain", body).then(response => response.json()).then(data => {
      if (data.result=="success") {
        data.AllTokenByChain.unshift({
            "blockChainID":"2",
            "ifOwner":1,
            "tokenAddress":`${sessionStorage.getItem("ethAddress")}`,
            "tokenDecimals":18,
            "tokenFullName":"ETH",
            "tokenID":"",
            "tokenIcon":`${require("../../../resources/ewallet/eth.png")}`,
            "tokenName":"ETH"
        });
        this.setState({
          AllTokenByChain:data.AllTokenByChain,
          AllTokenByChainStatus:data.result,
        })
      }
    })
  }
  fomartETHAddress(ethAddress){
    var eth = "";
    var ethlen = ethAddress.length;
    var beforstr = ethAddress.substring(0,6);
    var endstr = ethAddress.substring(ethlen-4,ethlen)
    eth = beforstr+"******"+endstr;
    return eth;
  }
  //组件的渲染界面
  render() {
    return (
      <div>
        <div className="vertically-horizontally-center" style={{width:this.props.windowWidth,height:this.props.windowHeight,backgroundColor:this.props.theme.wllistcolor,borderRadius:4}}>
          <div style={{width:this.props.windowWidth}}>

              <div>
                <div className="horizontally-center" style={{width:"100%"}}>
                  <div>
                    <div className="horizontally-center" style={{width:"100%"}}>
                      <img src={require("../../../resources/ewallet/defaultIcon.png")} style={{height:this.props.windowHeight*0.08,borderRadius:5}}/>
                    </div>
                    <div className="horizontally-center" style={{width:"100%",color:"#108ee9",fontSize:this.props.windowHeight*0.04,whiteSpace: "nowrap",}}>
                      {this.props.ETHCurrentWallet.accountName}
                    </div>
                    <div className="horizontally-center" style={{width:"100%",color:"#4C6889",fontSize:this.props.windowHeight*0.04,whiteSpace: "nowrap",}}>
                      {this.fomartETHAddress(this.props.ETHCurrentWallet.accountAddress)}
                    </div>
                    <div className="horizontally-center" style={{width:"100%",color:"#4C6889",fontSize:this.props.windowHeight*0.04,whiteSpace: "nowrap",}}>
                      请转入&nbsp;&nbsp;{this.state.tokenName}
                    </div>
                  </div>
                </div>
                <div className="vertically-horizontally-center" style={{backgroundColor:"transparent",width:this.props.windowWidth,height:this.props.windowWidth*0.6}}>
                  <div className="vertically-horizontally-center" style={{backgroundColor:"#FFFFFF",height:this.props.windowWidth*0.55,width:this.props.windowWidth*0.55}}>
                    <QRCode value={this.state.code} size={this.props.windowWidth*0.5}/>
                  </div>
                </div>
                <div className="horizontally-center" style={{width:"100%"}}>
                  <div style={{width:this.props.windowWidth*0.9,
                            borderStyle:"solid none  none none  ",
                            borderColor:"#028BA2 #00FFFF #FFFFFF #00FFFF  ",
                            borderWidth:1,
                  }}></div>
                </div>
                <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.1,width:this.props.windowWidth*0.9}}>
                  <Row style={{width:"100%"}}>
                    <Col span={12} className="vertically-horizontally-center" onClick={this.changeTokenClick.bind(this)} style={{cursor: "pointer",color:"#108ee9",fontSize:this.props.windowHeight*0.035,height:this.props.windowHeight*0.1}}>
                      <div>
                        <img name="invitation" src={require("../../../resources/ewallet/openwallet_changeassets.png")} style={{float:"left",height:this.props.windowHeight*0.06}} />
                        <span >更换资产</span>
                      </div>
                    </Col>
                    <Modal
                      visible={this.state.tokenvisible}
                      onCancel={this.changeTokenCancel.bind(this)}
                      bodyStyle={{backgroundColor:"#183257"}}
                      footer={null}
                      width={this.props.windowWidth*0.8}
                    >
                      <div style={{height:this.props.windowHeight*0.9,width:"100%",overflow:"auto"}}>
                        <div className="horizontally-center" style={{width:"100%"}}>
                          <Spin tip="加载代币列表..." spinning={this.state.AllTokenByChainStatus!="success"}></Spin>
                        </div>
                        <List
                          dataSource={this.state.AllTokenByChain}
                          size="small"
                          split={false}
                          renderItem={item => (
                            <List.Item key={item.block}>
                                <Row onClick={this.changeTokenOk.bind(this,item)} onDoubleClick={this.changeTokenOk.bind(this,item)}  style={{width:"100%",paddingBottom:10,cursor:"pointer"}}>
                                  <Col span={6} >
                                    <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.12}}>
                                      <img src={item.tokenIcon}style={{height:this.props.windowHeight*0.08}}/>
                                    </div>
                                  </Col>
                                  <Col span={14}>
                                    <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.03,fontWeight:"bold"}}>{item.tokenName}</div>
                                    <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{item.tokenFullName}</div>
                                    <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{this.fomartETHAddress(item.tokenAddress)}</div>
                                  </Col>
                                </Row>
                            </List.Item>
                          )}
                        >
                        </List>
                      </div>
                    </Modal>
                    <Col span={12} className="vertically-horizontally-center" onClick={this.countClick.bind(this)} style={{cursor: "pointer",color:"#108ee9",fontSize:this.props.windowHeight*0.035,height:this.props.windowHeight*0.1}}>
                      <div>
                        <img name="invitation" src={require("../../../resources/ewallet/openwallet_changeamount.png")} style={{float:"left",height:this.props.windowHeight*0.06}} />
                        <span>指定金额</span>
                      </div>
                    </Col>
                    <Modal
                      visible={this.state.visible}
                      onCancel={this.handleCancel.bind(this)}
                      bodyStyle={{backgroundColor:"#183257"}}
                      footer={null}
                      width={this.props.windowWidth}
                    >
                      <div style={{color:this.props.theme.fontcolor}}>
                        请输入金额
                      </div>
                      <div className="vertically-center" style={{height:this.props.windowHeight*0.12,borderStyle:"none none solid none",borderColor:"#6A82A5",borderWidth:2}}>
                        <div >
                          <input onChange={this.pwdChange.bind(this)}  style={{float:"left",width:this.props.windowWidth*0.8,fontSize:this.props.windowHeight*0.06,color:"#FFFFFF",backgroundColor:"#183257",borderStyle:"none none none none",borderColor:"#6A82A5",borderWidth:2,outline:"none",height:this.props.windowHeight*0.08,textAlign:"center"}}/>
                        </div>
                      </div>
                      <div className="vertically-flex-end" style={{height:this.props.windowHeight*0.15}}>
                        <Button onClick={this.handleOk.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
                      </div>
                    </Modal>
                  </Row>
                </div>
              </div>
          </div>
        </div>
      </div>
    )
  }
          
}
//类属性
ETHTurnIn.propTypes = {
    
}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight *0.7,
    windowWidth: state.WindowSizeReducer.windowWidth * 0.3,
    theme: state.ThemeReducer.theme,
    ETHCurrentWallet:state.WalletListReducer.ETHCurrentWallet,
  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {
    WalletClickAction: (clickRowKey,clickRowInfo) => {
      dispatch(WalletClickAction(clickRowKey,clickRowInfo));
    },
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ETHTurnIn); 