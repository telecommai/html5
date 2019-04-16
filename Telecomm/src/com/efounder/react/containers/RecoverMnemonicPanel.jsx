import React, { Component } from 'react';
import { Form,Input,Row,Col,Button,Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import FormMnemonicCard from '../component/FormMnemonicCard.jsx';
import FormPrivateCard from '../component/FormPrivateCard.jsx';
import '../style/formTabs.css'
class RecoverMnemonicPanel extends Component {
    render(){
        return(
            <div style={{height:'100%',backgroundColor:'#0A182D'}}>
                <Tabs defaultActiveKey="1">
                    <TabPane style={{color:'#FFF'}} tab="助记词" key="1">
                        <FormMnemonicCard></FormMnemonicCard>
                    </TabPane>
                    <TabPane tab="私钥" key="2">
                        <FormPrivateCard></FormPrivateCard>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default RecoverMnemonicPanel;