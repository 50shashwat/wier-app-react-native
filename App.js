/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import BleMan from "./app/components/BleMan";
import { createStackNavigator } from "react-navigation";
import SingleDevice from "./app/components/SingleDevice";


export  default  class App extends Component {

  render() {

    return (
        <AppNavigator />
    );
  }

}

const AppNavigator = createStackNavigator({
    Home: {
        screen: BleMan
    },
    Device: {
        screen : SingleDevice
    }
});




