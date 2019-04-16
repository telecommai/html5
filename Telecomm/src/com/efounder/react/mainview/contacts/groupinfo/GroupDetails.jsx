/*群组详情页(废弃不用)
*author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Card,Checkbox} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const { Meta } = Card;
const data ={}
class GroupDetails extends Component {
  constructor(props){
        super(props);
        this.state ={
          data:data,
        }
    }
    zdonChange=(e)=> {
    }
    pbonChange=(e)=> {
    }
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
          if(i==0){
            html.push(<Avatar key={list[i].avatar} size="small" src={list[i].avatar==""||list[i].avatar==undefined?require("../../../resources/icon/user.png"):list[i].avatar} />)
          }
          if(i==1){ 
            html.push(<span>|</span>);
            html.push(<Avatar key={list[i].avatar} size="small" src={list[i].avatar==""||list[i].avatar==undefined?require("../../../resources/icon/user.png"):list[i].avatar} />)
          }
          if(i>1){
            html.push(<Avatar key={list[i].avatar} size="small" src={list[i].avatar==""||list[i].avatar==undefined?require("../../../resources/icon/user.png"):list[i].avatar} />)
          }
        }
      }
      return html;
    }
    switchMeList(groupid,melist){
      var html=[];
      var list=[] ;
      if(melist.length!=0){
        for(let value of melist){
          if(value.groupid==groupid){
            list=value.list;
            break;
          }
        }
      }
      html.push(<span>{list[0].note}</span>)
      return html
    }
    render() {
        return (
          <div>
              <Layout style={{backgroundColor:this.props.theme.infobgcolor,padding:10}}>
                <div className="vertically-center">
                  <span style={{color:this.props.theme.listfontcolor}}>群主/管理员&nbsp;&nbsp;&nbsp;</span>
                  {this.switchAdminList(this.props.selgroup.groupId,this.props.adminlist)}
                </div><br/>
                <p style={{color:this.props.theme.listfontcolor}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;群名称&nbsp;&nbsp;&nbsp;<span style={{color:this.props.theme.listfontcolor}}>{this.props.selgroup.groupName}</span></p>
                <p style={{color:this.props.theme.listfontcolor}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;群号&nbsp;&nbsp;&nbsp;<span style={{color:this.props.theme.listfontcolor}}>{this.props.selgroup.groupId}</span></p>
                <p style={{color:this.props.theme.listfontcolor}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我的昵称&nbsp;&nbsp;&nbsp;<span style={{color:this.props.theme.listfontcolor}}>{this.switchMeList(this.props.selgroup.groupId,this.props.userself)}</span></p>
                <p style={{color:this.props.theme.listfontcolor}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置顶聊天&nbsp;&nbsp;&nbsp;<Checkbox onChange={this.zdonChange}></Checkbox></p>
                <p style={{color:this.props.theme.listfontcolor}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;屏蔽聊天&nbsp;&nbsp;&nbsp;<Checkbox onChange={this.pbonChange}></Checkbox></p>
              </Layout>
          </div>
        )
      }
    }
GroupDetails.propTypes = {
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
    adminlist: state.LoadGroupUserListReducer.adminlist,
    userself: state.LoadGroupUserListReducer.userself,
  }
}
const mapDispatchToProps=(dispatch)=>{
    return {
        //稍后添加群组点击事件或者使用下面这个点击action
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupDetails); 