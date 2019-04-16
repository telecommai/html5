/*登录页面
 * author：xpf
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import {Form,Icon,Input,Button,Checkbox,Modal} from 'antd';
import './LoginForm.css';
import {HashRouter as Router,Route,Link} from 'react-router-dom';
import {hashHistory} from 'react-router';
import request from "../request/request.js";
import requestLogin from "../request/requestLogin.js";
import LoadLoginUserInfo from "../actions/LoadLoginUserInfo.js"
import login_bg from "../resources/login_bg2.png";

const QRCode = require('qrcode.react');
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrcode:'',
            error:false,
            count:0,
        }
    }
    //组件挂载完成后回调
    componentDidMount() {
        this.loadcode()
    }
    loadcode(){
        clearInterval(this.timerID)
        this.setState({
            error:false,
            count:this.state.count+1,
        })
        if (this.state.count >= 1) {
            clearInterval(this.timerID)
            this.setState({
                error: true,
                qrcode:'二维码已失效,请刷新',
                count:0,
            })
            return;
        }
        requestLogin("/tcserver/oauth/code", "client_id=a6f23fbb-0a1d-4e10-be7e-89181cdf089c").then(response =>
                response.json())
            .then(data => {
                if (data.result=="success") {
                    this.loadstaus(data.code)
                    var json = {"client_id":"a6f23fbb-0a1d-4e10-be7e-89181cdf089c","code":data.code,"type":"opLogin"}
                    this.setState({
                        qrcode:JSON.stringify(json),
                        error:false
                    })
                }else{
                    this.setState({
                        error:true,
                        qrcode:'二维码已失效,请刷新',
                    })
                    clearInterval(this.timerID)
                }
            }).catch(error => {
                this.setState({
                    error:true,
                    qrcode:'二维码已失效,请刷新',
                })
                clearInterval(this.timerID)
                return;
            });
    }
    loadstaus(code) {
        var count = 0;
        this.timerID = setInterval(() => {
            requestLogin("/tcserver/oauth/authenticationCode", "code=" + code).then(
                response => response.json()).then(data => {
                //{result: "success", status: 1}
                if (data.result == "success") {
                    //0 已过期 1 未过期 但未扫码  2 已经扫码登录
                    if (data.status == 0) {
                        clearInterval(this.timerID);
                        this.loadcode();
                    } else if (data.status == 1) {} else if (data.status == 2) {
                        if (this.timerID != undefined) {
                            clearInterval(this.timerID);
                        }
                        var userInfo = data.userInfo
                        var access_token = data.access_token;
                        var refresh_token = data.refresh_token;
                        var avatar = userInfo.avatar;
                        var ethAddress = userInfo.ethAddress;
                        var ethPublicKey = userInfo.ethPublicKey;
                        var fromInviteCode = userInfo.fromInviteCode;
                        var imPassword = userInfo.imPassword;
                        var imUserId = userInfo.imUserId;
                        var inviteCode = userInfo.inviteCode;
                        var inviteCodeUseCount = userInfo.inviteCodeUseCount;
                        var nickName = userInfo.nickName;
                        var password = userInfo.password;
                        var sex = userInfo.sex;
                        var userId = userInfo.userId;
                        var userIdMd5 = userInfo.userIdMd5;
                        var userName = userInfo.userName;
                        for (var key in userInfo) {
                            sessionStorage.setItem(key, userInfo[key])
                        }
                        sessionStorage.setItem("userInfo", userInfo)
                        sessionStorage.setItem("access_token", access_token);
                        sessionStorage.setItem("token", access_token);
                        sessionStorage.setItem("refresh_token", refresh_token)
                        sessionStorage.setItem("userName", userName);
                        sessionStorage.setItem("imUserId", imUserId);
                        sessionStorage.setItem("userId", userId);
                        sessionStorage.setItem("imUserPassWord", imPassword);
                        sessionStorage.setItem("avatar", avatar)
                        sessionStorage.setItem("nickName", nickName)
                        /*this.props.LoadLoginUserInfo(userInfo)*/
                        this.props.history.push({
                            pathname: '/',
                        });
                    }
                }
            }).catch(error => {
                this.setState({
                    error:true,
                    qrcode:'二维码已失效,请刷新',
                })
                clearInterval(this.timerID)
                return;
            });
        }, 1000);
    }
    //点击刷新qrcode
    refreshqrcode=(e)=>{
        this.loadcode();
    }
    //组件有更新后回调
    componentDidUpdate() {}
    //组件将要挂载时回调
    componentWillMount() {
        
    }
    //组件销毁时回调
    componentWillUnmount() {
        if(this.timerID!=undefined){
            clearInterval(this.timerID)
        }
    }
    //props改变回调函数
    componentWillReceiveProps(nextProps) {}
    render() {
        return (
            <div
            className="vertically-horizontally-center"
            style = {{
                backgroundImage:`url(${login_bg})`,
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height:'100vh',
                
            }}>
                <div 
                className="vertically-horizontally-center"
                style = {{
                    background:this.props.theme.bgcolor,
                    borderRadius:"8px",
                    height:this.props.windowHeight*0.4,
                    width:this.props.windowWidth*0.18,
                    
                }}>
                    <div className="horizontally-center" style={{width:this.props.windowWidth*0.18,height:this.props.windowHeight*0.32}}>
                        <div className="horizontally-center" style={{position:"relative",width:"100%",height:"100%"}}>
                            <div
                            className="vertically-horizontally-center"
                            style={{backgroundColor:"#FFFFFF",
                                width:this.props.windowWidth*0.12,
                                height:this.props.windowWidth*0.12,
                                position:"absolute",
                                left:"50%",
                                transform: "translate(-50%)", 
                                MsTransform: "translate(-50%)", /* IE9及以上支持 */
                                WebkitTransform: "translate(-50%)",    /* Safari and Chrome */
                                OTransform: "translate(-50%)",    /* Opera */
                                MozTransform: "translate(-50%)", 
                                zIndex:1,   
                            }}>
                                <QRCode value={this.state.qrcode} size={this.props.windowWidth*0.1}/>
                            </div>
                            {this.state.error&&
                            <div 
                            className="vertically-horizontally-center"
                            onClick={this.refreshqrcode.bind(this)} 
                            style={{
                                backgroundColor:"rgba( 169,169,169,0.5)",
                                width:this.props.windowWidth*0.12,
                                height:this.props.windowWidth*0.12,
                                position:"absolute",
                                left:"50%",
                                transform: "translate(-50%)", 
                                MsTransform: "translate(-50%)", /* IE9及以上支持 */
                                WebkitTransform: "translate(-50%)",    /* Safari and Chrome */
                                OTransform: "translate(-50%)",    /* Opera */
                                MozTransform: "translate(-50%)", 
                                zIndex:2, 
                            }}>

                            </div>}
                            <div style={{position:"absolute",
                                width:"100%",
                                bottom:0,
                                left:"50%",
                                textAlign:"center",
                                transform: "translate(-50%)", 
                                MsTransform: "translate(-50%)", /* IE9及以上支持 */
                                WebkitTransform: "translate(-50%)",    /* Safari and Chrome */
                                OTransform: "translate(-50%)",    /* Opera */
                                MozTransform: "translate(-50%)", }}>
                                {this.state.error?<div style={{height:this.props.windowHeight*0.03,fontSize:this.props.windowHeight*0.02,color:"#FF4500"}}>二维码已过期，请点击刷新</div>:<div style={{height:this.props.windowHeight*0.03}}/>}
                                <div style={{fontSize:this.props.windowHeight*0.02,color:"#FFFFFF",}}>请使用Telecomm扫描上方二维码登录</div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}
LoginForm.propTypes = {
    
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
  }
}
const mapDispatchToProps=(dispatch)=>{
    return{
      LoadLoginUserInfo: (userInfo) => {
        dispatch(LoadLoginUserInfo(userInfo));//派发action，可添加多个参数
      }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm); 