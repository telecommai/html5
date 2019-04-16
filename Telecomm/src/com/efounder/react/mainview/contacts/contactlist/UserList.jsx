/*好友列表
author：xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Input,Button,Table,Row,Col,Spin,Dropdown,Modal} from 'antd';
import UserCard from '../UserCard.jsx'
import ContactsListClickAction from "../../../actions/ContactsListClickAction.js"
import AddChatAction from "../../../actions/AddChatAction.js"
import MainMenuClickAction from "../../../actions/MainMenuClickAction.js"
import LoadContactListAction from "../../../actions/LoadContactListAction.js"
import '../../../style/TableList.css'
const { Header, Footer, Sider, Content } = Layout;
const { Column } = Table;

class UserList extends React.Component {
  constructor(props){
        super(props);
        this.state ={
          username:"",
          visible:false,
          deluser:null,
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
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  cancelModal = () => {
    this.setState({
      visible: false,
    });
  }
  hideModal = () => {
    var deluser = Object.assign({},this.props.seluser)
    this.setState({
      visible: false,
      deluser:deluser,
    });
    //删除前要调用一下添加好友接口才能删除，不知道是什么问题
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&friendUserId=" + this.props.seluser.userId;
    request("MessageServerURL", "POST", "user/addFriend", body, this.addFriendback.bind(this));
  }
  addFriendback(json) {
    var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&friendUserId=" + this.props.seluser.userId;
    request("MessageServerURL", "POST", "user/deleteFriend", body, this.deleteFriendback.bind(this))
  }
  deleteFriendback(json) {
    if (json.result == "success") {
      message.success('删除成功');
      this.props.ContactsListClickAction([], "");
      var userlist = this.props.userlist;
      var deluser = this.state.seluser;
      for (var i = userlist.length - 1; i >= 0; i--) {
        if(userlist[i].imUserId == deluser.imUserId){
          userlist.splice(i,1)
          break;
        }
      }
      var count = 0;
      for (var i = userlist.length - 1; i >= 0; i--) {
        if(userlist[i].ZMNO==undefined){
          count++;
        }
      }
      this.props.LoadContactListAction("UserListLoad", userlist, "success",count);
    } else {
      message.warning('删除失败');
    }
  }
  render() {
    const menu =(
      <div>
        <div className="vertically-horizontally-center" onClick={this.showModal} style={{cursor:"pointer",height:this.props.windowHeight*0.03,width:this.props.windowHeight*0.1,backgroundColor:"#72A4D6"}}>
          <span style={{color:"#FFFFFF",fontSize:this.props.windowHeight*0.018}}>
            删除好友
          </span>
        </div>
      </div>
    )
    return (
      <Layout style={{backgroundColor:"#FFFFFF"}}>
        {/*<Layout style={{backgroundColor:"#FFFFFF"}}><span>好友{this.props.userlistnumber}</span></Layout>*/}
        <Content style={{backgroundColor:this.props.theme.listbgcolor}}>
          <Spin tip="加载好友列表..." spinning={this.props.userlistresult!="success"}>
          <Table 
            dataSource={this.props.userlist} 
            showHeader={false}
            split={false}
            pagination={false}
            onRow={(record) => ({
                onClick: ()=>{
                                if(record.ZMNO==undefined){
                                  this.props.ContactsListClickAction(record,"userlist");
                                }
                              },
                onDoubleClick: ()=>{
                                    if(record.ZMNO==undefined){
                                      this.props.MainMenuClickAction("message");
                                      this.props.ContactsListClickAction(record,"userlist");
                                      var user={};
                                      user.id = record.imUserId;
                                      user.name = record.note==undefined||record.note==""?record.nickName:record.note;
                                      user.avatar = record.avatar;
                                      user.type = "user";
                                      user.isfriend=true;
                                      user.time = new Date();
                                      this.props.AddChatAction(user);
                                    }
                                  },
                onContextMenu: () => {if(record.ZMNO==undefined){
                                        this.props.ContactsListClickAction(record,"userlist");
                                      }
                                      },
                onMouseEnter: () => {},
                onMouseLeave: () => {},
              })
            }
            rowClassName={(record,index)=>{
              if(this.props.seluser==undefined||this.props.seluser.length==0){
                return null;
              }
              if(this.props.listtype!="userlist"){
                return null;
              }
              if(record.imUserId==this.props.seluser.imUserId){
                return "chatTableList"
              }
            }}
            pagination={false}
          >
              <Column
                title="好友列表"
                defaultSortOrder='descend'
                key="userList"
                render={(text, record) => (
                  <div>
                    {record.ZMNO==undefined?
                      <Dropdown overlay={menu} trigger={['contextMenu']}>
                      <Row>
                        <Col span={6}>
                          {record.avatar!=""&&record.avatar!=undefined?
                            <img src={record.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                            :
                            <img src={require("../../../resources/icon/user.png")} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                          }
                        </Col>
                        <Col span={18}>
                          <span style={{color:this.props.theme.listfontcolor,fontSize:this.props.windowHeight*0.025}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
                          <br/>
                          <span style={{color:this.props.theme.listfontcolor,fontSize:this.props.windowHeight*0.018}}>{record.sign}</span>
                        </Col>
                      </Row>
                      </Dropdown>
                      :
                      <Row>
                        <Col span={24}>
                          <span style={{color:this.props.theme.listfontcolor}}>{record.ZMNO}</span>
                        </Col>
                      </Row>
                    }
                  </div>
                )}
              />
          </Table>
          </Spin>
        </Content>
        <Modal
            title="删除好友"
            visible={this.state.visible}
            onOk={this.hideModal}
            onCancel={this.cancelModal}
            okText="删除"
            cancelText="取消"
            width="300px"
          >
            <span style={{fontSize:this.props.windowHeight*0.025}}>确定要删除{this.props.seluser==null?"":this.props.seluser.note==undefined||this.props.seluser.note==""?this.props.seluser.nickName:this.props.seluser.note}吗？</span>
          </Modal>
      </Layout>
    )
  }
}

UserList.propTypes = {
    ContactsListClickAction:PropTypes.func.isRequired,
    AddChatAction:PropTypes.func.isRequired,
    MainMenuClickAction:PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    seluser: state.ContactsListClickReducer.selectRow,
    userlist: state.LoadContactListReducer.userlist,
    userlistresult: state.LoadContactListReducer.userlistresult,
    menukey: state.MainMenuClickReducer.menukey,
    seluser: state.ContactsListClickReducer.selectRow,
    listtype: state.ContactsListClickReducer.listtype,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    ContactsListClickAction: (user, listtype) => { //页面加载时，派发Action用于加载表单中组件的默认值
      dispatch(ContactsListClickAction(user, listtype));
    },
    AddChatAction: (user) => {
      dispatch(AddChatAction(user)); //派发action，可添加多个参数
    },
    MainMenuClickAction: (menukey) => {
      dispatch(MainMenuClickAction(menukey)); //派发action，可添加多个参数
    },
    LoadContactListAction: (actiontype, list, result, count) => {
      dispatch(LoadContactListAction(actiontype, list, result, count)); //派发action，可添加多个参数
    },
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList); 