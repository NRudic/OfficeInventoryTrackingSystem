import React from "react";
import { StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function ScannerView() {
    return (
        <Animatable.View
            style={{
                width: 220,
                height: 220,
            }}
            animation={"pulse"}
            iterationCount={"infinite"}
        >
            <View style={styles.borderTopLeft} />
            <View style={styles.borderTopRight} />
            <View style={styles.borderBottomLeft} />
            <View style={styles.borderBottomRight} />
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    borderTopLeft: {
        position: "absolute",
        borderColor: "#fff",
        width: 55,
        height: 55,
        top: 0,
        left: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderTopWidth: 3,
        borderLeftWidth: 3,
    },
    borderTopRight: {
        position: "absolute",
        borderColor: "#fff",
        width: 55,
        height: 55,
        top: 0,
        right: 0,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 3,
        borderBottomRightRadius: 3,

        borderTopWidth: 3,
        borderRightWidth: 3,
    },
    borderBottomLeft: {
        position: "absolute",
        borderColor: "#fff",
        width: 55,
        height: 55,
        bottom: 0,
        left: 0,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 3,
        borderTopLeftRadius: 3,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
    },
    borderBottomRight: {
        position: "absolute",
        borderColor: "#fff",
        width: 55,
        height: 55,
        bottom: 0,
        right: 0,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomWidth: 3,
        borderRightWidth: 3,
    },
});
