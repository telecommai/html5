/*群组列表
*author：xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Table,Spin} from 'antd';
import AddChatAction from "../../actions/AddChatAction.js"
import MainMenuClickAction from "../../actions/MainMenuClickAction.js"
import LoadGroupUserListAction from "../../actions/LoadGroupUserListAction.js"
import requestInfo from "../../request/requestInfo.js"
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { TextArea } = Input;
const { Column } = Table;
class ChatGroupList extends Component {
	  constructor(props){
        super(props);
        this.state={
          pages:50,
          spinState:false
        }
    }
    //组件挂载完成后回调
    componentDidMount() {
      clearInterval(this.timerID);
      var th_array = document.getElementsByTagName('th');
      for (var i = 0; i < th_array.length; i++) {
        th_array[i].style.border = '0px';
      }
      var td_array = document.getElementsByTagName('td');
      for (var i = 0; i < td_array.length; i++) {
        td_array[i].style.border = '0px';
      }
    }
    componentDidUpdate() {
      var th_array = document.getElementsByTagName('th');
      for (var i = 0; i < th_array.length; i++) {
        th_array[i].style.border = '0px';
      }
      var td_array = document.getElementsByTagName('td');
      for (var i = 0; i < td_array.length; i++) {
        td_array[i].style.border = '0px';
      }
      var table_array = document.getElementsByTagName('table');
      for (var i = 0; i < table_array.length; i++) {
        table_array[i].style.padding = '0 0 0 0px';
      }
    }
    switchUserList(chat,list,pages){
      if(chat.type=="user"){
        return [];
      }
      var groupid = chat.id;
      var list =[];
      for(let value of this.props.groupuserlist){
        if(value.groupid==groupid){
          list = value.list
        }
      }
      return list.slice(0,pages);
    }
    //获取群成员数量
    getGroupUserCount(chat,groupuserlist){
      if(chat.type=="user"){
        return [];
      }
      var groupid = chat.id;
      var list =[];
      for(let value of groupuserlist){
        if(value.groupid==groupid){
          list = value.list
        }
      }
      return list.length;
    }
    //滚动条触发事件，用于动态追加人员，避免人员过多加载导致的卡顿
    onScrollHandle(event) {
      const clientHeight = event.target.clientHeight
      const scrollHeight = event.target.scrollHeight
      const scrollTop = event.target.scrollTop
      const isBottom = (clientHeight + scrollTop === scrollHeight)
      if(isBottom){
        var num = this.state.pages+50
        this.setState({
          pages:num,
        })
      }
    }
    //群主管理员加图标
    switchRecord(record){
      var headurl = require("../../resources/icon/user.png");
      if(record.avatar!=null&&record.avatar!=undefined&&record.avatar!=""){
        headurl = record.avatar
      }
      if(record.mana==9){
        return(<div className="vertically-center">
                  <img style={{height:20,width:20}} src={require('../../resources/icon/qz.png')}/>
                  <img src={headurl} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                  <span style={{fontSize:this.props.windowHeight*0.024,color:this.props.theme.listfontcolor,paddingLeft:4}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
              </div>)
      }else if(record.mana==1){
        return(<div className="vertically-center">
                  <img style={{height:20,width:20}} src={require('../../resources/icon/gly.png')}/>
                  <img src={headurl} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                  <span style={{fontSize:this.props.windowHeight*0.024,color:this.props.theme.listfontcolor,paddingLeft:4}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
              </div>)
      }else if(record.mana==0){
        return(<div className="vertically-center">
                  <div style={{height:20,width:20}}></div>
                  <img src={headurl} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                  <span style={{fontSize:this.props.windowHeight*0.024,color:this.props.theme.listfontcolor,paddingLeft:4}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
              </div>)
      }
    }
    //刷新群成员
    groupUserListLoad=(chat,e)=>{
      this.setState({
        spinState:true,
      })
      if(chat.type=="user"){
        this.setState({
          spinState:false,
        })
        return [];
      }
      var groupId = chat.id;
      var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + groupId;
      requestInfo("group/getUserListByGroupId", body).then(response => response.json()).then(data => {
        if(data.result!="success"){
          message.waring("未成功刷新列表，请检查网络")
        }else{
          this.props.LoadGroupUserListAction(groupId, data.users)
        }
        this.setState({
          spinState:false,
        })
      })
      
    }
    render() {
        return (
			   <Layout>
           <Sider style={{background:this.props.theme.listbgcolor,overflow:"auto",borderStyle:"none none none solid ",borderColor:" #FFFFFF #FFFFFF #FFFFFF "+this.props.theme.linecolor,borderWidth:1,height:this.props.windowHeight*0.742}} >
              {/*<Content style={{height:this.props.windowHeight*0.155,borderStyle:"none none solid  none ",borderColor:" #FFFFFF #FFFFFF "+this.props.theme.linecolor+" #FFFFFF",borderWidth:1,}}>
              <span style={{fontSize:16,color:this.props.theme.listfontcolor}}>&nbsp;&nbsp;<b>群公告</b></span><br/>
              <Layout style={{textAlign:"center",background: this.props.theme.infobgcolor}}><span style={{color:this.props.theme.listfontcolor}}>今日群公告</span></Layout>
              </Content>*/}
              <Content style={{backgroundColor:this.props.theme.listbgcolor,height:this.props.windowHeight*0.742,overflow:"auto"}} onScroll={this.onScrollHandle.bind(this)}>
                <Spin tip="加载中..." spinning={this.state.spinState}>
                  <div className="vertically-horizontally-center" style={{width:"100%",whiteSpace: "nowrap"}}>
                    <span style={{fontSize:this.props.windowHeight*0.025,color:this.props.theme.listfontcolor}}>
                      部落成员&nbsp;&nbsp;
                      {this.getGroupUserCount(this.props.currentChat,this.props.groupuserlist)}&nbsp;&nbsp;
                      <img src={require("../../resources/icon/refresh.png")} style={{height:this.props.windowHeight*0.04}} onClick={this.groupUserListLoad.bind(this,this.props.currentChat)}/>
                    </span>
                  </div>
                  <Table 
                    dataSource={this.switchUserList(this.props.currentChat,this.props.groupuserlist,this.state.pages)} 
                    size="small" 
                    showHeader={false} 
                    onRow={(record) => ({
                        onClick: ()=>{
                                      },
                        onDoubleClick: ()=>{
                                          this.props.MainMenuClickAction("message");
                                          var user={};
                                          user.id = record.userId;
                                          user.name = record.note==undefined||record.note==""?record.nickName:record.note;
                                          user.avatar = record.avatar;
                                          user.type = "user";
                                          user.isfriend=false;
                                          user.time = new Date();
                                          this.props.AddChatAction(user);
                                          },
                        onContextMenu: () => {},
                        onMouseEnter: () => {},
                        onMouseLeave: () => {},
                      })
                    } 
                    pagination={false}>
                        <Column
                          title="群列表"
                          key="1"
                          render={(text, record) => (
                            this.switchRecord(record)
                          )}
                        />
                  </Table>
                </Spin>
              </Content>
            </Sider>
          </Layout>
        );
    }
}
ChatGroupList.propTypes = {
    //先注释
    //ContactsListClickAction:PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    selgroup: state.ContactsListClickReducer.selectRow,
    currentChat: state.ChatListReducer.currentChat,
    groupuserlist: state.LoadGroupUserListReducer.groupuserlist,
  }
}
const mapDispatchToProps=(dispatch)=>{
  return {
    //稍后添加群组点击事件或者使用下面这个点击action
    AddChatAction: (user) => {
      dispatch(AddChatAction(user));//派发action，可添加多个参数
    },
    MainMenuClickAction: (menukey) => {
      dispatch(MainMenuClickAction(menukey));//派发action，可添加多个参数
    },
    LoadGroupUserListAction: (id, users) => {
      dispatch(LoadGroupUserListAction(id, users));
    },
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatGroupList); 