/*用户群组列表
author：xpf
*/
import React, {Component} from 'react';
import {Form,Layout,Table,Row,Col,Spin,Dropdown,message,Modal} from 'antd';
import request from "../../../request/request.js"
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import ContactsListClickAction from "../../../actions/ContactsListClickAction.js";
import LoadGroupUserListAction from "../../../actions/LoadGroupUserListAction.js";
import GroupCardMenuClickAction from "../../../actions/GroupCardMenuClickAction.js";
import MainMenuClickAction from "../../../actions/MainMenuClickAction.js";
import AddChatAction from "../../../actions/AddChatAction.js";
import DeleteGroupAction from "../../../actions/DeleteGroupAction.js";
import requestInfo from "../../../request/requestInfo.js";
import '../../../style/TableList.css';

const {Header,Footer,Sider,Content} = Layout;
const {Column} = Table;
class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      groupId: "",
      groupuserlist: [],
      record: null,
      dissolveModal:false,
      quitModal:false,
    })
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
  groupUserListLoad(groupId) {
    this.props.GroupCardMenuClickAction("groupdetails");
    for (var value of this.props.groupuserlist) {
      if (value.groupid == groupId) {
        this.props.ContactsListClickAction(this.state.record, "grouplist");
        return;
      }
    }
    this.state.groupId = groupId;
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupId=" + groupId;
    request("MessageServerURL", "POST", "group/getUserListByGroupId", body, this.groupUserListLoadBack)
  }
  groupUserListLoadBack = (json) => {
    this.props.LoadGroupUserListAction(this.state.groupId, json.users)
    this.props.ContactsListClickAction(this.state.record, "grouplist");
  }
  getContextMenu(selgroup,userself,listtype){
    if(listtype=="userlist"||listtype==null||listtype==undefined){
      return;
    }
    var groupId = selgroup.groupId;
    var flag = false;
    for (var i = userself.length - 1; i >= 0; i--) {
        if(userself[i].groupid==groupId){
          if(userself[i].user.mana==9){
            flag = true;
          }
          break;
        }
    }
    if(flag){
      return(
        <div className="vertically-horizontally-center" onClick={this.openDissolveGroup} style={{cursor:"pointer",height:this.props.windowHeight*0.03,width:this.props.windowHeight*0.1,backgroundColor:"#72A4D6"}}>
          <span style={{color:"#FFFFFF",fontSize:this.props.windowHeight*0.018}}>
            解散部落
          </span>
        </div>
      )
    }else{
      return(
        <div className="vertically-horizontally-center" onClick={this.openQuitModal} style={{cursor:"pointer",height:this.props.windowHeight*0.03,width:this.props.windowHeight*0.1,backgroundColor:"#72A4D6",}}>
          <span style={{color:"#FFFFFF",fontSize:this.props.windowHeight*0.018}}>
            离开部落
          </span>
        </div>
      )
    }
  }
  openDissolveGroup=(e)=>{
    this.setState({
      dissolveModal:true,
    })
  }
  openQuitModal=(e)=>{
    this.setState({
      quitModal:true,
    })
  }
  //解散群组/IMServer/group/dissolveGroup?userId=%@&passWord=%@&groupId=%@
  dissolveGroup=(e)=>{
    var groupId = this.props.selgroup.groupId;
    /*console.log("测试解散")*/
    this.setState({
      dissolveModal:false
    })
    /*return;*/
    if(groupId==""||groupId==undefined||groupId==null){
      return;
    }
    var body ="userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")+"&groupId="+groupId;
    requestInfo("group/dissolveGroup", body).then(response => response.json()).then(data => {
      if (data.result!="success") {
        message.warning("群组解散失败")
        return;
      }else{
        message.success("群组已解散")
        this.props.DeleteGroupAction(groupId);
        this.props.ContactsListClickAction(null,null)
      }
    })
  }
  //group/userQuitGroup?userId=%@&passWord=%@&groupId=%@
  userQuitGroup=(e)=>{
    var groupId = this.props.selgroup.groupId;
    /*console.log("测试退出")*/
    this.setState({
      quitModal:false
    })
    /*return;*/
    if(groupId==""||groupId==undefined||groupId==null){
      return;
    }
    var body ="userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")+"&groupId="+groupId;
    requestInfo("group/userQuitGroup", body).then(response => response.json()).then(data => {
      if (data.result!="success") {
        message.warning("退出群组失败")
        return;
      }else{
        message.success("已退出群组")
        this.props.DeleteGroupAction(groupId);
        this.props.ContactsListClickAction(null,null)
      }
    })
  }
  cancelModal(){
    this.setState({
      dissolveModal:false,
      quitModal:false,
    })
  }
  render() {
    const menu =(<div>{
      this.getContextMenu(this.props.selgroup,this.props.userself,this.props.listtype)
    }</div>)
    return (
      <Layout style={{backgroundColor:"#FFFFFF"}}>
        {/*<Layout style={{backgroundColor:"#FFFFFF"}}><span>群组{this.props.grouplist.length}</span></Layout>*/}
        <Content style={{backgroundColor:this.props.theme.listbgcolor}}>
          <Spin tip="加载群组列表..."  spinning={this.props.grouplistresult!="success"}>
            <Table 
              dataSource={this.props.grouplist}
              split={false}
              pagination={false}
              onRow={(record) => ({
                onClick: ()=>{
                              this.state.record = record;
                              this.groupUserListLoad(record.groupId);
                              },
                onDoubleClick: ()=>{
                                      this.props.MainMenuClickAction("message");
                                      /*this.groupUserListLoad(record.groupId);*/
                                      var group={};
                                      group.id = record.groupId;
                                      group.name = record.groupName;
                                      group.avatar = record.avatar;
                                      group.type = "group";
                                      group.isfriend=true;
                                      group.time = new Date();
                                      this.props.AddChatAction(group);
                                  },
                onContextMenu: () => {
                                        this.state.record = record;
                                        this.groupUserListLoad(record.groupId);
                                      },
                onMouseEnter: () => {},
                onMouseLeave: () => {},
              })
            }
            rowClassName={(record,index)=>{
              if(this.props.selgroup==undefined||this.props.selgroup.length==0){
                return null;
              }
              if(this.props.listtype!="grouplist"){
                return null;
              }
              if(record.groupId==this.props.selgroup.groupId){
                return "chatTableList"
              }
            }}
            showHeader={false} 
            pagination={false}>
              <Column
                title="群组列表"
                key="groupList"
                render={(text, record) => (
                  <div>
                    <Dropdown overlay={menu} trigger={['contextMenu']}>
                      <Row>
                        <Col span={6}>
                        {("avatar" in record)?
                          <img src={record.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                          :
                          <img src={require("../../../resources/icon/group.png")} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                        }
                        </Col>
                        <Col span={18}>
                          <span style={{color:this.props.theme.listfontcolor,fontSize:this.props.windowHeight*0.025}}>{record.groupName}</span>
                        </Col>
                      </Row>
                    </Dropdown>
                  </div>
                )}
              />
            </Table>
          </Spin>
        </Content>
        <Modal
            title="退出群组"
            visible={this.state.quitModal}
            onOk={this.userQuitGroup.bind(this)}
            onCancel={this.cancelModal.bind(this)}
            okText="退出"
            cancelText="取消"
            width="300px"
          >
            <span style={{fontSize:this.props.windowHeight*0.025}}>确定要退出{this.props.selgroup==null?"":this.props.selgroup.groupName}吗？</span>
        </Modal>
        <Modal
            title="解散群组"
            visible={this.state.dissolveModal}
            onOk={this.dissolveGroup.bind(this)}
            onCancel={this.cancelModal.bind(this)}
            okText="解散"
            cancelText="取消"
            width="300px"
          >
            <span style={{fontSize:this.props.windowHeight*0.025}}>确定要解散{this.props.selgroup==null?"":this.props.selgroup.groupName}吗？</span>
        </Modal>
      </Layout>
    )
  }
}
GroupList.propTypes = {
  //先注释
  //ContactsListClickAction:PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    grouplist: state.LoadContactListReducer.grouplist,
    grouplistresult: state.LoadContactListReducer.grouplistresult,
    selgroup: state.ContactsListClickReducer.selectRow,
    listtype:state.ContactsListClickReducer.listtype,
    groupuserlist: state.LoadGroupUserListReducer.groupuserlist,
    userself:state.LoadGroupUserListReducer.userself
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    //稍后添加群组点击事件或者使用下面这个点击action
    ContactsListClickAction: (user, listtype) => { //页面加载时，派发Action用于加载表单中组件的默认值
      dispatch(ContactsListClickAction(user, listtype));
    },
    LoadGroupUserListAction: (groupid, list) => {
      dispatch(LoadGroupUserListAction(groupid, list)); //派发action，可添加多个参数
    },
    GroupCardMenuClickAction: (menukey) => {
      dispatch(GroupCardMenuClickAction(menukey)); //派发action，可添加多个参数
    },
    AddChatAction: (group) => {
      dispatch(AddChatAction(group)); //派发action，可添加多个参数
    },
    MainMenuClickAction: (menukey) => {
      dispatch(MainMenuClickAction(menukey)); //派发action，可添加多个参数
    },
    DeleteGroupAction:(groupId)=>{
      dispatch(DeleteGroupAction(groupId));
    },
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupList);