/*无钱包恢复界面
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Layout,Button,message,Row,Col} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

//最好类名跟文件名对应
class BTCNoWallet extends React.Component {
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
  //props改变回调函数
  componentWillReceiveProps(nextProps) {}
  //组件的渲染界面
  recoverWallet=(e)=>{
    message.warning("该功能还未上线，请等待通知")
  }
  render() {
    return (
      <div>
        <Layout>
        <Sider className="horizontally-center" width={this.props.windowWidth} style={{height:this.props.windowHeight,backgroundColor:this.props.theme.listbgcolor}}>
          <div className="vertically-horizontally-center" style={{height:this.props.windowHeight,width:this.props.windowWidth*0.95,backgroundColor:this.props.theme.listbgcolor}}>
            <div style={{width:"100%"}}>
              <Row style={{width:"100%"}}>
                <Col span={24} style={{textAlign:"center"}}>
                  <img src={require('../../../resources/ewallet/btc.png')} style={{borderRadius:1000,height:this.props.windowHeight*0.12}}/>
                </Col>
              </Row>
              <Row style={{width:"100%",}}>
                <Col span={24} className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.1,color:"#4c6889",fontSize:this.props.windowHeight*0.04}}>
                  BTC
                </Col>
              </Row>
              <Row style={{width:"100%"}}>
                <Col span={24} style={{textAlign:"center"}}>
                  <button onClick={this.recoverWallet.bind(this)} style={{width:this.props.windowWidth*0.6,height:this.props.windowHeight*0.1,borderRadius:this.props.windowHeight*0.06,backgroundColor:"#F8931F",outline:"none",cursor: "pointer",color:"#FFFFFF",border:"none"}}>
                    恢复钱包
                  </button>
                </Col>
              </Row>
            </div>
          </div>
        </Sider>
        </Layout>
      </div>
    )
  }
}
//类属性
BTCNoWallet.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight*0.72,
    windowWidth: state.WindowSizeReducer.windowWidth*0.2,
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
)(BTCNoWallet);