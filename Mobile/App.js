import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect } from "react";
import Navigation from './navigation/Navigator'
import Login from './views/Login'
import QrCodeScanner from "./components/Scanner";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [showQRComponent, setShowQRComponent] = useState(null);
  const [userAuth, setUserAuth] = useState(null);

  const [scannedId, setScanned] = useState(null);
  setComponent = () => {
    setShowQRComponent(true)
  }

  setScannedId = (id) => {
    setScanned(id);
    setShowQRComponent(null);
    alert(scannedId);
  }
  const signOut = async () => {
    try {
      AsyncStorage.clear();
      setUserAuth(null);
      let loginValues = await getAuthToken();
      console.log("User" + loginValues);
      console.log("User" + userAuth);


    } catch (e) {
      alert(e);
    }
  }

  const storeUserAuth = async (value) => {
    try {
      let user = {
        user_id: 1,
        first_name: "Niko",
        last_name: "Rudić"
      };
      let jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem('userAuth', jsonValue);
      let loginValues = await getAuthToken();
      console.log("User" + loginValues);
      setUserAuth(loginValues);
    } catch (e) {
      alert(e);
    }
  }

  async function getAuthToken() {
    return await AsyncStorage.getItem('userAuth').then((value) => value);
  }


  useEffect(() => {
    const backAction = () => {
      if (showQRComponent !== null) {
        setShowQRComponent(null);
      }
      else {
        BackHandler.exitApp();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [showQRComponent]);

  if (userAuth == null) return <Login tryLogin={storeUserAuth}></Login>;


  if (showQRComponent !== null) return <QrCodeScanner setScannedId={setScannedId} ></QrCodeScanner>;

  return (
    <View style={styles.container}>
      <Navigation setComponent={setComponent} signOut={signOut}></Navigation>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  }
});
