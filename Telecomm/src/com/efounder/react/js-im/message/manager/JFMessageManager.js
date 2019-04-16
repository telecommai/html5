import ByteBuffer from "../../lib/bytebuffer-dataview"
import IMStructMessage from "../struct/IMStructMessage.js"
import IMStructReceipt from "../struct/IMStructReceipt.js"
import IMStructHeartbeat from "../struct/IMStructHeartbeat.js"
import IMStructLogin from "../struct/IMStructLogin.js"

function JFSocketManager() {
  this.socketManager;
  this.ws;
  this.delegate;
  this.sUserName;
  this.sPassword;
  this.serverURL;
  this.socketInterval;

  this.sharedSocketManager = function() {
    if (socketManager == undefined) {
      socketManager = new JFSocketManager();
    }
    return socketManager;
  };

  this.sendData = function(msg) {
    socketManager.ws.send(msg);
  };

  this.startConnect = function() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
        guid += "-";
    }
    //-------------获取deviceModel以及deviceVersion  begin--------//
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    var deviceModel = "";
    var deviceVersion = "";
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]:
      (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
      (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
      (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
      (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.ie) {
      deviceModel = "IE";
      deviceVersion = Sys.ie;
    }
    if (Sys.firefox) {
      deviceModel = "Firefox";
      deviceVersion = Sys.firefox;
    }
    if (Sys.chrome) {
      deviceModel = "Chrome";
      deviceVersion = Sys.chrome;
    }
    if (Sys.opera) {
      deviceModel = "Opera";
      deviceVersion = Sys.opera;
    }
    if (Sys.safari) {
      deviceModel = "Safari";
      deviceVersion = Sys.safari;
    }
    //-------------------------------end----------------------------//
    var url = this.serverURL + "/user/login?userId=" + this.sUserName + "&passWord=" + this.sPassword + "&deviceId=" + guid + "&deviceType=ws&deviceClass=ws" + "&deviceModel=" + deviceModel + "&deviceVersion=" + deviceVersion;

    fetch(url, {
        method: "get",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      }).then(response =>
        response.json())
      .then(data => {
        var json = data;
        var server = json['server'];
        var wss = server['WS'];
        var socketURL = wss[0];
        var token = json['token'];

        socketManager.ws = new WebSocket(socketURL);
        socketManager.ws.binaryType = "arraybuffer";
        socketManager.ws.onopen = function() {
          /////////////////发送上线消息/////////////////
          var imStructLogin = new IMStructLogin();
          imStructLogin.clientID = token;
          var loginAB = imStructLogin.toData();
          socketManager.sendData(loginAB);
          /////////////////发送上线消息/////////////////

          /////////////////发送心跳消息/////////////////
          this.socketInterval = setInterval(function heartBeat() {
            //console.log('heartbeat');
            var hb = new IMStructHeartbeat().toData();
            socketManager.sendData(hb);
          }, 30000);
          /////////////////发送心跳消息/////////////////
        }.bind(this);

        socketManager.ws.onmessage = function(res) {

          var bb = ByteBuffer.wrap(res.data);
          var messageType = bb.readByte(); //messageType
          //回执
          if (messageType == 3) {
            socketManager.delegate.receiptReceive(bb);
          }
          //消息
          else if (messageType == 2) {
            socketManager.delegate.messageReceive(bb);
          }
        };

        socketManager.ws.onclose = function() {
          if (this.socketInterval != undefined) {
            clearInterval(this.socketInterval);
          }
          socketManager.delegate.onSocketDidDisconnect();
        };
      })
  };

  this.stopConnect = function() {}
}


var JFMessageManager = function() {};
var JFMessageManagerPrototype = JFMessageManager.prototype;

var messageManager;
var delegateArray = new Array();
var isConnected = false;
var messageQueue = new Array();
var messageMap = {};
var currentDate;
var currentMessage;
var socketManager;
var userName;
var password;
var imURL;

JFMessageManager.sharedMessageManager = function() {
  if (messageManager == undefined) {
    messageManager = new JFMessageManager();
    socketManager = new JFSocketManager();
  }
  return messageManager;
}

JFMessageManagerPrototype.start = function() {
  socketManager.sUserName = this.userName;
  socketManager.sPassword = this.password;
  socketManager.serverURL = this.imURL;
  socketManager.delegate = this;
  socketManager.startConnect();
  setInterval(function sendMessageQueue() {
    var lastMessage = messageQueue[0];
    if (lastMessage == undefined) return;
    //如果当前正在发送的消息为空或者和队列头部的消息不是一个消息
    // 队列头部的消息是第一次发送 记录当前时间 用于超时判断
    if (currentMessage == undefined || currentMessage != lastMessage) {
      currentDate = Date.now();
      currentMessage = lastMessage;
      messageManager.changeMessageState(lastMessage, 2); //kMESSAGE_STATE_SENDING
    }
    //判断超时 把消息设置为发送失败 移除队列
    var second = Date.now() - currentDate;
    if (second > 60000) {
      messageManager.changeMessageState(lastMessage, 10); //kMESSAGE_STATE_FAILURE
      messageQueue.shift();
    } else if (lastMessage.state == 35) { //kMESSAGE_STATE_DELETE
      messageQueue.shift();
    } else {
      var messageAB = lastMessage.toData();
      socketManager.sendData(messageAB);
    }
  }, 2000);
}

JFMessageManagerPrototype.sendMessage = function(message) {
  messageMap[message.getMessageIDString()] = message;
  messageQueue.push(message);
}

JFMessageManagerPrototype.sendText = function(userID, text, type) {
  var message = new IMStructMessage();
  message.fromUserID = this.userName;
  message.toUserID = userID;
  message.message = text;
  message.postType = 0;
  message.subType = type;
  messageManager.sendMessage(message);
}

// JFMessageManagerPrototype.sendMessageQueue = function () {
//   var lastMessage = messageQueue[0];
//   if (lastMessage == undefined) return;
//   //如果当前正在发送的消息为空或者和队列头部的消息不是一个消息
//   // 队列头部的消息是第一次发送 记录当前时间 用于超时判断
//   if (currentMessage == undefined || currentMessage != lastMessage) {
//     currentDate = Date.now();
//     currentMessage = lastMessage;
//     JFMessageManager.sharedMessageManager().changeMessageState(lastMessage, 2);//kMESSAGE_STATE_SENDING
//   }
//   //判断超时 把消息设置为发送失败 移除队列
//   var second = Date.now() - currentDate;
//   if (second > 60) {
//     JFMessageManager.sharedMessageManager().changeMessageState(lastMessage, 10);//kMESSAGE_STATE_FAILURE
//     messageQueue.shift();
//   } else if (lastMessage.state == 35) {//kMESSAGE_STATE_DELETE
//     messageQueue.shift();
//   } else {
//     var messageAB = lastMessage.toData();
//     JFSocketManager.sharedSocketManager().sendData(messageAB);
//   }
// }

JFMessageManagerPrototype.startConnect = function() {
  socketManager.delegate = this;
  socketManager.startConnect();
}

JFMessageManagerPrototype.stopConnect = function() {
  socketManager.stopConnect();
}

JFMessageManagerPrototype.onSocketDidConnect = function() {
  isConnected = true;
  var de;
  for (var i = 0; i < delegateArray.length; i++) {
    de = delegateArray[i];
    de.onMessageDidConnect();
  }
}

JFMessageManagerPrototype.onSocketDidDisconnect = function(res) {
  isConnected = false;
  var de;
  var count = delegateArray.length;
  //保证唯一性
  for (var i = 0; i < count; i++) {
    de = delegateArray[0];
    delegateArray.splice(0, 1)
    de.onMessageDidDisConnect(res);
  }
}

JFMessageManagerPrototype.addMessageDelegate = function(delegate) {
  delegateArray.push(delegate);
}
JFMessageManagerPrototype.romveMessageDelegate = function(delegate) {
  for (var i = 0; i < delegateArray.length; i++) {
    if (delegateArray[i] === delegate) {
      delegateArray.splice(i, 1)
    }
  }
}
JFMessageManagerPrototype.receiptReceive = function(res) {
  var iMStructReceipt = new IMStructReceipt();
  iMStructReceipt.toStruct(res);
  var lastMessage = messageQueue[0];
  if (lastMessage == undefined) return;
  var mID = lastMessage.getMessageIDString();
  if (mID == iMStructReceipt.messageIDString) {

    messageQueue.shift();
    messageManager.changeMessageState(lastMessage, 15); //kMESSAGE_STATE_SEND
  }
}

JFMessageManagerPrototype.messageReceive = function(res) {
  var bb = res; //ByteBuffer.wrap(res.data);
  var imStructMessage = new IMStructMessage();
  imStructMessage.toStruct(res);
  //发送回执
  messageManager.sendReceipt(imStructMessage);
  //subType
  var subType = imStructMessage.subType;
  //已送达
  if (subType == 101) {
    var message = messageMap[imStructMessage.message];
    if (message != undefined) {
      messageManager.changeMessageState(message, 20); //kMESSAGE_STATE_RECEIVE
      var de;
      for (var i = 0; i < delegateArray.length; i++) {
        de = delegateArray[i];
        de.onMessageDidUpdate(message);
      }
    }
  }
  //系统消息
  else if (subType == 100) {
    var de;
    for (var i = 0; i < delegateArray.length; i++) {
      de = delegateArray[i];
      de.onMessageDidReceiveStruct(imStructMessage);
    }
  }
  //已查看
  else if (subType == 102) {
    var message = messageMap[imStructMessage.getMessageIDString()];
    //加了一个if判断，如果消息不是从本机发送的则直接改变消息状态为25
    if (message != undefined && message != null) {
      messageManager.changeMessageState(message, 25); //kMESSAGE_STATE_READ
    } else {
      messageManager.changeMessageState(imStructMessage, 25)
    }
    var de;
    for (var i = 0; i < delegateArray.length; i++) {
      de = delegateArray[i];
      de.onMessageDidUpdate(message);
    }
  }
  //消息
  else {
    var message = messageMap[imStructMessage.getMessageIDString()];
    if (message == undefined) {
      var de;
      for (var i = 0; i < delegateArray.length; i++) {
        de = delegateArray[i];
        de.onMessageDidReceiveStruct(imStructMessage);
      }
    }
  }
}

JFMessageManagerPrototype.changeMessageState = function(message, state) {

  message.state = state;
  var de;
  for (var i = 0; i < delegateArray.length; i++) {
    de = delegateArray[i];
    de.onMessageDidUpdate(message);
  }
}

JFMessageManagerPrototype.sendReceipt = function(message) {
  var receipt = new IMStructReceipt();
  receipt.ackType = 0;
  receipt.serverTime = message.serverTime;
  receipt.fromUserID = message.fromUserID;
  receipt.toUserID = message.toUserID;
  receipt.time = message.time;
  receipt.postType = message.postType;
  receipt.messageID = message.messageID;
  receipt.messageIDString = message.getMessageIDString();
  var messageAB = receipt.toData();
  socketManager.sendData(messageAB);
  //JFMessageManager.sharedMessageManager().sendMessage(receipt);
}

export default JFMessageManager