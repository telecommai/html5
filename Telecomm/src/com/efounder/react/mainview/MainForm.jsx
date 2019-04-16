/*主体页面
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Form,Layout,Menu,Icon,Avatar,Badge,Input,Row,Col,message} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import './MainForm.css';
import Message from './message/Message.jsx';
import Contacts from './contacts/Contacts.jsx';
import Head from './Head.jsx';
import Wallet from './wallet/Wallet.jsx';
import request from "../request/request.js";
import requestInfo from "../request/requestInfo.js";
import tcrequest from "../request/tcrequest.js";
import MainMenuClickAction from "../actions/MainMenuClickAction.js";
import JFMessageManager from "../js-im/message/manager/JFMessageManager.js";
import IMStructMessage from "../js-im/message/struct/IMStructMessage.js";
import AddChatRecordAction from "../actions/AddChatRecordAction.js";
import LoadContactListAction from "../actions/LoadContactListAction.js";
import UserListSort from "../util/UserListSort.js";
import AddChatAction from "../actions/AddChatAction";
import AddChatUserAction from "../actions/AddChatUserAction";
import LoadGroupUserListAction from "../actions/LoadGroupUserListAction.js";
import AddSystemMsgAction from "../actions/AddSystemMsgAction.js";
import ChangeChatIsFriendAction from "../actions/ChangeChatIsFriendAction.js"
import DeleteSystemMsgAction from "../actions/DeleteSystemMsgAction.js";
import ContactsListClickAction from "../actions/ContactsListClickAction.js";
import getGUID from "../util/GetGuid.js";
import LoadThemeAction from "../actions/LoadThemeAction.js";
import LoadWindowSizeAction from "../actions/LoadWindowSizeAction.js";
import MsgStateChangeAction from "../actions/MsgStateChangeAction.js";
import bgimg from "../resources/login_bg2.png";
import "../style/layout.less";

const {Header,Footer,Sider,Content} = Layout;
const Search = Input.Search;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgarr: null,
      chatid: null,
      systemMsg: null,
      docvisible:"visible",
      timer:null
    }
  }
  componentWillMount() {
    if (sessionStorage.getItem("token") == undefined) {
      this.props.history.push({
        pathname: '/login',
      });
      return;
    }
    
    if (this.props.userlistresult != "success") {
      {
        this.userListLoad()
      }
    }
    if (this.props.grouplistresult != "success") {
      {
        this.groupListLoad()
      }
    }
    if (this.props.publiclistresult != "success") {
      {
        this.publicListLoad()
      }
    }
    var theme =require("../style/theme.json")
    this.props.LoadThemeAction(theme);
  }
  componentWillUnmount() {
    var messageManager = JFMessageManager.sharedMessageManager();
    messageManager.romveMessageDelegate(this)
  }
  componentDidMount() {
    //设置一个定时器检测sessionStorage
    /*this.state.timer=setInterval(()=>{
      var token = sessionStorage.getItem("token")
      if (token==undefined||token==null||token=="") {
        clearInterval(this.state.timer);
        this.props.history.push({
          pathname: '/login',
        });
        message.warning("登录超时")
      }
    }, 500)*/
      //网页当前状态判断
      /*var hidden, state, visibilityChange;
      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
      } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
      }
      // 添加监听器，在state中添加页面状态:visible:激活;hidden:隐藏;
      document.addEventListener(visibilityChange, function() {
        this.setState({
          docvisible:document[state],
        })
      }.bind(this), false);*/
      //初始化页面状态
      /*document.title = document[state];*/
    if (sessionStorage.getItem("imUserId") == undefined) {
      return;
    }

    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.init();
  }
  onWindowResize=(e)=>{
    this.props.LoadWindowSizeAction(window.innerHeight,window.innerWidth);
  }
  //建立连接``
  init() {
    var messageManager = JFMessageManager.sharedMessageManager();
    JFMessageManager.sharedMessageManager();
    messageManager.userName = sessionStorage.getItem("imUserId");
    messageManager.password = sessionStorage.getItem("imUserPassWord");
    messageManager.imURL = "http://im.solarsource.cn:9692/IMServer";
    this.order = 0;
    messageManager.addMessageDelegate(this);
    messageManager.start();
  }
  //接收消息
  onMessageDidReceiveStruct(msg) {
    this.sendReadMsg(msg)
    console.log(msg)
    //this.mesgNotice();//消息提醒
    //消息类型显示处理放置在处理聊天消息的工具类中//这里对消息预处理
    switch (msg.subType) {
      case 0:
        /*处理文本消息*/
        this.dealUnSystemMsg(msg);
        break;
      case 1:
        /*处理图片消息*/
        this.dealUnSystemMsg(msg);
        break;
      case 2:
        /*语音*/
        this.dealUnSystemMsg(msg);
        break;
      case 3:
        /*小视频*/
        this.dealUnSystemMsg(msg);
        break;
      case 4:
        /*拍摄视频*/
        this.dealUnSystemMsg(msg);
        break;
      case 5:
        /*处理文件消息*/
        var tempmsg = JSON.parse(msg.message);
        //文件进度标识为100%
        tempmsg.FilePer = "100%";
        //文件发送状态 -1:失败；0：发送中；1：已发送
        tempmsg.FileSendState = 1;
        msg.message = JSON.stringify(tempmsg)
        this.dealUnSystemMsg(msg);
        break;
      case 100:
        /*处理系统消息*/
        this.dealSystemMsg(msg)
        break;
      case 103:
        /*正在输入消息*/
        this.dealSystemMsg(msg)
        break;
      default:
        this.dealSystemMsg(msg)
    }
  }
  //消息提醒
  mesgNotice() {
    /**以下代码判断当前浏览器页签是否处于打开状态，
    *  但是并不能判断浏览器是否处于可见状态，是否需要提示，
    *  故先行注释。
    *  只要消息不来自于自己，就进行提示。
    */
    /*if(this.state.docvisible=="visible"){
      return;
    }*/
    if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function(status) {
        var notice_ = new Notification('新的消息', {
          body: '您有新的消息',
          icon:require("../resources/ewallet/system.ico")
        });
        notice_.onclick = function(event) {
          window.focus();
          //event.preventDefault(); // prevent the browser from focusing the Notification's tab
          /*window.open('http://www.mozilla.org', '_blank');*/
        }
        notice_.onerror = function() {

        }
        notice_.onshow = function() {
          setTimeout(function() {
            notice_.close();
          }, 2000)
        }
      });
    }
  }
  //处理非系统消息
  dealUnSystemMsg(msg) {
    if (msg.fromUserID!=sessionStorage.getItem("imUserId")) {
      //如果消息不来自于我，则提醒新消息
      this.mesgNotice();//消息提醒
    }
    //个人消息处理
    if (msg.postType == 0) {
      this.dealPersonMsg(msg)
    }
    //群组消息的处理
    else if (msg.postType == 1) {
      this.dealGroupMsg(msg)
    }
  }
  //处理个人消息
  dealPersonMsg(msg) {
    //判断消息是不是由自己发出的，定义消息列表ID
    if (msg.fromUserID == sessionStorage.getItem("imUserId")) {
      var chatid = msg.toUserID;
    } else {
      var chatid = msg.fromUserID;
    }
    var userlist = this.props.userlist;
    //如果消息来自于我，则视为已发送，改变消息状态为15
    if (msg.fromUserID == sessionStorage.getItem("imUserId")) {
      msg.state = 15;
    }
    //把消息跟聊天信息都放到state暂存
    this.state.msgarr = msg;
    this.state.chatid = chatid;
    //去联系人列表里面查找这个人的信息，插入聊天列表时用到
    var fromuser = {};
    var flag = false;

    for (var i = 0; i < userlist.length; i++) {
      if (userlist[i].imUserId == this.state.chatid) {
        fromuser.id = userlist[i].imUserId;
        fromuser.name = userlist[i].note==undefined||userlist[i].note==""?userlist[i].nickName:userlist[i].note;
        fromuser.avatar = userlist[i].avatar;
        fromuser.type = "user";
        fromuser.isfriend = true;
        flag = true;
        break;
      }
    }
    //如果聊天列表无此人信息，且发消息的人不来自于我自己，则视为陌生人消息处理
    if (!flag) {
      var body = "otherUserId=" + this.state.chatid;
      //加载陌生人的信息，然后插入聊天列表以及聊天记录
      requestInfo("user/getOtherUserByUserId", body).then(response => response.json()).then(data => {
        var msgarr = this.state.msgarr;
        if(msg.fromUserID != sessionStorage.getItem("imUserId")){
          msgarr.nickName = data.user.nickName;
          msgarr.avatar = data.user.avatar;
        }else{
          msg.nickName = sessionStorage.getItem("userName");
          msg.avatar = sessionStorage.getItem("avatar");
        }
        var fromuser = {};
        fromuser.id = data.user.userId;
        fromuser.name = data.user.nickName;
        fromuser.avatar = data.user.avatar;
        fromuser.type = "user";
        fromuser.isfriend = false;
        this.props.AddChatRecordAction(this.state.chatid, this.state.msgarr, fromuser);
        this.props.AddChatUserAction(fromuser);
      })
      return;
    }
    //如果发消息的人出自于我，则把我的头像跟昵称放上，如果不是我，则把发送人的放上
    if (msg.fromUserID == sessionStorage.getItem("imUserId")) {
      msg.nickName = sessionStorage.getItem("userName");
      msg.avatar = sessionStorage.getItem("avatar");
    } else {
      msg.nickName = fromuser.name;
      msg.avatar = fromuser.avatar;
    }
    this.props.AddChatRecordAction(chatid, msg, fromuser);
    this.props.AddChatUserAction(fromuser);
  }
  //群组消息处理
  dealGroupMsg(msg) {
    if (msg.fromUserID == sessionStorage.getItem("imUserId")) {
      msg.state = 15;
    }
    var chatid = msg.toUserID;
    var grouplist = this.props.grouplist;
    var chat = {};
    var flag = false;
    //遍历查找这个群是否存在
    for (var i = 0; i < grouplist.length; i++) {
      if (grouplist[i].groupId == msg.toUserID) {
        chat.id = grouplist[i].groupId;
        chat.name = grouplist[i].groupName;
        chat.avatar = grouplist[i].avatar;
        chat.type = "group";
        chat.isfriend = true;
        this.setState({
          chat: chat,
          groupid: chat.id,
        });
        flag = true;
        break;
      }
    }
    //不存在则重新加载群列表
    if (!flag) {
      var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")
      requestInfo("group/getGroupListByUserId", body).then(response => response.json()).then(data => {
        var count = data.groups.length;
        this.props.LoadContactListAction("GroupListLoad", data.groups, data.result, count);
        var groupId = msg.toUserID;
        //根据群组ID加载群组成员
        var body2 = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + groupId;
        requestInfo("group/getUserListByGroupId", body2).then(response => response.json()).then(data => {
          this.props.LoadGroupUserListAction(groupId, data.users);
          //加载完成之后重新调用处理
          this.dealGroupMsg(msg);
          return;
        })
      })
    }
    if(!flag){
      return;
    }
    flag = false;
    var userlist;
    //查看群列表有没有这个人，有则取这个人的头像跟昵称
    if (this.props.groupuserlist.length != 0) {
      for (var value of this.props.groupuserlist) {
        if (value.groupid == chatid) {
          userlist = value.list;
        }
      }
      if (userlist != undefined) {
        for (var value of userlist) {
          if (value.userId == msg.fromUserID) {
            if(value.note!=undefined&&value.note!=""){
              msg.nickName = value.note
            }else{
             msg.nickName = value.nickName;
            }
            msg.avatar = value.avatar;
            flag = true;
            break;
          }
        }
      }
    }
    //如果没有，则去加载群成员然后处理头像跟昵称信息
    if (!flag) {
      this.state.message=msg;
      this.state.chatid=chatid;
      this.groupChatLoad(chatid);
      return;
    }
    //在聊天里面插入聊天记录
    this.props.AddChatRecordAction(chatid, msg, chat);
    //在聊天列表里面插入会话
    this.props.AddChatUserAction(chat);
  }
  //发送已查看消息回执
  sendReadMsg(msg){
    var messageManager = JFMessageManager.sharedMessageManager();
    var newmessage = new IMStructMessage();
    //提取出来发送人的信息，看是否是自己发送的消息
    var acceptUser = msg.fromUserID
    var messageIDString = msg.messageIDString
    //定义一个102的已读消息类型
    newmessage.fromUserID = parseInt(sessionStorage.getItem("imUserId"));
    newmessage.toUserID = acceptUser;
    newmessage.postType = msg.postType;
    newmessage.subType = 102;
    newmessage.message = messageIDString;
    if (acceptUser != sessionStorage.getItem("imUserId")) {
      //先判断聊天列表是否有数据，没有则是直接打开的列表，所以直接发送已查看消息即可，25
      if (this.props.chatlist.length == 0) {
        //先改变消息状态
        msg.state = 25;
        messageManager.sendMessage(newmessage);
      }
      //有数据，则继续判断是否需要直接发送已查看的消息。
      else {
        //收到消息后如果当前界面处于未打开的状态，则直接发送已查看消息，并改变状态为已查看25
        var chatid;
        if(msg.postType==1){
          chatid=msg.toUserID;
        }else if(msg.postType==0){
          chatid=msg.fromUserID;
        }
        if (chatid == this.props.currentChat.id) {
          //如果当前对话处于打开状态
          msg.state = 25;
          messageManager.sendMessage(newmessage);
        } else {
          //未打开，则改变消息状态为30未查看，在消息列表点击时处理发送
          msg.state = 30;
        }
      }
    }else{
      //来自于自己的消息暂不处理状态类型
      //msg.state = 20;
    }
  }
  //只用来加载群成员
  groupUserListLoad(groupId) {
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + groupId;
    requestInfo("group/getUserListByGroupId", body).then(response => response.json()).then(data => {
      this.props.LoadGroupUserListAction(groupId, data.users)
    })
  }
  //如果群组成员未加载，在收到群组消息时加载群组成员
  groupChatLoad(groupId) {
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + groupId;
    requestInfo("group/getUserListByGroupId", body).then(response => response.json()).then(data => {
      this.props.LoadGroupUserListAction(groupId, data.users)
      var msgarr = this.state.message;
      var chatid = this.state.chatid;
      var chat = this.state.chat;
      for (var value of data.users) {
        if (value.userId == msgarr.fromUserID) {
          if (value.note != undefined && value.note != "") {
            msgarr.nickName = value.note
          } else {
            msgarr.nickName = value.nickName;
          }
          msgarr.nickName = value.nickName;
          msgarr.avatar = value.avatar;
          break;
        }
      }
      this.props.AddChatRecordAction(chatid, msgarr, chat);
      this.props.AddChatUserAction(chat);
    })
  }
    //处理system的消息
  dealSystemMsg(msg) {
    var systemMsg = msg;
    systemMsg.message = JSON.parse(msg.message),
    this.state.systemMsg = systemMsg;
    //收到好友请求requestInfo("user/getOtherUserByUserId",body).then(response =>response.json()).then(data => {})
    if (systemMsg.message.CMD == "applyAddFriend") {
      var body = "otherUserId=" + systemMsg.message.friendUserId;
      requestInfo("user/getOtherUserByUserId", body).then(response => response.json()).then(data => {
        for (var value of this.props.systemMsgList) {
          if (value.userId == data.user.userId && value.systemMsgType == "applyAddFriend") {
            return;
          }
        }
        data.user.guid = getGUID();
        data.user.systemMsgType = "applyAddFriend";
        data.user.user = data.user;
        this.props.AddSystemMsgAction(data.user);
      })
    }
    //添加好友成功
    if (systemMsg.message.CMD == "addFriend") {
      var body = "otherUserId=" + systemMsg.message.friendUserId;
      requestInfo("user/getOtherUserByUserId", body).then(response => response.json()).then(data => {
        var flag = false;
        var userlist = this.props.userlist;
        for (var value of userlist) {
          if (value.userId == data.user.userId) {
            var flag = true;
          }
        }
        if (!flag) {
          message.success(data.user.nickName + "已成功添加你为好友", 5)
          this.props.ChangeChatIsFriendAction(data.user.userId);
          this.userListLoad();
        }
      })
    }
    //收到群组申请
    if (systemMsg.message.CMD == "applyAddGroup") {
      var body = "otherUserId=" + systemMsg.message.userId;
      requestInfo("user/getOtherUserByUserId", body).then(response => response.json()).then(data => {
        if (data.result != "success") {
          return;
        }
        var groupId = this.state.systemMsg.message.groupId;
        for (var value of this.props.systemMsgList) {
          if (value.userId == data.user.userId && value.systemMsgType == "applyAddGroup" && value.groupId == groupId) {
            return;
          }
        }
        var msg = data.user;
        var group;
        for (var value of this.props.grouplist) {
          if (value.groupId == groupId) {
            group = value;
          }
        }
        msg.systemMsgType = 'applyAddGroup';
        msg.groupId = group.groupId;
        msg.groupName = group.groupName;
        msg.user = data.user;
        msg.group = data.group;
        msg.guid = getGUID();
        this.props.AddSystemMsgAction(msg);
      })
    }
    if (systemMsg.message.CMD == "addUserToGroup") {
      /*{"CMD":"addUserToGroup","groupId":2648,"groupUserId":166061,"manaId":182}*/
      var groupUser = null;
      var manaUser = null;
      var group = null;
      var body1 = "otherUserId=" + systemMsg.message.groupUserId;
      requestInfo("user/getOtherUserByUserId", body1).then(response => response.json()).then(data => {
        groupUser = data.user;
        var body2 = "otherUserId=" + systemMsg.message.manaId;
        requestInfo("user/getOtherUserByUserId", body2).then(response => response.json()).then(data => {
          manaUser = data.user;
          var body3 = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + systemMsg.message.groupId;
          requestInfo("group/getGroupByGroupId", body3).then(response => response.json()).then(data => {
            group = data.group;
            if (groupUser.userId == sessionStorage.getItem("imUserId")) {
              message.success("您已成功加入群组【" + group.groupName + "】", 5);
              this.groupListLoad();
            } else {
              message.success(groupUser.nickName + "已加入群组【" + group.groupName + "】", 5);
            }
            this.groupUserListLoad(systemMsg.message.groupId)
            for (var value in this.props.systemMsgList) {
              if (value.systemMsgType == "addUserToGroup" && msg.userId == systemMsg.message.groupUserId) {
                this.props.DeleteSystemMsgAction(value)
              }
            }
          })
        })
      })
    }
    if (systemMsg.message.CMD == "deleteGroupUser") {
      /*{"CMD":"deleteGroupUser","groupId":2659,"groupUserId":166061,"manaId":182}*/
      var group = null;
      for (var value of this.props.grouplist) {
        if (value.groupId == systemMsg.message.groupId) {
          group = value;
          break;
        }
      }
      if (systemMsg.message.groupUserId == sessionStorage.getItem("imUserId")) {
        message.warning("您已被移除出【" + group.groupName + "】群组", 5);
        this.groupListLoad();
        this.props.ContactsListClickAction(null, null)
      } else {
        var body = "otherUserId=" + systemMsg.message.groupUserId;
        requestInfo("user/getOtherUserByUserId", body).then(response => response.json()).then(data => {
          message.warning("【" + data.user.nickName + "】已退出群组【" + group.groupName + "】", 5)
          this.groupUserListLoad(systemMsg.message.groupId)
        })
      }
    }
    //用户退出群组
    if (systemMsg.message.CMD == "userQuitGroup") {
      var group = null;
      var groupUser = null;
      var body = "otherUserId=" + systemMsg.message.groupUserId;
      requestInfo("user/getOtherUserByUserId", body).then(response => response.json()).then(data => {
        groupUser = data.user;
        var body1 = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + systemMsg.message.groupId;
        requestInfo("group/getGroupByGroupId", body1).then(response => response.json()).then(data => {
          group = data.group;
          if (systemMsg.message.groupUserId == sessionStorage.getItem("imUserId")) {
            message.warning("您已退出群组【" + group.groupName + "】", 5)
            this.groupListLoad();
            this.props.ContactsListClickAction(null, null)
          } else {
            message.warning("【" + groupUser.nickName + "】已退出群组【" + group.groupName + "】", 5)
            this.groupUserListLoad(systemMsg.message.groupId)
          }
        })
      })
    }
    if (systemMsg.message.CMD == "updateGroup") {
      /*{"CMD":"updateGroup","groupId":2648,"groupName":"马飞"}*/
      this.groupListLoad();
      this.groupUserListLoad(systemMsg.message.groupId)
    }
    if (systemMsg.message.CMD == "updateUser") {
      /*{"CMD":"updateUser","userId":182,"user":{"appId":0,"avatar":"http://oap8mw8pg.bkt.clouddn.com/FqfZLe3hzx2Xu5XKnMGAl4DozVtB","email":"","mobilePhone":"18735183358","nickName":"许鹏飞-","passWord":"","phone":"18735183358","sex":"M","sign":"123126","userId":182,"userName":"18735183358","userType":0}*/
      this.userListLoad();
      this.props.ContactsListClickAction(null, null)
    }
  }
  //好友加载以及回调
  userListLoad() {
    /*var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")
    request("MessageServerURL", "POST", "user/addresslist", body, this.userListLoadBack)*/
    var body = "access_token=" + sessionStorage.getItem("access_token");
    tcrequest("/tcserver/user/friendAddressList", body).then(response => response.json()).then(data => {
      if (data.result == "success") {
        var listSort = new UserListSort();
        var sortlist = listSort.listSort(data.addressList);
        var count = data.addressList.length;
        this.props.LoadContactListAction("UserListLoad", sortlist, data.result, count);
        return;
      } else {
        var body2 = "grant_type=refresh_token" + "&client_id=a6f23fbb-0a1d-4e10-be7e-89181cdf089c&client_secret=2a6a9640-9a46-4622-b226-bc94b852848c&refresh_token=" + sessionStorage.getItem("refresh_token");
        tcrequest("/tcserver/oauth/accessToken", body2).then(response => response.json()).then(data => {
          if(data.error=="invalid_request"){
            this.props.history.push({
              pathname: '/login',
            });
            message.warning("当前登录失效，请重新登录")
            return;
          }
          sessionStorage.setItem("access_token", data.access_token);
          sessionStorage.setItem("refresh_token", data.refresh_token);
          this.userListLoad();
        })
      }
    })
  }
/*  userListLoadBack = (json) => {
    var listSort = new UserListSort();
    var sortlist = listSort.listSort(json.addressList);
    var count  = json.addressList.length;
    this.props.LoadContactListAction("UserListLoad", sortlist, json.result,count);
  }*/
  //群组列表加载以及回调
  groupListLoad() {
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")
    request("MessageServerURL", "POST", "group/getGroupListByUserId", body, this.groupListLoadBack)
  }
  groupListLoadBack = (json) => {
    var count = json.groups.length;
    this.props.LoadContactListAction("GroupListLoad", json.groups, json.result,count);
  }
  //公众号列表加载
  publicListLoad() {
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")
    request("MessageServerURL", "POST", "public/getPublicListByUserId", body, this.publicListLoadBack)
  }
  publicListLoadBack = (json) => {
    var count = json.publics.length;
    this.props.LoadContactListAction("PublicListLoad", json.publics, json.result,count)
  }
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
    /*if(msg!=undefined){
      this.props.MsgStateChangeAction(msg);
    }*/
  }
  //聊天窗口连接
  onMessageDidConnect() {
  }
  //聊天窗口丢失连接 断线就重连
  onMessageDidDisConnect() {
    //var messageManager = JFMessageManager.sharedMessageManager();
    this.init();
  }
  handleClick = (e) => {
    this.props.MainMenuClickAction(e.key);
  }
  //匹配不同页面
  switchPage(viewArr, data) {
    switch (viewArr) {
      case 'message':
        //聊天页面
        return <Message object={data}/>;
      case 'contacts':
        return <Contacts object={data}/>;
      case 'base':
        return <Wallet object={data}/>;
    }
  }
  render() {
    return (
      <div 
      className="vertically-horizontally-center"
      style={{
        height:window.innerHeight,
        width:window.innerWidth,
        backgroundColor:this.props.theme.bgcolor,
        backgroundImage:`url(${bgimg})`,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}>
      <Row>
          <Col span={20}>
          <Layout style={{width:this.props.windowWidth*0.85}}>
            <Content style={{height:this.props.windowHeight*0.08,backgroundColor:this.props.theme.titlebgcolor}}>
                <Head/>
            </Content>
            <Content style={{height:this.props.windowHeight*0.8,backgroundColor:this.props.theme.bgcolor, borderStyle:"solid none none none  ",borderColor:this.props.theme.titlebgcolor+" #FFFFFF #FFFFFF #FFFFFF ",borderWidth:2}}>
              <div style={{height:"100%"}}>{this.switchPage(this.props.menukey)}</div>
            </Content>
            {/*<Content className="vertically-center" style={{backgroundColor:this.props.theme.titlebgcolor,color:"#FFFFFF",height:this.props.windowHeight*0.08}}>
              版权所有 © 普联软件股份有限公司
            </Content>*/}
          </Layout>
          </Col>
          </Row>
      </div>
    );
  }
}
MainForm.propTypes = {
  MainMenuClickAction: PropTypes.func.isRequired,
  AddChatRecordAction: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    menukey: state.MainMenuClickReducer.menukey,
    listtype: state.ContactsListClickReducer.listtype,
    userlist: state.LoadContactListReducer.userlist,
    grouplist: state.LoadContactListReducer.grouplist,
    publiclist: state.LoadContactListReducer.publiclist,
    userlistresult: state.LoadContactListReducer.userlistresult,
    grouplistresult: state.LoadContactListReducer.grouplistresult,
    publiclistresult: state.LoadContactListReducer.publiclistresult,
    groupuserlist: state.LoadGroupUserListReducer.groupuserlist,
    systemMsgList: state.SystemMsgReducer.systemMsgList,
    systemMsgList: state.SystemMsgReducer.systemMsgList,
    theme:state.ThemeReducer.theme,
    windowHeight:state.WindowSizeReducer.windowHeight,
    windowWidth:state.WindowSizeReducer.windowWidth,
    chatlist: state.ChatListReducer.chatlist,
    currentChat: state.ChatListReducer.currentChat,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    LoadWindowSizeAction: (height, width) => {
      dispatch(LoadWindowSizeAction(height, width))
    },
    MainMenuClickAction: (menukey) => {
      dispatch(MainMenuClickAction(menukey));
    },
    AddChatRecordAction: (chatid, message, user) => {
      dispatch(AddChatRecordAction(chatid, message, user));
    },
    LoadContactListAction: (actiontype, list, result,count) => {
      dispatch(LoadContactListAction(actiontype, list, result,count));
    },
    AddChatUserAction: (user) => {
      dispatch(AddChatUserAction(user));
    },
    LoadGroupUserListAction: (id, users) => {
      dispatch(LoadGroupUserListAction(id, users));
    },
    AddSystemMsgAction: (userapply) => {
      dispatch(AddSystemMsgAction(userapply)); //添加系统消息
    },
    ChangeChatIsFriendAction: (userid) => {
      dispatch(ChangeChatIsFriendAction(userid));
    },
    DeleteSystemMsgAction: (userapply) => {
      dispatch(DeleteSystemMsgAction(userapply))
    },
    ContactsListClickAction: (seletrow, listtype) => { //页面加载时，派发Action用于加载表单中组件的默认值
      dispatch(ContactsListClickAction(seletrow, listtype));
    },
    LoadThemeAction: (theme) => {
      dispatch(LoadThemeAction(theme));
    },
    MsgStateChangeAction:(message)=>{
      dispatch(MsgStateChangeAction(message));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainForm);