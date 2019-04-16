/*书写组件的模板
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Layout,Button,Table,Row,Col,Tabs,List} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import copy from 'copy-to-clipboard';
import TurnOut from "./walletinfo/TurnOut.jsx";
import InviteCode from "./walletinfo/InviteCode.jsx";
import TurnIn from "./walletinfo/TurnIn.jsx";
import TransactionRecords from "./walletinfo/TransactionRecords.jsx";
import PWRWallet from './walletinfo/PWRWallet.jsx';
import ETHWallet from './walletinfo/ETHWallet.jsx';
import ETHTurnIn from './walletinfo/ETHTurnIn.jsx';
import ETHTurnOut from './walletinfo/ETHTurnOut.jsx';
import BTCTurnIn from './walletinfo/BTCTurnIn.jsx';
import BTCTurnOut from './walletinfo/BTCTurnOut.jsx';
import BTCNoWallet from './walletinfo/BTCNoWallet.jsx';
import EOSNoWallet from './walletinfo/EOSNoWallet.jsx';
import BTCWallet from './walletinfo/BTCWallet.jsx';
import EOSWallet from './walletinfo/EOSWallet.jsx';
import AllProperty from './walletinfo/AllProperty.jsx';
import tcrequest from "../../request/tcrequest.js";
import LoadChildrenWalletAction from "../../actions/LoadChildrenWalletAction.js";
import WalletTabsClickAction from "../../actions/WalletTabsClickAction.js";
const { Header, Footer, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;
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
  componentWillMount() {
    var body = "mainAccountAddress="+sessionStorage.getItem("ethAddress");
    tcrequest("/tcserver/account/getAllWallet", body).then(response => response.json()).then(data => {
      if(data.result=="success"){
        this.props.LoadChildrenWalletAction(data.ChildrenWallet)
      }
    })
  }
  //组件销毁时回调
  componentWillUnmount() {}
  //匹配页面
  switchPage(key){
    switch (key) {
      case 'turnOut':
        //转出
        return <TurnOut/>;
      case 'invitation':
        //邀请码
        return <InviteCode/>
      case 'turnIn':
        //PWR转入
        return <TurnIn/>
      case 'dealinfo':
        //PWR交易信息
        return <TransactionRecords/>
      case 'ETHTokenDealInfo':
        //ETH代币交易信息
        return <TransactionRecords/>
      case 'BTCTokenDealInfo':
        return <TransactionRecords/>
      case 'ETHTurnIn':
        return <ETHTurnIn/>
      case 'ETHTurnOut':
        return <ETHTurnOut/>
      case 'BTCTurnIn':
        return <BTCTurnIn/>
      case 'BTCTurnOut':
        return <BTCTurnOut/>
    }
  }
  //钱包类型切换
  tabsChange(activeKey){
    this.props.WalletTabsClickAction(activeKey)
  }
  //组件的渲染界面
  render() {
    return (
      <div>
        <Layout>
        <Sider width={this.props.windowWidth} style={{height:this.props.windowHeight,background:this.props.theme.listbgcolor}}>
          <div style={{height:this.props.windowHeight,position: "relative"}}>
            <div style={{position: "absolute", bottom:0,width:this.props.windowWidth}}>
              <Tabs onChange={this.tabsChange.bind(this)} defaultActiveKey="1" size="small" tabBarGutter={6} tabPosition="bottom" tabBarStyle={{width:this.props.windowWidth,color:this.props.theme.chatbreviarymsgcolor,background:this.props.theme.wlTabsBgColor}}>
                <TabPane tab="总资产" key="AllProperty">
                  <AllProperty/>
                </TabPane>
                <TabPane tab="PWR" key="PWR">
                  <PWRWallet/>
                </TabPane>
                <TabPane tab="ETH" key="ETH">
                  <ETHWallet/>
                </TabPane>
                <TabPane tab="BTC" key="BTC">
                  <BTCWallet/>
                </TabPane>
                <TabPane tab="EOS" key="EOS">
                  <EOSNoWallet/>
                </TabPane>
              </Tabs>
              </div>
            </div>
        </Sider>
        <Content className="vertically-horizontally-center" style={{height:this.props.windowHeight,backgroundColor:this.props.theme.infobgcolor,}}>
          {this.switchPage(this.props.clickRowKey)}
        </Content>
        </Layout>
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
    userlistcount: state.LoadContactListReducer.userlistcount,
    grouplistcount:state.LoadContactListReducer.grouplistcount,
    publiclistcount:state.LoadContactListReducer.publiclistcount,
    windowHeight: state.WindowSizeReducer.windowHeight*0.8,
    windowWidth: state.WindowSizeReducer.windowWidth*0.2,
    theme: state.ThemeReducer.theme,
    balance:state.CoinCountReducer.balance,
    integralTotal:state.CoinCountReducer.integralTotal,
    clickRowKey:state.WalletClickReducer.clickRowKey,
    clickRowInfo:state.WalletClickReducer.clickRowInfo,
  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {
    LoadCoinCountAction: (type,count) => {
      dispatch(LoadCoinCountAction(type,count));
    },
    LoadChildrenWalletAction:(ChildrenWallet)=>{
      dispatch(LoadChildrenWalletAction(ChildrenWallet));
    },
    WalletTabsClickAction:(WalletKey)=>{
      dispatch(WalletTabsClickAction(WalletKey));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);