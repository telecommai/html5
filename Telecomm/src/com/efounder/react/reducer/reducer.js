/*这是一个总的reducer文件用于把各个reducer集合在一起
author:xpf
*/
import {
	combineReducers
} from 'redux';
import ContactsListClickReducer from './ContactsListClickReducer.js';
import MainMenuClickReducer from './MainMenuClickReducer.js';
import ChatListReducer from './ChatListReducer.js';
import LoadContactListReducer from './LoadContactListReducer.js';
import LoadGroupUserListReducer from './LoadGroupUserListReducer.js';
import SystemMsgReducer from './SystemMsgReducer.js';
import ThemeReducer from './ThemeReducer.js';
import WindowSizeReducer from './WindowSizeReducer.js';
import UserInfoReducer from './UserInfoReducer.js';
import CoinCountReducer from './CoinCountReducer.js';
import WalletClickReducer from './WalletClickReducer.js';
import ReKeyStatusReducer from './ReKeyStatusReducer.js';
import WalletListReducer from './WalletListReducer.js';

const rootReducer = combineReducers({
	//为子reducer设置了key值之后，可以在容器组件中比较轻易的绑定该部分对应的数据，下文会再次提到这点
	ContactsListClickReducer, //用户列表点击reducer
	MainMenuClickReducer, //顶部菜单点击reducer
	ChatListReducer, //点击添加聊天列表reducer
	LoadContactListReducer, //好友列表持久化
	LoadGroupUserListReducer, //群组列表持久化
	SystemMsgReducer, //系统消息
	ThemeReducer, //主题颜色
	WindowSizeReducer, //浏览器宽高
	UserInfoReducer, //当前登录的用户的信息
	CoinCountReducer, //币数量信息
	WalletClickReducer, //钱包左侧row点击
	ReKeyStatusReducer, //恢复钱包的弹窗
	WalletListReducer, //子钱包
});

export default rootReducer;