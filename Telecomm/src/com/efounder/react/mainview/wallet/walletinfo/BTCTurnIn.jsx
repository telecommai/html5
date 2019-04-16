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
class BTCTurnIn extends React.Component {
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
      "chainId": "1",
      "contractAddress": "",
      "isTokenAccount": false,
      "tokenId": "",
      "tokenUnit": "BTC",
      "type": "tokenTrade",
      "walletAddress": this.props.BTCCurrentWallet.accountAddress
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
  //指定金额
  countClick=(e)=>{
    this.setState({
      visible:true,
    })
  }
  //指定金额弹窗确定
  handleOk(){
    var code = JSON.parse(this.state.code)
    code.amount = this.state.money;
    this.setState({
      code:JSON.stringify(code),
      visible:false,
    })
  }
  //指定金额弹窗取消
  handleCancel(){
    this.setState({
      visible:false,
    })
  }
  //格式化地址
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
                      <img src={this.props.BTCCurrentWallet.accountIcon} style={{height:this.props.windowHeight*0.08,borderRadius:5}}/>
                    </div>
                    <div className="horizontally-center" style={{width:"100%",color:"#108ee9",fontSize:this.props.windowHeight*0.04,whiteSpace: "nowrap",}}>
                      {this.props.BTCCurrentWallet.accountName}
                    </div>
                    <div className="horizontally-center" style={{width:"100%",color:"#4C6889",fontSize:this.props.windowHeight*0.04,whiteSpace: "nowrap",}}>
                      {this.fomartETHAddress(this.props.BTCCurrentWallet.accountAddress)}
                    </div>
                    <div className="horizontally-center" style={{width:"100%",color:"#4C6889",fontSize:this.props.windowHeight*0.04,whiteSpace: "nowrap",}}>
                      请转入&nbsp;&nbsp;BTC
                    </div>
                  </div>
                </div>
                <div className="vertically-horizontally-center" style={{backgroundColor:"transparent",width:this.props.windowWidth,height:this.props.windowWidth*0.6,}}>
                  <div style={{backgroundColor:"#FFFFFF",height:this.props.windowWidth*0.55,width:this.props.windowWidth*0.55,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
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
                    <Col span={24} onClick={this.countClick.bind(this)} className="vertically-horizontally-center" style={{cursor: "pointer",color:"#108ee9",fontSize:this.props.windowHeight*0.035,height:this.props.windowHeight*0.1}}>
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
                      <div className="vertically-flex-end-horizontally-center" style={{height:this.props.windowHeight*0.15}}>
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
BTCTurnIn.propTypes = {
    
}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight *0.7,
    windowWidth: state.WindowSizeReducer.windowWidth * 0.3,
    theme: state.ThemeReducer.theme,
    BTCCurrentWallet:state.WalletListReducer.BTCCurrentWallet,
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
)(BTCTurnIn); 