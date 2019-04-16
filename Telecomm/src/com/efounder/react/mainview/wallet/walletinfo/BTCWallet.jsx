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
import SwitchWalletAction from "../../../actions/SwitchWalletAction.js";
import BTCNoWallet from "./BTCNoWallet.jsx";
import copy from 'copy-to-clipboard';
const { Header, Footer, Sider, Content } = Layout;

//最好类名跟文件名对应
class BTCWallet extends React.Component {
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
        {this.props.BTCCurrentWallet!=undefined?
        <Layout>
        <Sider className="horizontally-center" width={this.props.windowWidth} style={{height:this.props.windowHeight,backgroundColor:this.props.theme.listbgcolor}}>
          <div className="vertically-horizontally-center" style={{marginTop:this.props.windowHeight*0.02,width:this.props.windowWidth*0.9,height:this.props.windowHeight*0.25,backgroundColor:this.props.theme.wllistcolor,borderRadius:5}}>
            <div style={{width:this.props.windowWidth}}>
              <table width="100%">
                <tbody>
                <tr>
                  <td rowSpan="2" style={{width:this.props.windowWidth*0.2,textAlign:'center'}}>
                    <img src={this.props.BTCCurrentWallet.accountIcon==""?
                    require("../../../resources/ewallet/defaultIcon.png"):this.props.BTCCurrentWallet.accountIcon} 
                    style={{height:this.props.windowHeight*0.08,borderRadius:5}}/>
                  </td>
                  <td style={{width:this.props.windowWidth*0.7}}>
                    <Row style={{width:"100%"}}>
                      <Col span={12} style={{fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                        {this.props.BTCCurrentWallet.accountName}
                      </Col>
                      <Col span={10} style={{textAlign:"right",fontSize:this.props.windowHeight*0.03,color:"#108ee9",}}>
                        <img src={require("../../../resources/ewallet/heartPurse.png")} style={{height:this.props.windowHeight*0.04}}/>
                        <span onClick={this.BTCSwitch.bind(this)} style={{cursor: "pointer"}}>切换钱包</span>
                      </Col>
                    </Row>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{fontSize:this.props.windowHeight*0.025,color:"#708090",}}>
                      <span onClick={this.copyETHAddress} style={{cursor: "pointer"}}>{this.fomartETHAddress(this.props.BTCCurrentWallet.accountAddress)}&nbsp;&nbsp;<Icon type="copy" /></span>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
              <Modal
                visible={this.state.visible}
                onCancel={this.BTCSwitchCancel.bind(this)}
                bodyStyle={{backgroundColor:"#183257"}}
                footer={null}
                width={this.props.windowWidth*0.8}
              >
                <div style={{height:this.props.windowHeight*0.6,width:"100%",overflow:"auto"}}>
                  <List
                    dataSource={this.props.BTCWalletList}
                    size="small"
                    split={false}
                    renderItem={item => (
                      <List.Item key={item.id}>
                          <Row onClick={this.BTCSwitchOk.bind(this,item)} onDoubleClick={this.BTCSwitchOk.bind(this,item)}  style={{width:"100%",paddingBottom:10,cursor:"pointer"}}>
                            <Col span={6} >
                              <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.1}}>
                                <img src={item.accountIcon==""?require("../../../resources/ewallet/defaultIcon.png"):item.accountIcon} style={{height:this.props.windowHeight*0.08}}/>
                              </div>
                            </Col>
                            <Col span={14}>
                              <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.03,fontWeight:"bold"}}>{item.accountName}</div>
                              <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02,whiteSpace:"nowrap"}}>{this.fomartETHAddress(item.accountAddress)}</div>
                            </Col>
                          </Row>
                      </List.Item>
                    )}
                  >
                  </List>
                </div>
              </Modal>
              <Row style={{width:"100%"}}>
                <Col span={4} style={{textAlign:"center"}}>
                  <img src={require("../../../resources/ewallet/btc_icon.png")} style={{height:this.props.windowHeight*0.04}}/>
                </Col>
                <Col span={18} style={{color:"#FFE696",fontSize:this.props.windowHeight*0.025}}>
                  <div style={{width:"100%",textAlign:"right"}}>{this.props.AllETHBalance}</div>
                </Col>
              </Row>
              <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.02}}>
                <div style={{width:this.props.windowWidth*0.8,borderBottom:"1px solid "+this.props.theme.linecolor}}></div>
              </div>
              <Row style={{width:"100%"}}>
                <Col span={7} className="horizontally-center" style={{fontSize:this.props.windowHeight*0.025,color:"#108ee9",}}>
                      <span onClick={this.ethTurnInClick.bind(this)} style={{cursor: "pointer"}}>转入</span>
                </Col>
                <Col span={1} className="horizontally-center" style={{textAlign:"center"}}>
                  <div style={{height:this.props.windowHeight*0.04,borderRight:"1px solid "+this.props.theme.linecolor}}></div>
                </Col>
                <Col span={7}>
                  <div className="horizontally-center" style={{fontSize:this.props.windowHeight*0.025,color:"#108ee9"}}>
                      <span onClick={this.ethDetailsClick.bind(this)}  style={{cursor: "pointer",}}>明细</span>
                  </div>
                </Col>
                <Col span={1} className="horizontally-center" style={{textAlign:"center"}}>
                  <div style={{height:this.props.windowHeight*0.04,borderRight:"1px solid "+this.props.theme.linecolor}}></div>
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
                </Col>
              </Row>
                <div>
                  <div className="horizontally-center" style={{width:"100%"}}>
                  </div>
                  <List
                  dataSource={this.props.BTCTokensWalletList}
                  size="small"
                  split={false}
                  renderItem={item => (
                    <List.Item key={item.block}>
                        <Row onClick={this.tokenBalanceClick.bind(this,item)} style={{width:"100%",paddingBottom:10,cursor:"pointer"}}>
                          <Col span={4} className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.06}}>
                            <img src={require("../../../resources/ewallet/btc.png")} 
                              style={{height:this.props.windowHeight*0.06}}
                            />
                          </Col>
                          <Col span={14}>
                            <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.035}}>{item.blockChainName}</div>
                          </Col>
                          <Col span={6} className="vertically-center" style={{height:this.props.windowHeight*0.05,textAlign:"right",color:"#108ee9",fontSize:this.props.windowHeight*0.03}}>
                            <div style={{width:"100%",textAlign:"right"}}>{this.fomartETHCoin(0)}</div>
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
        :<BTCNoWallet/>}
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
)(BTCWallet);