import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpeedDial, Button } from 'react-native-elements';

const Writeoff = () => {
    const [listWriteoff, setListTrasfers] = useState([]);
    const [userAuth, setUserAuth] = useState(null);
    const [open, setOpen] = useState(null);


    async function getAuthToken() {
        return await AsyncStorage.getItem('userAuth').then((value) => value);
    }
    useEffect(() => {
        async function getUserData() {
            let loginValues = await getAuthToken();
            setUserAuth(loginValues);
        }
        getUserData();
    }, []);


    useEffect(() => {
        fetchUserRequests();
    }, [userAuth]);

    const fetchUserRequests = () => {
        if (userAuth == null) return;
        let user = JSON.parse(userAuth);
        fetch(`https://inventory-tracker-bk.herokuapp.com/api/writeoff/user/${user.user_id}`).then((response) => response.json())
            .then((json) => {
                setListTrasfers(json);
                console.log(json);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.listTitle}>Zahtjevi za Otpis</Text>
            {
                listWriteoff.map((writeoff) => (
                    <ListItem
                        disabled={!writeoff.is_active}
                        disabledStyle={styles.disabledItem}
                        key={writeoff.writeoff_id} bottomDivider style={styles.itemContainer}
                    >
                        {
                            writeoff.is_accepted ?
                                <Ionicons name="checkmark-done-circle"
                                    color={'green'}
                                    size={30} /> :
                                writeoff.is_active ?
                                    <Ionicons name="md-time-sharp"
                                        color={'black'}
                                        size={30} />
                                    :
                                    <Ionicons name="close-circle-sharp"
                                        color={'red'}
                                        size={30} />
                        }
                        <ListItem.Content>
                            <ListItem.Title>{writeoff.item_name}</ListItem.Title>
                            <ListItem.Subtitle>Status: {writeoff.is_accepted ? "Odobreno" : writeoff.is_active ? "Čeka odobrenje" : "Odbijeno"} </ListItem.Subtitle>
                            <ListItem.Subtitle>Opis: {writeoff.reason.lenght > 20 ? writeoff.reason.substring(0, 23) + "..." : writeoff.reason} </ListItem.Subtitle>
                        </ListItem.Content>

                    </ListItem>
                ))
            }
            <SpeedDial
                isOpen={open}
                icon={{ name: 'add', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
                style={styles.formModal}
                color='#0581f5'
            >
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.inputContainer}
                        keyboardType="default"
                        placeholder="Unesite artikl"
                    />
                    <TextInput
                        style={styles.inputContainer}
                        keyboardType="default"
                        placeholder="Unesite korisnika"
                    />
                    <TextInput
                        style={styles.inputContainer}
                        keyboardType="default"
                        placeholder="Unesite razlog"
                    />
                    <Button title="Submit" buttonStyle={styles.submitButton} raised />
                </View>
            </SpeedDial>
        </View >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8eaed',
        paddingTop: 50,
        paddingHorizontal: 20
    },
    itemContainer: {

    },
    listTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingHorizontal: 22,
        marginBottom: 25
    },
    disabledItem: {
        opacity: 0.6
    },
    formModal: {
        paddingBottom: 95
    },
    formContainer: {
        marginHorizontal: 80,
        marginBottom: 150,
    },
    inputContainer: {
        height: 60,
        borderRadius: 10,
        paddingHorizontal: 40,
        fontSize: 20,
        color: "#929292",
        backgroundColor: "#fff",
        textAlign: "center",
        textAlignVertical: "center",
        marginBottom: 8
    },
    submitButton: {
        padding: 10,
    }
});

export default Writeoff;