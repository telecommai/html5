/*PWR的转入
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,Avatar,Badge,Input,Row,Col,Button,message,Modal } from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import copy from 'copy-to-clipboard';
import WalletClickAction from "../../../actions/WalletClickAction.js";
const QRCode = require('qrcode.react');
import "../../../style/TableList.css"
//最好类名跟文件名对应
class TurnIn extends React.Component {
  constructor(props){
    super(props);
    this.state={
      code:"{}",
      visible:false,
      money:"0",
    }
  }
  //组件挂载完成后回调
  componentDidMount(){
    this.getQRCode();
  }
  getQRCode() {
    var ethAddress = sessionStorage.getItem("ethAddress");
    var money = this.state.money;
    var userId = sessionStorage.getItem("imUserId");
    var code = {};
    code.ethAddress = ethAddress;
    code.money = money;
    code.type = "gathering";
    code.userId = userId;
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
  transactionRecords=(e)=>{
    var key = e.target.getAttribute("name")
    this.props.WalletClickAction(key,{"blockChainID":"4","CoinType":"PWR"})
  }
  pwdChange=(e)=>{
    this.state.money=e.target.value
  }
  countClick=(e)=>{
    this.setState({
      visible:true,
    })
  }
  handleOk(){
    this.setState({
      visible:false,
    })
    this.getQRCode()
  }
  handleCancel(){
    this.setState({
      visible:false,
    })
  }
  //组件的渲染界面
  render() {
    return (
      <div>
        <div style={{width:this.props.windowWidth,height:this.props.windowHeight,backgroundColor:this.props.theme.wllistcolor,borderRadius:4,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
          <div style={{width:this.props.windowWidth}}>
            <Row style={{height:this.props.windowHeight*0.12}}>
              <div>
                <div style={{color:"#4C6889",fontSize:this.props.windowHeight*0.04,whiteSpace: "nowrap",height:this.props.windowHeight*0.2,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center', justifyContent:'center',}}>
                  扫描二维码进行能量交换
                </div>
                <div style={{backgroundColor:"transparent",width:this.props.windowWidth,height:this.props.windowWidth*0.6,
                        display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",
                        alignItems:'center',
                        justifyContent:'center',    
                }}>
                  <div style={{backgroundColor:"#FFFFFF",height:this.props.windowWidth*0.6,width:this.props.windowWidth*0.6,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
                    <QRCode value={this.state.code} size={this.props.windowWidth*0.56}/>
                  </div>
                </div>
                <div  style={{color:"#108ee9",fontSize:this.props.windowHeight*0.03,height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                  <div onClick={this.countClick.bind(this)} style={{cursor: "pointer"}}>设置交易数量</div>
                </div>
                <Modal
                  visible={this.state.visible}
                  onCancel={this.handleCancel.bind(this)}
                  bodyStyle={{backgroundColor:"#183257"}}
                  footer={null}
                  width={this.props.windowWidth}
                >

                      <div style={{color:this.props.theme.fontcolor}}>
                        请输入交易数量
                      </div>
                      <div style={{height:this.props.windowHeight*0.12,borderStyle:"none none solid none",borderColor:"#6A82A5",borderWidth:2,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
                        <div >
                          <img name="invitation" src={require("../../../resources/ewallet/balance.png")} style={{float:"left",height:this.props.windowHeight*0.1}} />
                          <input onChange={this.pwdChange.bind(this)}  style={{float:"left",width:this.props.windowWidth*0.6,fontSize:this.props.windowHeight*0.06,color:"#FFFFFF",backgroundColor:"#183257",borderStyle:"none none none none",borderColor:"#6A82A5",borderWidth:2,outline:"none",height:this.props.windowHeight*0.08,textAlign:"center"}}/>
                        </div>
                      </div>
                      <div style={{height:this.props.windowHeight*0.15,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:'center',alignItems:'flex-end',}}>
                        <Button onClick={this.handleOk.bind(this)} style={{width:this.props.windowWidth*0.3,backgroundColor:"#214a7f",color:"#FFFFFF",border:"none"}}>确定</Button>
                      </div>
                </Modal>
                <div style={{width:"100%",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
                  <div style={{width:this.props.windowWidth*0.9,
                            borderStyle:"solid none  none none  ",
                            borderColor:"#028BA2 #00FFFF #FFFFFF #00FFFF  ",
                            borderWidth:1,
                  }}></div>
                </div>
                <div name="dealinfo" onClick={this.transactionRecords} style={{cursor: "pointer",height:this.props.windowHeight*0.2,width:this.props.windowWidth*0.9,float:"left",marginLeft:10,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <div name="dealinfo" style={{float:"left",height:this.props.windowHeight*0.04,width:this.props.windowWidth*0.45,color:"#4C6889",fontSize:this.props.windowHeight*0.045,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <img name="dealinfo" src={require("../../../resources/ewallet/change.png")} style={{height:this.props.windowHeight*0.08}}/>&nbsp;&nbsp;
                      交换记录
                    </div>
                    <div name="dealinfo" style={{height:this.props.windowHeight*0.04,width:this.props.windowWidth*0.45,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'flex-end',color:this.props.theme.bluefontcolor}}>
                      <img name="dealinfo" src={require("../../../resources/ewallet/more.png")} style={{height:this.props.windowHeight*0.06}} />
                    </div>
                </div>
              </div>
            </Row>
          </div>
        </div>
      </div>
    )
  }
          
}
//类属性
TurnIn.propTypes = {
    
}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight *0.7,
    windowWidth: state.WindowSizeReducer.windowWidth * 0.25,
    theme: state.ThemeReducer.theme,
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
)(TurnIn); 