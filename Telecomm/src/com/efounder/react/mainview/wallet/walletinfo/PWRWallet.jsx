/*书写组件的模板
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Form,Layout,Menu,Icon,Avatar,Badge,Input,Button,Upload,message,Table,List,Row,Col} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import TurnOut from "./TurnOut.jsx";
import InviteCode from "./InviteCode.jsx";
import TurnIn from "./TurnIn.jsx";
import TransactionRecords from "./TransactionRecords.jsx";
import tcrequest from "../../../request/tcrequest.js";
import LoadCoinCountAction from "../../../actions/LoadCoinCountAction.js";
import WalletClickAction from "../../../actions/WalletClickAction.js";
import copy from 'copy-to-clipboard';
const {Column} = Table;
const { Header, Footer, Sider, Content } = Layout;

//最好类名跟文件名对应
class PWRWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      clickRowKey:"",
      integralTotal:0,
      balance:0,
    }
  }
  //组件挂载完成后回调
  componentDidMount() {}
  //组件有更新后回调
  componentDidUpdate() {}
  //组件将要挂载时回调
  componentWillMount() {
    this.getIntegralTotal()
  }

  //加载银钻
  getIntegralTotal(){
    var body = "access_token="+sessionStorage.getItem("access_token");
    tcrequest("/tcserver/integral/integralTotal", body).then(response => response.json()).then(data => {
      if (data.result=="success") {
        this.props.LoadCoinCountAction("integralTotal",data.integralTotal)
        this.getBalance();
      }else{
        var body2 = "grant_type=refresh_token"+"&client_id=a6f23fbb-0a1d-4e10-be7e-89181cdf089c&client_secret=2a6a9640-9a46-4622-b226-bc94b852848c&refresh_token="+sessionStorage.getItem("refresh_token");
        tcrequest("/tcserver/oauth/accessToken", body2).then(response => response.json()).then(data => {
          if(data.error=="invalid_request"){
            this.props.history.push({
              pathname: '/login',
            });
            message.warning("当前登录失效，请重新登录")
            return;
          }
          sessionStorage.setItem("access_token",data.access_token);
          sessionStorage.setItem("refresh_token",data.refresh_token);
          this.getIntegralTotal();
        })
      }
    })
  }
  //加载能量币
  getBalance(){
    var body = "ethAddress="+sessionStorage.getItem("ethAddress");
    tcrequest("/tcserver/eth/ethGetBalance", body).then(response => response.json()).then(data => {
      if (data.result=="success") {
        var balance = data.balance/1000000000000000000;
        var newbalance = Math.round(balance*100000000)/100000000;
        this.props.LoadCoinCountAction("balance",newbalance)
      }
    })
  }
  //组件销毁时回调
  componentWillUnmount() {}
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
  //点击事件
  trClick=(e)=>{
    var key = e.target.getAttribute("name")
    this.props.WalletClickAction(key,{"blockChainID":"4","CoinType":"PWR"})
  }
  fomartETHAddress(){
    var ethAddress = sessionStorage.getItem("ethAddress")
    var eth = "";
    var ethlen = ethAddress.length;
    var beforstr = ethAddress.substring(0,6);
    var endstr = ethAddress.substring(ethlen-4,ethlen)
    eth = beforstr+"******"+endstr;
    return eth;
  }
  //复制基地地址
  copyETHAddress = () => {
    copy(sessionStorage.getItem("ethAddress"));
    message.success('基地ID已复制');
  };
  //组件的渲染界面
  render() {
    return (
      <div>
        <Layout>
        <Sider width={this.props.windowWidth} style={{height:this.props.windowHeight,backgroundColor:this.props.theme.listbgcolor,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
          <table style={{width:this.props.windowWidth}}>
            <tbody>
              <tr>
                <td>
                  <div style={{height:this.props.windowHeight*0.25,position:"relative"}}>
                    <img src={require("../../../resources/ewallet/background.png")} style={{width:this.props.windowWidth,height:this.props.windowHeight*0.25,position:"absolute",zIndex:0}}/>
                    <div style={{
                        width:this.props.windowWidth,
                        height:this.props.windowHeight*0.25,
                        position:"absolute",
                        zIndex:1,
                        backgroundImage:`url(${require("../../../resources/ewallet/background1.png")})`,
                        backgroundRepeat:"no-repeat",
                        backgroundSize: `${this.props.windowWidth*1.8}px ${this.props.windowWidth*1.2}px`,
                        backgroundPosition: "top center",
                      }}
                    ></div>
                    <div style={{
                        width:this.props.windowWidth,
                        height:this.props.windowHeight*0.25,
                        position:"absolute",
                        zIndex:2,
                        backgroundImage:`url(${require("../../../resources/ewallet/planet/"+sessionStorage.getItem("planet")+".png")})`,
                        backgroundRepeat:"no-repeat",
                        backgroundSize: `${this.props.windowWidth*1.8}px ${this.props.windowWidth*1.2}px`,
                        backgroundPosition: "top center",
                      }}
                    ></div>
                    <div style={{
                        width:this.props.windowWidth,
                        height:this.props.windowHeight*0.25,
                        position:"absolute",
                        zIndex:3,
                        backgroundImage:`url(${require("../../../resources/ewallet/background2.png")})`,
                        backgroundRepeat:"no-repeat",
                        backgroundSize: `${this.props.windowWidth*1.8}px ${this.props.windowWidth*1.2}px`,
                        backgroundPosition: "top center",
                      }}
                    ></div>
                    <div style={{height:this.props.windowHeight*0.25,position:"absolute",zIndex:5,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"flex-end"}}>
                      <table style={{width:this.props.windowWidth}}>
                        <tbody>
                          <tr>
                            <td colSpan={4}>
                              <div style={{fontSize:this.props.windowHeight*0.03,color:this.props.theme.bluefontcolor}}>
                                {sessionStorage.getItem("nickName")}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>
                              <div style={{fontSize:this.props.windowHeight*0.025,color:this.props.theme.bluefontcolor}}>
                                星际ID&nbsp;&nbsp;{sessionStorage.getItem("imUserId")}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={4}>
                              <div style={{fontSize:this.props.windowHeight*0.025,color:this.props.theme.bluefontcolor}}>
                                基地ID&nbsp;&nbsp;<span onClick={this.copyETHAddress} style={{cursor: "pointer"}}>{this.fomartETHAddress()}&nbsp;&nbsp;<Icon type="copy" /></span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                            <div style={{height:this.props.windowHeight*0.012}}></div>
                            </td>
                          </tr>
                          <tr>
                            <td style={{fontSize:this.props.windowHeight*0.03,textAlign:"center",color:"#FFFFFF"}}>
                              <div>{this.props.userlistcount}</div>
                              <div>好友</div>
                            </td>
                            <td style={{fontSize:this.props.windowHeight*0.03,textAlign:"center",color:"#FFFFFF"}}>
                              <div>{this.props.grouplistcount}</div>
                              <div>部落</div>
                            </td>
                            <td style={{fontSize:this.props.windowHeight*0.03,textAlign:"center",color:"#FFFFFF"}}>
                              <div>{sessionStorage.getItem("inviteCodeUseCount")==""||sessionStorage.getItem("inviteCodeUseCount")==undefined?0:sessionStorage.getItem("inviteCodeUseCount")}</div>
                              <div>粉丝</div>
                            </td>
                            <td style={{fontSize:this.props.windowHeight*0.03,textAlign:"center",color:"#FFFFFF"}}>
                              <div>{this.props.publiclistcount}</div>
                              <div>应用</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
              <tr style={{backgroundColor:this.props.theme.wllistcolor}}>
                <td>
                  <Row style={{height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
                    <Col span={6} style={{height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:"center"}}>
                      <img style={{height:this.props.windowHeight*0.1,borderRadius:1000,}} src={require("../../../resources/ewallet/pwc_z.gif")}/>
                    </Col>
                    <Col span={18} >
                      <div style={{width:this.props.windowWidth*0.72,color:this.props.theme.wlmoneycolor,fontSize:this.props.windowHeight*0.025}}>
                      能量
                      </div>
                      <div style={{width:this.props.windowWidth*0.72,textAlign:"right",color:this.props.theme.wlmoneycolor,fontSize:this.props.windowHeight*0.025}}>
                      {this.props.balance}
                      </div>
                    </Col>
                  </Row>
                </td>
              </tr>
              <tr style={{backgroundColor:this.props.theme.wllistcolor}}>
                <td>
                <div style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:this.props.windowWidth*0.9,borderBottom:"1px solid "+this.props.theme.linecolor}}></div>
                </div>
                </td>
              </tr>
              <tr style={{backgroundColor:this.props.theme.wllistcolor}}>
                <td>
                  <Row style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <Col span={11} name="turnOut" onClick={this.trClick} style={{cursor: "pointer"}}>
                      <div name="turnOut" style={{textAlign:"center",height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.45,color:this.props.theme.wlmoneycolor,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
                        <img name="turnOut" src={require("../../../resources/ewallet/walletTurnOut.png")} style={{fontSize:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04}}/>&nbsp;&nbsp;
                        转出
                      </div>
                    </Col>
                    <Col span={2} style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                      <div style={{height:this.props.windowHeight*0.05,borderStyle:" none solid none none  ",borderColor:" #00FFFF "+this.props.theme.linecolor+" #FFFFFF #00FFFF  ",borderWidth:1,}}></div>
                    </Col>
                    <Col span={11} name="turnIn" onClick={this.trClick} style={{cursor: "pointer"}}>
                      <div name="turnIn" style={{textAlign:"center",height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.45,color:this.props.theme.wlmoneycolor,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',}}>
                        <img name="turnIn" src={require("../../../resources/ewallet/walletTurnIn.png")} style={{fontSize:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04}}/>&nbsp;&nbsp;
                        转入
                      </div>
                    </Col>
                  </Row>  
                </td>
              </tr>
              <tr style={{backgroundColor:this.props.theme.wllistcolor}}>
                <td>
                <div style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:this.props.windowWidth*0.9,borderBottom:"1px solid "+this.props.theme.linecolor}}></div>
                </div>
                </td>
              </tr>
              <tr name="dealinfo" onClick={this.trClick} style={{backgroundColor:this.props.theme.wllistcolor,cursor: "pointer"}}>
                <td name="dealinfo" >
                  <div name="dealinfo"  style={{height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.95,float:"left",marginLeft:10,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <div name="dealinfo"  style={{fontSize:this.props.windowHeight*0.025,float:"left",height:this.props.windowHeight*0.08,width:this.props.windowWidth*0.45,color:this.props.theme.fontcolor,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <img name="dealinfo" src={require("../../../resources/ewallet/profile.png")} style={{fontSize:this.props.windowHeight*0.035,height:this.props.windowHeight*0.04}}/>&nbsp;&nbsp;
                      交易明细
                    </div>
                    <div name="dealinfo"  style={{height:this.props.windowHeight*0.08,width:this.props.windowWidth*0.48,color:this.props.theme.bluefontcolor,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'flex-end',}}>
                      <img name="dealinfo" src={require("../../../resources/ewallet/more.png")} style={{height:this.props.windowHeight*0.04}} />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                <div style={{height:this.props.windowHeight*0.01}}></div>
                </td>
              </tr>
              <tr name="sildia" onClick={this.trClick} style={{backgroundColor:this.props.theme.wllistcolor,cursor: "pointer"}}>
                <td name="sildia">
                  <div name="sildia" style={{height:this.props.windowHeight*0.08,width:this.props.windowWidth*0.95,float:"left",marginLeft:10,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <div name="sildia" style={{float:"left",height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.45,color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.025,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <img name="sildia" src={require("../../../resources/ewallet/silverDiamond.gif")} style={{height:this.props.windowHeight*0.06}}/>&nbsp;&nbsp;
                      银钻
                    </div>
                    <div name="sildia" style={{fontSize:this.props.windowHeight*0.025,height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.45,color:this.props.theme.bluefontcolor,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'flex-end',}}>
                      {this.toThousands(this.props.integralTotal)}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                <div style={{height:this.props.windowHeight*0.01}}></div>
                </td>
              </tr>
              <tr name="blkdia" onClick={this.trClick} style={{backgroundColor:/*this.state.clickRowKey=="blkdia"?this.props.theme.wlrowclick:*/this.props.theme.wllistcolor,cursor: "pointer"}}>
                <td name="blkdia">
                  <div name="blkdia" style={{height:this.props.windowHeight*0.08,width:this.props.windowWidth*0.95,float:"left",marginLeft:10,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <div name="blkdia" style={{float:"left",height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.45,color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.025,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <img name="blkdia" src={require("../../../resources/ewallet/blackDiamond.gif")} style={{height:this.props.windowHeight*0.06}}/>&nbsp;&nbsp;
                      黑钻
                    </div>
                    <div name="blkdia" style={{fontSize:this.props.windowHeight*0.025,whiteSpace: "nowrap",height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.45,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'flex-end',color:this.props.theme.bluefontcolor}}>
                      加入Telecomm矿池
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                <div style={{height:this.props.windowHeight*0.01}}></div>
                </td>
              </tr>
              <tr name="invitation" onClick={this.trClick} style={{backgroundColor:/*this.state.clickRowKey=="blkdia"?this.props.theme.wlrowclick:*/this.props.theme.wllistcolor,cursor: "pointer"}}>
                <td name="invitation">
                  <div name="invitation" style={{height:this.props.windowHeight*0.06,width:this.props.windowWidth*0.95,float:"left",marginLeft:10,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <div name="invitation" style={{float:"left",height:this.props.windowHeight*0.04,width:this.props.windowWidth*0.45,color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.025,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center'}}>
                    <img name="invitation" src={require("../../../resources/ewallet/code.png")} style={{height:this.props.windowHeight*0.04}}/>&nbsp;&nbsp;
                      邀请码
                    </div>
                    <div name="invitation" style={{height:this.props.windowHeight*0.04,width:this.props.windowWidth*0.45,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'flex-end',color:this.props.theme.bluefontcolor}}>
                      <img name="invitation" src={require("../../../resources/ewallet/more.png")} style={{height:this.props.windowHeight*0.04}} />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                <div style={{height:this.props.windowHeight*0.01}}></div>
                </td>
              </tr>
            </tbody>
          </table>
        </Sider>
        </Layout>
      </div>
    )
  }
}
//类属性
PWRWallet.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    userlistcount: state.LoadContactListReducer.userlistcount,
    grouplistcount:state.LoadContactListReducer.grouplistcount,
    publiclistcount:state.LoadContactListReducer.publiclistcount,
    windowHeight: state.WindowSizeReducer.windowHeight*0.72,
    windowWidth: state.WindowSizeReducer.windowWidth*0.2,
    theme: state.ThemeReducer.theme,
    balance:state.CoinCountReducer.balance,
    integralTotal:state.CoinCountReducer.integralTotal,
  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {
    LoadCoinCountAction: (type,count) => {
      dispatch(LoadCoinCountAction(type,count));
    },
    WalletClickAction:(clickRowKey,clickRowInfo)=>{
      dispatch(WalletClickAction(clickRowKey,clickRowInfo));
    },
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PWRWallet);