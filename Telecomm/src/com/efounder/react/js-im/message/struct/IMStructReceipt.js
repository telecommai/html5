import ByteBuffer from "../../lib/bytebuffer-dataview"
var IMStructReceipt = function() {
  this.messageType = 3;
};
var IMStructReceiptPrototype = IMStructReceipt.prototype;

var messageType;
var messageLength;
var messageIDString;
var ackType;
var serverTime;

IMStructReceiptPrototype.toData = function() {
  var receipt = new ByteBuffer().writeInt8(this.messageType).writeInt32(42 + 1 + 8).writeString(this.messageIDString + '').flip();
  receipt.limit = 1 + 42 + 4;
  // var r2 = receipt.flip();
  var r3 = new ByteBuffer().writeInt8(0).writeFloat64(this.serverTime.getTime()).flip();
  var r4 = ByteBuffer.concat([receipt, r3]);
  return r4.toArrayBuffer();
}

IMStructReceiptPrototype.toStruct = function(bb) {
  this.messageIDString = bb.readString(42, ByteBuffer.METRICS_CHARS, 5).string;
  this.ackType = bb.readByte(47);
  this.serverTime = bb.readDouble(48);
}
export default IMStructReceipt