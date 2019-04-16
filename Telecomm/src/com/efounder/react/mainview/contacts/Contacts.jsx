/*联系人页面
author：xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Row,Col,Table,message,Checkbox} from 'antd';
import UserCard from "./UserCard.jsx"
import GroupCard from "./GroupCard.jsx"
import UserList from "./contactlist/UserList.jsx"
import GroupList from "./contactlist/GroupList.jsx"
import PublicList from "./contactlist/PublicList.jsx"
import request from "../../request/request.js"
import requestInfo from "../../request/requestInfo.js"
import MainMenuClickAction from "../../actions/MainMenuClickAction.js";
import AddChatAction from "../../actions/AddChatAction.js";
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Search = Input.Search;
const { Column } = Table;
class Contacts extends React.Component {
	constructor(props){
        super(props);
        this.state ={
            flag:false,
            username:"",
            selmenu:"friendlist",
            page:"",
            visible:false,
            createVisible:false,
            searchMenu:"friend",
            searchValue:"",
            searchUserList:[],
            searchGroupList:[],
            searchPublicList:[],
            userlist:[],
            checkedUserList:[]
        }
    }
    componentWillMount() {
    }
    //组件挂载完成后回调
    componentDidMount() {
      var userlisttemp = this.props.userlist;
      for (var i = userlisttemp.length - 1; i >= 0; i--) {
        if (userlisttemp[i].ZMNO==undefined) {
          userlisttemp[i].checked = false;
        }
      }
      this.setState({
        userlist:userlisttemp,
      })
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
    hideSearchModal = () => {
      this.setState({
        visible: false,
      });
    }
    cancelModal=()=>{
      this.setState({
        visible: false,
      });
    }
    //匹配不同的列表
    switchList(page) {
        switch (page){
            case 'friendlist':
              return  <UserList height={this.props.windowHeight*0.726}/>;
            case 'grouplist':
              return <GroupList height={this.props.windowHeight*0.726}/>;
            case 'publiclist':
              return <PublicList height={this.props.windowHeight*0.726}/>;
        }
    }
    //匹配列表所要展示的信息页
    //参数为：userlist：通过用户列表点击进来的
    switchPage(page){
      switch(page){
        case 'userlist':
          return <UserCard />;
        case 'grouplist':
          return <GroupCard />;
      }
    }
    
	  handleClick=(e)=> {
      if (e.key=="addFriend") {
        this.setState({
          visible: true,
        });
        return;
      }
      if(e.key=="creategroup"){
        this.setState({
          createVisible:true,
        })
        return;
      }
      this.setState({
        selmenu:e.key,
      });
 	  }
    searchMenuClick=(e)=>{
      this.setState({
        searchMenu:e.key,
      });
    }
    search=(e)=>{
      if(this.state.searchMenu=="friend"){
        var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&keyWord="+document.getElementById("searchvalue").value;
        request("MessageServerURL","POST","user/search",body,this.searchUserListBack.bind(this))
      }if(this.state.searchMenu=="group"){
        var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&keyWord="+document.getElementById("searchvalue").value;
        request("MessageServerURL","POST","group/search",body,this.searchGroupListBack.bind(this))
      }if(this.state.searchMenu=="public"){
        var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&keyWord="+document.getElementById("searchvalue").value;
        request("MessageServerURL","POST","public/search",body,this.searchPublicListBack.bind(this))
      }
    }
    searchGroupListBack(json){
      if(json.groups.length==0){
        message.warning('无查询结果');
        return;
      }
      this.setState({
        searchGroupList:json.groups
      })
    }
    searchUserListBack(json){
      if(json.users.length==0){
        message.warning('无查询结果');
        return;
      }
      this.setState({
        searchUserList:json.users
      })
    }
    searchPublicListBack(json){
      if(json.publics.length==0){
        message.warning('无查询结果');
        return;
      }
      this.setState({
        searchPublicList:json.publics,
      })
    }
    applyFriend=(record,event)=>{
      var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&friendUserId="+record.userId;
      request("MessageServerURL","POST","user/applyAddFriend",body,this.applyFriendBack)
    }
    applyFriendBack(json){
      if(json.result=="success"){
        message.success('请求已发送');
      }else{
        message.warning('添加请求发送失败');
      }
    }
    applyGroup=(record,event)=>{
      var body = "userId="+sessionStorage.getItem("imUserId")+"&passWord="+sessionStorage.getItem("imUserPassWord")+"&groupId="+record.groupId;
      request("MessageServerURL","POST","group/applyAddGroup",body,this.applyGroupBack)
    }
    applyGroupBack(json){
      if(json.result=="success"){
        message.success('请求已发送');
      }else{
        message.warning('申请发送失败');
      }
    }
    applyPublic=(record,event)=>{
    }
    hideCreateModal=()=>{
      this.setState({
        createVisible:false,
      })
    }
    createGroup=()=>{
      var checkedUserList = this.state.checkedUserList;
      var groupName = sessionStorage.getItem("nickName");
      for (var i=0;i<checkedUserList.length;i++) {
        if(i>1){
          break;
        }
        groupName = groupName +"、"+checkedUserList[i].nickName
      }
      var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord") + "&groupName="+groupName;
      requestInfo("group/createGroup", body).then(response => response.json()).then(data => {
        if (data.result!="success") {
          message.warning("部落创建失败")
        }else{
          message.success("部落创建成功")
          var groupId = data.group.groupId;
          var addUserId = "";
          for (var i=0;i<checkedUserList.length;i++) {
            if(i==0){
              addUserId = addUserId+checkedUserList[i].imUserId
            }else{
              addUserId = addUserId+";"+checkedUserList[i].imUserId
            }
          }
          var body2 = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")+"&groupId="+groupId+"&addUserId="+addUserId;
          requestInfo("group/addUserToGroup", body2).then(response => response.json()).then(data => {
            if(data.result=="success"){
              this.setState({
                checkedUserList:[],
              })
              this.props.MainMenuClickAction("message");
              var group={};
              group.id = groupId;
              group.name = groupName;
              group.avatar = "";
              group.type = "group";
              group.isfriend=true;
              group.time = new Date();
              this.props.AddChatAction(group);
            }else{
              message.warning("邀请好友失败")
            }
          })
        }
      })
      this.setState({
        createVisible:false,
      })
    }
    checkChange=(record,e)=>{
      var checkedUserList = this.state.checkedUserList;
      var userlist = this.state.userlist;
      if(e.target.checked){
        for (var i = userlist.length - 1; i >= 0; i--) {
          if(userlist[i].userId==record.userId){
            userlist[i].checked=true;
          }
        }
        checkedUserList.push(record);
      }else{
        for (var i = checkedUserList.length - 1; i >= 0; i--) {
          if(checkedUserList[i].userId==record.userId){
            checkedUserList.splice(i,1)
            break;
          }
        }
        for (var i = userlist.length - 1; i >= 0; i--) {
          if(userlist[i].userId==record.userId){
            userlist[i].checked=false;
          }
        }
      }
      this.setState({
        checkedUserList:checkedUserList,
      })
    }
    deleteCheckChange=(record,e)=>{
      var checkedUserList = this.state.checkedUserList;
      var userlist = this.state.userlist;
      for (var i = checkedUserList.length - 1; i >= 0; i--) {
        if(checkedUserList[i].userId==record.userId){
          checkedUserList.splice(i,1)
          break;
        }
      }
      for (var i = userlist.length - 1; i >= 0; i--) {
        if(userlist[i].userId==record.userId){
          userlist[i].checked=false;
        }
      }
      this.setState({
        checkedUserList:checkedUserList,
      })
    }
    render() {
        return (
			   <Layout>
         {/*<Button onClick={this.onClick}>Default</Button>*/}
			   	<Sider style={{ background: '#EBEBEB'}} width={this.props.windowWidth*0.2}>
			   		<Menu
      			  onClick={this.handleClick}
              defaultSelectedKeys={["friendlist"]}
      			  mode="horizontal"
              style={{background:this.props.theme.listbgcolor,width:"100%",color:"#6a82a5",borderBottom:"1px solid "+this.props.theme.linecolor}}
      			>
              <Menu.Item key="friendlist" style={{width:"40%",textAlign:"center"}}>好友</Menu.Item>
              <Menu.Item key="grouplist" style={{width:"40%",textAlign:"center"}}>群组</Menu.Item>
              {/*<Menu.Item key="publiclist">组织机构</Menu.Item>*/}
              <SubMenu  title={<Icon type="plus-circle-o" />} theme="light" style={{width:"20%",textAlign:"center"}}>
                  <Menu.Item key="creategroup" >创建部落</Menu.Item>
                  <Menu.Item key="addFriend" >添加朋友</Menu.Item>
              </SubMenu>
      			</Menu>
            <Content>
              <div style={{ height:this.props.windowHeight*0.726,backgroundColor:this.props.theme.listbgcolor,overflow:"auto"}}>
                {this.switchList(this.state.selmenu)}
              </div>
            </Content>
            {/*查找好友查找群组*/}
            <Modal
              title="查找"
              visible={this.state.visible}
              onOk={this.hideSearchModal}
              onCancel={this.hideSearchModal}
              okText="确定"
              cancelText="取消"
              width={this.props.windowWidth*0.4}
            >
              <Layout style={{backgroundColor:"#FFFFFF",width:"100%"}}>
                <div style={{width:"100%"}}>
                  <div className="vertically-horizontally-center" style={{width:"100%"}}>
                    <div>
                      <Menu
                        onClick={this.searchMenuClick}
                        defaultSelectedKeys={["friend"]}
                        mode="horizontal"
                      >
                        <Menu.Item key="friend">找人</Menu.Item>
                        <Menu.Item key="group">找部落</Menu.Item>
                        {/*<Menu.Item key="public">组织机构</Menu.Item>*/}
                      </Menu>
                    </div>
                  </div>
                  <div className="vertically-horizontally-center" style={{whiteSpace: "nowrap",width:"100%",height:this.props.windowHeight*0.1}}>
                    <Input id="searchvalue" style={{width:"80%",marginRight:10}} />
                    <Button onClick={this.search} style={{width:"18%",}}>查找</Button>
                  </div>
                  <div style={{marginTop:10,padding:10,overflow:"auto",height:200,borderStyle:"solid  solid solid solid ",borderColor:"#DBDBDB #DBDBDB #DBDBDB #DBDBDB  ",borderWidth:1}}>
                    {this.state.searchMenu=="friend"&&
                    <Table 
                        dataSource={this.state.searchUserList} 
                        
                        onRow={(record) => ({
                            onClick: ()=>{},
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
                            title="头像"
                            key="avatar"
                            render={(text, record) => (
                              <div>
                              {record.avatar!=""&&record.avatar!=undefined?
                              <img src={record.avatar} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                              :
                              <img src={require("../../resources/icon/user.png")} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                              }
                              </div>
                            )}
                          />
                          {/*<Column
                            title="账号"
                            key="userName"
                            dataIndex='userName'
                          />*/}
                          <Column
                            title="星际ID"
                            key="userId"
                            dataIndex='userId'
                          />
                          <Column
                            title="昵称"
                            key="nickName"
                            dataIndex='nickName'
                          />
                          <Column
                            title="操作"
                            key="action"
                            render={(text, record) => (
                                <Button onClick={this.applyFriend.bind(this,record)}>添加</Button>
                            )}
                          />
                      </Table>
                    }
                    {this.state.searchMenu=="group"&&
                      <Table 
                        dataSource={this.state.searchGroupList} 
                        onRow={(record) => ({
                            onClick: ()=>{},
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
                            title="头像"
                            key="avatar"
                            render={(text, record) => (
                              <div>
                              {record.avatar!=""&&record.avatar!=undefined?
                              <img src={record.avatar} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                              :
                              <img src={require("../../resources/icon/group.png")} style={{width:this.props.windowHeight*0.04,height:this.props.windowHeight*0.04,borderRadius:100000}}/>
                              }
                              </div>
                            )}
                          />
                          <Column
                            title="部落号"
                            key="groupId"
                            dataIndex='groupId'
                          />
                           <Column
                            title="名称"
                            key="groupName"
                            dataIndex='groupName'
                          />
                          <Column
                            title="操作"
                            key="action"
                            render={(text, record) => (
                                <Button onClick={this.applyGroup.bind(this,record)}>申请</Button>
                            )}
                          />
                      </Table>
                    }
                    {this.state.searchMenu=="public"&&
                      <Table 
                        dataSource={this.state.searchPublicList} 
                        onRow={(record) => ({
                            onClick: ()=>{},
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
                            title="账号"
                            key="userId"
                            dataIndex='userId'
                          />
                           <Column
                            title="名称"
                            key="userName"
                            dataIndex='userName'
                          />
                          <Column
                            title="操作"
                            key="action"
                            render={(text, record) => (
                                <Button onClick={this.applyPublic.bind(this,record)}>关注</Button>
                            )}
                          />
                      </Table>
                    }
                  </div>
                </div>
              </Layout>
            </Modal>
            <Modal
              title="创建部落"
              visible={this.state.createVisible}
              onOk={this.createGroup}
              onCancel={this.hideCreateModal}
              okText="确定"
              cancelText="取消"
              width={this.props.windowWidth*0.4}
            >
              <Row>
                <Col span={12}>
                  {/*<div>
                  <input placeholder="查找" style={{width:"100%",borderRadius:"4px",border:"1px solid #CDCDCD"}}/>
                  </div><br/>*/}
                  <div style={{width:"100%",height:this.props.windowHeight*0.45,overflow:"auto"}}>
                    <Table 
                      dataSource={this.state.userlist} 
                      showHeader={false} 
                      rowClassName = {
                        (record, index) => {
                            return "tableClass"
                        }
                      }
                      split={false}
                      pagination={false}
                      onRow={(record) => ({
                          onClick: ()=>{
                                          if(record.ZMNO==undefined){
                                            /*this.props.ContactsListClickAction(record,"userlist");*/
                                          }
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
                          key="userList"
                          render={(text, record) => (
                            <div>
                              {record.ZMNO==undefined?
                                <Row>
                                  <Col span={6}>
                                    {record.avatar!=""&&record.avatar!=undefined?
                                      <img src={record.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                                      :
                                      <img src={require("../../resources/icon/user.png")} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                                    }
                                  </Col>
                                  <Col span={14}>
                                    <span style={{color:this.props.theme.listfontcolor,fontSize:this.props.windowHeight*0.025}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
                                    <br/>
                                    <span style={{color:this.props.theme.listfontcolor,fontSize:this.props.windowHeight*0.018}}>{record.sign}</span>
                                  </Col>
                                  <Col span={4}>
                                    <Checkbox checked={record.checked} onChange={this.checkChange.bind(this,record)}></Checkbox>
                                  </Col>
                                </Row>
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
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{width:"100%",height:this.props.windowHeight*0.45,overflow:"auto"}}>
                    <Table 
                      dataSource={this.state.checkedUserList} 
                      showHeader={false} 
                      rowClassName = {
                        (record, index) => {
                            return "tableClass"
                        }
                      }
                      split={false}
                      pagination={false}
                      onRow={(record) => ({
                          onClick: ()=>{
                                          if(record.ZMNO==undefined){
                                            /*this.props.ContactsListClickAction(record,"userlist");*/
                                          }
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
                          key="userList"
                          render={(text, record) => (
                            <div>
                              {record.ZMNO==undefined?
                                <Row>
                                  <Col span={6}>
                                    {record.avatar!=""&&record.avatar!=undefined?
                                      <img src={record.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                                      :
                                      <img src={require("../../resources/icon/user.png")} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                                    }
                                  </Col>
                                  <Col span={14}>
                                    <span style={{color:this.props.theme.listfontcolor,fontSize:this.props.windowHeight*0.025}}>{record.note==undefined||record.note==""?record.nickName:record.note}</span>
                                    <br/>
                                    <span style={{color:this.props.theme.listfontcolor,fontSize:this.props.windowHeight*0.018}}>{record.sign}</span>
                                  </Col>
                                  <Col span={4}>
                                    <Icon type="close" style={{cursor: "pointer",color:this.props.theme.listfontcolor}} onClick={this.deleteCheckChange.bind(this,record)} />
                                  </Col>
                                </Row>
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
                  </div>
                </Col>
              </Row>
            </Modal>
			   	</Sider>
          <Content style={{backgroundColor:this.props.theme.infobgcolor,flex:1,justifyContent:'center',alignItems:'center',overflow:"auto"}} >
            <div style={{overflow:"auto",height:"100%"}}>{this.switchPage(this.props.listtype)}</div>
          </Content>
			   </Layout>
        );
    }
}
Contacts.propTypes = {
    /*LoadContactListAction:PropTypes.func.isRequired,*/
}
const mapStateToProps=(state)=> {
  return {
    theme: state.ThemeReducer.theme,
    listtype: state.ContactsListClickReducer.listtype,
    userlist: state.LoadContactListReducer.userlist,
    grouplist: state.LoadContactListReducer.grouplist,
    publiclist: state.LoadContactListReducer.publiclist,
    userlistresult: state.LoadContactListReducer.userlistresult,
    grouplistresult: state.LoadContactListReducer.grouplistresult,
    publiclistresult: state.LoadContactListReducer.publiclistresult,
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    userlist: state.LoadContactListReducer.userlist,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    AddChatAction: (group) => {
      dispatch(AddChatAction(group)); //派发action，可添加多个参数
    },
    MainMenuClickAction: (menukey) => {
      dispatch(MainMenuClickAction(menukey)); //派发action，可添加多个参数
    },
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts); 
