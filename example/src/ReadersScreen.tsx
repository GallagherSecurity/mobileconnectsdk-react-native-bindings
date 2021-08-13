
import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity, NativeEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GallagherMobileAccess, { SdkStateChanged, ReaderUpdated, AccessEvent } from 'react-native-gallagher-mobile-access';
const GallagherMobileAccessEvents = new NativeEventEmitter(GallagherMobileAccess);

const Stack = createStackNavigator();

function connectToReader(id) {
    //GallagherMobileAccess.
}

function displayMessageForSdkState(sdkState: String): String {
    // this is not exhaustive, just the ones you are most likely to hit
    switch(sdkState) {
        case "errorNoCredentials": return "Please register a credential to scan for readers"
        case "bleErrorUnauthorized": return "App is not authorized to use bluetooth"
        case "bleErrorLocationServiceDisabled": return "Location Services are disabled"

        case "bleErrorNoLocationPermission": return "App doesn't have Location Permissions (required for Bluetooth)"
        // this is not neccessarily an error. Lots of people only want to have access when the app is visible on-screen
        case "bleErrorNoBackgroundLocationPermission": return "(Optional) App doesn't have Background Location Permission"
        
        // Note: you may not wish to copy these sample messages as-is. 
        // For example, saying "may still use nfc" when NFC is also disabled, isn't correct
        case "bleErrorDisabled": return "Bluetooth is disabled (may still use nfc)"
        case "nfcErrorDisabled": return "NFC is disabled (may still use bluetooth)"
        default: return sdkState // no friendly text for this one
    }
}

function ReadersScreen() {
    const [messages, setMessages] = useState([]);
    const [readers, setReaders] = useState([]);
    
    const updateSdkStates = function(sdkStates: [String]) {
        const mapped = sdkStates.map(s => ({ id: s, message: displayMessageForSdkState(s) }))
        setMessages(mapped)
    }

    useEffect(() => {
        console.log('ReadersScreen load');
        console.log(GallagherMobileAccessEvents.addListener);

        GallagherMobileAccess.getStates().then(s => updateSdkStates(s))

        const sdkSub = GallagherMobileAccessEvents.addListener('sdkStateChanged', (data: SdkStateChanged) => {
            console.log('isScanning: ' + data.isScanning + ' sdkStates: '+JSON.stringify(data.states));
            updateSdkStates(data.states)
        });

        const subscription = GallagherMobileAccessEvents.addListener('readerUpdated', (data: ReaderUpdated) => {
            const { updateType, reader } = data;

            let existingReader = null;
            let existingIdx = -1;
            for (let i = 0; i < readers.length; i++) {
                if (readers[i].id == reader.id) {
                    existingIdx = i;
                    existingReader = readers[i];
                    break;
                }
            }

            switch (updateType) {
                case "readerUnavailable":
                    if (existingIdx != -1) {
                        // TODO - we're modifying the value directly out of getState so we should probably
                        // copy it, but we're going to call setReaders anyway so it should be fine
                        const localReaders = readers.slice();
                        localReaders.splice(existingIdx, 1);
                        setReaders(localReaders);
                    }
                    break;
                case "attributesChanged":
                    {
                        const localReaders = readers.slice();
                        if (existingIdx != -1) {
                            Object.assign(localReaders[existingIdx], reader); // overwrite properties but leave status alone
                        } else {
                            localReaders.push(reader);
                        }
                        setReaders(localReaders);
                        break;
                    }
            }

        });

        const accessSubscription = GallagherMobileAccessEvents.addListener('access', (data: AccessEvent) => {
            const { event, message, reader } = data;
            console.log(`access event=${event} message=${message}`);

            let existingReader = null;
            let existingIdx = -1;
            for (let i = 0; i < readers.length; i++) {
                if (readers[i].id == reader.id) {
                    existingIdx = i;
                    existingReader = readers[i];

                    const newStatus = (event == 'started' ? "Connecting..." : message);
                    existingReader["status"] = newStatus;
                    setReaders(readers);

                    setTimeout(() => {
                        existingReader["status"] = null;
                        setReaders(readers);
                    }, 2000);

                    break;
                }
            }
        });

        return () => {
            sdkSub.remove();
            subscription.remove();
            accessSubscription.remove();
        }
    }, []);

    const ReaderMessageItem = ({ message }) => (
        <View style={styles.listItem}>
            <Text style={styles.titleText}>{message}</Text>
        </View>
    )

    const ReaderListItem = ({ reader }) => (
        <TouchableOpacity onPress={() => connectToReader(reader.id)}>
            <View style={styles.listItem}>
                <Text style={styles.titleText}>{reader.name}</Text>
                { reader.status &&
                    <Text style={styles.titleText}>{reader.status}</Text>
                }
                { !reader.status &&
                <>
                    <Text style={styles.titleText}>{reader.distance}</Text>
                    <Button title="Actions" onPress={() => { /*todo requestReaderActions*/ }} />
                </>
                }
            </View>
        </TouchableOpacity>
    )

    const ReadersList = ({ navigation }) => {
        const renderMessage = ({ item }) => {
            return <ReaderMessageItem message={item.message} />
        }
        const renderItem = ({ item }) => {
            return <ReaderListItem reader={item} />
        }

        return (<View style={{ flex: 0 }}>
            <FlatList contentContainerStyle={{ flexGrow: 1 }} data={messages} renderItem={renderMessage} keyExtractor={item => item.id} />
            {(readers.length>0) ?
                <>
                    <View style={{height: 1, backgroundColor: 'black'}} />
                    <FlatList contentContainerStyle={{ flexGrow: 1 }} data={readers} renderItem={renderItem} keyExtractor={item => item.id} />
                </>
            : null}
        </View>);
    };

    return ( // useless nav container just to get the top header
        <NavigationContainer independent="true">
            <Stack.Navigator>
                <Stack.Screen name="Readers" component={ReadersList} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    plainView: {
        padding: 8,
        flex: 1,
        backgroundColor: 'white'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 8,
        paddingRight: 8,
    },

    listItem: {
        height: 64,
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomColor: '#e9e9ec',
        borderBottomWidth: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 18,
        flexGrow: 1,
    }
});


export default ReadersScreen;