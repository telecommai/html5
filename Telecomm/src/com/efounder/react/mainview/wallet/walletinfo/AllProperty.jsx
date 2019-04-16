/*总资产
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
import SwitchWalletAction from "../../../actions/SwitchWalletAction.js";
import BTCNoWallet from "./BTCNoWallet.jsx";
import copy from 'copy-to-clipboard';
const { Header, Footer, Sider, Content } = Layout;
const data=[{name:"ETH",imgurl:"eth"},{name:"BTC",imgurl:"btc"},{name:"EOS",imgurl:"eos"}]
//最好类名跟文件名对应
class AllProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      AddressBalance:0,
      visible:false,
    }
  }
  //组件挂载完成后回调
  componentDidMount() {
  }
  //组件有更新后回调
  componentDidUpdate() {}
  //组件将要挂载时回调
  componentWillMount() {
    /*this.getIntegralTotal()*/
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
    copy(this.props.BTCCurrentWallet.accountAddress);
    message.success('复制成功');
  };
  //eth转入
  ethTurnInClick=(e)=>{
    this.props.WalletClickAction("BTCTurnIn",{})
  }
  //eth明细
  ethDetailsClick=(e)=>{
    this.props.WalletClickAction("BTCTokenDealInfo",{"blockChainID":"1","tokenName":"BTC","CoinType":"BTC"})
  }
  //eth转出
  ethTurnOutClick=(e)=>{
    this.props.WalletClickAction("BTCTurnOut",{})
  }
  //代币点击加载交易信息
  tokenBalanceClick=(item,e)=>{
    return;
    item.CoinType="ETH"
    this.props.WalletClickAction("ETHTokenDealInfo",item)
  }
  //格式化币
  fomartETHCoin(coinCount){
    var balance = coinCount/1000000000000000000;
    var newbalance = Math.round(balance*100000000)/100000000;
    return newbalance;
  }
  //切换钱包
  BTCSwitch=(e)=>{
    this.setState({
      visible:true,
    })
  }
  //切换钱包取消
  BTCSwitchCancel=(e)=>{
    this.setState({
      visible:false,
    })
  }
  //切换钱包点击事件
  BTCSwitchOk=(item,e)=>{
    this.props.SwitchWalletAction(item,"BTC")
    this.setState({
      visible:false,
    })
  }
  //组件的渲染界面
  render() {
    return (
      <div>
        <Layout>
        <Sider className="horizontally-center" width={this.props.windowWidth} style={{height:this.props.windowHeight,backgroundColor:this.props.theme.listbgcolor}}>
          <div className="vertically-horizontally-center" style={{width:this.props.windowWidth,height:this.props.windowHeight*0.25,backgroundImage:`url(${require("../../../resources/ewallet/sybg.png")})`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%"}}>
            <div>
              <div style={{width:this.props.windowWidth,textAlign:"center",color:"#108ee9",fontSize:this.props.windowHeight*0.03}}>
                总资产(CNY)
              </div>
              <div style={{width:this.props.windowWidth,textAlign:"center",color:"#108ee9",fontSize:this.props.windowHeight*0.035,fontWeight:"blod",marginTop:this.props.windowHeight*0.02}}>
                0.00
              </div>
            </div>
          </div>
          <div className="horizontally-center" style={{width:this.props.windowWidth*0.9,height:this.props.windowHeight*0.75,backgroundColor:"transparent"}}>
            <div style={{width:"100%"}}>
              <Row style={{width:"100%"}}>
                <Col span={12}>
                  <div style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                      
                  </div>
                </Col>
                <Col span={12} className="horizontally-flex-end">
                </Col>
              </Row>
                <div>
                  <div className="horizontally-center" style={{width:"100%"}}>
                  </div>
                  <List
                  dataSource={data}
                  size="small"
                  split={false}
                  renderItem={item => (
                    <List.Item key={item.block}>
                        <Row onClick={this.tokenBalanceClick.bind(this,item)} style={{width:"100%",paddingBottom:10,cursor:"pointer"}}>
                          <Col span={4} className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.1}}>
                            <img src={require("../../../resources/ewallet/"+item.imgurl+".png")} 
                              style={{height:this.props.windowHeight*0.07,width:this.props.windowHeight*0.07,borderRadius:10000}}
                            />
                          </Col>
                          <Col span={14}>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.035}}>{item.name}</div>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.035}}>≈2048.32CNY</div>
                          </Col>
                          <Col span={6} style={{height:this.props.windowHeight*0.05,color:"#108ee9",fontSize:this.props.windowHeight*0.03}}>
                            <div style={{width:"100%",textAlign:"right",fontSize:this.props.windowHeight*0.035,textAlign:"right",}}>{this.fomartETHCoin(0)}</div>
                            <div style={{width:"100%",textAlign:"right",fontSize:this.props.windowHeight*0.035,textAlign:"right",}}>{this.fomartETHCoin(0)}CNY</div>
                          </Col>
                        </Row>
                    </List.Item>
                  )}
                >
                </List>
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
AllProperty.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight*0.72,
    windowWidth: state.WindowSizeReducer.windowWidth*0.2,
    theme: state.ThemeReducer.theme,
    AllETHBalance:state.CoinCountReducer.AllETHBalance,
    BTCCurrentWallet:state.WalletListReducer.BTCCurrentWallet,
    BTCTokensWalletList:state.WalletListReducer.BTCTokensWalletList,
    BTCWalletList:state.WalletListReducer.BTCWalletList,
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
    SwitchWalletAction:(walletinfo,waltype)=>{
      dispatch(SwitchWalletAction(walletinfo,waltype));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllProperty);