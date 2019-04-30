import React,{Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, TextInput, View, ScrollView} from 'react-native';

export default class Design extends Component{
    render(){
        return(
            <View style={styles.container}>
                <View style={[styles.boxContainer, styles.box1]}>
                    <Text>Container 1</Text>
                    <Text>Container 1</Text>
                    <Text>Container 1</Text>
                </View>

                <View style={[styles.boxContainer, styles.box2]}>
                    <Text>Container 2</Text>
                </View>

                <View style={[styles.boxContainer, styles.box3]}>
                    <Text>Container 3</Text>
                    <Text>Container 3</Text>
                    <Text>Container 3</Text>
                    <Text>Container 3</Text>
                    <Text>Container 3</Text>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    boxContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    box1:{
        flex:3,
        backgroundColor:'red',
        justifyContent:'space-between',
        alignItems:'flex-start'
    },
    box2:{
        backgroundColor:'green'
    },
    box3:{
        flexDirection:'row',
        backgroundColor:'blue',
        alignItems:'flex-end'
    }
});