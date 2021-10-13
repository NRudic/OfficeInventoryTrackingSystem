import React, { useState } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Login = (props) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Sustav za praćenje inventurne liste</Text>

                    <Text style={styles.prijavaText}>Prijava</Text>
                </View>
                <View style={styles.form}>
                    <Ionicons name="mail" style={styles.iconLock} />
                    <TextInput
                        style={styles.inputPassword}
                        keyboardType="email-address"
                        autoFocus={true}
                        placeholder="Email adresa"
                        placeholderTextColor="#929292"
                        onChangeText={text => setEmail(text)}
                    />
                </View>
                <View style={styles.form}>
                    <Ionicons name="lock-closed" style={styles.iconLock} />
                    <TextInput
                        style={styles.inputPassword}
                        keyboardType="default"
                        secureTextEntry={true}
                        placeholder="Unesite lozinku"
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => props.tryLogin({ email: email, password: password })}>
                    <Text style={styles.buttonText}>Prijava</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#23588c",
        paddingHorizontal: 30,
        flexDirection: 'column',
    },
    title: {
        marginTop: 80,
        marginBottom: 30,
    },
    titleText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 36,
        lineHeight: 40,
        fontWeight: "bold",
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 100

    },
    prijavaText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 28,
        fontWeight: "bold"
    },
    userText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        lineHeight: 30,
    },
    form: {
        marginBottom: 15,
    },
    iconLock: {
        color: "#929292",
        position: "absolute",
        fontSize: 16,
        top: 22,
        left: 22,
        zIndex: 10,
    },
    inputPassword: {
        height: 60,
        borderRadius: 30,
        paddingHorizontal: 30,
        fontSize: 20,
        color: "#929292",
        backgroundColor: "#fff",
        textAlign: "center",
        textAlignVertical: "center",
    },
    button: {
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ff5500",
        justifyContent: "center",
        marginTop: 15,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff",
        textAlign: "center",
    },
});
export default Login;
