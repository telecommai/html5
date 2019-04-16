/*系统通知组件
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,Avatar,Badge,Input,Popover,Modal,Table,message} from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import LoadContactListAction from "../actions/LoadContactListAction.js";
import DeleteSystemMsgAction from "../actions/DeleteSystemMsgAction.js";
import UserListSort from "../util/UserListSort.js";
import request from "../request/request.js";
import tcrequest from "../request/tcrequest.js";

const { Column } = Table;
const { Header, Footer, Sider, Content } = Layout;
class HeadNotice extends React.Component {
	constructor(props){
    super(props);
    this.state={
      visible:false,
      record:null
    }
  }
  componentDidMount(){}
  componentDidUpdate(){}
  componentWillMount(){}
  componentWillUnmount(){}
  sysMsgCount(sysmsglist){
    var count = 0;
    for(let value of sysmsglist){
      if(value.CMD=="applyAddFriend"){
        count = value.message.length;
      }
    }
    return count;
  }
  switchMsg(sysmsglist){
    var list=null
    for(let value of sysmsglist){
      if(value.CMD=="applyAddFriend"){
        list=value.message;
      }
    }
    return list;
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
    var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&friendUserId="+this.state.record.userId
    request("MessageServerURL","POST","user/addFriend",body,this.addFriendback.bind(this))
  }
  cancelModal=()=>{
    this.setState({
      visible: false,
    });
  }
  addFriendback(json){
    if(json.result=="success"){
      message.success('添加成功');
      this.props.DeleteSystemMsgAction(this.state.record)
      this.userListLoad();
    }else{
      message.warning('添加失败');
    }
    
  }
  userListLoad() {
    /*var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")
    request("MessageServerURL","POST","user/addresslist",body,this.userListLoadBack)*/
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
          this.state.refreshCount = this.state.refreshCount+1;
          sessionStorage.setItem("access_token", data.access_token);
          sessionStorage.setItem("refresh_token", data.refresh_token);
          this.userListLoad();
        })
      }
    })
  }
  userListLoadBack=(json)=>{
      var listSort =new UserListSort();//写的一个排序的方法，求优化
      var sortlist = listSort.listSort(json.addressList);
      var count = json.addressList.length;
      this.props.LoadContactListAction("UserListLoad",sortlist,json.result,count);
  }
  render() {
    return (
      <Content style={{float:"left"}}>
        <Popover 
        trigger="click"
        mouseLeaveDelay={0.1}
        content={(
            <div>
              <Table 
                dataSource={this.props.systemMsgList} 
                showHeader={false} 
                onRow={(record) => ({
                    onClick: ()=>{
                      this.state.record = record;
                      this.showModal();
                    },
                    onDoubleClick: ()=>{},
                    onContextMenu: () => {},
                    onMouseEnter: () => {},
                    onMouseLeave: () => {},
                  })
                }
                
                pagination={false}
                size = "small"
              >
                  <Column
                    title="好友列表"
                    defaultSortOrder='descend'
                    key={(text,record) => (record.userId)}
                    render={(text, record) => (
                      <div>
                        {record.avatar!=""?
                          /*<Avatar size="small" src={record.avatar} />
                          :
                          <Avatar size="small" src={require("../resources/icon/user.png")} />*/
                          <img src={record.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                          :
                          <img src={require("../resources/icon/user.png")} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                        }{record.nickName}请求添加你为好友
                      </div>
                    )}
                  />
              </Table>
            </div>
          )} 
        title="通知">
          <Badge count={this.props.systemMsgList.length}>
            <Icon style={{color:"white",fontSize:20,marginLeft:6,marginRight:6,marginTop:-6,cursor: "pointer",}} type="bell"/>
          </Badge>
        </Popover>
        <Modal
          title="好友请求"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.cancelModal}
          okText="接受"
          cancelText="取消"
          width="300px"
        >
          <p>接受{this.state.record==null?null:this.state.record.message.friendUserId}的好友请求？</p>
        </Modal>
      </Content>
    )
  }
			    
}
HeadNotice.propTypes = {
    
}
function mapStateToProps(state) {
    return {
        systemMsgList:state.SystemMsgReducer.systemMsgList,
    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        LoadContactListAction: (actiontype,list,result,count) => {
            dispatch(LoadContactListAction(actiontype,list,result,count));//派发action，可添加多个参数
        },
        DeleteSystemMsgAction:(message)=>{
            dispatch(DeleteSystemMsgAction(message))
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadNotice); 