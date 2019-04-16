/*聊天面板的左侧聊天列表
author：xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Table,Row,Col,Button} from 'antd';
import ChatPanel from "./ChatPanel.jsx";
import ChatList from "./ChatList.jsx"

const { Column } = Table;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Message extends React.Component {
	  constructor(props){
      super(props);
    }
    render() {
      return (
        <div style={{height:"100%"}}>
			      <Layout style={{backgroundColor:this.props.theme.infobgcolor}}>
              <Sider style={{background:this.props.theme.listbgcolor,overflow:"auto"}} width={this.props.windowWidth*0.2}>
              	<div style={{height:this.props.windowHeight*0.8}}>
                  <ChatList/>
  					    </div>
              </Sider>
			        <Content style={{height:this.props.windowHeight*0.8,backgroundColor:this.props.theme.infobgcolor}}>
			        	  <ChatPanel/>
			        </Content>
			      </Layout>
			  </div>
      );
    }
}
Message.propTypes = {
    
}
const mapStateToProps=(state)=> {
  return {
    theme: state.ThemeReducer.theme,
    chatlist: state.ChatListReducer.chatlist,
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
  }
}
const mapDispatchToProps=(dispatch)=>{
    return{
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Message); 