/*书写组件的模板
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Layout,Button,message,List,Row,Col,Switch,Icon,Spin,Modal} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import tcrequest from "../../../request/tcrequest.js";
import LoadCoinCountAction from "../../../actions/LoadCoinCountAction.js";
import WalletClickAction from "../../../actions/WalletClickAction.js";
import AddWalletListAction from "../../../actions/AddWalletListAction.js";
import SwitchWalletAction from "../../../actions/SwitchWalletAction.js";
import copy from 'copy-to-clipboard';
const { Header, Footer, Sider, Content } = Layout;

//最好类名跟文件名对应
class ETHWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      imgStatus:"add",
      AllTokenBalance:[],
      AddressBalance:0,
      AllTokenByChain:[],
      WatchCoinStatus:"fail",
      AllTokenByChainStatus:"fail",
      visible:false,
      ETHCurrentWallet:{}
    }
  }
  //组件挂载完成后回调
  componentDidMount() {
    this.state.ETHCurrentWallet={
            "accountAddress":`${sessionStorage.getItem("ethAddress")}`,
            "accountIcon":`${require("../../../resources/ewallet/defaultIcon.png")}`,
            "accountName":"账户",
            "accountPrivateKey":"",
            "accountPublicKey":"",
            "accountType":1,
            "balance":"0",
            "blockChainName":"ETH",
            "eosIsActive":0,
            "id":"",
            "mainAccountAddress":`${sessionStorage.getItem("ethAddress")}`,
        }
    this.getWatchCoin(this.state.ETHCurrentWallet.accountAddress);
  }
  //组件有更新后回调
  componentDidUpdate() {}
  //组件将要挂载时回调
  componentWillMount() {

    this.props.AddWalletListAction("ETH",{
            "accountAddress":`${sessionStorage.getItem("ethAddress")}`,
            "accountIcon":`${require("../../../resources/ewallet/defaultIcon.png")}`,
            "accountName":"账户",
            "accountPrivateKey":"",
            "accountPublicKey":"",
            "accountType":1,
            "balance":"0",
            "blockChainName":"ETH",
            "eosIsActive":0,
            "id":"",
            "mainAccountAddress":`${sessionStorage.getItem("ethAddress")}`,
        })
  }
  getWatchCoin(ethAddress){
    /*var ethAddress = this.state.ETHCurrentWallet.accountAddress*/
    if(ethAddress==null||ethAddress==""||ethAddress==undefined||ethAddress=="undefined"){
      return;
    }
    var body = "chainID=2"+"&userAddress="+ethAddress;
    tcrequest("/tcserver/chain/getAllTokenBalanceByChainAndUserAddress", body).then(response => response.json()).then(data => {
      if (data.result=="success") {
        data.AllTokenBalance.unshift({
            "balance":data.AddressBalance,
            "blockChainID":"2",
            "tokenAddress":this.state.ETHCurrentWallet.accountAddress,
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
  getAllTokenByChain(ethAddress){
    /*var ethAddress = this.state.ETHCurrentWallet.accountAddress;*/
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
      this.getWatchCoin(this.state.ETHCurrentWallet.accountAddress)
    } else if (this.state.imgStatus == "add") {
      this.setState({
        AllTokenByChain:[],
          imgStatus: "back",
          AllTokenByChainStatus:"fail",
      })
      this.getAllTokenByChain(this.state.ETHCurrentWallet.accountAddress);
    }
  }
  //开关切换
  switchChange = (tokenID, checked, e) => {
    var ethAddress = this.state.ETHCurrentWallet.accountAddress;
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
  //切换钱包
  ETHSwitch=(e)=>{
    this.setState({
      visible:true,
    })
  }
  ETHSwitchCancel(){
    this.setState({
      visible:false,
    })
  }
  ETHSwitchOk(item,e){
    this.props.SwitchWalletAction(item,"ETH")
    this.state.ETHCurrentWallet = item;
    this.getWatchCoin(item.accountAddress)
    this.setState({
      visible:false,
    })
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
        <Sider width={this.props.windowWidth} style={{height:this.props.windowHeight,backgroundColor:this.props.theme.listbgcolor,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
          <div style={{width:this.props.windowWidth*0.9,height:this.props.windowHeight*0.25,backgroundColor:this.props.theme.wllistcolor,borderRadius:5,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center',marginTop:this.props.windowHeight*0.02}}>
            <div style={{width:this.props.windowWidth}}>
              <table width="100%">
                <tbody>
                <tr>
                  <td rowSpan="2" style={{width:this.props.windowWidth*0.2,textAlign:'center'}}>
                    <img src={this.state.ETHCurrentWallet.accountIcon==""?require("../../../resources/ewallet/defaultIcon.png"):this.state.ETHCurrentWallet.accountIcon} style={{height:this.props.windowHeight*0.08,borderRadius:5}}/>
                  </td>
                  <td style={{width:this.props.windowWidth*0.7}}>
                    <Row style={{width:"100%"}}>
                      <Col span={12} style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                        {this.state.ETHCurrentWallet.accountName}
                      </Col>
                      <Col span={10} style={{textAlign:"right",fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                        <img  src={require("../../../resources/ewallet/heartPurse.png")} style={{cursor: "pointer",height:this.props.windowHeight*0.04}}/>
                        <span onClick={this.ETHSwitch.bind(this)} style={{cursor: "pointer"}}>切换钱包</span>
                      </Col>
                    </Row>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{fontSize:this.props.windowHeight*0.025,color:"#708090",}}>
                      <span onClick={this.copyETHAddress} style={{cursor: "pointer"}}>{this.fomartETHAddress(this.state.ETHCurrentWallet.accountAddress)}&nbsp;&nbsp;<Icon type="copy" /></span>
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
              <div style={{height:this.props.windowHeight*0.02,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                <div style={{width:this.props.windowWidth*0.8,borderBottom:"1px solid "+this.props.theme.linecolor}}></div>
              </div>
              <Row style={{width:"100%"}}>
                <Col span={7} style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',fontSize:this.props.windowHeight*0.025,color:"#108ee9",}}>
                      <span onClick={this.ethTurnInClick.bind(this)} style={{cursor: "pointer"}}>转入</span>
                </Col>
                <Col span={1} style={{textAlign:"center",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
                  <div style={{height:this.props.windowHeight*0.04,borderRight:"1px solid "+this.props.theme.linecolor}}></div>
                </Col>
                <Col span={7}>
                  <div style={{fontSize:this.props.windowHeight*0.025,color:"#108ee9",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
                      <span onClick={this.ethDetailsClick.bind(this)}  style={{cursor: "pointer",}}>明细</span>
                  </div>
                </Col>
                <Col span={1} style={{textAlign:"center",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
                  <div style={{height:this.props.windowHeight*0.04,borderRight:"1px solid "+this.props.theme.linecolor}}></div>
                </Col>
                <Col span={7}>
                  <div style={{fontSize:this.props.windowHeight*0.025,color:"#108ee9",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
                      <span onClick={this.ethTurnOutClick.bind(this)} style={{cursor: "pointer"}}>转出</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <Modal
            visible={this.state.visible}
            onCancel={this.ETHSwitchCancel.bind(this)}
            bodyStyle={{backgroundColor:"#183257"}}
            footer={null}
            width={this.props.windowWidth*0.8}
          >
            <div style={{height:this.props.windowHeight*0.6,width:"100%",overflow:"auto"}}>
              <List
                dataSource={this.props.ETHWalletList}
                size="small"
                split={false}
                renderItem={item => (
                  <List.Item key={item.id}>
                      <Row onClick={this.ETHSwitchOk.bind(this,item)} onDoubleClick={this.ETHSwitchOk.bind(this,item)}  style={{width:"100%",paddingBottom:10,cursor:"pointer"}}>
                        <Col span={6} >
                          <div style={{height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                            <img src={item.accountIcon==""?require("../../../resources/ewallet/defaultIcon.png"):item.accountIcon} style={{height:this.props.windowHeight*0.08}}/>
                          </div>
                        </Col>
                        <Col span={14}>
                          <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.03,fontWeight:"bold"}}>{item.accountName}</div>
                          <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{this.fomartETHAddress(item.accountAddress)}</div>
                        </Col>
                      </Row>
                  </List.Item>
                )}
              >
              </List>
            </div>
          </Modal>
          <div style={{width:this.props.windowWidth*0.9,height:this.props.windowHeight*0.75,backgroundColor:"transparent",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",justifyContent:'center',}}>
            <div style={{width:"100%"}}>
              <Row style={{width:"100%"}}>
                <Col span={12}>
                  <div style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                      资产
                  </div>
                </Col>
                <Col span={12} style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'flex-end',}}>
                  <div >
                    <img onClick={this.addClick.bind(this)} src={require("../../../resources/ewallet/"+this.state.imgStatus+".png")} style={{height:this.props.windowHeight*0.035,cursor: "pointer"}}/>
                  </div>
                </Col>
              </Row>
              <div style={{height:this.props.windowHeight*0.72,paddingTop:10,width:"100%",overflow:"auto"}}>
                {this.state.imgStatus=="add"&&
                <div>
                  <div style={{width:"100%",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
                  <Spin tip="加载关注列表..." spinning={this.state.WatchCoinStatus!="success"}></Spin>
                  </div>
                  <List
                  dataSource={this.state.AllTokenBalance}
                  size="small"
                  split={false}
                  renderItem={item => (
                    <List.Item key={item.block}>
                        <Row onClick={this.tokenBalanceClick.bind(this,item)} style={{width:"100%",paddingBottom:10,cursor:"pointer"}}>
                          <Col span={4} style={{height:this.props.windowHeight*0.06,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                            <img src={item.tokenIcon} 
                              style={{height:this.props.windowHeight*0.06}}
                            />
                          </Col>
                          <Col span={14}>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.035}}>{item.tokenName}</div>
                          </Col>
                          <Col span={6} style={{height:this.props.windowHeight*0.05,textAlign:"right",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',color:"#108ee9",fontSize:this.props.windowHeight*0.03}}>
                            <div style={{width:"100%",textAlign:"right"}}>{this.fomartETHCoin(item.balance)}</div>
                          </Col>
                        </Row>
                    </List.Item>
                  )}
                >
                </List></div>}
                {this.state.imgStatus=="back"&&
                <div>
                <div style={{width:"100%",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", justifyContent:'center',}}>
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
                            <div style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                              <img src={item.tokenIcon}style={{height:this.props.windowHeight*0.08}}/>
                            </div>
                          </Col>
                          <Col span={14}>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.03,fontWeight:"bold"}}>{item.tokenName}</div>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{item.tokenFullName}</div>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{this.fomartETHAddress(item.tokenAddress)}</div>
                          </Col>
                          <Col span={4} >
                            <div style={{height:this.props.windowHeight*0.12,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',color:"#108ee9",fontSize:this.props.windowHeight*0.03}}>
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
ETHWallet.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight*0.72,
    windowWidth: state.WindowSizeReducer.windowWidth*0.2,
    theme: state.ThemeReducer.theme,
    AllETHBalance:state.CoinCountReducer.AllETHBalance,
    ETHCurrentWallet:state.WalletListReducer.ETHCurrentWallet,
    ETHWalletList:state.WalletListReducer.ETHWalletList,
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
    AddWalletListAction:(wallettype,walletinfo)=>{
      dispatch(AddWalletListAction(wallettype,walletinfo));
    },
    SwitchWalletAction:(walletinfo,waltype)=>{
      dispatch(SwitchWalletAction(walletinfo,waltype));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ETHWallet);