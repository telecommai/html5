/*刷新token(目前搁置不用)
 */
var RefreshToken = function() {}
var RefreshTokenPrototype = RefreshToken.prototype;
import tcrequest from "../request/tcrequest.js";
RefreshTokenPrototype.rftoken = function(backfun) {
	var body = "grant_type=refresh_token" +
		"&client_id=a6f23fbb-0a1d-4e10-be7e-89181cdf089c" +
		"&client_secret=2a6a9640-9a46-4622-b226-bc94b852848c" +
		"&refresh_token=" + sessionStorage.getItem("refresh_token");
	tcrequest("/tcserver/oauth/accessToken", body).then(response => response.json()).then(data => {
		sessionStorage.setItem("access_token", data.access_token);
		sessionStorage.setItem("refresh_token", data.refresh_token);
		backfun(data)
	})
}