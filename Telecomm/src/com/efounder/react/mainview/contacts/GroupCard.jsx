/*群组信息页面(目前在用)
 *author：xpf
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import request from "../../request/request.js";
import {Layout,Menu,Icon,List,Avatar,message,Row,Col,Modal,Switch} from 'antd';
import GroupDetails from "./groupinfo/GroupDetails.jsx";
import GroupPerList from "./groupinfo/GroupPerList.jsx";
import GroupCardMenuClickAction from "../../actions/GroupCardMenuClickAction.js";
import MainMenuClickAction from "../../actions/MainMenuClickAction.js";
import AddChatAction from "../../actions/AddChatAction.js";
import LoadContactListAction from "../../actions/LoadContactListAction.js";
import ContactsListClickAction from "../../actions/ContactsListClickAction.js";
import requestInfo from "../../request/requestInfo.js";

const {Header,Footer,Sider,Content} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const QRCode = require('qrcode.react');

class GroupCard extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible:false,
      qrcode:"",
    }
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
      if(data.result!="success"){
        //重新加载群组列表失败
      }else{
        var count =  data.groups.length;
        this.props.LoadContactListAction("GroupListLoad", data.groups, data.result,count);
      }
      
    })
  }
  //点击显示二维码
  QRClick=(e)=>{
    var qrcode = "{'type':'addGroup','userID':'"+this.props.selgroup.groupId+"'}";
    this.setState({
      visible:true,
      qrcode:qrcode,
    })
  }
  //点击二维码取消
  QRClickCancel(){
    this.setState({
      visible:false,
    })
  }
  //获取创建时间
  getCreateTime(createTime){
    if(createTime==undefined||createTime==""||createTime==null){
      var str = "未知年份"
      return str
    }
    var year = createTime.slice(0,4)
    var month = createTime.slice(4,6)
    var day = createTime.slice(6,8)
    var str = year+"年"+month+"月"+day+"日"
    return str
  }
  //获取管理员列表
  switchAdminList(groupid,alladminlist){
      var html=[];
      var list=[] ;
      if(alladminlist.length!=0){
        for(let value of alladminlist){
          if(value.groupid==groupid){
            list=value.list;
            break;
          }
        }
        for(let i=0;i<list.length;i++){
          if(i!=list.length-1){
            if(list[i].note!=undefined){
              html.push(<span>{list[i].note}、</span>)
            }else{
              html.push(<span>{list[i].nickName}、</span>)
            }
          }else{
            if(list[i].note!=undefined){
              html.push(<span>{list[i].note}</span>)
            }else{
              html.push(<span>{list[i].nickName}</span>)
            }
          }
        }
      }
      return html;
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
          <div style={{height:this.props.windowHeight*0.7,width:this.props.windowWidth*0.26,backgroundColor:this.props.theme.listbgcolor,border:"none",borderRadius:5}}>
            <div style={{position:"relative",backgroundColor:"#FFFFFF",height:this.props.windowHeight*0.15,width:"100%",borderRadius:"5px 5px 0px 0px"}}>
              <div style={{
                backgroundImage:`url(${require("../../resources/icon/groupHeader.png")})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height:this.props.windowHeight*0.15,
                width:"100%",
                borderRadius:"5px 5px 0px 0px",
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
                <table>
                  <tbody>
                  <tr>
                    <td rowSpan="2" style={{
                      width:this.props.windowWidth*0.06,
                      textAlign:"center"
                    }}>
                      <img src={this.props.selgroup.avatar==undefined?require("../../resources/icon/group.png"):this.props.selgroup.avatar} style={{width:this.props.windowHeight*0.08,height:this.props.windowHeight*0.08,borderRadius:100000}}/>
                    </td>
                    <td >
                      <div style={{width:this.props.windowWidth*0.18,textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",}}>
                      <span style={{fontSize:this.props.windowHeight*0.03,color:"#1E90FF",}}>{this.props.selgroup.groupName}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span style={{fontSize:this.props.windowHeight*0.02,color:"#808080"}}>
                        部落ID：{this.props.selgroup.groupId}
                      </span>&nbsp;&nbsp;&nbsp;&nbsp;
                      <img src={require("../../resources/icon/QRcode.png")} onClick={this.QRClick.bind(this)} style={{height:this.props.windowHeight*0.025,cursor:"pointer"}}/>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <img src={require("../../resources/icon/chatBtn_hover.png")} onClick={this.openChat.bind(this)} style={{zIndex:3,height:this.props.windowHeight*0.06,position:"absolute",bottom:-this.props.windowHeight*0.03,right:this.props.windowHeight*0.015,cursor: "pointer",}}/>
            </div>
            <div style={{width:"100%",display:"-moz-box",
                display:"-ms-flexbox",
                display:"-webkit-box",
                display:"-webkit-flex",
                display:"box",
                display:"flexbox",
                display:"flex",
                justifyContent:"center"}}>
              <div style={{width:"80%"}}>
                <div className="vertically-horizontally-center" style={{height:this.props.windowHeight*0.05}}>
                </div>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    部落名称
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    {this.props.selgroup.groupName}
                  </span>
                </div>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    英文名称
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    {this.props.selgroup.groupKey}
                  </span>
                </div>
                <hr style={{width:"100%",height:"1px",border:"none",borderTop:"1px solid #808080"}}/>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    创&nbsp;&nbsp;建&nbsp;&nbsp;者
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    {this.props.selgroup.createUserId}
                  </span>
                </div>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    创建时间
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    {this.getCreateTime(this.props.selgroup.createTime)}
                  </span>
                </div>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    部落介绍
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    暂无部落介绍
                  </span>
                </div>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    群主/管理员
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    {this.switchAdminList(this.props.selgroup.groupId,this.props.adminlist)}
                  </span>
                </div>
                <hr style={{width:"100%",height:"1px",border:"none",borderTop:"1px solid #808080"}}/>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    我在本部落的昵称
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    
                  </span>
                </div>
                <div className="vertically-center" style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",height:this.props.windowHeight*0.04}}>
                  <span style={{color:"#808080",fontSize:this.props.windowHeight*0.022}}>
                    自由加入
                  </span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.022}}>
                    <Switch size="small" checked={this.props.selgroup.groupType==1?true:false}  />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/*qrcode*/}
        <Modal
          visible={this.state.visible}
          onCancel={this.QRClickCancel.bind(this)}
          width={this.props.windowWidth*0.2}
          bodyStyle={{height:this.props.windowHeight*0.45,backgroundColor:"#183257",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center',justifyContent:'center',}}
          footer={null}
        >
          <div style={{width:"100%"}}>
          <div>
            <div style={{
                width:"100%",
                height:this.props.windowHeight*0.08,
                borderRadius:"5px 5px 0px 0px",
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
                <div style={{width:"100%",textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden",}}>
                  <img src={this.props.selgroup.avatar==undefined?require("../../resources/icon/group.png"):this.props.selgroup.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                  <span style={{fontSize:this.props.windowHeight*0.025,color:"#FFFFFF",}}>{this.props.selgroup.groupName}</span>
                </div>
              </div>
          </div>
          <div 
          className="vertically-horizontally-center"
          style={{backgroundColor:"#FFFFFF",
                width:this.props.windowHeight*0.26,
                height:this.props.windowHeight*0.26,
                position:"absolute",
                left:"50%",
                transform: "translate(-50%)", 
                MsTransform: "translate(-50%)", /* IE9及以上支持 */
                WebkitTransform: "translate(-50%)",    /* Safari and Chrome */
                OTransform: "translate(-50%)",    /* Opera */
                MozTransform: "translate(-50%)",   
            }}>
                <QRCode value={this.state.qrcode} size={this.props.windowHeight*0.22}/>
          </div>
          <div 
          className="vertically-horizontally-center"
          style={{
            height:this.props.windowHeight*0.32,
            width:"100%"
          }}>
            <span style={{fontSize:this.props.windowHeight*0.025,color:"#FFFFFF"}}>扫描二维码，加入星际部落</span>
          </div>
          </div>
        </Modal>
        {/*<Layout style={{paddingLeft:20,paddingRight:20,paddingTop:20,backgroundColor:this.props.theme.infobgcolor}}>
            <Layout style={{backgroundColor:this.props.theme.infobgcolor}}>
              <div>
                <Meta
                  avatar={this.props.selgroup.avatar==undefined?<Avatar size="large" src={require("../../resources/icon/group.png")}   />:<Avatar size="large" src={this.props.selgroup.avatar} />}
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
                  style={{backgroundColor:this.props.theme.infobgcolor}}
                >
                  <Menu.Item key="groupdetails">详情</Menu.Item>
                  <Menu.Item key="groupperlist">群成员</Menu.Item>
              </Menu>
            </Layout>
            <Content>
              <div>{this.switchPage(this.props.groupmenukey,"")}</div>
            </Content>
          </Layout>*/}
      </div>
      
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
    adminlist: state.LoadGroupUserListReducer.adminlist,
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