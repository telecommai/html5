/*钱包（废弃）
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Form,Layout,Menu,Icon,Avatar,Badge,Input,Button,Upload,message,Table,List} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
const {Column} = Table;
const data = [
  {"imUserId":656,"imUserPassWord":"313817664","userId":"OX123*****890","nickName":"钱包1","click":true},
  {"imUserId":656,"imUserPassWord":"313817664","userId":"OX123*****890","nickName":"钱包2"},
];
//最好类名跟文件名对应
class Wallet extends React.Component {
  constructor(props) {
    super(props);
  }
  //组件挂载完成后回调
  componentDidMount() {}
  //组件有更新后回调
  componentDidUpdate() {}
  //组件将要挂载时回调
  componentWillMount() {}
  //组件销毁时回调
  componentWillUnmount() {}
  //组件的渲染界面
  render() {
    return (
      <div style={{backgroundColor:this.props.wlinfocolor,height:this.props.windowHeight*0.8,width:this.props.windowWidth*0.5}}>
        {/*<div style={{height:this.props.windowHeight*0.04,color:"#FFFFFF",backgroundColor:this.props.theme.wltitlecolor}}>电子钱包</div>*/}
        <div style={{height:this.props.windowHeight*0.8,width:this.props.windowWidth*0.5}}>
          <div style={{height:this.props.windowHeight*0.8,width:this.props.windowWidth*0.15,float:"left",backgroundColor:this.props.theme.wllistcolor}}>
            <div style={{height:this.props.windowHeight*0.2,borderBottom:"1px solid "+this.props.theme.fontcolor,display:"flex",display: "-webkit-flex", alignItems:'center',justifyContent:'center',}}>
              <div style={{textAlign:"center"}}><img style={{height:this.props.windowHeight*0.15,borderRadius:1000,}} src={sessionStorage.getItem("avatar")}/><br/><span style={{color:this.props.theme.bluefontcolor}}>{sessionStorage.getItem("nickName")}</span></div>
            </div>
            <div style={{height:this.props.windowHeight*0.06,display:"flex",display: "-webkit-flex", alignItems:'center',}}>
              <div style={{width:this.props.windowWidth*0.07,display:"flex",display: "-webkit-flex", alignItems:'center',justifyContent:'center',color:this.props.theme.bluefontcolor}}>
                <img src={require("../resources/ewallet/createWallet.png")}/>
                创建钱包
              </div>
              <div style={{height:this.props.windowHeight*0.02,borderLeft:"1px solid "+this.props.theme.fontcolor}}></div>
              <div style={{width:this.props.windowWidth*0.07,textAlign:"center",display:"flex",display: "-webkit-flex", alignItems:'center',justifyContent:'center',color:this.props.theme.bluefontcolor}}>
                <img src={require("../resources/ewallet/recoveryWallet.png")}/>
                恢复钱包
              </div>
            </div>
            <div style={{height:this.props.windowHeight*0.48,overflow:"auto"}}>
              <List
                dataSource={data}
                renderItem={item => (
                  <List.Item key={item.imUserId} style={{backgroundColor:item.click?this.props.theme.wlinfocolor:"transparent"}}>
                    <table style={{}}>
                      <tbody>
                        <tr style={{cursor: "pointer",width:this.props.windowWidth*0.15}}>
                          <td>
                            <img style={{height:this.props.windowHeight*0.08,borderRadius:1000,}} src={sessionStorage.getItem("avatar")}/>
                          </td>
                          <td>
                            <div style={{color:this.props.theme.fontcolor}}>{item.nickName}</div>
                            <div style={{color:this.props.theme.bluefontcolor}}>{item.userId}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </List.Item>
                )}
              >
              </List>
            </div>
          </div>
          <div style={{float:"left",height:this.props.windowHeight*0.8,width:this.props.windowWidth*0.35,backgroundColor:this.props.theme.wlinfocolor,display:"flex",display: "-webkit-flex", justifyContent:'center',}}>
            <table style={{width:this.props.windowWidth*0.28,marginTop:this.props.windowHeight*0.06}}>
              <tbody>
                <tr>
                  <td>
                    <div style={{float:"left"}}><img style={{height:this.props.windowHeight*0.08,borderRadius:1000,}} src={sessionStorage.getItem("avatar")}/></div>
                    <div style={{float:"left",marginLeft:10}}>
                      <span style={{color:this.props.theme.fontcolor,fontSize:16}}>钱包1</span><br/>
                      <span style={{color:this.props.theme.bluefontcolor}}>0x112346867531243651324444444</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <div style={{height:this.props.windowHeight*0.03,display:"flex",display: "-webkit-flex", alignItems:'center',}}>
                    <div style={{width:this.props.windowWidth*0.28,borderBottom:"1px solid "+this.props.theme.fontcolor}}></div>
                  </div>
                </tr>
                <tr>
                  <td>
                    <div style={{float:"left",display:"flex",display: "-webkit-flex", alignItems:'center',}}>
                      <div style={{float:"left",width:"8px",height:this.props.windowHeight*0.02,borderLeft:"5px solid "+this.props.theme.bluefontcolor}}></div>
                      <span style={{float:"left",fontSize:16,color:this.props.theme.fontcolor}}>资产</span>
                    </div>
                    <div style={{float:"right",color:this.props.theme.wlmoneycolor}}>小米(millet)</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style={{color:this.props.theme.wlmoneycolor,fontSize:24}}>1.2313232</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style={{float:"right",color:this.props.theme.fontcolor}}>0.00100000=500克小米</span>
                  </td>
                </tr>
                <tr>
                  <div style={{height:this.props.windowHeight*0.03,display:"flex",display: "-webkit-flex", alignItems:'center',}}>
                    <div style={{width:this.props.windowWidth*0.28,borderBottom:"1px solid "+this.props.theme.fontcolor}}></div>
                  </div>
                </tr>
                <tr>
                  <div style={{height:this.props.windowHeight*0.04,display:"flex",display: "-webkit-flex", alignItems:'center',}}>
                    <div style={{fontSize:18,width:this.props.windowWidth*0.14,display:"flex",display: "-webkit-flex", alignItems:'center',justifyContent:'center',color:this.props.theme.fontcolor}}>
                      <img src={require("../resources/ewallet/turnOut.png")}/>
                      粜(tiao)米
                    </div>
                    <div style={{height:this.props.windowHeight*0.02,borderLeft:"1px solid "+this.props.theme.fontcolor}}></div>
                    <div style={{fontSize:18,width:this.props.windowWidth*0.14,display:"flex",display: "-webkit-flex", alignItems:'center',justifyContent:'center',color:this.props.theme.fontcolor}}>
                      <img src={require("../resources/ewallet/turnIn.png")}/>
                      籴(di)米
                    </div>
                  </div>
                </tr>
                <tr>
                  <div style={{height:this.props.windowHeight*0.03,display:"flex",display: "-webkit-flex", alignItems:'center',}}>
                    <div style={{width:this.props.windowWidth*0.28,borderBottom:"1px solid "+this.props.theme.fontcolor}}></div>
                  </div>
                </tr>
                <tr>
                  <td>
                    <div style={{float:"left",display:"flex",display: "-webkit-flex", alignItems:'center',}}>
                      <div style={{float:"left",width:"8px",height:this.props.windowHeight*0.02,borderLeft:"5px solid "+this.props.theme.bluefontcolor}}></div>
                      <span style={{float:"left",fontSize:16,color:this.props.theme.fontcolor}}>交易明细</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
//类属性
Wallet.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
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
)(Wallet);