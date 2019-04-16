/*图片上传
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,Badge,Input,Upload } from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import request from "../request/request.js";
import JFMessageManager from "../js-im/message/manager/JFMessageManager.js";
import IMStructMessage from "../js-im/message/struct/IMStructMessage.js";
import AddChatRecordAction from "../actions/AddChatRecordAction.js";
import ManagerSendFileAction from "../actions/ManagerSendFileAction.js";
import FileStateChangeAction from "../actions/FileStateChangeAction.js";
//最好类名跟文件名对应
class SendImgMsg extends React.Component {
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
  render() {
    const _this = this;
    const props = {
      name: 'file',
      accept:"image/*",
      action: 'http://panserver.solarsource.cn:9692/panserver/files/file/directupload',
      data: {
        parentId: 66662,
        createUser: 66662
      },
      showUploadList:false,
      multiple: false,
      onChange(info) {
        if (info.file.status == 'uploading') {

        } else if (info.file.status == 'done') {
          var file = info.file;
          var resp = file.response;
          var fileid = resp.fileid;
          var width = 0;
          var height = 0;
          var image = new Image();
          var toUserID = "";
          var postType=null;
          var filename = "";
          var sendfilearr = _this.props.sendfilearr;
          for (var i = sendfilearr.length - 1; i >= 0; i--) {
            if(sendfilearr[i].uid==file.uid){
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
            msgarr.beforeMsgId = file.uid;
            msgarr.chatid = newmessage.toUserID;
            /*_this.props.AddChatRecordAction(_this.state.toUserID, msgarr, _this.props.currentChat);*/
            _this.props.FileStateChangeAction(msgarr)
          }
        } else if (info.file.status === 'error') {

        }
      },
      beforeUpload(file){
        var newmessage = new IMStructMessage();
        var context = {
              "url": require("../resources/filetype/loading.gif"),
              "path": "",
              "scale": "50:100"
            }
        newmessage.fromUserID = parseInt(sessionStorage.getItem("imUserId"));
        newmessage.toUserID = parseInt(_this.props.currentChat.id);

        if (_this.props.currentChat.type == "group") {
          newmessage.postType = 1;
        } else if (_this.props.currentChat.type == "user") {
          newmessage.postType = 0;
        }
        newmessage.subType = 1;
        newmessage.message = JSON.stringify(context);
        newmessage.integral=10;
        newmessage.nickName=sessionStorage.getItem("userName");
        newmessage.avatar=sessionStorage.getItem("avatar");
        newmessage.messageIDString = file.uid;
        newmessage.state = 2;
        var fileinfo = {};
        fileinfo.toUserID=newmessage.toUserID;
        fileinfo.uid = file.uid;
        fileinfo.postType = newmessage.postType;
        fileinfo.name = file.name;
        _this.props.ManagerSendFileAction("AddFile",fileinfo)
        _this.props.AddChatRecordAction(_this.props.currentChat.id, newmessage, _this.props.currentChat);
      },
    };
    return (
      <div>
        <Upload {...props}>
          <div ref="chooseAndUpload">
            <Icon style={{color:this.props.iconcolor,paddingLeft:this.props.windowWidth*0.0072,cursor: "pointer",fontSize:this.props.windowHeight*0.03}} type="picture" />
          </div>
        </Upload>
      </div>
    )
  }
          
}
//类属性
SendImgMsg.propTypes = {

}
//映射store中的数据至本页面state
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
//映射派发action至本页面
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
)(SendImgMsg);