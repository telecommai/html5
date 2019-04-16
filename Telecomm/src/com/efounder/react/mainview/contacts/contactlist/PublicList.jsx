/*公众号列表
author：xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Form,Layout,Menu,Icon,List,Avatar,Badge,Input,Button,Modal,Card,Checkbox,Table,Row,Col,Spin} from 'antd';
import '../../../style/TableList.css'
const {Header,Footer,Sider,Content} = Layout;
const {Meta} = Card;
const {Column} = Table;
const data = [];
class PublicList extends React.Component {
  constructor(props) {
    super(props);
  }
  onSelectRow = (e) => {
    this.setState({
      username: e.name,
    })
  }
  componentWillMount() {
  }
    //组件挂载完成后回调
  componentDidMount() {
    clearInterval(this.timerID);
    var th_array = document.getElementsByTagName('th');
    for (var i = 0; i < th_array.length; i++) {
      th_array[i].style.border = '0px';
    }
    var td_array = document.getElementsByTagName('td');
    for (var i = 0; i < td_array.length; i++) {
      td_array[i].style.border = '0px';
    }
  }
  componentDidUpdate() {
    var th_array = document.getElementsByTagName('th');
    for (var i = 0; i < th_array.length; i++) {
      th_array[i].style.border = '0px';
    }
    var td_array = document.getElementsByTagName('td');
    for (var i = 0; i < td_array.length; i++) {
      td_array[i].style.border = '0px';
    }
    var table_array = document.getElementsByTagName('table');
    for (var i = 0; i < table_array.length; i++) {
      table_array[i].style.padding = '0 0 0 0px';
    }
  }
  render() {
    return (
      <Layout style={{backgroundColor:this.props.theme.listbgcolor}}>
                    {/*<Layout style={{backgroundColor:"#FFFFFF"}}><span>应用号{this.props.publiclist.length}</span></Layout>*/}
                    <Content style={{backgroundColor:this.props.theme.listbgcolor}}>
                      <Spin tip="加载应用号列表..." spinning={this.props.publiclistresult!="success"}>
                      <Table 
                      dataSource={this.props.publiclist} 
                      showHeader={false}
                      rowClassName = {
                        (record, index) => {
                            return "tableClass"
                        }
                      }
                      split={false}
                      pagination={false}
                      onRow={(record) => ({
                          onClick: ()=>{this.onSelectRow},
                          onDoubleClick: ()=>{
                                            },
                          onContextMenu: () => {},
                          onMouseEnter: () => {},
                          onMouseLeave: () => {},
                        })
                      }
                      pagination={false}>
                          <Column
                            title="应用号列表"
                            key="publicList"
                            render={(text, record) => (
                              <div>
                                <Row>
                                  <Col span={6}>
                                  {("avatar" in record)?
                                    <img src={record.avatar} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                                    :
                                    <img src={require("../../../resources/icon/group.png")} style={{width:this.props.windowHeight*0.06,height:this.props.windowHeight*0.06,borderRadius:100000}}/>
                                  }
                                  </Col>
                                  <Col span={18}>
                                    <span style={{color:this.props.theme.listfontcolor}}>{record.groupName}</span>
                                  </Col>
                                </Row>
                              </div>
                            )}
                          />
                      </Table>
                      </Spin>
                    </Content>
              </Layout>
    )
  }
}
PublicList.propTypes = {
  //先注释
  //ContactsListClickAction:PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    windowHeight: state.WindowSizeReducer.windowHeight,
    windowWidth: state.WindowSizeReducer.windowWidth,
    theme: state.ThemeReducer.theme,
    publiclist: state.LoadContactListReducer.publiclist,
    publiclistresult: state.LoadContactListReducer.publiclistresult,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    //稍后添加群组点击事件或者使用下面这个点击action
    //ContactsListClickAction: (user,listtype) => {//页面加载时，派发Action用于加载表单中组件的默认值
    //    dispatch(ContactsListClickAction(user,listtype));
    //},
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicList);