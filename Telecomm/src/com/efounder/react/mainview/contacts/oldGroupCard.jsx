/*群组信息页面
 *author：xpf
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import request from "../../request/request.js";
import {Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Card,message} from 'antd';
import GroupDetails from "./groupinfo/GroupDetails.jsx";
import GroupPerList from "./groupinfo/GroupPerList.jsx";
import GroupCardMenuClickAction from "../../actions/GroupCardMenuClickAction.js";
import MainMenuClickAction from "../../actions/MainMenuClickAction.js";
import AddChatAction from "../../actions/AddChatAction.js";
import LoadContactListAction from "../../actions/LoadContactListAction.js";
import ContactsListClickAction from "../../actions/ContactsListClickAction.js";
import requestInfo from "../../request/requestInfo.js";

const {Header,Footer,Sider,Content} = Layout;
const {Meta} = Card;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class GroupCard extends Component {
  constructor(props) {
    super(props);
  }
  handleClick = (e) => {
    this.props.GroupCardMenuClickAction(e.key);
  }
  componentWillMount() {

  }
  componentDidUpdate() {

  }
  componentDidMount() {

  }
  //匹配页面
  switchPage(viewArr, data) {
    switch (viewArr) {
      case 'groupdetails':
        return <GroupDetails object={data}/>;
      case 'groupperlist':
        return <GroupPerList object={data}/>;
    }
  }
  openChat() {
    this.props.MainMenuClickAction("message");
    var group = {};
    group.id = this.props.selgroup.groupId;
    group.name = this.props.selgroup.groupName;
    group.avatar = this.props.selgroup.avatar;
    group.type = "group";
    group.isfriend = true;
    group.time = new Date();
    this.props.AddChatAction(group);
  }
  userQuitGroup = (e) => {
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + this.props.selgroup.groupId;
    requestInfo("group/userQuitGroup", body).then(response => response.json()).then(data => {
      if (data.result == "success") {
        message.success("您已成功退出群组" + this.props.selgroup.groupName, 5)
        this.groupListLoad();
        this.props.ContactsListClickAction(null, null);
      }else if(data.result=="fail"){
        message.error(data.msg,5);
      }
    })
  }
  groupListLoad() {
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")
    requestInfo("group/getGroupListByUserId", body).then(response => response.json()).then(data => {
      var count =  data.groups.length;
      this.props.LoadContactListAction("GroupListLoad", data.groups, data.result,count);
    })
  }
  render() {
    return (
      <Layout style={{paddingLeft:20,paddingRight:20,paddingTop:20,backgroundColor:"transparent"}}>
            <Layout style={{backgroundColor:"transparent"}}>
              <div>
                <Meta
                  avatar={this.props.selgroup.avatar==undefined?<Avatar size="large" icon="team"   />:<Avatar size="large" src={this.props.selgroup.avatar} />}
                  title={<span style={{color:this.props.theme.listfontcolor}}>{this.props.selgroup.groupName}</span>}
                  description={<span style={{color:this.props.theme.listfontcolor}}>{this.props.selgroup.groupId}</span>}
                  style={{float:"left"}}
                />
                <div style={{float:"right",padding:5}}>
                  <Icon style={{fontSize:24,cursor: "pointer",paddingRight:15,color:this.props.theme.listfontcolor}} onClick={this.userQuitGroup} type="delete"/>
                  <Icon style={{fontSize:24,cursor: "pointer",paddingRight:15,color:this.props.theme.listfontcolor}} type="edit" />
                  <Icon style={{fontSize:24,cursor: "pointer",paddingRight:15,color:this.props.theme.listfontcolor}} type="export" />
                  <Icon style={{fontSize:24,cursor: "pointer",paddingRight:15,color:this.props.theme.listfontcolor}} onClick={this.openChat.bind(this)} type="message" />
                </div>
              </div>
              <Menu
                  onClick={this.handleClick}
                  defaultSelectedKeys={[this.props.groupmenukey]}
                  selectedKeys={[this.props.groupmenukey]}
                  mode="horizontal"
                  style={{backgroundColor:"transparent"}}
                >
                  <Menu.Item key="groupdetails">详情</Menu.Item>
                  <Menu.Item key="groupperlist">群成员</Menu.Item>
{/*                  <Menu.Item key="groupnotice">群公告</Menu.Item>
                  <Menu.Item key="groupfile">群文件</Menu.Item>
                  <Menu.Item key="groupimgs">群相册</Menu.Item>
                  <Menu.Item key="grouptopic">群话题</Menu.Item>*/}
              </Menu>
            </Layout>
            <Content>
              <div>{this.switchPage(this.props.groupmenukey,"")}</div>
            </Content>
          </Layout>
    )
  }
}
GroupCard.propTypes = {
  LoadGroupUserListAction: PropTypes.func.isRequired,
  MainMenuClickAction: PropTypes.func.isRequired,
  AddChatAction: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    selgroup: state.ContactsListClickReducer.selectRow,
    groupuserlist: state.LoadGroupUserListReducer.groupuserlist,
    groupmenukey: state.MainMenuClickReducer.groupmenukey,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    LoadGroupUserListAction: (groupid, list) => {
      dispatch(LoadGroupUserListAction(groupid, list)); //派发action，可添加多个参数
    },
    GroupCardMenuClickAction: (menukey) => {
      dispatch(GroupCardMenuClickAction(menukey)); //派发action，可添加多个参数
    },
    MainMenuClickAction: (menukey) => {
      dispatch(MainMenuClickAction(menukey)); //派发action，可添加多个参数
    },
    AddChatAction: (user) => {
      dispatch(AddChatAction(user)); //派发action，可添加多个参数
    },
    LoadContactListAction: (actiontype, list, result,count) => {
      dispatch(LoadContactListAction(actiontype, list, result,count));
    },
    ContactsListClickAction: (seletrow, listtype) => { //页面加载时，派发Action用于加载表单中组件的默认值
      dispatch(ContactsListClickAction(seletrow, listtype));
    },
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupCard);