/*聊天信息组件
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Layout,Icon,Popover,Button,Modal} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import expre from "../resources/expression/expre.json";
import ReactPlayer from 'react-player'
const {Header,Footer,Sider,Content} = Layout;
const leftjt = {
  float: "left",
  width: 0,
  height: 0,
  borderStyle: "solid",
  borderWidth: 5,
  borderColor: "#6987A7 #6987A7 transparent transparent ",
  transform: "rotate(-135deg)",
  /*boxShadow: "2px -2px 2px #ccc",
  WebkitBoxShadow: "2px -2px 2px #ccc",
  MozBoxShadow: "2px -2px 2px #ccc",*/
  marginTop: 8,
}
const leftltk = {
  float: "left",
  borderRadius: 5,
  /*WebkitBoxShadow: "0 0 10px #ccc",
  MozBoxShadow: "0 0 10px #ccc",
  boxShadow: "0 0 10px #ccc",*/
  zIndex: -1,
  backgroundColor: "#6987A7",
  marginLeft: -5,
  wordWrap: "break-word",
}
const rightjt = {
  float: "right",
  width: 0,
  height: 0,
  borderStyle: "solid",
  borderWidth: 5,
  borderColor: "#FFC87C #FFC87C transparent transparent ",
  transform: "rotate(45deg)",
  /*boxShadow: "2px -2px 2px #ccc",
  WebkitBoxShadow: "2px -2px 2px #ccc",
  MozBoxShadow: "2px -2px 2px #ccc",*/
  marginTop: 8,
}
const rightltk = {
  float: "right",
  borderRadius: 5,
  /*WebkitBoxShadow: "0 0 10px #ccc",
  MozBoxShadow: "0 0 10px #ccc",
  boxShadow: "0 0 10px #ccc",*/
  zIndex: -1,
  backgroundColor: "#FFC87C",
  marginRight: -5,
  wordWrap: "break-word",
}
class ChatPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      visible:false,
      imgModalUrl:"",
      modalwidth:0,
      videoVisible:false,
      videoUrl:null,
    }
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {
    
  }
  //匹配消息状态
  switchStateImg(msgState) {
    switch (msgState) {
      //WAITSEND 0:待发送,
      case 0:
        return (<img title="待发送" src={require("../resources/msgstateicon/wait_for_send.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //PRESEND 1:预发送,
      case 1:
        return (<img title="预发送" src={require("../resources/msgstateicon/wait_for_send.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //SENDING 2:发送中,
      case 2:
        return (<img title="发送中" src={require("../resources/msgstateicon/send_ing.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //DELIVER 5:已投递,
      case 5:
        return (<img title="已投递" src={require("../resources/msgstateicon/delivered.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //FAILURE 10:发送失败,
      case 10:
        return (<img title="发送失败" src={require("../resources/msgstateicon/send_failed.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //SEND 15:已发送,
      case 15:
        return (<img title="已发送" src={require("../resources/msgstateicon/send_ed.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //RECEIVE 20:已送达,
      case 20:
        return (<img title="已送达" src={require("../resources/msgstateicon/sent.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //READ 25:已查看,
      case 25:
        return (<img title="已查看" src={require("../resources/msgstateicon/viewed.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //UNREAD 30:未查看,
      case 30:
        return (<img title="未查看" src={require("../resources/msgstateicon/unviewed.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
        //DELETE 35:删除,
      case 35:
        return (<img title="已删除" src={require("../resources/msgstateicon/delete.png")} style={{height:this.props.windowHeight*0.02}}/>);
        break;
      default:
        return (<img title="待发送" src={require("../resources/msgstateicon/wait_for_send.png")} style={{height:this.props.windowHeight*0.02}}/>);;
    }
  }
  //处理消息内容
  contentdispose(message) {
    let html = [];
    var fontStyle = {
      fontSize:this.props.windowHeight*0.022,
    }
    //如果是普通文本消息
    switch (message.subType) {
      case 0:
        //文本消息处理，附带表情处理
        var text = message.message
        var regex = new RegExp('\\[[a-zA-Z0-9\\/\\u4e00-\\u9fa5]+\\]', 'g');
        var contentArray = [];
        var regArray = text.match(regex);
        if (regArray === null) {
          contentArray.push({
            "Content": text
          });
          contentArray.map((content, i) => {
            if (content["Content"] != null) { //文本    
              html.push(<span style={fontStyle}>{content["Content"]}</span>);
            } else if (content["Resources"] != null) { //表情  
              html.push(<img src={require("../"+content["Resources"])}/>);
            }
          })
          return html;
        }
        var indexArray = [];
        var pos = text.indexOf(regArray[0]); //头  
        for (let i = 1; i < regArray.length; i++) {
          indexArray.push(pos);
          pos = text.indexOf(regArray[i], pos + 1);
        }
        indexArray.push(pos);
        for (let i = 0; i < indexArray.length; i++) {
          if (indexArray[i] === 0) { //一开始就是表情  
            contentArray.push({
              "Resources": regArray[i],
              attr: {
                Type: "0"
              }
            });
          } else {
            if (i === 0) {
              contentArray.push({
                "Content": text.substr(0, indexArray[i])
              });
            } else {
              if (indexArray[i] - indexArray[i - 1] - regArray[i - 1].length > 0) { //两个表情相邻，中间不加content  
                contentArray.push({
                  "Content": text.substr(indexArray[i - 1] + regArray[i - 1].length, indexArray[i] - indexArray[i - 1] - regArray[i - 1].length)
                });
              }
            }
            contentArray.push({
              "Resources": regArray[i],
              attr: {
                Type: "0"
              }
            });
          }
        }
        let lastLocation = indexArray[indexArray.length - 1] + regArray[regArray.length - 1].length;
        if (text.length > lastLocation) {
          contentArray.push({
            "Content": text.substr(lastLocation, text.length - lastLocation)
          });
        }
        contentArray.map((content, i) => {
          if (content["Content"] != null) { //文本    
            html.push(<span style={fontStyle}>{content["Content"]}</span>);
          } else if (content["Resources"] != null) { //表情 
            var  text = content["Resources"];
            if(expre[text]!=undefined){
              var url =   expre[text];
              html.push(<img src={require("../resources/expression/"+url)} />);
            }else{
              html.push(<span style={fontStyle}>{content["Resources"]}</span>)
            }
            
          }
        })
        return html;
        break;
      case 1:
        //图片消息处理
        var msg = JSON.parse(message.message);
        var url = msg.url;
        if(msg.scale!=""){
          var aspect = msg.scale.split(":")
          var width = parseInt(aspect[0])
        }
        html.push(<img onClick={this.imgClick.bind(this,url,width)} src={url} style={{cursor: "pointer",maxWidth:window.innerWidth*0.2}}/>);
        return html;
        break;
      case 2:
        //语音消息处理
        var msg = JSON.parse(message.message);
        html.push(
          <div>
            <img src={require("../resources/icon/voice.png")} name={msg.url} onClick={this.amrClick} style={{height:this.props.windowHeight*0.03,width:this.props.windowHeight*0.03,cursor:"pointer"}}/>&nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{fontSize:this.props.windowHeight*0.025}}>{msg.time+"\""}</span>
          </div>
        );
        return html;
        break;
      case 3:
        //小视频消息处理
        var msg = JSON.parse(message.message);
        html.push(
          <div style={{width:this.props.windowHeight*0.2,height:this.props.windowHeight*0.2,position:"relative"}}>
            <div className="vertically-horizontally-center" style={{width:"100%",height:"100%",position:"absolute",zIndex:2}}>
              <img src={require("../resources/icon/readyPlay.png")} onClick={this.videoClick.bind(this,msg.url)} style={{width:"30%",height:"30%",cursor:"pointer"}} />
            </div>
            <div style={{width:"100%",height:"100%",position:"absolute",zIndex:1}}>
              <ReactPlayer url={msg.url} width="100%" height="100%" />
            </div>
          </div>);
        return html;
        break;
      case 4:
        //拍摄视频消息处理
        html.push(<span style={fontStyle}>不支持的消息类型，请在手机端查看</span>);
        return html;
        break;
      case 5:
        //文件消息处理
        var msg = JSON.parse(message.message)
        var FileType = msg.FileType;
        var FileName = msg.FileName;
        var FileSize = msg.FileSize;
        //百分比
        var FilePer = msg.FilePer;
        if(FilePer==undefined||FilePer==null){
          FilePer="100%"
        }
        //文件发送状态-1:失败；0：发送中；1：已发送
        var FileSendState = msg.FileSendState;
        if (FileSendState==""||FileSendState==undefined||FileSendState=="undefined"||FileSendState==null) {
          FileSendState = 1
        }
        var imgurl;
        var url="";
        if (msg.FileId!="") {
          url = "https://panserver.solarsource.cn/panserver/files/" + msg.FileId + "/download"
        }else{
          url = "";
        }
        if (FileType == "exe") {
          imgurl = require("../resources/filetype/012.png");
        } else if (FileType == "zip" || FileType == "rar" || FileType == "7z") {
          imgurl = require("../resources/filetype/008.png");
        } else if (FileType == "txt" || FileType == "pdf" || FileType == "htm" || FileType == "html" || FileType == "xml") {
          imgurl = require("../resources/filetype/010.png");
        } else if (FileType == "png" || FileType == "ico" || FileType == "jpg" || FileType == "jpeg" || FileType == "bmp" || FileType == "gif") {
          imgurl = require("../resources/filetype/005.png");
        } else if (FileType == "wav" || FileType == "mp3" || FileType == "wma" || FileType == "aac" || FileType == "flac") {
          imgurl = require("../resources/filetype/013.png");
        } else if (FileType == "mp4" || FileType == "rm" || FileType == "mpg" || FileType == "mpeg" || FileType == "ogg") {
          imgurl = require("../resources/filetype/004.png");
        } else if (FileType == "doc" || FileType == "docx") {
          imgurl = require("../resources/filetype/002.png");
        } else if (FileType == "xls" || FileType == "xlsx") {
          imgurl = require("../resources/filetype/003.png");
        } else if (FileType == "ppt" || FileType == "pptx") {
          imgurl = require("../resources/filetype/001.png");
        } else {
          imgurl = require("../resources/filetype/007.png");
        }
        var fileFontStyle = {
          fontSize:this.props.windowHeight*0.022,
          width:this.props.windowWidth*0.12,
          textOverflow: "ellipsis",
          whiteSpace:"nowrap",
          overflow:"hidden"
        }
        if (url != "") {
          html.push(
          <a href={encodeURI(url)} style={{textDecoration:"none",outLine: "none"}}>
            <div style={{width:this.props.windowWidth*0.18,
                height:this.props.windowHeight*0.1,
                display:"-moz-box",
                display:"-ms-flexbox",
                display:"-webkit-box",
                display:"-webkit-flex",
                display:"box",
                display:"flexbox",
                display:"flex",
                alignItems:'center'}}>
              <div>
                <table width="100%">
                  <tbody>
                  <tr>
                    <td rowSpan="2">
                      <img src={imgurl} style={{width:this.props.windowHeight*0.08,height:this.props.windowHeight*0.08}}/>
                    </td>
                    <td>
                      <div style={fileFontStyle}>{FileName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={fileFontStyle}>{FileSize}</div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div className="vertically-center">
                  <div style={{height:this.props.windowHeight*0.006,width:this.props.windowWidth*0.17,backgroundColor:"#FFFFFF"}}>
                    <div style={{height:this.props.windowHeight*0.006,width:FilePer,backgroundColor:"#32CD32"}}></div>
                  </div>
                  <img src={require("../resources/msgstateicon/send_ed.png")} title={this.props.message.fromUserID==sessionStorage.getItem("imUserId")?"已发送":"已接收"} style={{height:this.props.windowHeight*0.015,width:this.props.windowHeight*0.015}}/>
                </div>
              </div>
            </div>
          </a>
          )
        }else{
          html.push(
            <div className="vertically-center" style={{width:this.props.windowWidth*0.18,height:this.props.windowHeight*0.1}}>
              <div>
                <table width="100%">
                  <tbody>
                  <tr>
                    <td rowSpan="2">
                      <img src={imgurl} style={{width:this.props.windowHeight*0.08,height:this.props.windowHeight*0.08}}/>
                    </td>
                    <td>
                      <div style={fileFontStyle}>{FileName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={fileFontStyle}>{FileSize}</div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div className="vertically-center">                  
                  <div style={{marginLeft:this.props.windowWidth*0.002,height:this.props.windowHeight*0.006,width:this.props.windowWidth*0.16,backgroundColor:"#FFFFFF"}}>
                    <div style={{height:this.props.windowHeight*0.006,width:FilePer,backgroundColor:"#32CD32"}}></div>
                  </div>
                  {FileSendState==0&&<img src={require("../resources/filetype/loading.gif")} title="正在发送" style={{height:this.props.windowHeight*0.015,width:this.props.windowHeight*0.015}}/>}
                  {FileSendState==-1&&<img src={require("../resources/msgstateicon/send_failed.png")} title="发送失败" style={{height:this.props.windowHeight*0.015,width:this.props.windowHeight*0.015}}/>}
                </div>
              </div>
            </div>
          )
        }
        return html;
        break;
      default:
        html.push(<span style={fontStyle}>不支持的消息类型，请在手机端查看</span>);
        return html;
    }
  }
  //图片点击事件
  imgClick=(url,width,e)=>{
    this.setState({
      visible:true,
      imgModalUrl:url,
      modalwidth:width,
    })
  }
  //图片点击取消事件
  imgClickCancel(){
    this.setState({
      visible:false,
    })
  }
  //语音消息
  amrClick=(e)=>{
    var img = e.currentTarget;
    var amrUrl = e.target.getAttribute("name");
    img.src=require("../resources/icon/voice.gif")
    var BenzAMRRecorder = require('benz-amr-recorder');
    var amr = new BenzAMRRecorder();
    amr.initWithUrl(amrUrl).then(function() {
      amr.play();
    });
    amr.onEnded(function() {
      img.src=require("../resources/icon/voice.png")
    })
  }
  //视频消息
  videoClick=(url,e)=>{
    this.setState({
      videoVisible:true,
      videoUrl:url,
    })
  }
  //视频消息关闭
  videoClickCancel(){
    this.setState({
      videoVisible:false,
      url:null,
    })
  }
  //获取聊天界面
  getPopover(message){
    var html = [];
    if (message.subType!=1001) {
      if(message.fromUserID==sessionStorage.getItem("imUserId")){
        html.push(
          <div style={{float:"right"}}>
          <div style={{float:"right"}}>
            <div className="vertically-flex-end">
              {this.switchStateImg(this.props.msgState)}
              {this.props.avatar==""||this.props.avatar==undefined?
              <img src={require("../resources/icon/user.png")} style={{height:this.props.windowHeight*0.052,width:this.props.windowHeight*0.052,borderRadius:100000,}}/>
              :
              <img src={this.props.avatar} style={{height:this.props.windowHeight*0.052,width:this.props.windowHeight*0.052,borderRadius:100000,}}/>
              }
            </div>
          </div>
          <table key={this.props.key} style={{float:"right",marginRight:this.props.windowWidth*0.002}}>
            <tbody>
              {/*<tr>
                <td style={{float:"right"}}><span style={{color:this.props.theme.listfontcolor}}>{this.props.username}</span></td>
              </tr>*/}
              <tr>
                <td className="vertically-flex-end">
                  {this.props.message.postType==0&&this.props.integral!=0&&this.props.integral!="0"&&this.props.integral!=undefined&&this.props.integral!="undefined" 
                    &&<div style={{float:"right"}}>
                  <img src={require("../resources/icon/diamond.gif")} style={{height:this.props.windowHeight*0.02}}/>
                  <span style={{fontSize:this.props.windowHeight*0.012,color:"#D6650A"}}>+{this.props.integral}</span>
                  </div>}
                </td>
                <td>
                  <div style={rightjt} ></div>
                  <div style={rightltk}>
                        <div style={{margin:this.props.windowWidth*0.004,wordWrap:"break-word",maxWidth:this.props.windowWidth/3,}}>
                            {
                              this.contentdispose(this.props.message)
                            }
                        </div>
                  </div>
                  
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        )
      }else{
        html.push(
          <div>
            <div className="vertically-center" style={{float:"left",height:this.props.windowHeight*0.1}}>
              {this.props.avatar==""||this.props.avatar==undefined?
              <img src={require("../resources/icon/user.png")} style={{height:this.props.windowHeight*0.052,width:this.props.windowHeight*0.052,borderRadius:100000,}}/>
              :
              <img src={this.props.avatar} style={{height:this.props.windowHeight*0.052,width:this.props.windowHeight*0.052,borderRadius:100000,}}/>
              }
            </div>
            <table key={this.props.key} style={{float:"left",marginLeft:this.props.windowWidth*0.002}}>
              <tbody>
                <tr>
                  <td><span style={{color:this.props.theme.listfontcolor}}>{this.props.username}</span></td>
                </tr>
                <tr>
                  <td style={{paddingBottom:0}}>
                    
                    <div style={leftjt} ></div>
                    <div style={leftltk}>
                          <div style={{margin:this.props.windowWidth*0.004,wordWrap:"break-word",maxWidth:this.props.windowWidth/3}}>
                              {
                                this.contentdispose(this.props.message)
                              }
                          </div>
                    </div>
                    <div style={{float:"left"}}>
                    <img src={require("../resources/icon/diamond.gif")} style={{height:this.props.windowHeight*0.02}}/>
                    <span style={{fontSize:this.props.windowHeight*0.012,color:"#D6650A"}}>+{this.props.integral}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      }
    }else{
      html.push(
        <div className="vertically-horizontally-center" style={{color:this.props.theme.fontcolor,fontSize:this.props.windowHeight*0.02,width:"100%",height:this.props.windowHeight*0.045,backgroundColor:"transparent"}}>
          {this.getChatTime(message)}   
        </div>
      )
    }
    return html;
  }
  //获取聊天列表显示时间
  getChatTime(record){
    var newdate = new Date()
    var defaultTime = newdate.getHours() + ':' + newdate.getMinutes();
    if(record.time==undefined||record.time==""||record.time==null){
      return defaultTime;
    }
    var time = new Date(record.time)
    //var datetime=time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    if(time.getMinutes()<10){
      var chattime = time.getHours() + ':0' + time.getMinutes();
    }else{
      var chattime = time.getHours() + ':' + time.getMinutes();
    }
    if(this.isYestday(time)){
      return "昨天"+chattime;
    }else{
      return chattime;
    }
  }
  //判断是否是昨天
  isYestday(theDate){
    var date = (new Date());    //当前时间
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    var yestday = new Date(today - 24*3600*1000).getTime();
    return theDate.getTime() < today && yestday <= theDate.getTime();
  }
  render() {
    return (
      <Content>
        {/*获取界面内容*/}
        {this.getPopover(this.props.message)}
        {/*图片点击放大的Modal*/}
        <Modal
          visible={this.state.visible}
          onCancel={this.imgClickCancel.bind(this)}
          closable={false}
          width={this.state.modalwidth+30}
          bodyStyle={{backgroundColor:"#183257",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center',justifyContent:'center',}}
          footer={null}
        >
          <img src={this.state.imgModalUrl} onClick={this.imgClickCancel.bind(this)} style={{cursor: "pointer"}}/>
        </Modal>
        {/*视频点击放大的modal*/}
        <Modal
          visible={this.state.videoVisible}
          onCancel={this.videoClickCancel.bind(this)}
          width={this.props.windowHeight*0.6}
          bodyStyle={{height:this.props.windowHeight*0.6,backgroundColor:"#183257",display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex",alignItems:'center',justifyContent:'center',}}
          footer={null}
        >
          <div style={{width:"90%",height:"90%"}}>
            <ReactPlayer url={this.state.videoUrl} width="100%" height="100%" controls={true} />
          </div>
        </Modal>
        </Content>
    )
  }

}
ChatPopover.propTypes = {

}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatPopover);