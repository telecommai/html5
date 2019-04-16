/*书写组件的模板
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import 'ant-design-pro/dist/ant-design-pro.css';
import { Form,Layout,Menu,Icon,Avatar,Badge,Input,Popconfirm,Popover,Row,Col,Table,Modal,message,Select,Button,Dropdown } from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
import request from "../request/request.js";
import MainMenuClickAction from "../actions/MainMenuClickAction.js";
import LoadContactListAction from "../actions/LoadContactListAction.js";
import DeleteSystemMsgAction from "../actions/DeleteSystemMsgAction.js";
import LoadGroupUserListAction from "../actions/LoadGroupUserListAction.js";
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import UserListSort from "../util/UserListSort.js";
import tcrequest from "../request/tcrequest.js";
import config from "../config/config.json"
const {Header,Footer,Sider,Content} = Layout;
const { Column } = Table;
const Search = Input.Search;
const menuStyle={
  fontSize:24,
  color:"#6a82a5",
  cursor: "pointer",
}
const menuClickStyle={
  fontSize:28,
  color:"#108ee9",
  cursor: "pointer",
}
class Head extends React.Component {
	constructor(props){
    super(props);
    this.state={
      userApplyVisible:false,
      groupApplyVisible:false,
      walletVisible:false,
      record:{"avatar":null,"userName":null,"nickName":null,"sex":null,"mobilePhone":null,"userId":null,"email":null,"sign":null,},
    }
  }
  logout=(e)=>{
    sessionStorage.clear();
    window.location.reload()
    
  }
  handleClick = (e) => {
    this.props.MainMenuClickAction(e.target.name);
  }
  componentDidUpdate(){}
  sysMsgCount(sysmsglist){
    var count = 0;
    for(let value of sysmsglist){
      if(value.CMD=="applyAddFriend"){
        count = value.message.length;
      }
    }
    return count;
  }
  showModal = () => {
    if(this.state.record.systemMsgType=="applyAddFriend"){
      this.setState({
        userApplyVisible: true,
      });
    }
    if(this.state.record.systemMsgType=="applyAddGroup"){
      this.setState({
        groupApplyVisible: true,
      });
    }
  }
  hideModel = () => {
    this.setState({
      userApplyVisible: false,
      groupApplyVisible:false,
    });
    if(this.state.record.systemMsgType=="applyAddFriend"){
      var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&friendUserId="+this.state.record.userId;
      request("MessageServerURL","POST","user/addFriend",body,this.addFriendback.bind(this));
    }
    if(this.state.record.systemMsgType=="applyAddGroup"){
      var body = "groupId="+this.state.record.groupId+"&userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&addUserId="+this.state.record.userId;
      request("MessageServerURL","POST","group/addUserToGroup",body,this.addUserToGroupBack.bind(this));
    }
  }
  cancelModel=()=>{
    this.setState({
      userApplyVisible: false,
      groupApplyVisible:false,
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
  addUserToGroupBack(json){
    if(json.result=="success"){
      message.success('添加成功');
      this.props.DeleteSystemMsgAction(this.state.record)
    }else{
      message.warning('添加失败');
    }
  }
  //添加群组成员重新加载列表
  groupUserListLoad(groupId){
    var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&groupId="+groupId;
    requestInfo("group/getUserListByGroupId",body).then(response =>response.json()).then(data => {
      if(data.result!="success"){
        //重新加载群组成员失败
      }else{
        this.props.LoadGroupUserListAction(groupId,data.users)
      }
    })
  }
  //添加完重新加载好友列表
  userListLoad(){
    /*var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord");
    request("MessageServerURL","POST","user/addresslist",body,this.userListLoadBack);*/
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
  //通知列表显示匹配
  switchSystemMsg(record){
    if(record.systemMsgType=="applyAddFriend"){
      return(
        <div className="vertically-center" style={{width:200,whiteSpace: "nowrap"}}>
          【{record.nickName}】请求添加你为好友
        </div>
      )
    }
    if(record.systemMsgType=="applyAddGroup"){
      return(
        <div className="vertically-center" style={{width:200}}>
          【{record.nickName}】请求加入群组【{record.groupName}】
        </div>
        )
    }
    if(record.systemMsgType=="addUserToGroup"){
      return(
        <div className="vertically-center" style={{width:200}}>
          【{record.groupUserName}】加入群组【{record.groupName}】
        </div>
        )
    }
  }
  //上方菜单显示根据配置显示，暂且注释
  menuVisible(config){
    let html =[];
    if (config.message) {
      html.push(
        <div  style={{float:"left",cursor: "pointer",width:this.props.windowWidth*0.028,marginLeft:this.props.windowWidth*0.014}}>
          <Badge count={0} overflowCount={99}>
              <img name="message" onClick={this.handleClick} src={require(this.props.menukey=="message"?"../resources/menuicon/message.png":"../resources/menuicon/messagebak.png")} style={{height:this.props.windowHeight*0.06}}/>
          </Badge>
        </div>
      )
    }
    if(config.contacts){
      html.push(
        <div  style={{float:"left",cursor: "pointer",width:this.props.windowWidth*0.028,marginLeft:this.props.windowWidth*0.014}}>
          <Badge count={0} overflowCount={99}> 
            <img name="contacts" onClick={this.handleClick} src={require(this.props.menukey=="contacts"?"../resources/menuicon/contacts.png":"../resources/menuicon/contactsbak.png")} style={{height:this.props.windowHeight*0.06}}/>
          </Badge>
        </div>
      )
    }
    if(config.base){
      html.push(
        <div  style={{float:"left",cursor: "pointer",width:this.props.windowWidth*0.028,marginLeft:this.props.windowWidth*0.014}}>
          <Badge count={0} overflowCount={99}> 
            <img name="base" onClick={this.handleClick} src={require(this.props.menukey=="base"?"../resources/menuicon/base.png":"../resources/menuicon/basebak.png")} style={{height:this.props.windowHeight*0.06}}/>
          </Badge>
        </div>
      )
    }
    return html;          
  }
  //获取未读条数
  getUnReadNum(chatlist){
    var count = 0;
    for (var i = chatlist.length - 1; i >= 0; i--) {
      if(chatlist[i].unreadnum!=0&&chatlist[i].unreadnum!=undefined){
        count = count+chatlist[i].unreadnum
      }
    }
    return count;
  }
  render() {
    return (
      <div className="vertically-center" style={{position:"relative",borderRadius:"5px 5px 0px 0px",height:this.props.windowHeight*0.08,width:this.props.windowWidth*0.85}}>
        <div style={{float:'left',paddingLeft:20,width:"20%"}}>
          <img src={require("../resources/icon/title_logo2.png")}/>
        </div>
        <div className="horizontally-center" style={{width:"60%",float:"left",backgroundColor:this.props.theme.titlebgcolor}}>
          {/*根据配置文件加载菜单this.menuVisible(config)*/}
          <div  style={{float:"left",cursor: "pointer",width:this.props.windowWidth*0.028,marginLeft:this.props.windowWidth*0.014}}>
            <Badge count={this.props.unreadcount} overflowCount={99}>
              <img name="message" onClick={this.handleClick} src={require(this.props.menukey=="message"?"../resources/menuicon/message.png":"../resources/menuicon/messagebak.png")} style={{height:this.props.windowHeight*0.06}}/>
            </Badge>
          </div>
          <div  style={{float:"left",cursor: "pointer",width:this.props.windowWidth*0.028,marginLeft:this.props.windowWidth*0.014}}>
            <Badge count={0} overflowCount={99}> 
              <img name="contacts" onClick={this.handleClick} src={require(this.props.menukey=="contacts"?"../resources/menuicon/contacts.png":"../resources/menuicon/contactsbak.png")} style={{height:this.props.windowHeight*0.06}}/>
            </Badge>
          </div>
          <div  style={{float:"left",cursor: "pointer",width:this.props.windowWidth*0.028,marginLeft:this.props.windowWidth*0.014}}>
            <Badge count={0} overflowCount={99}> 
              <img name="base" onClick={this.handleClick} src={require(this.props.menukey=="base"?"../resources/menuicon/base.png":"../resources/menuicon/basebak.png")} style={{height:this.props.windowHeight*0.06}}/>
            </Badge>
          </div>
        </div>
        <div style={{width:"20%",position:"absolute",right:0,top:"50%",transform: "translate(0,-50%)", MsTransform: "translate(0,-50%)",WebkitTransform: "translate(0,-50%)",OTransform: "translate(0,-50%)",MozTransform: "translate(0,-50%)"}}>
          <div style={{float:'right',paddingRight:20,}}>
            
            <Badge count={0}> 
              {sessionStorage.getItem("avatar")!=''?
              <img src={sessionStorage.getItem("avatar")} style={{height:this.props.windowHeight*0.052,width:this.props.windowHeight*0.052,borderRadius:100000,}}/>
              :
              <img src={require("../resources/icon/user.png")} style={{height:this.props.windowHeight*0.052,width:this.props.windowHeight*0.052,borderRadius:100000,}}/>
              }
            </Badge>&nbsp;&nbsp;
            <span style={{color:this.props.theme.listfontcolor,fontSize:18}}>{sessionStorage.getItem("nickName")}</span>
            {/*通知按钮，先注释*/}
            <Popover 
              trigger="click"
              mouseLeaveDelay={0.1}
              title="通知"
              content={(
                <div>
                  <Table 
                    dataSource={this.props.systemMsgList} 
                    showHeader={false} 
                    onRow={(record) => ({
                        onClick: ()=>{
                          if(record.systemMsgType=="applyAddFriend"){
                            this.state.record = record;
                            this.showModal();
                          }
                          if(record.systemMsgType=="applyAddGroup"){
                            this.state.record = record;
                            this.showModal();
                          }
                        },
                        onDoubleClick: ()=>{},
                        onContextMenu: () => {},
                        onMouseEnter: () => {},
                        onMouseLeave: () => {},
                      })
                    }
                    pagination={false}
                  >
                      <Column
                        title="通知列表"
                        defaultSortOrder='descend'
                        render={(text, record) => (
                          this.switchSystemMsg(record)
                        )}
                      />
                  </Table>
                </div>
              )} 
            >
              {/*<Badge count={this.props.systemMsgList.length}>
                <Icon style={{color:this.props.theme.listfontcolor,fontSize:20,marginLeft:6,marginRight:6,marginTop:-6,cursor: "pointer",}} type="bell"/>
              </Badge>*/}
            </Popover>
            <Link to={{ pathname: '/login'}}>
              <Popconfirm placement="bottomRight" title="是否退出系统？" onConfirm={this.logout} okText="退出" cancelText="取消" arrowPointAtCenter={true} style={{backgroundColor:this.props.theme.infobgcolor}}>
                <Icon type='logout' style={{color:this.props.theme.listfontcolor,fontSize:20,marginLeft:6,marginRight:6}} />
              </Popconfirm>
            </Link>
          </div>
        </div>
        {/*群组申请信息modal*/}
          <Modal
            title="申请信息"
            visible={this.state.groupApplyVisible}
            onOk={this.hideModel}
            onCancel={this.cancelModel}
            okText="同意"
            cancelText="取消"
            width="300px"
          >
            <div>
              是否同意{this.state.record.nickName}的申请
            </div>
          </Modal>
          {/*好友申请modal*/}
          <Modal
            title="好友请求"
            visible={this.state.userApplyVisible}
            onOk={this.hideModel}
            onCancel={this.cancelModel}
            okText="接受"
            cancelText="取消"
            width="300px"
          >
            <div className="vertically-center" style={{whiteSpace: "nowrap"}}>
              {this.state.record.avatar!=""?
                <img src={this.state.record.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                :
                <img src={require("../resources/icon/user.png")} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
              }
              <b style={{fontSize:20}}>
                {this.state.record.nickName}
              </b>
            </div>
            <Layout style={{borderStyle:"solid  none none none ",borderColor:"#DBDBDB #FFFFFF #FFFFFF #FFFFFF  ",borderWidth:1,paddingTop:10,marginTop:10,backgroundColor:"#FFFFFF"}}>
              <p>账&nbsp;&nbsp;&nbsp;号&nbsp;&nbsp;&nbsp;<span>{this.state.record.userName}</span></p>
              <p>昵&nbsp;&nbsp;&nbsp;称&nbsp;&nbsp;&nbsp;<span>{this.state.record.nickName}</span></p>
              <p>性&nbsp;&nbsp;&nbsp;别&nbsp;&nbsp;&nbsp;<span>{this.state.record.sex=="F"?"女":"男"}</span></p>
              <p>联信号&nbsp;&nbsp;&nbsp;<span>{this.state.record.userId}</span></p>
              <p>电&nbsp;&nbsp;&nbsp;话&nbsp;&nbsp;&nbsp;<span>{this.state.record.mobilePhone}</span></p>
              <p>邮&nbsp;&nbsp;&nbsp;箱&nbsp;&nbsp;&nbsp;<span>{this.state.record.email}</span></p>
              <p>签&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;<span>{this.state.record.sign}</span></p>
            </Layout>
          </Modal>
      </div>
    )
  }
			    
}
Head.propTypes = {
    MainMenuClickAction:PropTypes.func.isRequired,
}
const mapStateToProps=(state,ownProps) =>{
  return {
    menukey: state.MainMenuClickReducer.menukey,
    systemMsgList: state.SystemMsgReducer.systemMsgList,
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    unreadcount: state.ChatListReducer.unreadcount,
  }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        MainMenuClickAction: (menukey) => {
            dispatch(MainMenuClickAction(menukey));//派发action，可添加多个参数
        },
        LoadContactListAction: (actiontype,list,result,count) => {
            dispatch(LoadContactListAction(actiontype,list,result,count));//派发action，可添加多个参数
        },
        DeleteSystemMsgAction:(userapply)=>{
            dispatch(DeleteSystemMsgAction(userapply))
        },
        LoadGroupUserListAction:(id,users)=>{
            dispatch(LoadGroupUserListAction(id,users));
        },
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Head); 