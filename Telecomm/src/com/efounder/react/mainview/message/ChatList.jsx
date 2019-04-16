/*聊天面板的左侧聊天列表
author：xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Table,Row,Col,Button} from 'antd';
import ChatPanel from "./ChatPanel.jsx";
import AddChatAction from "../../actions/AddChatAction.js"
import RemoveChatAction from "../../actions/RemoveChatAction.js"
import JFMessageManager from "../../js-im/message/manager/JFMessageManager.js"
import IMStructMessage from "../../js-im/message/struct/IMStructMessage.js"
import AceptMsgStateChangeAction from "../../actions/AceptMsgStateChangeAction.js"
const { Column } = Table;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class ChatList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {
    var messageManager = JFMessageManager.sharedMessageManager();
    messageManager.romveMessageDelegate(this)
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
  onSelectRow(record) {
    this.props.AddChatAction(record);
    //发送已查看的消息
    var messageManager = JFMessageManager.sharedMessageManager();
    var chatrecord = null;
    var msgarr = null;
    for (var value of this.props.chatrecord) {
      if (record.id == value.chatid) {
        msgarr = value.chatrecord;
        break;
      }
    }
    if (msgarr == null) {
      return;
    }
    for (var value of msgarr) {
      if (value.state == 30) {
        //如果非群组类型则发送已读消息
        if (record.type == "user"&&value.fromUserID!=sessionStorage.getItem("imUserId")) {
          var newmessage = new IMStructMessage();
          newmessage.toUserID = value.fromUserID
          newmessage.message = value.messageIDString
          newmessage.postType = value.postType;
          newmessage.subType = 102;
          newmessage.fromUserID = parseInt(sessionStorage.getItem("imUserId"));
          messageManager.sendMessage(newmessage);
          //消息发送增加时间间隔1毫秒，可能是消息服务的原因，不间隔只会发送一条消息
          this.sleep(1);
        }
        var msg = value;
        msg.state = 25
        msg.chatid = record.id
        this.props.AceptMsgStateChangeAction(msg)
      }
    }
  }
  //一个sleep方法
  sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  }
  init() {
    var messageManager = JFMessageManager.sharedMessageManager();
    messageManager.addMessageDelegate(this);
  }
  onMessageDidDisConnect() {
    this.init();
  }
  onMessageDidReceiveStruct(message) {}
  onMessageDidUpdate(message) {}
  onMessageDidConnect() {}
  RemoveChat(record,e) {
    e.stopPropagation()
    this.props.RemoveChatAction(record);
  }
  switchAvatar(record) {
    var html = [];
    if (record.avatar != "" && record.avatar != undefined) {
      html.push(<img src={record.avatar} style={{width:this.props.windowHeight*0.07,height:this.props.windowHeight*0.07,borderRadius:100000}}/>)
    } else if (record.avatar == "" || record.avatar == undefined) {
      if (record.type == "user") {
        html.push(<img src={require("../../resources/icon/user.png")} style={{width:this.props.windowHeight*0.07,height:this.props.windowHeight*0.07,borderRadius:100000}}/>)
      } else if (record.type == "group") {
        html.push(<img src={require("../../resources/icon/group.png")} style={{width:this.props.windowHeight*0.07,height:this.props.windowHeight*0.07,borderRadius:100000}}/>)
      }
    }
    return html
  }
  //鼠标移入展示删除符号
  rowMouseEnter(record){
    var del = document.getElementById(record.id+"delete")
    var bag = document.getElementById(record.id+"badge")
    del.style.display = "block";
    bag.style.display = "none";
  }
  //鼠标移除取消删除符号展示
  rowMouseLeave(record){
    var del = document.getElementById(record.id+"delete")
    var bag = document.getElementById(record.id+"badge")
    del.style.display = "none";
    bag.style.display = "block";
  }
  //获取聊天列表显示时间
  getChatTime(record){
    var newdate = new Date()
    var defaultTime = newdate.getHours() + ':' + newdate.getMinutes();
    if(record.time==undefined||record.time==""||record.time==null){
      return defaultTime;
    }
    var time = new Date(record.time)
    //var datetime=time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    if(time.getMinutes()<10){
      var chattime = time.getHours() + ':0' + time.getMinutes();
    }else{
      var chattime = time.getHours() + ':' + time.getMinutes();
    }
    if(this.isYestday(time)){
      return "昨天"+chattime;
    }
    if(this.isBeforeYestday(time)){
      return (time.getMonth() + 1) + '-' + time.getDate()+" "+chattime
    }
    return chattime
  }
  //判断是否是昨天
  isYestday(theDate){
    var date = new Date();    //当前时间
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    var yestday = new Date(today - 24*3600*1000).getTime();
    return theDate.getTime() < today && yestday <= theDate.getTime();
  }
  //判断是否昨天之前
  isBeforeYestday(theDate){
    var date = new Date();    //当前时间
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    var yestday = new Date(today - 24*3600*1000).getTime();//昨天凌晨
    return theDate.getTime() < yestday
  }
  render() {
    return (
      <div>
      {
        this.props.chatlist.length!=0
        &&
        <Table 
          dataSource={this.props.chatlist} 
          showHeader={false}
          onRow={(record) => ({
              onClick: ()=>{
                            this.onSelectRow(record)
                            },
              onDoubleClick: ()=>{},
              onContextMenu: () => {},
              onMouseEnter: () => {
                this.rowMouseEnter(record)
              },
              onMouseLeave: () => {
                this.rowMouseLeave(record)
              },
            })
          }
          rowClassName={(record,index)=>{
              if(record.id==this.props.currentChat.id){
                  return "chatTableList"
              }
          }}
          pagination={false}
        >
          <Column
            title="ChatList"
            dataIndex="Chat"
            key="Chat"
            render={(text, record) => (
              <div key={record.id+"div"}>
                <Row key={record.id}>
                  <Col span={6} key={record.id+"col1"}>
                    {this.switchAvatar(record)}
                  </Col>
                  <Col span={12} key={record.id+"col2"}>
                    <div style={{width:this.props.windowWidth*0.1,textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",}}>
                      <span style={{fontSize:this.props.windowHeight*0.022,color:this.props.theme.listfontcolor}}>
                        {record.name}
                      </span>
                    </div>
                    <div style={{width:this.props.windowWidth*0.1,textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",}}>
                      <span style={{fontSize:this.props.windowHeight*0.013,color:this.props.theme.chatbreviarymsgcolor}}>
                        {record.breviarymsg}
                      </span>
                    </div>
                  </Col>
                  <Col span={6} key={record.id+"col3"}>
                    <div style={{textAlign:"end",width:"100%"}}>
                      <span style={{fontSize:this.props.windowHeight*0.013,color:this.props.theme.chatbreviarymsgcolor}}>
                        {this.getChatTime(record)}
                      </span>
                    </div>
                    <div className="horizontally-flex-end" style={{width:"100%"}}>
                      <div>
                        <div id={record.id+"delete"} style={{display:"none",height:20,width:20}}>
                          <Icon type="close" style={{cursor: "pointer",color:this.props.theme.listfontcolor}} onClick={this.RemoveChat.bind(this,record)}/>
                        </div>
                        <div id={record.id+"badge"} style={{width:this.props.windowWidth*0.01,display:"block"}}>
                          <Badge  count={record.unreadnum==undefined?0:record.unreadnum} overflowCount={99}> </Badge>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          />
        </Table>
        }
      </div>
    );
  }
}
ChatList.propTypes = {
    
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    chatlist: state.ChatListReducer.chatlist,
    currentChat: state.ChatListReducer.currentChat,
    msgarr: state.ChatListReducer.msgarr,
    chatrecord:state.ChatListReducer.chatrecord,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    AddChatAction: (user) => {
      dispatch(AddChatAction(user)); //派发action，可添加多个参数
    },
    RemoveChatAction: (user) => {
      dispatch(RemoveChatAction(user)); //派发action，可添加多个参数
    },
    AceptMsgStateChangeAction: (message) => {
      dispatch(AceptMsgStateChangeAction(message));
    }
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatList); 