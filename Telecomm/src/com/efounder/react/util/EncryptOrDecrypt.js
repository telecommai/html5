/*加密  解密*/
import * as CryptoJS from 'crypto-js';
var EncryptOrDecrypt = function() {};
var EncryptOrDecryptPrototype = EncryptOrDecrypt.prototype;
EncryptOrDecryptPrototype.encrypt = function(key, iv, data) {
	let AuthTokenKey = key; //AES密钥
	let AuthTokenIv = iv; //AES向量
	let encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Latin1.parse(AuthTokenKey), {
		iv: CryptoJS.enc.Latin1.parse(AuthTokenIv),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
}
EncryptOrDecryptPrototype.decrypt = function(key, iv, data) {
	let AuthTokenKey = key; //AES密钥
	let AuthTokenIv = iv; //AES向量
	var key = CryptoJS.enc.Latin1.parse(AuthTokenKey);
	var iv = CryptoJS.enc.Latin1.parse(AuthTokenIv);
	var decrypted = CryptoJS.AES.decrypt(data, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}
export default EncryptOrDecrypt