/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Text, View,  TouchableOpacity} from 'react-native';

import {connect} from 'react-redux';

export class Counter extends Component {

    render() {
        return (
            <View style={{flexDirection:'row', width:200, justifyContent: 'space-around'}}>
                <TouchableOpacity>
                    <Text style={{fontSize:20}} onPress={()=>this.props.increaseCounter()}>
                        Increase
                    </Text>
                </TouchableOpacity>
                <Text style={{fontSize:20}}>{this.props.counter}</Text>
                <TouchableOpacity onPress={()=>this.props.increaseCounter()}>
                    <Text style={{fontSize:20}}>
                        Decrease
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    increaseCounter(){
        this.props.decreaseCounter();
    }


}

function mapStateToProps(state){
    return {
        counter: state.counter
    }
}

function mapDispatchToProps(dispatch){
    return {
        increaseCounter: ()=> dispatch({type: 'INCREASE_COUNTER'}),
        decreaseCounter: ()=> dispatch({type: 'DECREASE_COUNTER'})

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Counter)

