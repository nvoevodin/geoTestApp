import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';
const moment = require("moment");
const LOCATION_TRACKING = 'location-tracking';
//global.x = 'https://volleybuddy.metis-data.site';



export default function App() {



  const stopLocationTracking = async () => {
    alert('TRACKING IS STOPPED');

    TaskManager.unregisterTaskAsync(LOCATION_TRACKING);
  };


  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 15000,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log('tracking started?', hasStarted);
  };

  useEffect(() => {
    const config = async () => {
      let res = await Permissions.askAsync(Permissions.LOCATION);
      if (res.status !== 'granted') {
        console.log('Permission to access location was denied');
      } else {
        console.log('Permission to access location granted');
      }
    };

    config();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Start tracking" onPress={startLocationTracking} />

      <Button style = {{marginTop:50}} title="Stop tracking" onPress={stopLocationTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

TaskManager.defineTask(LOCATION_TRACKING, ({ data, error }) => {
  if (error) {
    console.log('LOCATION_TRACKING task ERROR:', error);
    return;
  }
  if (data) {
    let sqlStamp = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    console.log(sqlStamp)
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    console.log(
      `${sqlStamp}: ${lat},${long}`
    );

    // fetch(
    //   `${global.x}/addGlobal?datetime=${sqlStamp}&latitude=${lat}&longitude=${long}&nearest_site=${'test'}&email=${'NIKITATEST@GMAIL.COM'}&distance=${5}`,
    //   { method: "POST" }
    //   ).catch((error) => {
    //     console.log('ERROR:',error)
    //   })


  }
});

