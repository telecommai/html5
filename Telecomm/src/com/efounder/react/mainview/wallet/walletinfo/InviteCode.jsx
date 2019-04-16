/*邀请码https://mobile.solarsource.cn/ospstore/openplanet.html
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,Avatar,Badge,Input,Row,Col,Button,message } from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import copy from 'copy-to-clipboard';
const QRCode = require('qrcode.react');
import "../../../style/TableList.css"
//最好类名跟文件名对应
class InviteCode extends React.Component {
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
  copyInviteCode = () => {
    copy(sessionStorage.getItem("inviteCode"));
    message.success('复制成功');
  };
  //组件的渲染界面
  render() {
    return (
      <div>
        <div style={{width:this.props.windowWidth,height:this.props.windowHeight,backgroundColor:this.props.theme.wllistcolor,borderRadius:4,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
          <div style={{width:this.props.windowWidth}}>
            <Row style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <div style={{textAlign:"center"}}>
                <div style={{color:"#108EE9",fontSize:this.props.windowHeight*0.05}}>
                  您的邀请码
                </div>
                <div style={{color:"#108EE9",fontSize:this.props.windowHeight*0.08}}>
                  {sessionStorage.getItem("inviteCode")}
                </div>
                <div >
                  <button onClick={this.copyInviteCode} style={{borderRadius:4,backgroundColor:"#108EE9",color:"#FFFFFF",border:"none",width:this.props.windowWidth*0.2,height:this.props.windowWidth*0.1,outline:"none",cursor: "pointer"}}>复制</button>
                </div>
                <div style={{color:"#4C6889",fontSize:this.props.windowHeight*0.03,whiteSpace: "nowrap",height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center',justifyContent:'center',}}>
                  每邀请一位好友注册后，您将获得1000银钻奖励
                </div>
                <div style={{backgroundColor:"transparent",width:this.props.windowWidth,height:this.props.windowHeight*0.3,
                        display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",
                        alignItems:'center',
                        justifyContent:'center',    
                }}>
                  <div style={{backgroundColor:"#FFFFFF",height:this.props.windowWidth*0.32,width:this.props.windowWidth*0.32,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
                  <QRCode value={"https://mobile.solarsource.cn/ospstore/openplanet.html"} size={this.props.windowWidth*0.28}/>
                  </div>
                </div>
                <div style={{color:"#4C6889",fontSize:this.props.windowHeight*0.03,height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center',justifyContent:'center'}}>
                  扫码下载Telecomm
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
InviteCode.propTypes = {
    
}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight *0.6,
    windowWidth: state.WindowSizeReducer.windowWidth * 0.25,
    theme: state.ThemeReducer.theme,
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
)(InviteCode); 