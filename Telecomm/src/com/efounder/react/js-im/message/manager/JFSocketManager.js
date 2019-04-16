function JFSocketManager() {
  this.socketManager;
  this.ws;
  this.delegate;
  this.sUserName;
  this.sPassword;
  this.serverURL;


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
    var url = this.serverURL + "/user/login?userId=" + this.sUserName + "&passWord=" + this.sPassword + "&deviceId=" + guid;
    $.ajax({
      url: url,
      type: "get",
      data: {},
      dataType: "json",
      error: function() {},
      beforeSend: function() {},
      success: function(data) {
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
          setInterval(function heartBeat() {
            //console.log('heartbeat');
            var hb = new IMStructHeartbeat().toData();
            socketManager.sendData(hb);
          }, 30000);
          /////////////////发送心跳消息/////////////////
        };

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
          clearInterval();
          socketManager.delegate.onSocketDidDisconnect();
        };
      }
    })
  };

  this.stopConnect = function() {}
}

module.exports = {
  startConnect: startConnect,
  stopConnect: stopConnect,
  sendData: sendData,
  sharedSocketManager: sharedSocketManager
}