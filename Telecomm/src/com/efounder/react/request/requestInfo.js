/*请求信息
 *author：xpf
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import {
	message
} from 'antd';
export default function request(action, body) {
	if (sessionStorage.getItem("token") == undefined) {
		this.props.history.push({
			pathname: '/login',
		});
		message.warning("登录失效请重新登陆")
		return;
	}
	return fetch("http://im.solarsource.cn:9692/IMServer/" + action, {
		credentials: 'include',
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		body: body,
	})
}