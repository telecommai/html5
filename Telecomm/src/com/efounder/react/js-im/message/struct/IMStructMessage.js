import ByteBuffer from "../../lib/bytebuffer-dataview"


var IMStructMessage = function() {
  this.messageType = 2;
  this.version = 0;
  this.state = -1;
  this.offline = 0;
  var ddate = Date.now();
  this.timeDouble = ddate;
  this.messageID = 1234;
};
var IMStructMessagePrototype = IMStructMessage.prototype;

var messageType; //消息类型     0:心跳  1:首次登录  2:点对点消息  3:回执
var version; //版本号
var messageLength; //消息长度
var fromUserID; //来源用户ID
var toUserID; //发送到用户ID
var timeDouble;
var time; //消息时间
var serverTime; //服务器时间
var serverTimeDouble;
var messageID; //消息ID
var postType; //postType:0个人到个人，1个人到群组
var subType; //消息子类型     0:文本  1:图片  2:音频  3:视频  99:用户自定义
var messageContentLength; //消息内容长度
var body; //消息内容data
var message; //消息内容
var messageIDString; //消息ID 消息唯一标识
var userID;
var isHavePMsgId; //是否有parentID
var pMsgId; //父消息ID
var pUserId; //父用户ID
var localTime;
var userAvatar;
var userNickName;
var offline; //离线消息标志
var state;
var ackType //回执类型 0:送达 1:已读
var integralType;
var integralSubtype;
var integral;

IMStructMessagePrototype.toData = function() {
  var pMsgID = false;
  var message = new ByteBuffer().writeInt8(this.messageType); //messageType
  var bodyLength = ByteBuffer.calculateUTF8Bytes(this.message);
  var len = 2 + 4 + 4 + 8 + 8 + 4 + 1 + 2 + 4 + bodyLength + 1;
  if (pMsgID) {
    len += 42;
  }
  len += 4;
  message.writeInt32(len); //messageLength
  message.writeInt16(this.version); //version
  message.writeInt32(this.fromUserID); //fromUserID
  message.writeInt32(this.toUserID); //toUserID
  message.writeLong(this.timeDouble);
  message.writeLong(this.timeDouble);
  message.writeInt32(this.messageID); //messageID
  message.writeInt8(this.postType); //postType
  message.writeUint16(this.subType); //subType
  message.writeInt32(bodyLength); //bodyLength
  var m = message.flip();
  var messageBody = new ByteBuffer().writeString(this.message).flip();
  messageBody.limit = bodyLength;
  var message2 = ByteBuffer.concat([m, messageBody]);
  var message3 = new ByteBuffer();
  if (pMsgID) {
    message3.writeInt8(1).writeString('pMsgID').flip();
    message3.limit = 1 + 42;
  } else {
    message3.writeInt8(0);
  }
  message3.writeInt32(0);
  var message4 = message3.flip();
  var message5 = ByteBuffer.concat([message2, message4]);
  return message5.toArrayBuffer();
}


IMStructMessagePrototype.toStruct = function(bb) {
  this.fromUserID = bb.readInt(7);
  this.toUserID = bb.readInt(11);
  this.timeDouble = bb.readLong(15);
  this.time = new Date(parseInt(this.timeDouble, 10));
  this.serverTimeDouble = bb.readLong(23);
  this.serverTime = new Date(parseInt(this.serverTimeDouble, 10));
  this.messageID = bb.readInt(31);
  this.postType = bb.readByte(35);
  this.subType = bb.readUint16(36);
  this.messageContentLength = bb.readInt(38);
  this.message = bb.readString(this.messageContentLength, ByteBuffer.METRICS_BYTES, 42).string;
  this.isHavePMsgId = bb.readByte(this.messageContentLength + 42);
  var pMsgIndex;
  if (this.isHavePMsgId == 1) {
    this.pMsgId = bb.readString(42, ByteBuffer.METRICS_BYTES, 43 + this.messageContentLength);
    pMsgIndex = 43 + this.messageContentLength + 42;
  } else {
    pMsgIndex = 43 + this.messageContentLength;
  }
  this.pUserId = bb.readInt(pMsgIndex);
  this.offline = bb.readByte(pMsgIndex + 4);
  var integralIndex = pMsgIndex + 4 + 1;
  //有积分消息才继续往下解析
  if (integralIndex < bb.limit) {
    this.integralType = bb.readByte(integralIndex);
    this.integralSubtype = bb.readByte(integralIndex + 1);
    this.integral = bb.readByte(integralIndex + 3);
  }
}

IMStructMessagePrototype.getMessageIDString = function() {
  if (this.messageIDString == undefined) {
    var mid = new ByteBuffer().writeInt32(this.fromUserID);
    mid.writeInt32(this.toUserID);
    mid.writeLong(this.timeDouble);
    mid.writeInt32(this.messageID);
    mid.writeInt8(this.postType);
    var r = mid.flip();
    this.messageIDString = r.toHex().toUpperCase();
  }
  return this.messageIDString;
}

export default IMStructMessage