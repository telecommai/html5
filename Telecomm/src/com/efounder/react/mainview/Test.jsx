/*书写组件的模板
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Form,Layout,Menu,Icon,Avatar,Badge,Input,Button,Upload,message,Modal,Table} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import EncryptOrDecrypt from "../util/EncryptOrDecrypt.js";
import * as CryptoJS from 'crypto-js';
import reqwest from 'reqwest';
import ReactPlayer from 'react-player'
/*import Zmage from 'react-zmage'*/
const FileUpload = require('react-fileupload');
/*const props = {
  name: 'file',
  showUploadList:false,
  action: 'http://panserver.solarsource.cn:9692/panserver/files/file/directupload',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
  },
  params:
  onChange(info) {
    console.log(info);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};*/
//最好类名跟文件名对应
class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      imgUrl:"",
      img:null,
    }
  }
  //组件挂载完成后回调
  componentDidMount() {
    console.log("监听事件")
    window.addEventListener("storage", function(e){ 
      console.log("监听事件")
      console.log(e); 
    }); 
    /*var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    //以下进行测试
    if (Sys.ie){
      console.log('IE: ' + Sys.ie);
    }
    if (Sys.firefox) {
      console.log('Firefox: ' + Sys.firefox);
    }
    if (Sys.chrome) {
      console.log('Chrome: ' + Sys.chrome);
    }
    if (Sys.opera) {
      console.log('Opera: ' + Sys.opera);
    }
    if (Sys.safari) {
      console.log('Safari: ' + Sys.safari);
    }*/
  }
  test() {
    var str = '123456';
    var key = '0123456789abcdef';
    var iv = '0123456789abcdef';

    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    console.log(key)
    console.log(iv)
    // DES 加密
    var encrypted = CryptoJS.DES.encrypt(str, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 转换为字符串
    encrypted = encrypted.toString();

    // DES 解密
    var decrypted = CryptoJS.DES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 转换为 utf8 字符串
    decrypted = CryptoJS.enc.Utf8.stringify(decrypted);

    // Triple DES 加密
    var encrypted = CryptoJS.TripleDES.encrypt(str, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 转换为字符串
    encrypted = encrypted.toString();

    // Triple DES 解密
    var decrypted = CryptoJS.TripleDES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 转换为 utf8 字符串
    decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
  }
  //组件有更新后回调
  componentDidUpdate() {}
  //组件将要挂载时回调
  componentWillMount() {}
  //组件销毁时回调
  componentWillUnmount() {}
  //组件的渲染界面
  inputChange = (e) => {

  }
  handleUpload = (file) => {
    console.log(file);
    
    var formData = new FormData();

    formData.append('files[]', file);
    reqwest({
      url: 'https://panserver.solarsource.cn:9692/panserver/files/file/directupload?parentId=66662&createUser=6662',
      method: 'post',
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      success: function (resp) {
        console.log(resp);
      },
      error: function (err) {},
    });
  }
  paste = (e) => {
    var cbd = e.clipboardData;
    var ua = window.navigator.userAgent;
    // 如果是 Safari 直接 return
    if (!(e.clipboardData && e.clipboardData.items)) {
      return;
    }
    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
    if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
      cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
      ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
      return;
    }
    for (var i = 0; i < cbd.items.length; i++) {
      var item = cbd.items[i];
      if (item.kind == "file") {
        var blob = item.getAsFile();
        if (blob.size === 0) {
          return;
        }else{
          this.handleUpload(blob)
        }
        var reader = new FileReader();
        reader.onload = function(event) {
          var text = event.target.result;
          this.setState({
            imgUrl:text,
          })
        }.bind(this)
        reader.readAsDataURL(blob);
      }
    }
  }
  //amr点击
  amrClick=(e)=>{
    var img = e.currentTarget;
    img.src=require("../resources/icon/voice.gif")
    var BenzAMRRecorder = require('benz-amr-recorder');
    var amr = new BenzAMRRecorder();
    
    amr.initWithUrl('https://panserver.solarsource.cn:9692/panserver/files/f7df6972-34ff-42e5-b57c-02ab7a1604d2/download').then(function() {
      amr.play();
    });
    amr.onEnded(function() {
      img.src=require("../resources/icon/voice.png")
    })
  }
  videoClick=(e)=>{
    alert("click")
  }
  getChatTime(time){
    var record ={};
    record.time = new Date(time)
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
      return " 昨天 "+chattime;
    }
    if(this.isBeforeYestday(time)){
      return (time.getMonth() + 1) + '-' + time.getDate()+" "+chattime
    }
    return chattime
  }
  //判断是否是昨天
  isYestday(theDate){
    var date = new Date();    //当前时间
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    var yestday = new Date(today - 24*3600*1000).getTime();
    return theDate.getTime() < today && yestday <= theDate.getTime();
  }
  //判断是否昨天之前
  isBeforeYestday(theDate){
    var date = new Date();    //当前时间
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    var yestday = new Date(today - 24*3600*1000).getTime();//昨天凌晨
    return theDate.getTime() < yestday
  }
  onBlur=(e)=>{
    sessionStorage.setItem("blur",sessionStorage.getItem("blur")+"3")
    console.log(sessionStorage.getItem("blur"))
  }
  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      width: 150,
    }, {
      title: 'Age',
      dataIndex: 'age',
      width: 150,
    }, {
      title: 'Address',
      dataIndex: 'address',
    }];
    
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      });
    }
    var fileFontStyle = {
          fontSize:this.props.windowHeight*0.022,
          width:this.props.windowWidth*0.12,
          textOverflow: "ellipsis",
          whiteSpace:"nowrap",
          overflow:"hidden"
        }
    return (
      <div>
        <div>
          <input onBlur={this.onBlur}/>
        </div>
          <ReactPlayer url="https://panserver.solarsource.cn/panserver/files/07a2b1f7-5eda-4199-b443-a073413cc49f/download" width={200} height={200} controls={true} />
          <div>{this.getChatTime("2018-11-14 11:08:30")}</div>
          <div>{this.getChatTime("2018-11-15 11:08:30")}</div>
        {/*<div>
          <input value={this.state.imgUrl} onChange={this.inputChange}/>
          <input type="file" accept="image/*" multiple />
        </div>*/}
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
        <div style={{width:this.props.windowWidth*0.18,height:this.props.windowHeight*0.1,display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',backgroundColor:"#eeFFFF"}}>
          <div>
            <table width="100%">
              <tbody>
              <tr>
                <td rowSpan="2">
                  <img src={require("../resources/filetype/012.png")} style={{width:this.props.windowHeight*0.08,height:this.props.windowHeight*0.08}}/>
                </td>
                <td>
                  <div style={fileFontStyle}>{"测试文件123.zip"}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={fileFontStyle}>{"123M"}</div>
                </td>
              </tr>
              </tbody>
            </table>
            <div style={{display:"-moz-box",display:"-ms-flexbox",display:"-webkit-box",display:"-webkit-flex",display:"box",display:"flexbox",display:"flex", alignItems:'center',}}>
              <img src={require("../resources/filetype/loading.gif")} title="aaaaaaaa" style={{height:this.props.windowHeight*0.02,width:this.props.windowHeight*0.02}}/>
              <div style={{marginLeft:this.props.windowWidth*0.002,height:this.props.windowHeight*0.004,width:this.props.windowWidth*0.16,backgroundColor:"#FFFFFF"}}>
                <div style={{height:this.props.windowHeight*0.004,width:"100%",backgroundColor:"#000000"}}></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div><span>可编辑测试</span></div>
          <div>
          <div 
            onPaste={this.paste}
            contentEditable="true"
            style={{
                    height:this.props.windowHeight*0.17,
                    backgroundColor:"transparent",
                    border:1,
                  }}
          >这是一段可编辑的段落。请试着编辑该文本。</div>
          </div>
          <div><img src={this.state.imgUrl}/></div>
        </div>

        <button onClick={this.amrClick}>语音消息</button>
        <img src={require("../resources/icon/voice.png")}  name="123213" onClick={this.amrClick} style={{height:this.props.windowHeight*0.03,width:this.props.windowHeight*0.03,cursor:"pointer"}}/>
      </div>
    )         
  }

}
//类属性
Test.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {

  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);