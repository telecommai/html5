import ByteBuffer from "../../lib/bytebuffer-dataview"
var IMStructHeartbeat = function() {
	this.messageType = 0;
};
var IMStructHeartbeatPrototype = IMStructHeartbeat.prototype;

var messageType;

IMStructHeartbeatPrototype.toData = function() {
	var bb = new ByteBuffer().writeInt8(this.messageType).flip();
	return bb.toArrayBuffer();
}

export default IMStructHeartbeat