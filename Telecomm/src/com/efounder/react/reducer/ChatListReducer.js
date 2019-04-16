/*用于在聊天界面添加聊天
  author:xpf
*/
function ChatListReducer(state = {
	chatlist: [],
	chatrecord: [],
	currentChat: null,
	msgarr: [],
	sendfilearr: [],
	unreadcount: 0,
}, action) {
	switch (action.type) {
		case 'AddChat':
			var newState = Object.assign({}, state);
			newState.currentChat = action.chat;
			//判断点击的这个chat是否在列表中，如果在则把最新的聊天记录放到msgarr
			var num = 0
			for (var value of newState.chatlist) {
				if (value.id == action.chat.id) {
					var msgarr = null;
					for (var value of newState.chatrecord) {
						if (newState.currentChat.id == value.chatid) {
							msgarr = value.chatrecord;
							break;
						}
					}
					newState.chatlist[num].unreadnum = 0
					var urcount = 0;
					for (var i = newState.chatlist.length - 1; i >= 0; i--) {
						if (newState.chatlist[i].unreadnum != 0 && newState.chatlist[i].unreadnum != undefined) {
							urcount = urcount + newState.chatlist[i].unreadnum
						}
					}
					newState.unreadcount = urcount;
					newState.msgarr = msgarr;
					return {
						...newState
					};
				}
				num++
			}
			newState.chatlist.push(action.chat);
			for (var value of newState.chatrecord) {
				if (newState.currentChat != undefined && newState.currentChat != null) {
					if (newState.currentChat.id == value.chatid) {
						newState.msgarr = value.chatrecord;
						return {
							...newState
						};
					}
				}
			}
			newState.chatrecord.push({
				"chatid": action.chat.id,
				"chatrecord": [],
			})
			newState.msgarr = [];
			return {
				...newState
			};
		case 'AddChatUser':
			var newState = Object.assign({}, state);
			if (newState.currentChat == null || newState.currentChat == undefined) {
				newState.currentChat = action.chat;
			}
			for (var value of newState.chatlist) {
				if (value.id == action.chat.id) {
					return { ...newState
					};
				}
			}
			newState.chatlist.push(action.chat);
			return {
				...newState
			};
		case 'RemoveChat':
			var newState = Object.assign({}, state);
			var newchatlist = [];
			for (var value of newState.chatlist) {
				if (value.id != action.chat.id) {
					newchatlist.push(value);
				}
			}
			newState.chatlist = newchatlist;
			newState.currentChat = newState.chatlist[0];
			var msgarr = null;
			for (var value of newState.chatrecord) {
				if (newState.currentChat != undefined && newState.currentChat != null) {
					if (newState.currentChat.id == value.chatid) {
						msgarr = value.chatrecord;
					}
				}
			}
			newState.msgarr = msgarr;
			return {
				...newState
			};
		case 'AddChatRecord':
			var newState = Object.assign({}, state);
			var flag = false;
			var chat = action.chat;
			//遍历当前消息列表如果当前消息ID的列表存在，则直接插入到列表中。
			for (var value of newState.chatrecord) {
				if (value.chatid == action.chatid) {
					var flag2 = false;
					for (var i = value.chatrecord.length - 1; i >= 0; i--) {
						if (value.chatrecord[i].messageIDString == action.message.messageIDString) {
							flag2 = true;
						}
					}
					if (value.chatrecord.length != 0) {
						var begintime = new Date(value.chatrecord[value.chatrecord.length - 1].time);
						var endtime = new Date(action.message.time);
						var differtime = (endtime - begintime) / 1000;
						if (differtime > 60) {
							var defmsg = {};
							defmsg.subType = 1001;
							defmsg.time = action.message.time;
							value.chatrecord.push(defmsg)
						}
					}
					if (!flag2) {
						value.chatrecord.push(action.message)
					}
					flag = true;
					break;
				}
			}
			//如果不存在与当前列表，则插入一个新列表
			if (!flag) {
				newState.chatrecord.push({
					"chatid": action.chatid,
					"chatrecord": [action.message],
				})
				newState.chatlist.push(action.chat);
			}
			//遍历聊天列表，查看是否需要在聊天列表插入当前聊天
			var havechat = false;
			for (var value of newState.chatlist) {
				if (value.id == action.chat.id) {
					havechat = true;
				}
			}
			if (!havechat) {
				newState.chatlist.push(action.chat);
			}
			if (newState.currentChat == null) {
				newState.currentChat = action.chat;
			}
			//判断是否是未读消息，是则在聊天列表的未读消息上+1
			for (var value of newState.chatlist) {
				if (value.id == action.chat.id) {
					if (action.message.state == 30) {
						if (value.unreadnum == undefined || value.unreadnum == 0 || value.unreadnum == null || value.unreadnum == "") {
							value.unreadnum = 1
						} else {
							value.unreadnum = value.unreadnum + 1
						}
					} else {
						value.unreadnum = 0
					}
					break;
				}
			}
			//计算未读条数
			var urcount = 0;
			for (var i = newState.chatlist.length - 1; i >= 0; i--) {
				if (newState.chatlist[i].unreadnum != 0 && newState.chatlist[i].unreadnum != undefined) {
					urcount = urcount + newState.chatlist[i].unreadnum
				}
			}
			//在chatlist里面插入当前聊天信息
			for (var value of newState.chatlist) {
				if (value.id == action.chat.id) {
					value.time = action.message.time;
					if (action.message.subType == 0) {
						value.breviarymsg = action.message.message;
					} else if (action.message.subType == 1) {
						value.breviarymsg = "[图片消息]";
					} else if (action.message.subType == 5) {
						value.breviarymsg = "[文件消息]";
					} else {
						value.breviarymsg = "不支持的消息类型，请在手机端查看";
					}
				}
			}
			//遍历插入到新的数组，去更新state
			var msgarr = null;
			for (var value of newState.chatrecord) {
				if (newState.currentChat.id == value.chatid) {
					msgarr = value.chatrecord;
				}
			}
			var newchatrecord = [];
			for (var value of newState.chatrecord) {
				newchatrecord.push(value);
			}
			var newchatlist = [];
			for (var value of newState.chatlist) {
				newchatlist.push(value);
			}
			newState.chatlist = newchatlist;
			newState.chatrecord = newchatrecord;
			newState.msgarr = msgarr;
			newState.currentChat = newState.currentChat;
			newState.unreadcount = urcount;
			return {
				...newState
			};
		case 'ChangeChatIsFriend':
			var newState = Object.assign({}, state);
			var newchatlist = [];
			for (var value of newState.chatlist) {
				if (value.id == action.id) {
					value.isfriend = true;
				}
				newchatlist.push(value)
			}
			state.chatlist = newchatlist;
			return {
				...state
			}
		case 'ChangeRecordState':
			//用于我本地发送后的消息状态改变
			var newState = Object.assign({}, state);
			//获取所有聊天记录
			var newrecord = newState.chatrecord;
			var chatid = null;
			var messageIDString = null;
			//如果是102的已查看状态的系统回执消息则chatid=fromuserid
			if (action.message.subType == 102) {
				chatid = action.message.fromUserID;
				messageIDString = action.message.message
			} else {
				chatid = action.message.toUserID;
				messageIDString = action.message.messageIDString
			}
			//定义当前chatid的聊天记录
			var record = null;
			var num = 0;
			for (var value of newrecord) {
				if (value.chatid == chatid) {
					record = value.chatrecord;
					break;
				}
				num++;
			}
			//如果没有聊天记录则直接返回state
			if (record == null) {
				return {
					...state
				};
			}
			//遍历当前聊天记录里的状态记录，改变状态
			var num2 = 0;
			for (var value of record) {
				if (value.messageIDString == messageIDString) {
					newrecord[num].chatrecord[num2].state = action.message.state;
					if (action.message.state == "25") {
						newrecord[num].chatrecord[num2].integral = 20;
					}
					break;
				}
				num2++
			}
			//如果聊天正在当前显示，则改变消息中的状态
			var msgarr = newState.msgarr;
			if (newState.currentChat.id == chatid) {
				msgarr[num2].state = action.message.state;
			}

			state.chatlist = newState.chatlist;
			state.chatrecord = newrecord;
			state.msgarr = msgarr;
			state.currentChat = newState.currentChat;
			return {
				...state
			};
		case "ChangeAceptState":
			//用于接收到消息的状态改变
			var newState = Object.assign({}, state);
			//获取所有聊天记录
			var newrecord = newState.chatrecord;
			var chatid = action.message.chatid;
			var messageIDString = action.message.messageIDString;
			//定义当前chatid的聊天记录
			var record = null;
			var num = 0;
			for (var value of newrecord) {
				if (value.chatid == chatid) {
					record = value.chatrecord;
					break;
				}
				num++;
			}
			//如果没有聊天记录则直接返回state
			if (record == null) {
				return {
					...state
				};
			}
			//遍历当前聊天记录里的状态记录，改变状态
			var num2 = 0;
			for (var value of record) {
				if (value.messageIDString == messageIDString) {
					newrecord[num].chatrecord[num2].state = action.message.state;
					break;
				}
				num2++
			}
			state.chatrecord = newrecord;
		case "FileStateChange":
			//用于文件的状态改变
			var newState = Object.assign({}, state);
			//获取所有聊天记录
			var newrecord = newState.chatrecord;
			var chatid = action.message.chatid;
			var messageIDString = action.message.beforeMsgId;
			//定义当前chatid的聊天记录
			var record = null;
			var num = 0;
			for (var value of newrecord) {
				if (value.chatid == chatid) {
					record = value.chatrecord;
					break;
				}
				num++;
			}
			//如果没有聊天记录则直接返回state
			if (record == null) {
				return {
					...state
				};
			}
			//遍历当前聊天记录里的状态记录，改变状态
			var num2 = 0;
			for (var value of record) {
				if (value.messageIDString == messageIDString) {
					newrecord[num].chatrecord[num2] = action.message;
					break;
				}
				num2++
			}
			newState.chatrecord = newrecord;
			var msgarr = null;
			for (var value of newState.chatrecord) {
				if (newState.currentChat.id == value.chatid) {
					msgarr = value.chatrecord;
				}
			}
			newState.msgarr = msgarr;
			return {
				...newState
			};
		case 'AddFile':
			var newState = Object.assign({}, state);
			newState.sendfilearr.push(action.fileinfo);
			return {
				...newState
			}
		case 'DeleteFile':
			var newState = Object.assign({}, state);
			var count = null;
			var sendfilearr = newState.sendfilearr;
			for (var i = sendfilearr.length - 1; i >= 0; i--) {
				if (sendfilearr[i].uid == action.fileinfo.uid) {
					count = i;
					break;
				}
			}
			if (count == null) {
				return {
					...newState
				}
			}
			sendfilearr.splice(count, 1);
			newState.sendfilearr = sendfilearr;
			return {
				...newState
			}
		default:
			return state;
	}
}
export default ChatListReducer