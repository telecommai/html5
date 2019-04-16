/*登录页面
 * author：xpf
 */
import React, {Component} from 'react';
import {Form,Icon,Input,Button,Checkbox,Modal} from 'antd';
import './LoginForm.css';
import {HashRouter as Router,Route,Link} from 'react-router-dom';
import {hashHistory} from 'react-router';
import request from "../request/request.js"

const FormItem = Form.Item;

export default class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }
    valueChange = (e) => {
        if (e.target.type === 'text') {
            this.setState({
                username: e.target.value
            });
        } else {
            this.setState({
                password: e.target.value
            });
        }
    }
    handleSubmit = (e) => {
        if (this.state.username == '') {
            Modal.error({
                title: '错误提示',
                content: '请输入用户名',
                okText: '确定'
            });
            return;
        } else if (this.state.password == '') {
            Modal.error({
                title: '错误提示',
                content: '请输入密码',
                okText: '确定'
            });
            return;
        }
        var body =
            'userId=' + this.state.username +
            '&passWord=' + this.state.password
            // 'userId=18735183358'
            // +'&passWord=xu4321083'
            +
            '&deviceType=win' +
            '&deviceVersion=' + '' +
            '&deviceCompany=' + '' +
            '&deviceModel=' + '' +
            '&appVersion=' + '' +
            '&deviceId=' + '';
        request("BSServerURL", "POST", "user/login",
            body,
            this.backFun);
    }

    backFun = (json) => {
        /// /api/list正常返回格式{errcode:0,errmsg:'',data:[]}
        if (json.result == "success") {
            sessionStorage.setItem("token", json.token);
            sessionStorage.setItem("userName", json.user.userName);
            sessionStorage.setItem("imUserId", json.user.imUserId);
            sessionStorage.setItem("userId", json.user.userId);
            sessionStorage.setItem("imUserPassWord", json.user.imUserPassWord);
            this.userInfoLoad()

        } else {
            Modal.error({
                title: '错误提示',
                content: "用户名或密码错误",
                okText: '确定'
            });
        }
    }
    userInfoLoad() {
        var body = "userId=" + sessionStorage.getItem("imUserId") + "&passWord=" + sessionStorage.getItem("imUserPassWord")
        request("MessageServerURL", "POST", "user/getUserByUserId", body, this.userInfoLoadBack)
    }
    userInfoLoadBack = (json) => {
        sessionStorage.setItem("avatar", json.user.avatar)
        sessionStorage.setItem("nickName", json.user.nickName)
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            this.props.history.push({
                pathname: '/',
            });
        });
    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        return (
            <div className="vertically-horizontally-center" style = {{background:'#EDEDED',height:'100vh'}}>
            <Form onSubmit={this.handleSubmit} className="login-form" style = {{background:'#FFFFFF',height:265,width:250,padding:30}}>
                <span style={{fontSize:16}}>登录联信（网页版）</span>
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入您的用户名！' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} onChange={this.valueChange} placeholder="输入账号" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入您的密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} onChange={this.valueChange} type="password" placeholder="输入密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登 录
                    </Button>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住账号密码</Checkbox>
                    )}
                </FormItem>
            </Form>
            </div>
        );
    }
}
