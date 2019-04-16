/*表情包页面/暂时是第二种解决方案
author:xpf
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Provider,connect} from 'react-redux';
import {Form,Layout,Menu,Icon,Badge,Input} from 'antd';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import expression from "../resources/expression/expression.json"
class Expression extends React.Component {
    constructor(props) {
        super(props);
    }
    expressionClick = (e) => {
        
    }
    render() {
        return (
            <div>
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[0].key}  src={require('../resources/expression/'+expression[0].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[1].key}  src={require('../resources/expression/'+expression[1].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[2].key}  src={require('../resources/expression/'+expression[2].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[3].key}  src={require('../resources/expression/'+expression[3].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[4].key}  src={require('../resources/expression/'+expression[4].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[5].key}  src={require('../resources/expression/'+expression[5].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[6].key}  src={require('../resources/expression/'+expression[6].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[7].key}  src={require('../resources/expression/'+expression[7].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[8].key}  src={require('../resources/expression/'+expression[8].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[9].key}  src={require('../resources/expression/'+expression[9].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[10].key} src={require('../resources/expression/'+expression[10].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[11].key} src={require('../resources/expression/'+expression[11].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[12].key} src={require('../resources/expression/'+expression[12].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[13].key} src={require('../resources/expression/'+expression[13].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[14].key} src={require('../resources/expression/'+expression[14].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[15].key} src={require('../resources/expression/'+expression[15].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[16].key} src={require('../resources/expression/'+expression[16].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[17].key} src={require('../resources/expression/'+expression[17].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[18].key} src={require('../resources/expression/'+expression[18].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[19].key} src={require('../resources/expression/'+expression[19].value)} /><br/>
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[20].key} src={require('../resources/expression/'+expression[20].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[21].key} src={require('../resources/expression/'+expression[21].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[22].key} src={require('../resources/expression/'+expression[22].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[23].key} src={require('../resources/expression/'+expression[23].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[24].key} src={require('../resources/expression/'+expression[24].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[25].key} src={require('../resources/expression/'+expression[25].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[26].key} src={require('../resources/expression/'+expression[26].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[27].key} src={require('../resources/expression/'+expression[27].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[28].key} src={require('../resources/expression/'+expression[28].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[29].key} src={require('../resources/expression/'+expression[29].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[30].key} src={require('../resources/expression/'+expression[30].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[31].key} src={require('../resources/expression/'+expression[31].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[32].key} src={require('../resources/expression/'+expression[32].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[33].key} src={require('../resources/expression/'+expression[33].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[34].key} src={require('../resources/expression/'+expression[34].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[35].key} src={require('../resources/expression/'+expression[35].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[36].key} src={require('../resources/expression/'+expression[36].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[37].key} src={require('../resources/expression/'+expression[37].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[38].key} src={require('../resources/expression/'+expression[38].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[39].key} src={require('../resources/expression/'+expression[39].value)} /><br/>
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[40].key} src={require('../resources/expression/'+expression[40].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[41].key} src={require('../resources/expression/'+expression[41].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[42].key} src={require('../resources/expression/'+expression[42].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[43].key} src={require('../resources/expression/'+expression[43].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[44].key} src={require('../resources/expression/'+expression[44].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[45].key} src={require('../resources/expression/'+expression[45].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[46].key} src={require('../resources/expression/'+expression[46].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[47].key} src={require('../resources/expression/'+expression[47].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[48].key} src={require('../resources/expression/'+expression[48].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[49].key} src={require('../resources/expression/'+expression[49].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[50].key} src={require('../resources/expression/'+expression[50].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[51].key} src={require('../resources/expression/'+expression[51].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[52].key} src={require('../resources/expression/'+expression[52].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[53].key} src={require('../resources/expression/'+expression[53].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[54].key} src={require('../resources/expression/'+expression[54].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[55].key} src={require('../resources/expression/'+expression[55].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[56].key} src={require('../resources/expression/'+expression[56].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[57].key} src={require('../resources/expression/'+expression[57].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[58].key} src={require('../resources/expression/'+expression[58].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[59].key} src={require('../resources/expression/'+expression[59].value)} /><br/>
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[60].key} src={require('../resources/expression/'+expression[60].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[61].key} src={require('../resources/expression/'+expression[61].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[62].key} src={require('../resources/expression/'+expression[62].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[63].key} src={require('../resources/expression/'+expression[63].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[64].key} src={require('../resources/expression/'+expression[64].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[65].key} src={require('../resources/expression/'+expression[65].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[66].key} src={require('../resources/expression/'+expression[66].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[67].key} src={require('../resources/expression/'+expression[67].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[68].key} src={require('../resources/expression/'+expression[68].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[69].key} src={require('../resources/expression/'+expression[69].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[70].key} src={require('../resources/expression/'+expression[70].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[71].key} src={require('../resources/expression/'+expression[71].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[72].key} src={require('../resources/expression/'+expression[72].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[73].key} src={require('../resources/expression/'+expression[73].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[74].key} src={require('../resources/expression/'+expression[74].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[75].key} src={require('../resources/expression/'+expression[75].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[76].key} src={require('../resources/expression/'+expression[76].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[77].key} src={require('../resources/expression/'+expression[77].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[78].key} src={require('../resources/expression/'+expression[78].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[79].key} src={require('../resources/expression/'+expression[79].value)} /><br/>
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[80].key} src={require('../resources/expression/'+expression[80].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[81].key} src={require('../resources/expression/'+expression[81].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[82].key} src={require('../resources/expression/'+expression[82].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[83].key} src={require('../resources/expression/'+expression[83].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[84].key} src={require('../resources/expression/'+expression[84].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[85].key} src={require('../resources/expression/'+expression[85].value)} />
        <img onClick={this.expressionClick} style={{cursor: "pointer",float:"left"}} alt={expression[86].key} src={require('../resources/expression/'+expression[86].value)} />
        <br/><br/>
      </div>
        )
    }

}
Expression.propTypes = {

}
const mapStateToProps = (state) => {
    return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Expression);