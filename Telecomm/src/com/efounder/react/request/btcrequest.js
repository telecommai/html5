/*btc币请求信息
 *author：xpf
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import {
	message
} from 'antd';
export default function request(action, body, method) {
	if (sessionStorage.getItem("token") == undefined) {
		this.props.history.push({
			pathname: '/login',
		});
		message.warning("登录失效请重新登陆")
		return;
	}
	return fetch("http://chaintest.openserver.cn" + action + "?" + body, {
		credentials: 'include',
		method: method == "" || method == undefined ? "POST" : method,
		mode: 'no-cors',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
	})
}