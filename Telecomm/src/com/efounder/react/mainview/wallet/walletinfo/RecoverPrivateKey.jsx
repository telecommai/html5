/*暂时不用
author:xpf
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import { Form,Layout,Menu,Icon,Avatar,Badge,Input } from 'antd';
import {BrowserRouter as Router,Route, Link} from 'react-router-dom';
//最好类名跟文件名对应
class Template extends React.Component {
  constructor(props) {
    super(props);
  }
  //组件挂载完成后回调
  componentDidMount() {}
  //组件有更新后回调
  componentDidUpdate() {}
  //组件将要挂载时回调
  componentWillMount() {}
  //组件销毁时回调
  componentWillUnmount() {}
  //props改变回调函数
  componentWillReceiveProps(nextProps) {}
  //组件的渲染界面
  render() {
    return (
      <div></div>
    )
  }
          
}
//类属性
Template.propTypes = {

}
//映射store中的数据至本页面state
const mapStateToProps = (state) => {
  return {

  }
}
//映射派发action至本页面
const mapDispatchToProps = (dispatch) => {
  return {

  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Template);