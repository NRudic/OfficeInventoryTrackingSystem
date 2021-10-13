import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../views/Home';
import Transfers from '../views/Transfers';
import Writeoffs from '../views/Writeoffs';
import Login from '../views/Login'

const Tab = createBottomTabNavigator();


const Navigator = (props) => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Prijenos') {
                            iconName = focused ? 'people-sharp' : 'people-outline';
                        } else if (route.name === 'Scan QR') {
                            iconName = focused ? 'qr-code' : 'qr-code-outline';
                        } else if (route.name === 'Otpis') {
                            iconName = focused ? 'ios-archive-sharp' : 'ios-archive-outline';
                        } else if (route.name === 'Izlaz') {
                            iconName = focused ? 'ios-exit' : 'ios-exit-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
                })}
                tabBarOptions={{
                    activeTintColor: '#0581f5',
                    inactiveTintColor: 'gray',
                    style: {
                        ...styles.navigation
                    },
                    labelStyle: {
                        paddingBottom: 10
                    }
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Prijenos" component={Transfers} />
                <Tab.Screen name="Scan QR" component={HomeScreen} options={{
                    tabBarButton: () =>
                        <View style={styles.scanContainer}>
                            <TouchableOpacity style={styles.scanParentButton} >
                                <TouchableOpacity style={styles.scanButton} onPress={() => props.setComponent("QRCode")} >
                                    <Ionicons name="qr-code-outline"
                                        color={'white'}
                                        size={30} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <Text style={styles.scanButtonText}>Scan QR</Text>
                        </View>
                }} />
                <Tab.Screen name="Otpis" component={Writeoffs} />
                <Tab.Screen name="Izlaz" component={Login} onPress={() => props.signOut()} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}


const styles = StyleSheet.create({
    navigation: {
        backgroundColor: '#fff',
        height: 75,
        borderRadius: 15,
        position: 'absolute',
        bottom: 10,
        marginHorizontal: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    scanContainer: {
        top: -40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        bottom: 35,
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 100
    },
    scanParentButton: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#e8eaed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#ff5500',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButtonText: {
        color: 'gray',
        fontSize: 12,
        lineHeight: 40,
        paddingTop: 8
    }
});

export default Navigator;