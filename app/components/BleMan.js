import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import  Device  from './Device';
import {PermissionsAndroid} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const timer = require('react-native-timer');

export default class  BleMan extends  Component{

    constructor(){
        super();

        this.state = {
            deviceArray:[{'device':'Device Name','deviceData':{}},{'device':'Device Name 2','deviceData':{}}],
            device:'',
            info: "",
            values: {},
            timer: null,
            counter: 0
        };

        this.manager = new BleManager();
        this.serviceUUIDs = "000000ee-0000-1000-8000-00805f9b34fb";
        this.readUUIDs = "0000ee01-0000-1000-8000-00805f9b34fb";

        //this.requestLocation();

    }

    async requestLocation() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'Needed Location Access',
                    message:
                    'Location Permission is Absolute Essential',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location Request Granted Successfully');
            } else {
                console.log('This app wont work. Go To App Settings and Enable Location Permission Mannually');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    render(){

        let devices = this.state.deviceArray.map((val, key)=>{
            return <Device key={key} keyVal={key} val={val}
                         connectMethod={()=> this.connectDevice(key)} />
        });

        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}> Wear App </Text>
                </View>
                <ScrollView style={styles.scrollContainer}>
                    {devices}
                </ScrollView>

                <TouchableOpacity onPress={this.searchDevice.bind(this)} style={styles.addButton}>
                    <Text style={styles.addButtonText}> <Icon name="search" size={30} color="#fff" /></Text>
                </TouchableOpacity>
            </View>
        )
    }

    connectDevice(key){
        let device = this.state.deviceArray[key].deviceData;

        device.connect()
            .then((device) => {
                this.info("Discovering services and characteristics");
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                this.info("Setting notifications");
                return this.setupNotifications(device);
            })
            .then(() => {
                this.info("Listening...");
            }, (error) => {
                this.error(error.message);
            });
        this.props.navigation.navigate('SingleDevice');
    }

    searchDevice(){
        this.setState({'counter':0})
    }

    serviceUUID() {
        return this.serviceUUIDs;
    }

    notifyUUID() {
        return this.readUUIDs;
    }

    writeUUID() {
        return this.readUUIDs;
    }

    info(message) {
        this.setState({info: message})
    }

    error(message) {
        this.setState({info: "ERROR: " + message})
    }

    updateValue(key, value) {
        this.setState({values: {...this.state.values, [key]: value}})
    }

    componentWillMount() {
        let timer = setInterval(this.tick, 1000);
        this.setState({timer});

        if (Platform.OS === 'ios') {
            this.manager.onStateChange((state) => {
                if (state === 'PoweredOn') this.scanAndConnect()
            })
        } else {
            this.scanAndConnect()
        }
    }

    componentWillUnmount() {
        this.clearInterval(this.state.timer);
    }

    tick =() => {
        this.setState({
            counter: this.state.counter + 1
        });
    };

    scanAndConnect() {
        let self = this;

        this.manager.startDeviceScan(null,
            null, (error, device) => {
                this.info("Scanning...");

                if (device) {
                   let skip = false;

                    if (!skip) {
                        self.state.deviceArray.push({
                            'device': device.name,
                            'deviceData': device
                        });
                        self.setState({'deviceArray': this.state.deviceArray});
                    }
                }


                console.log(device);

                if (error) {
                    this.error(error.message);
                    return
                }


                if (self.state.counter===10){
                    self.manager.stopDeviceScan();
                    self.state.counter=0;
                    console.log("Scan Completed");
                }
            });

    }

    async setupNotifications(device) {
        const service = this.serviceUUID();
        const characteristicW = this.writeUUID();
        const characteristicN = this.notifyUUID();

        const characteristic = await device.writeCharacteristicWithResponseForService(
            service, characteristicW, "" /* 0x01 in hex */
        );

        device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
            if (error) {
                this.error(error.message)
                return
            }
            this.updateValue(characteristic.uuid, characteristic.value)
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    header:{
        backgroundColor: '#E91E63',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd'
    },
    headerText:{
        color: 'white',
        fontSize:18,
        padding: 15
    },
    scrollContainer:{
        flex: 1,
        marginBottom: 100,
    },
    footer:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    textInput:{
        alignSelf: 'stretch',
        color: '#fff',
        padding: 20,
        backgroundColor: '#252525',
        borderTopWidth: 2,
        borderTopColor: '#ededed',
    },
    addButton:{
        position: 'absolute',
        zIndex:11,
        right: 20,
        bottom: 90,
        backgroundColor:'#E91E63',
        width: 90,
        height: 90,
        borderRadius:50,
        alignItems: 'center',
        justifyContent:'center',
        elevation: 8,
    },
    addButtonText:{
        color: '#fff',
        fontSize: 24
    }

});