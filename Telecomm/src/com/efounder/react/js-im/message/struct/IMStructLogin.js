import ByteBuffer from "../../lib/bytebuffer-dataview"
var IMStructLogin = function() {
	this.messageType = 1;
};
var IMStructLoginPrototype = IMStructLogin.prototype;
var messageType;
var messageLength;
var clientID;
IMStructLoginPrototype.toData = function() {
	var num = ByteBuffer.calculateUTF8Bytes(this.clientID);
	var bb = new ByteBuffer().writeInt8(this.messageType).writeInt32(num).flip();
	var bb2 = new ByteBuffer().writeString(this.clientID).flip();
	bb2.limit = num;
	var bb3 = ByteBuffer.concat([bb, bb2]);
	return bb3.toArrayBuffer();
}
export default IMStructLogin