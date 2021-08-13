
import React, { useState, useEffect } from 'react';
import { Pressable, Button, View, Text, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import GallagherMobileAccess from 'react-native-gallagher-mobile-access';

const Stack = createStackNavigator();

function CredentialsScreen() {
    const [credentials, setCredentials] = useState([]);

    var selectSecondFactorResolution, selectSecondFactorRejection;

    async function deleteCredential(id) {
        try {
            await GallagherMobileAccess.deleteCredential(id);

            const creds = await GallagherMobileAccess.getCredentials();
            setCredentials(creds);
        } catch(err) {
            console.log(err);
        }
    }

    async function registerCredential(invitationCode, cloudUrl, navigation) {
        try {
            const url = await GallagherMobileAccess.resolveInvitationUrl(cloudUrl, invitationCode);

            const response = await GallagherMobileAccess.registerCredential(url);
            if(!response.completed && "continuationPoint" in response) {

                // intermediary step to prompt for second factor
                navigation.push('Select Second Factor Type');

                // The "SelectSecondFactorType" screen wants to tell us when the user clicked a button.
                //
                // All the things on stackOverflow say that you should pass a closure into the navigation route params and call it
                // - however if I do that, I get RN warnings about non-serializable route params breaking state management,
                // so we do this instead
                const authenticationType = await new Promise<String>((resolve, reject) => {
                    // hoist the resolver out into component level scope so the SelectSecondFactorType component can see it too
                    selectSecondFactorResolution = resolve;
                    selectSecondFactorRejection = reject;
                })

                navigation.goBack();

                await GallagherMobileAccess.registerCredentialContinue(response.continuationPoint, true, authenticationType);
            }
            
            // we're all done
            navigation.goBack();
            setCredentials(await GallagherMobileAccess.getCredentials());

        } catch(err) {
            Alert.alert("Registration Failed", err.message);
        }
    }

    function AddCredential({ navigation }) {
        // Normally, as a third party app developer, you would do the following:
        // 1: Somehow your backend will create a mobile credential, by PATCHing a cardholder, or creating a new one.
        // 2: The Command Centre REST api will give you back an invitation URL, which looks like this:
        //     https://commandcentre-ap-southeast-2.security.gallagher.cloud/api/invitations/UUWM-M26T-UDT2-7TUN
        // 3: Call GallagherMobileAccess.registerCredential, passing that URL straight in.
        //
        // However, for dev/getting started purposes this is how you manually enter an invitation code,
        // to allow you to experiment with the mobile side before having built a Command Centre server/API backend integration

        const [invitationCode, setInvitationCode] = React.useState("UUWM-M26T-UDT2-7TUN"); // remove hardcoded example. Invitation codes are one-shot so this one is invalid
        const [cloudUrl, setCloudUrl] = React.useState("commandcentre-ap-southeast-2.security.gallagher.cloud");

        return (
            <View style={styles.plainView}>
                <Text>Invitation Code:</Text>
                <TextInput style={styles.input} value={invitationCode} onChangeText={setInvitationCode} />
                <Text>Cloud Url:</Text>
                <TextInput style={styles.input} value={cloudUrl} onChangeText={setCloudUrl} />
                <Button title="Register..." onPress={() => registerCredential(invitationCode, cloudUrl, navigation)} />
            </View>
        );
    }

    function SelectSecondFactorType() {
        // At this point it would be a good idea to query the system and ask it what methods it has available.
        // for example, does this phone have Fingerprint/Face ID (the user may not have configured them, or a low-end android phone may not have a fingerprint scanner)
        // This is left as a future excercise
        return (
            <View style={styles.plainView}>
                <Text>Select Second Factor Type:</Text>
                <View style={styles.buttonContainer}>
                    <Button title="Fingerprint or Face ID" onPress={() => selectSecondFactorResolution('fingerprintOrFaceId')} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Pin/Passcode" onPress={() => selectSecondFactorResolution('pin')} />
                </View>
            </View>
        );
    }

    
    const CredentialListItem = ({ title, id }) => (
        <View style={styles.listItem}>
            <Text style={styles.titleText}>{title}</Text>
            <Button title="Delete" onPress={() => deleteCredential(id)} />
        </View>
    );

    useEffect(async () => {
        try {
            const creds = await GallagherMobileAccess.getCredentials();
            console.log("got creds " + JSON.stringify(creds))
            setCredentials(creds);
        } catch (err) {
            console.log("getCredentials failed! " + err);
        }
    }, []);

    const renderItem = ({ item }) => {
        return <CredentialListItem id={item.id} title={item.facilityName} />
    }
    const CredentialsList = ({ navigation }) => {
        React.useLayoutEffect(() => {
            navigation.setOptions({
                headerRight: () => (
                    <Button onPress={() => navigation.push('Add Credential')} title="Add" />
                ),
            });
        }, [navigation]);

        return (<View style={{ flex: 1 }}>
            <FlatList contentContainerStyle={{ flexGrow: 1 }} data={credentials} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>);
    };

    return ( // useless nav container just to get the top header
        // note: a Stack Navigator is NOT a good way to manage the AddCredential / SelectSecondFactorType flow; A Modal is much more appropriate.
        // we only use stack nav here because I couldn't get React native modals to work for some reason.
        <NavigationContainer independent="true">
            <Stack.Navigator>
                <Stack.Screen name="Credentials" component={CredentialsList} />
                <Stack.Screen name="Add Credential" component={AddCredential} />
                <Stack.Screen name="Select Second Factor Type" component={SelectSecondFactorType} />
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
    buttonContainer: {
        margin: 8,
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


export default CredentialsScreen;