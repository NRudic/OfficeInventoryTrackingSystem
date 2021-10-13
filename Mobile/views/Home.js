import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements'
// import ListItem from '../components/ListItem'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
    const [listItems, setListItems] = useState([]);
    const [confirmedListItems, setConfirmedListItems] = useState([]);
    const [userAuth, setUserAuth] = useState(null);
    const today = new Date();
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

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

    const confirmItem = (item) => {
        if (userAuth == null) return;
        let user = JSON.parse(userAuth);
        fetch('https://inventory-tracker-bk.herokuapp.com/api/item/ownership', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user.user_id,
                itemId: item.item_id
            })
        }).then(() => {
            fetchUserItems(user.user_id);
        })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchUserItems();
    }, [userAuth]);

    const fetchUserItems = () => {
        if (userAuth == null) return;
        let user = JSON.parse(userAuth);
        fetch(`https://inventory-tracker-bk.herokuapp.com/api/item/user/${user.user_id}`).then((response) => response.json())
            .then((json) => {
                setListItems(json);
                console.log(json);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleConfirmItem = (index) => {
        let tempItems = [...listItems];
        let removedItem = tempItems.splice(index, 1);
        setListItems(tempItems);
        setConfirmedListItems([...confirmedListItems, removedItem[0]]);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.listTitle}>Zaduženja</Text>
            {
                listItems.map((item) => (
                    <ListItem
                        // disabled={!item.is_scannable}
                        disabledStyle={styles.disabledItem}
                        key={item.item_id} bottomDivider style={styles.itemContainer}
                        onPress={() => confirmItem(item)}
                    >
                        {
                            new Date(item.last_recorded_date) < lastMonth ?
                                <Ionicons name="close-circle"
                                    color={'black'}
                                    size={30} />
                                :
                                <Ionicons name="checkmark-done"
                                    color={'green'}
                                    size={30} />
                        }

                        {/* <Icon name={"ios-archive-sharp"} /> */}
                        <ListItem.Content>
                            <ListItem.Title>{item.item_name}</ListItem.Title>
                            <ListItem.Subtitle>S/N: : {item.item_sn ? item.item_sn : "-- Nema S/N --"} </ListItem.Subtitle>
                            <ListItem.Subtitle>Zadnja potvrda: {new Date(item.last_recorded_date).toISOString().substring(0, 10)} </ListItem.Subtitle>

                        </ListItem.Content>

                    </ListItem>
                ))
            }
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
    }
});

export default Home;