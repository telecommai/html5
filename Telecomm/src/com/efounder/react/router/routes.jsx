/**路由
 * author：xpf
 */
import React from 'react'
/*import {BrowserRouter as Router,Route} from 'react-router-dom';*/
import {HashRouter as Router,Route} from 'react-router-dom';
import { browserHistory } from 'react-router';

import LoginForm from '../login/LoginForm.jsx';
import loginBak from '../login/loginBak.jsx';
import MainForm from '../mainview/MainForm.jsx';
import test from '../mainview/Test.jsx'
import WalletMnemonic from '../component/WalletMnemonic.jsx';
import CreateMnemonicPanel from '../containers/CreateMnemonicPanel.jsx';
import RecoverMnemonicPanel from '../containers/RecoverMnemonicPanel.jsx';
import {Form} from 'antd';
//</Route>
// 增加路由后应用定义
const Routes = () => (
    <Router history={browserHistory}>
        <div>
            <Route exact path="/" component={Form.create()(MainForm)}/>
            <Route path="/login" component={Form.create()(LoginForm)}/>
            <Route path="/test" component={Form.create()(test)}/>
            {/*<Route path="/loginBak" component={Form.create()(loginBak)}/>
            <Route path="/chatpanel" component={Form.create()(ShareChatPanel)}/>
            <Route path="/personalcard" component={Form.create()(SharePersonalCard)}/>
            <Route path="/addfriend" component={Form.create()(ShareAddFriend)}/>*/}
        </div>
    </Router>
);
export default Routes;