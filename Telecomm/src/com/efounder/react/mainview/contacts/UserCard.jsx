/*个人信息页面
*author：xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Card,Row,Col,message} from 'antd';
import MainMenuClickAction from "../../actions/MainMenuClickAction.js"
import AddChatAction from "../../actions/AddChatAction.js"
import UpdateUserListInfoAction from "../../actions/UpdateUserListInfoAction.js"
import request from "../../request/request.js";
import requestInfo from "../../request/requestInfo.js"
import tcrequest from "../../request/tcrequest.js";
import LoadContactListAction from "../../actions/LoadContactListAction.js";
import ContactsListClickAction from "../../actions/ContactsListClickAction.js";
import UserListSort from "../../util/UserListSort.js";
import copy from 'copy-to-clipboard';
const { Header, Footer, Sider, Content } = Layout;
const { Meta } = Card;

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      noteEdit:false,
      note:"",
    }
  }
  componentDidMount() {
  }
  openChat() {
    this.props.MainMenuClickAction("message");
    var user = {};
    user.id = this.props.seluser.userId;
    user.name = this.props.seluser.note==undefined||this.props.seluser.note==""?this.props.seluser.nickName:this.props.seluser.note;
    user.avatar = this.props.seluser.avatar;
    user.type = "user";
    user.isfriend = true;
    user.time = new Date();
    this.props.AddChatAction(user);
  }
  fomartETHAddress(ethAddress){
    var eth = "";
    if(ethAddress==undefined||ethAddress==null||ethAddress==""){
      return eth;
    }
    var ethlen = ethAddress.length;
    var beforstr = ethAddress.substring(0,6);
    var endstr = ethAddress.substring(ethlen-4,ethlen)
    eth = beforstr+"******"+endstr;
    return eth;
  }
  copyUserETHAddress = () => {
    copy(this.props.seluser.ethAddress);
    message.success('复制成功');
  };
  //
  noteEdit=(e)=>{
    this.setState({
      noteEdit:true,
      note:this.props.seluser.note,
    })
  }
  noteEditBlur=(e)=>{
    var note = e.target.value;
    this.setState({
      noteEdit:false,
      note:note,
    })
    var user = this.props.seluser;
    user.note = note;
    if(user.userId==""||user.userId==undefined){
      return;
    }
    //发送请求
    var body ="userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")+"&friendUserId="+user.imUserId+"&note="+note;
    requestInfo("user/updateFriend", body).then(response => response.json()).then(data => {
      if (data.result!="success") {
        message.warning("备注修改失败")
        return;
      }
    })
    //更新本地
    this.props.UpdateUserListInfoAction(user);
  }

  render() {
    return (
      <div style={{
        width:"100%",
        height:"100%",
        display:"-moz-box",
          display:"-ms-flexbox",
          display:"-webkit-box",
          display:"-webkit-flex",
          display:"box",
          display:"flexbox",
          display:"flex",
          alignItems:'center',
          justifyContent:"center"
      }}>
        <div>
          <div style={{height:this.props.windowHeight*0.7,width:this.props.windowWidth*0.22,backgroundColor:this.props.theme.listbgcolor,border:"none",borderRadius:5}}>
            <div style={{position:"relative",backgroundColor:"#FFFFFF",height:this.props.windowHeight*0.35,width:this.props.windowWidth*0.22,borderRadius:"5px 5px 0px 0px"}}>
              <img src={this.props.seluser.avatar==""?require("../../resources/icon/user.png"):this.props.seluser.avatar} style={{height:this.props.windowHeight*0.35,width:this.props.windowWidth*0.22,borderRadius:"5px 5px 0px 0px"}}/>
              <img src={require("../../resources/icon/chatBtn_hover.png")} onClick={this.openChat.bind(this)} style={{zIndex:3,height:this.props.windowHeight*0.06,position:"absolute",bottom:-this.props.windowHeight*0.03,right:this.props.windowHeight*0.015,cursor: "pointer",}}/>
            </div>
            <div style={{width:this.props.windowWidth*0.22,color:this.props.theme.listfontcolor,}}>
              <Row>
                <Col span={24} className="vertically-flex-end-horizontally-center" style={{height:this.props.windowHeight*0.05}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.03,fontWeight:"blod"}}>
                    {this.props.seluser.nickName}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="vertically-flex-end-horizontally-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    {this.props.seluser.sign}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={6} offset={5} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    昵称
                  </span>
                </Col>
                <Col span={12} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    {this.props.seluser.nickName}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={6} offset={5} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    备注
                  </span>
                </Col>
                {this.state.noteEdit?
                <Col span={12} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    <input defaultValue={this.state.note} onBlur={this.noteEditBlur.bind(this)} autoFocus="autofocus" style={{outline:"none",borderStyle:" none  none solid none  ",borderColor:"#FFFFFF #FFFFFF "+this.props.theme.fontcolor+" #FFFFFF  ",borderWidth:1,backgroundColor:"transparent"}}/>
                  </span>
                </Col>
                :
                <Col span={12} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    {this.props.seluser.note}&nbsp;&nbsp;
                  </span>
                  <img src={require("../../resources/icon/noteEdit.png")} style={{height:this.props.windowHeight*0.025}} onClick={this.noteEdit.bind(this)}/>
                </Col>
                }
              </Row>
              <Row>
                <Col span={6} offset={5} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    星际ID
                  </span>
                </Col>
                <Col span={12} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    {this.props.seluser.imUserId}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={6} offset={5} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    基地ID
                  </span>
                </Col>
                <Col span={12} className="vertically-center" style={{height:this.props.windowHeight*0.04}}>
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02}}>
                    <span onClick={this.copyUserETHAddress} style={{cursor: "pointer"}}>{this.fomartETHAddress(this.props.seluser.ethAddress)}&nbsp;&nbsp;<Icon type="copy" /></span>
                  </span>
                </Col>
              </Row>
            </div>
          </div>
          {/*<br/>
          <Modal
                    title="好友请求"
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.cancelModal}
                    okText="删除"
                    cancelText="取消"
                    width="300px"
                  >
                    <p>确定删除{this.props.seluser.nickName}？</p>
                  </Modal>
          <Card
              style={{ width: 300,backgroundColor:this.props.theme.listbgcolor,border:"none",}}
              actions={[
                <span style={{color:this.props.theme.listfontcolor}}><Icon type="delete" onClick={this.showModal.bind(this)}/></span>, 
                <span style={{color:this.props.theme.listfontcolor}}><Icon type="export" /></span>, 
                <span style={{color:this.props.theme.listfontcolor}}><Icon type="message" onClick={this.openChat.bind(this)}/></span>]}
            >
              <Meta
                avatar=
                  {this.props.seluser.avatar!=""?
                  <Avatar size="small" src={this.props.seluser.avatar} />
                  :
                  <Avatar size="small" icon="user" />
                  }
                
                title={<span style={{color:this.props.theme.listfontcolor}}>{this.props.seluser.nickName}</span>}
                style={{height:25}}
              />
              <Layout style={{color:this.props.theme.listfontcolor,borderStyle:"solid  none none none ",borderColor:this.props.theme.linecolor+" #FFFFFF #FFFFFF #FFFFFF  ",borderWidth:1,paddingTop:10,marginTop:10,backgroundColor:this.props.theme.listbgcolor}}>
                <p>账&nbsp;&nbsp;&nbsp;号&nbsp;&nbsp;&nbsp;<span>{this.props.seluser.userName}</span></p>
                <p>昵&nbsp;&nbsp;&nbsp;称&nbsp;&nbsp;&nbsp;<span>{this.props.seluser.nickName}</span></p>
                <p>备&nbsp;&nbsp;&nbsp;注&nbsp;&nbsp;&nbsp;<span></span></p>
                <p>联信号&nbsp;&nbsp;&nbsp;<span>{this.props.seluser.userId}</span></p>
                <p>电&nbsp;&nbsp;&nbsp;话&nbsp;&nbsp;&nbsp;<span>{this.props.seluser.mobilePhone}</span></p>
                <p>邮&nbsp;&nbsp;&nbsp;箱&nbsp;&nbsp;&nbsp;<span>{this.props.seluser.email}</span></p>
                <p>签&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;<span>{this.props.seluser.sign}</span></p>
              </Layout>
          </Card>*/}
        </div>
      </div>
    )
  }
}


UserCard.propTypes = {
    MainMenuClickAction:PropTypes.func.isRequired,
    AddChatAction:PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    menukey: state.MainMenuClickReducer.menukey,
    seluser: state.ContactsListClickReducer.selectRow,
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
    LoadContactListAction: (actiontype, list, result, count) => {
      dispatch(LoadContactListAction(actiontype, list, result, count)); //派发action，可添加多个参数
    },
    ContactsListClickAction: (user, listtype) => { //页面加载时，派发Action用于加载表单中组件的默认值
      dispatch(ContactsListClickAction(user, listtype));
    },
    UpdateUserListInfoAction: (user) => {
      dispatch(UpdateUserListInfoAction(user));
    }
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserCard); 