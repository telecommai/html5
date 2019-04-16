/*币请求信息
 *author：xpf
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

export default function request(action, body) {

	return fetch("http://tc.solarsource.cn:9692" + action, {
		credentials: 'include',
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		body: body,
	})
}