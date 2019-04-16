/*群组详情页(废弃不用)
*author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Card,Checkbox,Table,Row, Col,message} from 'antd';
import request from "../../../request/request.js";
import MainMenuClickAction from "../../../actions/MainMenuClickAction.js";
import LoadGroupUserListAction from "../../../actions/LoadGroupUserListAction.js";
import AddChatAction from "../../../actions/AddChatAction.js";
import '../../../style/TableList.css'
const { Header, Footer, Sider, Content } = Layout;
const { Meta } = Card;
const { Column } = Table;
var seluser;
class GroupPerList extends Component {
  constructor(props){
        super(props);
        this.state={
          seluser,
          visible:false,
          deleteVisible:false,
          pages:50,
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
    selectRow(record){
      this.setState({
        seluser:record,
      })
    }
    switchUserList(groupid,list,pages){
      var list =[];
      for(let value of this.props.groupuserlist){
        if(value.groupid==groupid){
          list = value.list
        }
      }
      return list.slice(0,pages);
    }
    //群主管理员加图标
    switchRecord(record){
      var headurl = require("../../../resources/icon/user.png");
      if(record.avatar!=null&&record.avatar!=undefined&&record.avatar!=""){
        headurl = record.avatar
      }
      if(record.mana==9){
        return(<div className="vertically-center">
                  <img style={{height:20,width:20}} src={require('../../../resources/icon/qz.png')}/>
                  <img src={headurl} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                  <span style={{color:this.props.theme.listfontcolor,paddingLeft:4}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
              </div>)
      }else if(record.mana==1){
        return(<div className="vertically-center">
                  <img style={{height:20,width:20}} src={require('../../../resources/icon/gly.png')}/>
                  <img src={headurl} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                  <span style={{color:this.props.theme.listfontcolor,paddingLeft:4}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
              </div>)
      }else if(record.mana==0){
        return(<div className="vertically-center">
                  <div style={{height:20,width:20}}></div>
                  <img src={headurl} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                  <span style={{color:this.props.theme.listfontcolor,paddingLeft:4}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
              </div>)
      }
    }
    //添加好友
    adduser=(e)=>{
      this.setState({
        visible: true,
      });
    }
    adduserOK = () => {
      this.setState({
        visible: false,
      });
      var userlist = this.props.userlist;
      var flag = false;
      if(this.state.seluser.userId==sessionStorage.getItem("imUserId")){
        message.warning('不能添加自己为好友');
        return;
      }
      for(let value of userlist){
        if(value.userId==this.state.seluser.userId){
          flag=true;
          break;
        }
      }
      if(flag){
        message.warning('该好友已存在');
      }else{
        var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&friendUserId="+this.state.seluser.userId;
        request("MessageServerURL","POST","user/applyAddFriend",body,this.addUserSuccessBack)
      }
    }
    addUserSuccessBack(json){
      if(json.result=="success"){
        message.success('好友请求已发送');
      }else{
        message.warning('好友请求发送失败');
      }
    }
    modelCancel=()=>{
      this.setState({
        visible: false,
        deleteVisible:false,
      });
    }
    openChat=(e)=>{
      
      if(this.state.seluser.userId==sessionStorage.getItem("imUserId")){
        Modal.warning({
            title: '提醒',
            content: '不能给自己发送消息',
            okText:'确认',
        });
        return;
      }
      this.props.MainMenuClickAction("message");
      var user={};
      user.id = this.state.seluser.userId;
      user.name = this.state.seluser.note==undefined||this.state.seluser.note==""?this.state.seluser.nickName:this.state.seluser.note;
      user.avatar = this.state.seluser.avatar;
      user.type = "user";
      var flag=false;
      var userlist=this.props.userlist;
      for (var value of userlist) {
        if(value.userId==this.state.seluser.userId){
          var flag=true;
        }
      }
      user.isfriend=flag;
      user.time = new Date();
      this.props.AddChatAction(user);
    }
    showDeleteGroupUser=(e)=>{
      this.setState({
        deleteVisible:true,
      })
    }
    deleteGroupUser=()=>{
      var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&groupId="+this.props.selgroup.groupId+"&deleteUserId="+this.state.seluser.userId;
      request("MessageServerURL","POST","group/deleteGroupUser",body,this.deleteGroupUserBack.bind(this))
    }
    deleteGroupUserBack(json){
      this.setState({
        deleteVisible:false,
      })
      if(json.result=="success"){
        message.success('移除成功');
        this.setState({
          seluser:undefined,
        })
      }else{
        message.warning('移除失败');
      }
    }
    //滚动条滚动触发事件
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
    render() {
        return (
              <Layout style={{backgroundColor:this.props.theme.infobgcolor,padding:10}}>
                <Row>
                  <Col span={12}>
                    <Content style={{height:this.props.windowHeight*0.58,overflow:"auto"}} onScroll={this.onScrollHandle.bind(this)}>
                      <Layout style={{backgroundColor:this.props.theme.infobgcolor}} ><span style={{color:this.props.theme.listfontcolor}}>群成员<Icon  type="edit" /><Icon  type="plus-circle-o" /></span></Layout>
                      <Table 
                      dataSource={this.switchUserList(this.props.selgroup.groupId,this.props.groupuserlist,this.state.pages)} 
                      size="small" 
                      onRow={(record) => ({
                          onClick: ()=>{
                            this.selectRow(record);
                            
                                        },
                          onDoubleClick: ()=>{
                            this.props.MainMenuClickAction("message");
                                            var user={};
                                            user.id = record.userId;
                                            user.name = record.note==undefined||record.note==""?record.nickName:record.note;
                                            user.avatar = record.avatar;
                                            user.type = "user";
                                            user.isfriend=false;
                                            this.props.AddChatAction(user);
                                            },
                          onContextMenu: () => {},
                          onMouseEnter: () => {},
                          onMouseLeave: () => {},
                        })
                      } 
                      pagination={false}>
                          <Column
                            title={<span style={{color:this.props.theme.listfontcolor}}>成员</span>}
                            key="1"
                            render={(text, record) => (
                              this.switchRecord(record)
                            )}
                          />
                          <Column
                            title={<span style={{color:this.props.theme.listfontcolor}}>群名片</span>}
                            key="2"
                            render={(text, record) => (
                              <div style={{color:this.props.theme.listfontcolor}}>
                              {record.note}</div>
                            )}
                          />
                          <Column
                            title={<span style={{color:this.props.theme.listfontcolor}}>最后发言时间</span>}
                            key="3"
                          />
                      </Table>
                    </Content>
                  </Col>
                  <Col span={12}>
                    {this.state.seluser!=undefined&&
                      <Row>
                        <Col span={8} offset={4}>
                        <Modal
                        title="添加好友"
                        visible={this.state.visible}
                        onOk={this.adduserOK}
                        onCancel={this.modelCancel}
                        okText="添加"
                        cancelText="取消"
                        width="300"
                      >
                        是否添加【{this.state.seluser.nickName}】为好友？
                      </Modal>
                      <div style={{height:this.props.windowHeight*0.5,width:this.props.windowWidth*0.18,backgroundColor:this.props.theme.listbgcolor,border:"none",borderRadius:5}}>
                        <div style={{position:"relative",backgroundColor:"#FFFFFF",height:this.props.windowHeight*0.25,width:this.props.windowWidth*0.18,borderRadius:"5px 5px 0px 0px"}}>
                          <img src={this.state.seluser.avatar==""?require("../../../resources/icon/user.png"):this.state.seluser.avatar} style={{height:this.props.windowHeight*0.25,width:this.props.windowWidth*0.18,borderRadius:"5px 5px 0px 0px"}}/>
                          <img src={require("../../../resources/icon/chatBtn_hover.png")} onClick={this.openChat.bind(this)} style={{zIndex:3,height:this.props.windowHeight*0.06,position:"absolute",bottom:-this.props.windowHeight*0.03,right:this.props.windowHeight*0.015,cursor: "pointer",}}/>
                        </div>
                        <div style={{width:this.props.windowWidth*0.18,color:this.props.theme.listfontcolor,}}>
                          <Row>
                            <Col span={24} style={{height:this.props.windowHeight*0.05,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.03,fontWeight:"blod"}}>
                                {this.state.seluser.nickName}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24} style={{height:this.props.windowHeight*0.04,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                                {this.state.seluser.sign}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={6} offset={5} style={{height:this.props.windowHeight*0.04,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                                昵称
                              </span>
                            </Col>
                            <Col span={12} style={{height:this.props.windowHeight*0.04,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                                {this.state.seluser.nickName}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={6} offset={5} style={{height:this.props.windowHeight*0.04,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                                星际ID
                              </span>
                            </Col>
                            <Col span={12} style={{height:this.props.windowHeight*0.04,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                                {this.state.seluser.userId}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={6} offset={5} style={{height:this.props.windowHeight*0.04,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                                基地坐标
                              </span>
                            </Col>
                            <Col span={12} style={{height:this.props.windowHeight*0.04,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:"center"}}>
                              <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                                
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </div>
                        <Modal
                        title="移除成员"
                        visible={this.state.deleteVisible}
                        onOk={this.deleteGroupUser}
                        onCancel={this.modelCancel}
                        okText="移除"
                        cancelText="取消"
                        width="300"
                      >
                        是否从【{this.props.selgroup.groupName}】群组中移除【{this.state.seluser.nickName}】
                      </Modal>
                        </Col>
                        </Row>}
                  </Col>
                </Row>
              </Layout>
        )
      }
    }

GroupPerList.propTypes = {
    //先注释
    //ContactsListClickAction:PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    selgroup: state.ContactsListClickReducer.selectRow,
    groupuserlist: state.LoadGroupUserListReducer.groupuserlist,
    userlist: state.LoadContactListReducer.userlist,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    MainMenuClickAction: (menukey) => {
      dispatch(MainMenuClickAction(menukey)); //派发action，可添加多个参数
    },
    AddChatAction: (user) => {
      dispatch(AddChatAction(user)); //派发action，可添加多个参数
    },
    LoadGroupUserListAction: (id, users) => {
      dispatch(LoadGroupUserListAction(id, users));
    },
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupPerList); 