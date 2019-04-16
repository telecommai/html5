/*聊天面板
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Popover,Upload,message} from 'antd';
import ChatGrouplist from "./ChatGrouplist.jsx";
import request from "../../request/request.js";
import JFMessageManager from "../../js-im/message/manager/JFMessageManager.js";
import IMStructMessage from "../../js-im/message/struct/IMStructMessage.js";
import expression from "../../resources/expression/expression.json";
import ChatPopover from "../../component/ChatPopover.jsx";
import SendImgMsg from "../../component/SendImgMsg.jsx";
import SendFileMsg from "../../component/SendFileMsg.jsx";
import AddChatRecordAction from "../../actions/AddChatRecordAction.js";
import MsgStateChangeAction from "../../actions/MsgStateChangeAction.js";
import ManagerSendFileAction from "../../actions/ManagerSendFileAction.js";
import FileStateChangeAction from "../../actions/FileStateChangeAction.js";
import getGUID from "../../util/GetGuid.js";
import reqwest from 'reqwest';

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { TextArea } = Input;
const addUserStyle={
  paddingBottom:20,
}
const FileUpload = require('react-fileupload');
//字体点击弹出的窗口
const content = (
  <div>
    content
  </div>
);
class ChatPanel extends React.Component {
  constructor(props) {
    super(props);
    const msg = [];
    this.state = {
      visible: false,
      imgVisible:false,
      username: "",
      msg,
      addUserStyle: addUserStyle,
      msgarr: [],
      msgContext: "",
      pasteImg:null,
      imgUrl:"",
      imgtype:"jpg",
    }
  }
  componentWillMount() {

  }
  componentWillUnmount() {
    var messageManager = JFMessageManager.sharedMessageManager();
    messageManager.romveMessageDelegate(this)
  }
  componentDidUpdate() {
    if (document.getElementById("msgpanel") != null) {
      document.getElementById("msgpanel").scrollTop = document.getElementById("msgpanel").scrollHeight;
    }
    this.expressionEach(expression)
  }
  componentDidMount() {
    this.setState({
      data2: [],
      msgarr: this.props.msgarr
    });
    this.expressionEach(expression)
    this.init();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      msgarr: nextProps.msgarr
    })
  }
  init() {
    var messageManager = JFMessageManager.sharedMessageManager();
    messageManager.addMessageDelegate(this);
  }
  onMessageDidDisConnect() {
    this.init();
  }
  onMessageDidReceiveStruct(msg) {}
  onMessageDidUpdate(msg) {
    //消息状态
    //WAITSEND 0:待发送,
    //PRESEND 1:预发送,
    //SENDING 2:发送中,
    //DELIVER 5:已投递,
    //FAILURE 10:发送失败,
    //SEND 15:已发送,
    //RECEIVE 20:已送达,
    //READ 25:已查看,
    //UNREAD 30:未查看,
    //DELETE 35:删除,
    if (msg != undefined) {
      this.props.MsgStateChangeAction(msg);
      this.setState({});
    }
  }
  onMessageDidConnect() {}
  //遍历表情
  expressionEach(expression) {
    let htmltmp = [];
    for (var i = 1; i <= expression.length; i++) {
      if (i % 20 != 0) {
        htmltmp.push(<img key={expression[i-1].value} onClick={this.expressionClick} style={{cursor: "pointer"}} alt={expression[i-1].key} src={require('../../resources/expression/'+expression[i-1].value)} />);
      } else {
        htmltmp.push(<img key={expression[i-1].value} onClick={this.expressionClick} style={{cursor: "pointer"}} alt={expression[i-1].key} src={require('../../resources/expression/'+expression[i-1].value)} />);
        htmltmp.push(<br/>);
      }
    }
    this.state.expression = htmltmp;
  }
  //表情包点击事件
  expressionClick = (e) => {
    var msg = this.state.msgContext;
    this.setState({
      msgContext:msg+e.target.alt,
    })
    if (this.state.msg.context != undefined) {
      this.state.msg.context = this.state.msg.context + e.target.alt;
    } else {
      this.state.msg.context = e.target.alt;
    }
    this.state.msg.username = sessionStorage.getItem("userName");
    this.state.msg.avatar = sessionStorage.getItem("avatar");
  }

  menuClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  //发送消息
  sendMsg = (e) => {
    this.state.msg.fromUserID = sessionStorage.getItem("imUserId")
    //判断是否空消息
    if (this.state.msg.context == "" || this.state.msg.context == undefined) {
      Modal.error({
        title: '错误提示',
        content: '不可发送空消息',
        okText: '确定'
      });
      return;
    }
    //连接消息发送接口发送消息
    var messageManager = JFMessageManager.sharedMessageManager();
    var newmessage = new IMStructMessage();
    newmessage.fromUserID = parseInt(sessionStorage.getItem("imUserId"));
    newmessage.toUserID = parseInt(this.props.currentChat.id);
    if (this.props.currentChat.type == "group") {
      newmessage.postType = 1;
    } else if (this.props.currentChat.type == "user") {
      newmessage.postType = 0;
    }
    newmessage.subType = 0;
    newmessage.message = this.state.msg.context;
    messageManager.sendMessage(newmessage);
    var msgarr = Object.assign({}, newmessage);
    msgarr.nickName = sessionStorage.getItem("userName"),
    msgarr.avatar = sessionStorage.getItem("avatar"),
    this.props.AddChatRecordAction(this.props.currentChat.id, msgarr, this.props.currentChat);
    this.state.msg = [];
    this.setState({
      msgContext: ""
    })
  }
  //获取聊天框输入文字
  msgChange = (e) => {
    var msgval = e.target.value;
    var msgarr = {
      "username": sessionStorage.getItem("userName"),
      "avatar": sessionStorage.getItem("avatar"),
      "context": msgval,
    }
    this.state.msg = msgarr;
    this.setState({
      msgContext: msgval,
    })
  }
  //聊天框粘贴图片
  imgPaste=(e)=>{

    var cbd = e.clipboardData;
    var ua = window.navigator.userAgent;
    // 如果是 Safari 直接 return
    if (!(e.clipboardData && e.clipboardData.items)) {
      return;
    }
    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
    if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
      cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
      ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
      return;
    }
    for (var i = 0; i < cbd.items.length; i++) {
      var item = cbd.items[i];
      if (item.kind == "file") {
        this.setState({
          imgVisible:true,
        })
        var temparr = item.type.split("/")
        if (temparr.length==2) {
          var imgtype = temparr[1]
          this.state.imgtype = imgtype;
        }
        var blob = item.getAsFile();
        if (blob.size === 0) {
          return;
        }else{
          this.state.pasteImg = blob;
          //this.handleUpload(blob)
        }
        var reader = new FileReader();
        reader.onload = function(event) {
          var text = event.target.result;
          this.setState({
            imgUrl:text,
          })
        }.bind(this)
        reader.readAsDataURL(blob);
      }
    }
    
  }
  //粘贴图片后点击发送图片
  handleUpload = (uid) => {
    var _this = this;
    var file = this.state.pasteImg;
    
    var formData = new FormData();
    formData.append('files[]', file);
    reqwest({
      url: 'http//panserver.solarsource.cn:9692/panserver/files/file/directupload?parentId=66662&createUser=6662',
      method: 'post',
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      success: function (resp) {
        if(resp.result=="success"){
          /*---------------------发送成功begin-----------*/
          var fileid = resp.fileid;
          var width = 0;
          var height = 0;
          var image = new Image();
          var toUserID = "";
          var postType=null;
          var filename = "";
          var sendfilearr = _this.props.sendfilearr;
          for (var i = sendfilearr.length - 1; i >= 0; i--) {
            if(sendfilearr[i].uid==uid){
              toUserID = sendfilearr[i].toUserID;
              postType = sendfilearr[i].postType;
              filename = sendfilearr[i].name;
              _this.props.ManagerSendFileAction("DeleteFile",sendfilearr[i])
              break;
            }
          }
          if(toUserID==""){
            return;
          }
          image.src = "https://panserver.solarsource.cn/panserver/files/" + fileid + "/download";
          image.onload = function() {
            width = image.width;
            height = image.height;
            var context = {
              "url": "https://panserver.solarsource.cn/panserver/files/" + fileid + "/download",
              "path": filename,
              "scale": width + ":" + height
            }
            var messageManager = JFMessageManager.sharedMessageManager();
            var newmessage = new IMStructMessage();
            newmessage.fromUserID = parseInt(sessionStorage.getItem("imUserId"));
            newmessage.toUserID = parseInt(toUserID);
            newmessage.postType = postType;
            newmessage.subType = 1;
            newmessage.message = JSON.stringify(context);
            newmessage.integral = 10;
            messageManager.sendMessage(newmessage);
            var msgarr = Object.assign({}, newmessage);
            msgarr.nickName = sessionStorage.getItem("userName");
            msgarr.avatar = sessionStorage.getItem("avatar");
            msgarr.beforeMsgId = uid;
            msgarr.chatid = newmessage.toUserID;
            /*_this.props.AddChatRecordAction(_this.state.toUserID, msgarr, _this.props.currentChat);*/
            _this.props.FileStateChangeAction(msgarr)
          /*---------------------发送成功end-------------*/
          }
        }
      },
      error: function (err) {},
    });
  }
  //点击粘贴的图片发送按钮
  handleOk(){
    var uid = getGUID();
    /*----------------发送占位信息begin----------------*/
    var newmessage = new IMStructMessage();
    var context = {
          "url": require("../../resources/filetype/loading.gif"),
          "path": "",
          "scale": "50:100"
        }
    newmessage.fromUserID = parseInt(sessionStorage.getItem("imUserId"));
    newmessage.toUserID = parseInt(this.props.currentChat.id);
    if (this.props.currentChat.type == "group") {
      newmessage.postType = 1;
    } else if (this.props.currentChat.type == "user") {
      newmessage.postType = 0;
    }
    newmessage.subType = 1;
    newmessage.message = JSON.stringify(context);
    newmessage.integral=10;
    newmessage.nickName=sessionStorage.getItem("userName");
    newmessage.avatar=sessionStorage.getItem("avatar");
    newmessage.messageIDString = uid;
    newmessage.state = 2;
    var fileinfo = {};
    fileinfo.toUserID=newmessage.toUserID;
    fileinfo.uid = uid;
    fileinfo.postType = newmessage.postType;
    fileinfo.name = "1."+this.state.imgtype;
    this.props.ManagerSendFileAction("AddFile",fileinfo)
    this.props.AddChatRecordAction(this.props.currentChat.id, newmessage, this.props.currentChat);
    /*----------------发送占位信息end------------------*/
    //调用发送方法
    this.handleUpload(uid);
    //隐藏modal
    this.setState({
      imgVisible:false,
    })
  }
  //点击粘贴图片取消按钮
  handleCancel(){
    this.setState({
      imgVisible:false,
    })
  }
  //areOnKeyPress  textare的键盘事件
  onKeyDown = (e) => {
    var et = e || window.event;
    var keycode = et.charCode || et.keyCode;
    if (keycode == 13) {
        e.preventDefault(); //for firefox
    }
  }
  //滚动条滚动触发事件,暂时不用
  onScrollHandle(event) {
    const clientHeight = event.target.clientHeight
    const scrollHeight = event.target.scrollHeight
    const scrollTop = event.target.scrollTop
    const isBottom = (clientHeight + scrollTop === scrollHeight)
  }
  applyFriend = (e) => {
    var style = {
      display: "none"
    }
    this.setState({
      addUserStyle: style,
    })
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&friendUserId=" + this.props.currentChat.id;
    request("MessageServerURL", "POST", "user/applyAddFriend", body, this.applyFriendBack)
  }
  applyFriendBack(json) {
    if (json.result == "success") {
      message.success('请求已发送', 5);
    } else {
      message.warning('添加请求发送失败');
    }
  }
  cancelApplyFriend = (e) => {
    var style = {
      display: "none"
    }
    this.setState({
      addUserStyle: style,
    })
  }
  
  render() {
    const PanelBgColor = this.props.theme.infobgcolor;
    const InputBgColor = this.props.theme.infobgcolor;
    const IconColor = this.props.theme.fontcolor;
    const LineColor = this.props.theme.linecolor;
    const btnstyle={
      border:"1px solid #CDCDCD",
      width:this.props.windowHeight*0.08,
      height:this.props.windowHeight*0.035,
      borderRadius:4,
      backgroundColor:"#FFFFFF",
      cursor:"pointer"
    }
    return (
      <div>
      {this.props.chatlist.length!=0
          &&
        <Layout>
          <Layout>
            <div 
              className="vertically-center"
              style={{
                float:"left",
                paddingLeft:this.props.windowWidth*0.014,
                fontSize:this.props.windowHeight*0.025,
                height:this.props.windowHeight*0.05,
                borderStyle:" none  none solid none  ",
                borderColor:" #00FFFF #FFFFFF "+LineColor+" #00FFFF  ",
                borderWidth:1,
                backgroundColor:PanelBgColor,
                color:this.props.theme.fontcolor
              }}
            >
              <b>{this.props.currentChat==null?"":this.props.currentChat.name}</b>
            </div>
          </Layout>
          <Layout>
            <Content>
              {/*聊天信息面板*/}
              {/*!this.props.currentChat.isfriend&&
              <div style={this.state.addUserStyle}>
                <div className="vertically-center" style={{fontSize:this.props.windowHeight*0.02,width:this.props.windowWidth*0.8,height:this.props.windowHeight*0.045,position:"fixed",zIndex:1,color:this.props.theme.fontcolor,backgroundColor:"#f5f5f5"}}>
                  <div>此用户不是您的好友，是否添加为您的好友？
                  <button onClick={this.applyFriend} style={btnstyle}>添加</button>&nbsp;&nbsp;&nbsp;<button onClick={this.cancelApplyFriend} style={btnstyle}>取消</button>
                  </div>
                </div>
              </div>*/}
              <Layout 
                id="msgpanel" 
                style={{
                  backgroundColor:PanelBgColor,
                  height:this.props.windowHeight*0.55,
                  overflow:"auto"}} 
                onScroll={this.onScrollHandle}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={this.state.msgarr}
                  split={false}
                  size="small"
                  style={{marginTop:5}}
                  renderItem={item => (
                    <List.Item 
                      style={{
                        paddingLeft:10,
                        paddingRight:10,
                        paddingBottom:10
                      }}
                    >
                      <ChatPopover 
                        Popbgcolor={this.props.theme.Popbgcolor}
                        myPopbgcolor={this.props.theme.myPopbgcolor}
                        message={item} 
                        fromUserID={item.fromUserID} 
                        avatar={item.avatar} 
                        username={item.nickName} 
                        value={item.message} 
                        msgState={item.state} 
                        integral={item.integral}
                      />
                    </List.Item>
                  )}
                />
              </Layout>
              <Layout 
                style={{
                  backgroundColor:InputBgColor
                }}
              >
                {/*表情，图片，文件发送按钮*/}
                <div 
                  style={{
                    padding:2,
                    height:this.props.windowHeight*0.06,
                    display:"-moz-box",
                    display:"-ms-flexbox",
                    display:"-webkit-box",
                    display:"-webkit-flex",
                    display:"box",
                    display:"flexbox",
                    display:"flex",
                    alignItems:'center',
                    backgroundColor:"transparent",
                    borderStyle:"solid none none none",
                    borderColor:LineColor+" #FFFFFF #FFFFFF #FFFFFF ",
                    borderWidth:1
                  }}
                >
                  <div 
                    style={{
                      height:this.props.windowHeight*0.035
                    }}
                  >
                    <div style={{
                        height:this.props.windowHeight*0.03,
                        width:30,
                        float:'left'
                      }}
                    >
                      <Popover 
                        placement="topLeft" 
                        title={"表情"} 
                        trigger="click" 
                        content={<div>{this.state.expression}</div>} 
                        arrowPointAtRight
                      >
                        <div 
                          style={{
                            height:this.props.windowHeight*0.03,
                            display:"-moz-box",
                            display:"-ms-flexbox",
                            display:"-webkit-box",
                            display:"-webkit-flex",
                            display:"box",
                            display:"flexbox",
                            display:"flex",
                            alignItems:'center',
                          }}
                        >
                        <Icon 
                          style={{
                            color:IconColor,
                            paddingLeft:this.props.windowWidth*0.0072,
                            cursor: "pointer",
                            fontSize:this.props.windowHeight*0.03,
                            float:'left'}} 
                          type="smile-o"
                        />
                        </div>
                      </Popover>
                    </div>
                    <div 
                      style={{
                        height:this.props.windowHeight*0.03,
                        width:this.props.windowHeight*0.04,
                        float:'left'
                      }}
                    >
                      <SendImgMsg iconcolor={IconColor}/>
                    </div>
                    <div 
                      style={{
                        height:this.props.windowHeight*0.03,
                        width:this.props.windowHeight*0.03,
                        float:'left'
                      }}
                    >
                      <SendFileMsg iconcolor={IconColor}/>
                    </div>
                  </div>
                </div>
                {/*文本输入框*/}
                <TextArea 
                  value={this.state.msgContext} 
                  onKeyDown={this.onKeyDown.bind(this)} 
                  autosize={false} 
                  onPressEnter={this.sendMsg} 
                  onChange={this.msgChange}
                  onPaste={this.imgPaste}
                  style={{
                    height:this.props.windowHeight*0.08,
                    color:this.props.theme.fontcolor,
                    backgroundColor:"transparent",
                    border:0,
                    outline:"solid transparent",
                    outlineWidth:0,
                    outlineColor:"transparent",
                    outlineStyle:"none",
                    outline:'none',
                    resize:'none',
                    boxShadow:"0 0 0 0",
                    }}
                />
                {/*发送按钮*/}
                <div 
                  style={{
                    backgroundColor:"transparent",
                    padding:5
                  }}
                >
                  <button 
                    style={{
                      float:"right",
                      borderRadius:4,
                      backgroundColor:this.props.theme.btnBgColor,
                      color:"#FFFFFF",
                      border:"none",
                      width:this.props.windowWidth*0.048,
                      height:this.props.windowHeight*0.038,
                      fontSize:this.props.windowHeight*0.02,
                      outline:"none",
                      cursor: "pointer"
                    }}
                    onClick={this.sendMsg}
                  >
                  发&nbsp;&nbsp;送
                  </button>
                </div>
              </Layout>
              {/*粘贴图片的Modal框*/}
              <Modal
                visible={this.state.imgVisible}
                onCancel={this.handleCancel.bind(this)}
                closable={true}
                maskClosable={false}
                width={this.props.windowWidth*0.4}
                bodyStyle={{
                  backgroundColor:InputBgColor,
                  display:"-moz-box",
                  display:"-ms-flexbox",
                  display:"-webkit-box",
                  display:"-webkit-flex",
                  display:"box",
                  display:"flexbox",
                  display:"flex",
                  alignItems:'center',
                  justifyContent:'center',
                }}
                footer={null}
              >
                <div 
                  style={{
                    width:"100%"
                  }}
                >
                  <div 
                    style={{
                      width:"100%",
                      height:this.props.windowHeight*0.045,
                      fontSize:this.props.windowHeight*0.03,
                      color:"#000000"
                    }}
                  >
                    是否发送图片
                  </div>
                  <div 
                    style={{
                      width:"100%",
                      display:"-moz-box",
                      display:"-ms-flexbox",
                      display:"-webkit-box",
                      display:"-webkit-flex",
                      display:"box",
                      display:"flexbox",
                      display:"flex",
                      alignItems:'center',
                      justifyContent:'center',
                    }}
                  >
                    <img 
                      src={this.state.imgUrl} 
                      style={{
                        maxHeight:this.props.windowHeight*0.5,
                        maxWidth:this.props.windowWidth*0.35
                      }}
                    />
                  </div>
                  <div 
                    style={{
                      height:this.props.windowHeight*0.045,
                      width:"100%",
                    }}
                  >
                    <div 
                      style={{
                        float:"right",
                        marginTop:this.props.windowHeight*0.005
                      }}
                    >
                      <Button 
                        onClick={this.handleCancel.bind(this)} 
                        style={{
                          borderRadius:4,
                          backgroundColor:this.props.theme.btnBgColor,
                          color:"#FFFFFF",
                          border:"none",
                          width:this.props.windowWidth*0.07,
                          height:this.props.windowHeight*0.05,
                          fontSize:this.props.windowHeight*0.025,
                          outline:"none",
                          cursor: "pointer"
                        }}
                      >
                        取消
                      </Button>
                      <Button 
                        onClick={this.handleOk.bind(this)} 
                        style={{
                          borderRadius:4,
                          backgroundColor:this.props.theme.btnBgColor,
                          color:"#FFFFFF",
                          border:"none",
                          width:this.props.windowWidth*0.07,
                          height:this.props.windowHeight*0.05,
                          fontSize:this.props.windowHeight*0.025,
                          outline:"none",
                          cursor: "pointer"
                        }}
                      >
                        发送
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            </Content>
            {
              this.props.currentChat.type=="group"&&
              <Sider style={{background:this.props.theme.listbgcolor}}>
                <ChatGrouplist />
              </Sider>
            }
          </Layout>
        </Layout>}
      </div>
    );
  }
}
ChatPanel.propTypes = {
    
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    currentChat: state.ChatListReducer.currentChat,
    userlist: state.LoadContactListReducer.userlist,
    msgarr: state.ChatListReducer.msgarr,
    chatlist: state.ChatListReducer.chatlist,
    sendfilearr:state.ChatListReducer.sendfilearr,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    AddChatRecordAction: (chatid, message, user) => {
      dispatch(AddChatRecordAction(chatid, message, user));
    },
    MsgStateChangeAction: (message) => {
      dispatch(MsgStateChangeAction(message));
    },
    FileStateChangeAction:(message)=>{
      dispatch(FileStateChangeAction(message));
    },
    ManagerSendFileAction:(type,fileinfo)=>{
      dispatch(ManagerSendFileAction(type,fileinfo));
    }
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatPanel); 