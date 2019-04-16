/*交易记录
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Button,message,Tabs ,Row,Col,List} from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import WalletClickAction from "../../../actions/WalletClickAction.js";
import tcrequest from "../../../request/tcrequest.js";
import "../../../style/TableList.css";

const TabPane = Tabs.TabPane;
//最好类名跟文件名对应
class TransactionRecords extends React.Component {
  constructor(props){
    super(props);
    this.state={
      page:1,
      detailType:1,
      data:[],
    }
  }
  //组件挂载完成后回调
  componentDidMount(){
    var tokenId = this.props.clickRowInfo.tokenID;
    var body = "chainId="+this.props.clickRowInfo.blockChainID
    +"&page="+this.state.page
    +"&pagesize=25"
    +"&type="+this.state.detailType
    if(this.props.WalletTabsKey=="ETH"){
      body = body +"&walletAddress="+this.props.ETHCurrentWallet.accountAddress;
    }else if(this.props.WalletTabsKey=="BTC"){
      body = body +"&walletAddress="+this.props.BTCCurrentWallet.accountAddress;
    }else{
      body = body +"&walletAddress="+sessionStorage.getItem("ethAddress");
    }
    if(tokenId!=null&&tokenId!=""&&tokenId!=undefined&&tokenId!="undefined"){
      body = body+"&tokenId="+tokenId
    }
    this.getData(body)
  }
  //组件有更新后回调
  componentDidUpdate(){
    
  }
  //组件将要挂载时回调
  componentWillMount(){}
  //组件销毁时回调
  componentWillUnmount(){}
  //props改变回调函数
  componentWillReceiveProps(nextProps){
    this.setState({
      data: [],
    });
    var tokenId = nextProps.clickRowInfo.tokenID;
    var body = "chainId="+nextProps.clickRowInfo.blockChainID
    +"&page="+this.state.page
    +"&pagesize=25"
    +"&type="+this.state.detailType
    if(this.props.WalletTabsKey=="ETH"){
      body = body +"&walletAddress="+this.props.ETHCurrentWallet.accountAddress;
    }else if(this.props.WalletTabsKey=="BTC"){
      body = body +"&walletAddress="+this.props.BTCCurrentWallet.accountAddress;
    }else{
      body = body +"&walletAddress="+sessionStorage.getItem("ethAddress");
    }
    if(tokenId!=null&&tokenId!=""&&tokenId!=undefined&&tokenId!="undefined"){
      body = body+"&tokenId="+tokenId
    }
    this.getData(body)
  }
  tabsClick(key){
    //1全部2转出3转入4失败
    this.state.detailType = key
    this.setState({
      data: [],
    });
    var tokenId = this.props.clickRowInfo.tokenID;
    var body = "chainId="+this.props.clickRowInfo.blockChainID
    +"&page="+this.state.page
    +"&pagesize=25"
    +"&type="+this.state.detailType;
    if(this.props.WalletTabsKey=="ETH"){
      body = body +"&walletAddress="+this.props.ETHCurrentWallet.accountAddress;
    }else if(this.props.WalletTabsKey=="BTC"){
      body = body +"&walletAddress="+this.props.BTCCurrentWallet.accountAddress;
    }else{
      body = body +"&walletAddress="+sessionStorage.getItem("ethAddress");
    }
    if(tokenId!=null&&tokenId!=""&&tokenId!=undefined&&tokenId!="undefined"){
      body = body+"&tokenId="+tokenId
    }
    this.getData(body)
  }
  turnIn(e){
    if (this.props.clickRowInfo.CoinType=="PWR") {
      this.props.WalletClickAction("turnIn",{})
    }
    if (this.props.clickRowInfo.CoinType=="ETH") {
      this.props.WalletClickAction("ETHTurnIn",this.props.clickRowInfo)
    }
  }
  turnOut(e){
    if (this.props.clickRowInfo.CoinType=="PWR") {
      this.props.WalletClickAction("turnOut",{})
    }
    
  }
  getData(body){
    /*
    #define ChainID_BTC "1"
    #define ChainID_ETH "2"
    #define ChainID_EOS "3"
    #define ChainID_PWR "4"
    */
    

    tcrequest("/tcserver/chain/txlist_accounts", body).then(response => response.json()).then(data => {

      if(data.page!=undefined&&data.page!=null&&data.page!=""&&data.page!="undefined"){
        this.state.allRow = data.page.allRow;
        this.state.currentPage = data.page.currentPage;
        this.state.pageSize = data.page.pageSize;
        this.state.totalPage = data.page.totalPage;
        this.setState({
          data: data.txlist_accounts,
        });
      }else{
        this.setState({
          data: [],
        });
      }
    })
  }
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
        <div style={{width:this.props.windowWidth*0.25,height:this.props.windowHeight*0.76,backgroundColor:this.props.theme.wllistcolor,borderRadius:5}}>
          
          <div style={{width:this.props.windowWidth*0.25,height:this.props.windowHeight*0.2,position:"relative"}}>
            <img src={require("../../../resources/ewallet/recordsBackground.png")} style={{width:this.props.windowWidth*0.25,height:this.props.windowHeight*0.2,borderRadius:"5px 5px 0px 0px",position:"absolute",zIndex:0}}/>
            <div style={{position:"absolute",fontSize:this.props.windowHeight*0.03,width:"100%",color:"#FFFFFF",zIndex:1,textAlign:"center"}}>
              {this.props.clickRowInfo.tokenName==undefined?"":this.props.clickRowInfo.tokenName}
            </div>
          </div>
          <div style={{width:this.props.windowWidth*0.25,height:this.props.windowHeight*0.5,zIndex:0}}>
            <div style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
              <div style={{width:this.props.windowWidth*0.25,borderBottom:"5px solid "+this.props.theme.fontcolor}}></div>
            </div>
            <div>
              <Tabs defaultActiveKey="1" onTabClick={this.tabsClick.bind(this)} tabBarStyle={{color:"#6A82A5",border:"none"}}>
                <TabPane tab="全部" key="1">
                  <div style={{height:this.props.windowHeight*0.39,overflow:"auto"}}>
                  <List
                    dataSource={this.state.data}
                    size="small"
                    split={false}
                    renderItem={item => (
                      <List.Item key={item.block}>
                          <Row  style={{width:"100%",paddingBottom:10}}>
                            <Col span={4} style={{height:this.props.windowHeight*0.06,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                              <img src={require(`../../../resources/ewallet/${item.status=="sender"?"icon_turnout.png":"icon_turnin.png"}`)} 
                                style={{height:this.props.windowHeight*0.045}}
                              />
                            </Col>
                            <Col span={14}>
                              <div style={{color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>{this.fomartETHAddress(item.status=="sender"?item.to:item.from)}</div>
                              <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{item.age}</div>
                            </Col>
                            <Col span={6} style={{height:this.props.windowHeight*0.06,textAlign:"right",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>
                              <div style={{fontSize:this.props.windowHeight*0.02,width:"100%",textAlign:"right"}}>{item.value}</div>
                            </Col>
                          </Row>
                      </List.Item>
                    )}
                  >
                    {/*this.state.loading && (
                      <div className="demo-loading-container">
                        <Spin />
                      </div>
                    )*/}
                  </List>
                  </div>
                </TabPane>
                <TabPane tab="转出" key="2">
                  <div style={{height:this.props.windowHeight*0.39,overflow:"auto"}}>
                  <List
                    dataSource={this.state.data}
                    size="small"
                    split={false}
                    renderItem={item => (
                      <List.Item key={item.block}>
                          <Row  style={{width:"100%",paddingBottom:10}}>
                            <Col span={4} style={{height:this.props.windowHeight*0.06,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                              <img src={require(`../../../resources/ewallet/${item.status=="sender"?"icon_turnout.png":"icon_turnin.png"}`)} 
                                style={{height:this.props.windowHeight*0.045}}
                              />
                            </Col>
                            <Col span={14}>
                              <div style={{color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>{this.fomartETHAddress(item.status=="sender"?item.to:item.from)}</div>
                              <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{item.age}</div>
                            </Col>
                            <Col span={6} style={{height:this.props.windowHeight*0.06,textAlign:"right",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>
                              <div style={{fontSize:this.props.windowHeight*0.02,width:"100%",textAlign:"right"}}>{item.value}</div>
                            </Col>
                          </Row>
                      </List.Item>
                    )}
                  >
                    {/*this.state.loading && (
                      <div className="demo-loading-container">
                        <Spin />
                      </div>
                    )*/}
                  </List>
                  </div>
                </TabPane>
                <TabPane tab="转入" key="3">
                  <div style={{height:this.props.windowHeight*0.39,overflow:"auto"}}>
                  <List
                    dataSource={this.state.data}
                    size="small"
                    split={false}
                    renderItem={item => (
                      <List.Item key={item.block}>
                          <Row  style={{width:"100%",paddingBottom:10}}>
                            <Col span={4} style={{height:this.props.windowHeight*0.06,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                              <img src={require(`../../../resources/ewallet/${item.status=="sender"?"icon_turnout.png":"icon_turnin.png"}`)} 
                                style={{height:this.props.windowHeight*0.045}}
                              />
                            </Col>
                            <Col span={14}>
                              <div style={{color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>{this.fomartETHAddress(item.status=="sender"?item.to:item.from)}</div>
                              <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{item.age}</div>
                            </Col>
                            <Col span={6} style={{height:this.props.windowHeight*0.06,textAlign:"right",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>
                              <div style={{fontSize:this.props.windowHeight*0.02,width:"100%",textAlign:"right"}}>{item.value}</div>
                            </Col>
                          </Row>
                      </List.Item>
                    )}
                  >
                    {/*this.state.loading && (
                      <div className="demo-loading-container">
                        <Spin />
                      </div>
                    )*/}
                  </List>
                  </div>
                </TabPane>
                <TabPane tab="失败" key="4">
                  <div style={{height:this.props.windowHeight*0.39,overflow:"auto"}}>
                  <List
                    dataSource={this.state.data}
                    size="small"
                    split={false}
                    renderItem={item => (
                      <List.Item key={item.block}>
                          <Row  style={{width:"100%",paddingBottom:10}}>
                            <Col span={4} style={{height:this.props.windowHeight*0.06,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                              <img src={require(`../../../resources/ewallet/${item.status=="sender"?"icon_turnout.png":"icon_turnin.png"}`)} 
                                style={{height:this.props.windowHeight*0.045}}
                              />
                            </Col>
                            <Col span={14}>
                              <div style={{color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>{this.fomartETHAddress(item.status=="sender"?item.to:item.from)}</div>
                              <div style={{color:"#6A82A5",fontSize:this.props.windowHeight*0.02}}>{item.age}</div>
                            </Col>
                            <Col span={6} style={{height:this.props.windowHeight*0.06,textAlign:"right",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',color:"#108ee9",fontSize:this.props.windowHeight*0.02}}>
                              <div style={{fontSize:this.props.windowHeight*0.02,width:"100%",textAlign:"right"}}>{item.value}</div>
                            </Col>
                          </Row>
                      </List.Item>
                    )}
                  >
                    {/*this.state.loading && (
                      <div className="demo-loading-container">
                        <Spin />
                      </div>
                    )*/}
                  </List>
                  </div>
                </TabPane>
              </Tabs>
            </div>
            <div style={{width:this.props.windowWidth*0.25,height:this.props.windowHeight*0.06}}>
              <Row style={{width:"100%"}}>
                <Col span={12} style={{height:this.props.windowHeight*0.06,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                  <button onClick={this.turnIn.bind(this)} style={{borderRadius:4,backgroundColor:"#108EE9",color:"#FFFFFF",border:"none",width:this.props.windowWidth*0.08,height:this.props.windowWidth*0.02,outline:"none",cursor: "pointer"}}>转入</button>
                </Col>
                <Col span={12} style={{height:this.props.windowHeight*0.06,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',justifyContent:'center'}}>
                  <button onClick={this.turnOut.bind(this)} style={{borderRadius:4,backgroundColor:"#108EE9",color:"#FFFFFF",border:"none",width:this.props.windowWidth*0.08,height:this.props.windowWidth*0.02,outline:"none",cursor: "pointer"}}>转出</button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
          
}
//类属性
TransactionRecords.propTypes = {
    
}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    clickRowInfo:state.WalletClickReducer.clickRowInfo,
    ETHCurrentWallet:state.WalletListReducer.ETHCurrentWallet,
    WalletTabsKey:state.MainMenuClickReducer.wallettabskey,
    BTCCurrentWallet:state.WalletListReducer.BTCCurrentWallet,
  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {
    WalletClickAction:(clickRowKey,clickRowInfo)=>{
      dispatch(WalletClickAction(clickRowKey,clickRowInfo));
    },
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionRecords); 