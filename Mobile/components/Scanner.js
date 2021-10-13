import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Constants from "expo-constants";
import ScannerOverlay from "./ScannerCameraOverlay";

const ScanQrCode = (props) => {
    const [isScanned, setScanned] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    useEffect(() => {
        startScan()
    }, []);

    const startScan = () => {
        setScanned(false);

        // Request camera permission
        if (!hasPermission) {
            (async () => {
                const { status } = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === "granted");
            })();
        }
    };

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        props.setScannedId(data);
    };

    return (
        <SafeAreaView style={styles.container}>
            {!isScanned && hasPermission && (
                <View style={{ flex: 1 }}>
                    <BarCodeScanner
                        style={StyleSheet.absoluteFillObject}
                        onBarCodeScanned={handleBarCodeScanned}
                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    />
                </View>
            )}

            <View style={styles.content}>
                {isScanned !== null && hasPermission === null && (
                    <Text style={styles.helpText}>Potrebna su dopuštenja za upotrebu kamere</Text>
                )}

                {isScanned !== null && hasPermission === false && (
                    <Text style={styles.helpText}>Onemogućen pristup kameri</Text>
                )}

                {isScanned === false && hasPermission && (
                    <ScannerOverlay />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#000",
    },
    content: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    helpTextWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    helpText: {
        color: "#fff",
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: "#303940",
    },
    buttonText: {
        color: "#fff",
    },
});
export default ScanQrCode;
