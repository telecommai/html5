/*处理请求
 *author：xpf
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import {
    Modal,
    message
} from 'antd';
import {
    hashHistory
} from 'react-router';

export default function request(type, method, action, body, backfun) {
    if (sessionStorage.getItem("token") == undefined) {
        this.props.history.push({
            pathname: '/login',
        });
        message.warning("登录失效请重新登陆")
        return;
    }
    let systemParamObject = {};
    body = body
    method = method.toUpperCase();
    if (type == "BSServerURL") {
        fetch("http://panmob.solarsource.cn:9692/BSServer/" + action, {
                credentials: 'include',
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: body,
            }).then(response =>
                response.json())
            .then(data => {
                backfun(data);
            })
    } else if (type == "MessageServerURL") {
        fetch("http://im.solarsource.cn:9692/IMServer/" + action, {
                credentials: 'include',
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: body,
            }).then(response =>
                response.json())
            .then(data => {
                backfun(data);
            })
    }
}