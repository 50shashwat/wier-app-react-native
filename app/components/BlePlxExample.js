import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text, ScrollView} from 'react-native';
import { BleManager } from 'react-native-ble-plx';


export default class BlePlxExample extends Component{

    constructor() {
        super();
        this.manager = new BleManager();
        this.state = {info: "", values: {}};
        this.serviceUUIDs = "000000ee-0000-1000-8000-00805f9b34fb";
        this.readUUIDs = "0000ee01-0000-1000-8000-00805f9b34fb";
        this.sensors = {
            0: "Temperature",
            1: "Accelerometer",
            2: "Humidity",
            3: "Magnetometer",
            4: "Barometer",
            5: "Gyroscope"
        };
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
        if (Platform.OS === 'ios') {
            this.manager.onStateChange((state) => {
                if (state === 'PoweredOn') this.scanAndConnect()
            })
        } else {
            this.scanAndConnect()
        }
    }

    scanAndConnect() {
        this.manager.startDeviceScan(null,
            null, (error, device) => {
                this.info("Scanning...");
                console.log(device);

                if (error) {
                    this.error(error.message);
                    return
                }

                if (device.name === 'Test' || device.name === 'SensorTag') {
                    this.info("Connecting to "+device.name);
                    this.manager.stopDeviceScan();

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
                            this.error(error.message)
                        })
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

    render(){
        return(
            <View style={styles.container}>
                <Text>{this.state.info}</Text>
                    {Object.keys(this.sensors).map((key) => {
                        return <Text key={key}>
                            {this.sensors[key] + ": " + (this.state.values[this.notifyUUID(key)] || "-")}
                        </Text>
                    })}
            </View>
        )
    }


}

const styles = StyleSheet.create({
    'container': {
        flex: 1
    }

});