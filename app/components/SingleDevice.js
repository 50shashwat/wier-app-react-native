/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,  TouchableOpacity} from 'react-native';

export default class SingleDevice extends Component {

    render() {
        return (
           <View style={styles.device}><Text>Single Device</Text></View>
        );
    }



}

const styles = StyleSheet.create({
    device:{
        position: 'relative',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed',
    },
    deviceText: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#e91e63',

    },
    deviceConnect:{
        position: 'absolute',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#2980b9',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10
    },
    deviceConnectText:{
        color: 'white'
    }

});
