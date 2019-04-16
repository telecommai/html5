/*书写组件的模板
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Layout,Button,message,List,Row,Col,Switch,Icon,Spin} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import tcrequest from "../../../request/tcrequest.js";
import LoadCoinCountAction from "../../../actions/LoadCoinCountAction.js";
import WalletClickAction from "../../../actions/WalletClickAction.js";
import copy from 'copy-to-clipboard';
const { Header, Footer, Sider, Content } = Layout;

//最好类名跟文件名对应
class BTCWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      imgStatus:"add",
      AllTokenBalance:[],
      AddressBalance:0,
      AllTokenByChain:[],
      WatchCoinStatus:"fail",
      AllTokenByChainStatus:"fail",
    }
  }
  //组件挂载完成后回调
  componentDidMount() {
    this.getWatchCoin();
  }
  //组件有更新后回调
  componentDidUpdate() {}
  //组件将要挂载时回调
  componentWillMount() {
    /*this.getIntegralTotal()*/
  }
  getWatchCoin(){
    var ethAddress = sessionStorage.getItem("ethAddress")
    if(ethAddress==null||ethAddress==""||ethAddress==undefined||ethAddress=="undefined"){
      return;
    }
    var body = "chainID=2"
                +"&userAddress="+ethAddress;
    tcrequest("/tcserver/chain/getAllTokenBalanceByChainAndUserAddress", body).then(response => response.json()).then(data => {
      if (data.result=="success") {
        data.AllTokenBalance.unshift({
            "balance":data.AddressBalance,
            "blockChainID":"2",
            "tokenAddress":`${sessionStorage.getItem("ethAddress")}`,
            "tokenDecimals":0,
            "tokenFullName":"ETH",
            "tokenID":"",
            "tokenIcon":`${require("../../../resources/ewallet/eth.png")}`,
            "tokenName":"ETH"
        });
        this.setState({
          AllTokenBalance:data.AllTokenBalance,
          
          WatchCoinStatus:data.result,
        })
        var balance = data.AddressBalance/1000000000000000000;
        var newbalance = Math.round(balance*100000000)/100000000;
        this.props.LoadCoinCountAction("AllETHBalance",newbalance)
      }
    })
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
  //组件销毁时回调
  componentWillUnmount() {}
  //格式化ETH地址
  fomartETHAddress(ethAddress){
    if(ethAddress==""||ethAddress==null||ethAddress=="undefined"||ethAddress==undefined){
      return "";
    }
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
    message.success('复制成功');
  };
  //添加追踪钱包点击事件
  addClick = (e) => {
    if (this.state.imgStatus == "back") {
      this.setState({
        AllTokenBalance:[],
          imgStatus: "add",
          WatchCoinStatus:"fail",
        })
      this.getWatchCoin()
    } else if (this.state.imgStatus == "add") {
      this.setState({
        AllTokenByChain:[],
          imgStatus: "back",
          AllTokenByChainStatus:"fail",
      })
      this.getAllTokenByChain();
    }
  }
  //开关切换
  switchChange = (tokenID, checked, e) => {
    var ethAddress = sessionStorage.getItem("ethAddress")
    if (ethAddress == null || ethAddress == "" || ethAddress == undefined || ethAddress == "undefined") {
      return;
    }
    var body = "chainID=2" +
      "&userAddress=" + ethAddress +
      "&tokenID=" + tokenID;
    if (checked) {
      body = body+"&type=1";
      tcrequest("/tcserver/chain/updateUserToken", body).then(response => response.json()).then(data => {
        if(data.result=="success"){
          message.success("关注成功")
        }
      })
    } else {
      body = body+"&type=0";
      tcrequest("/tcserver/chain/updateUserToken", body).then(response => response.json()).then(data => {
        if(data.result=="success"){
          message.success("取消关注成功")
        }
      })
    }
  }
  //eth转入
  ethTurnInClick=(e)=>{
    this.props.WalletClickAction("ETHTurnIn",{})
  }
  //eth明细
  ethDetailsClick=(e)=>{
    this.props.WalletClickAction("ETHTokenDealInfo",{"blockChainID":"2","tokenName":"ETH","CoinType":"ETH"})
  }
  //eth转出
  ethTurnOutClick=(e)=>{
    this.props.WalletClickAction("ETHTurnOut",{})
  }
  //代币点击加载交易信息
  tokenBalanceClick=(item,e)=>{
    item.CoinType="ETH"
    this.props.WalletClickAction("ETHTokenDealInfo",item)
  }
  //格式化币
  fomartETHCoin(coinCount){
    var balance = coinCount/1000000000000000000;
    var newbalance = Math.round(balance*100000000)/100000000;
    return newbalance;
  }
  //组件的渲染界面
  render() {
    return (
      <div>
        <Layout>
        <Sider width={this.props.windowWidth} className="horizontally-center" style={{height:this.props.windowHeight,backgroundColor:this.props.theme.listbgcolor}}>
          <div className="vertically-horizontally-center" style={{width:this.props.windowWidth*0.9,height:this.props.windowHeight*0.25,backgroundColor:this.props.theme.wllistcolor,borderRadius:5}}>
            <div style={{width:this.props.windowWidth}}>
              <table width="100%">
                <tbody>
                <tr>
                  <td rowSpan="2" style={{width:this.props.windowWidth*0.2,textAlign:'center'}}>
                    <img src={require("../../../resources/ewallet/defaultIcon.png")} style={{height:this.props.windowHeight*0.08,borderRadius:5}}/>
                  </td>
                  <td style={{width:this.props.windowWidth*0.7}}>
                    <Row style={{width:"100%"}}>
                      <Col span={12} style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                        账户
                      </Col>
                      <Col span={10} style={{textAlign:"right",fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                        <img src={require("../../../resources/ewallet/heartPurse.png")} style={{height:this.props.windowHeight*0.04}}/>
                      </Col>
                    </Row>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{fontSize:this.props.windowHeight*0.025,color:"#708090",}}>
                      <span onClick={this.copyETHAddress} style={{cursor: "pointer"}}>{this.fomartETHAddress(sessionStorage.getItem("ethAddress"))}&nbsp;&nbsp;<Icon type="copy" /></span>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
              <Row style={{width:"100%"}}>
                <Col span={4} style={{textAlign:"center"}}>
                  <img src={require("../../../resources/ewallet/eth_icon.png")} style={{height:this.props.windowHeight*0.04}}/>
                </Col>
                <Col span={18} style={{color:"#FFE696",fontSize:this.props.windowHeight*0.025}}>
                  <div style={{width:"100%",textAlign:"right"}}>{this.props.AllETHBalance}</div>
                </Col>
              </Row>
              <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.02}}>
                <div style={{width:this.props.windowWidth*0.8,borderBottom:"1px solid #708090"}}></div>
              </div>
              <Row style={{width:"100%"}}>
                <Col span={7} className="horizontally-center" style={{fontSize:this.props.windowHeight*0.025,color:"#108ee9",}}>
                      <span onClick={this.ethTurnInClick.bind(this)} style={{cursor: "pointer"}}>转入</span>
                </Col>
                <Col span={1} className="horizontally-center" style={{textAlign:"center"}}>
                  <div style={{height:this.props.windowHeight*0.04,borderRight:"1px solid #708090"}}></div>
                </Col>
                <Col span={7}>
                  <div className="horizontally-center" style={{fontSize:this.props.windowHeight*0.025,color:"#108ee9"}}>
                      <span onClick={this.ethDetailsClick.bind(this)}  style={{cursor: "pointer",}}>明细</span>
                  </div>
                </Col>
                <Col span={1} className="horizontally-center" style={{textAlign:"center"}}>
                  <div style={{height:this.props.windowHeight*0.04,borderRight:"1px solid #708090"}}></div>
                </Col>
                <Col span={7}>
                  <div className="horizontally-center" style={{fontSize:this.props.windowHeight*0.025,color:"#108ee9"}}>
                      <span onClick={this.ethTurnOutClick.bind(this)} style={{cursor: "pointer"}}>转出</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="horizontally-center" style={{width:this.props.windowWidth*0.9,height:this.props.windowHeight*0.75,backgroundColor:"transparent"}}>
            <div style={{width:"100%"}}>
              <Row style={{width:"100%"}}>
                <Col span={12}>
                  <div style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                      资产
                  </div>
                </Col>
                <Col span={12} className="horizontally-flex-end">
                  <div >
                    <img onClick={this.addClick.bind(this)} src={require("../../../resources/ewallet/"+this.state.imgStatus+".png")} style={{height:this.props.windowHeight*0.035,cursor: "pointer"}}/>
                  </div>
                </Col>
              </Row>
              <div style={{height:this.props.windowHeight*0.72,paddingTop:10,width:"100%",overflow:"auto"}}>
                {this.state.imgStatus=="add"&&
                <div>
                  <div className="horizontally-center" style={{width:"100%"}}>
                  <Spin tip="加载关注列表..." spinning={this.state.WatchCoinStatus!="success"}></Spin>
                  </div>
                  <List
                  dataSource={this.state.AllTokenBalance}
                  size="small"
                  split={false}
                  renderItem={item => (
                    <List.Item key={item.block}>
                        <Row onClick={this.tokenBalanceClick.bind(this,item)} style={{width:"100%",paddingBottom:10,cursor:"pointer"}}>
                          <Col span={4} className="horizontally-center" style={{height:this.props.windowHeight*0.06}}>
                            <img src={item.tokenIcon} 
                              style={{height:this.props.windowHeight*0.06}}
                            />
                          </Col>
                          <Col span={14}>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.035}}>{item.tokenName}</div>
                          </Col>
                          <Col span={6} className="vertically-center" style={{height:this.props.windowHeight*0.05,textAlign:"right",color:"#108ee9",fontSize:this.props.windowHeight*0.03}}>
                            <div style={{width:"100%",textAlign:"right"}}>{this.fomartETHCoin(item.balance)}</div>
                          </Col>
                        </Row>
                    </List.Item>
                  )}
                >
                </List></div>}
                {this.state.imgStatus=="back"&&
                <div>
                <div className="horizontally-center" style={{width:"100%"}}>
                  <Spin tip="加载代币列表..." spinning={this.state.AllTokenByChainStatus!="success"}></Spin>
                </div>
                <List
                  dataSource={this.state.AllTokenByChain}
                  size="small"
                  split={false}
                  renderItem={item => (
                    <List.Item key={item.block}>
                        <Row style={{width:"100%",paddingBottom:10}}>
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
                          <Col span={4} >
                            <div className="vertically-center" style={{height:this.props.windowHeight*0.12,color:"#108ee9",fontSize:this.props.windowHeight*0.03}}>
                              {item.tokenName!="ETH"&&<Switch onChange={this.switchChange.bind(this,item.tokenID)} defaultChecked={item.ifOwner==1} size="small" />}
                            </div>
                          </Col>
                        </Row>
                    </List.Item>
                  )}
                >
                </List></div>}
              </div>
            </div>
          </div>
        </Sider>
        </Layout>
      </div>
    )
  }
}
//类属性
BTCWallet.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight*0.7,
    windowWidth: state.WindowSizeReducer.windowWidth*0.2,
    theme: state.ThemeReducer.theme,
    AllETHBalance:state.CoinCountReducer.AllETHBalance,
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
)(BTCWallet);