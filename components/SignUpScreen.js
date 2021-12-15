import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableHighlight,
    Alert, ScrollView,
} from 'react-native';
import firebase from 'firebase';
import { CheckBox } from 'react-native-elements'; //https://reactnativeelements.com/docs/checkbox/
import asyncStorage from "../utilities/asyncStorage";
//Startværdien bliver defineret og useState definerer hvilket format de indtastede værdier skal gemmes som.
export default function SignUpScreen({navigation}) {
    const [email, setEmail] = useState('test@test.com')
    const [password, setPassword] = useState('111111')
    const [confirm_password, setConfirmPassword] = useState('111111')
    const [errorMessage, setErrorMessage] = useState(null)
    const [isSelected, setSelection] = useState(false);

    const renderButton = () => {
        return <TouchableHighlight onPress={() => handleSubmit()} style={styles.renderButton}>
            <Text style={{color: "white", fontWeight: "bold"}}>Tilmed som virksomhed til Vicarius App!</Text>
        </TouchableHighlight>;
    };
    const renderButton2 = () => {
        return <TouchableHighlight onPress={() => handleSubmit2()} style={styles.renderButton}>
            <Text style={{color: "white", fontWeight: "bold"}}>Tilmed som vikar til Vicarius App!</Text>
        </TouchableHighlight>;
    };
    //Asynkron funktion. Tjekker først om kodeord er ens. Dernæst tjekkes om checkboksen er krydset af. Hvis begge kriterier er opfyldt, benyttes en  prædefineret metode som tager mail og password som argumenter og opretter en bruger.
    const handleSubmit = async () => {
        if (password !== confirm_password) {
            setErrorMessage("Kodeord er ikke ens");
        } else {
            if (isSelected)
                try {
                    await firebase.auth().createUserWithEmailAndPassword(email, password).then (async (data) => {
                        console.log("User info", data.user);
                        const user = data.user;
                        const userId = user.uid;
                        const email = user.email;

                        await firebase
                            .database()
                            .ref("clinics/" + userId)
                            .set({
                                email: email,
                                userId,
                            });
                        await asyncStorage.save("clinicId", userId)
                    });
                    navigation.navigate('Profil', 'company');
                } catch (error) {
                    setErrorMessage(error.message)
                } else {
                setErrorMessage('Handelsbetingelser ikke accepteret \n Accepter venligst handelsbetingelserne for at tilmelde til Vicarius')

                Alert.alert(
                    "Handelsbetingelser ikke accepteret",
                    "Accepter venligst handelsbetingelserne for at tilmelde til Vicarius",
                    [
                        {text: "OK", onPress: () => console.log("OK Pressed")}
                    ],
                    {cancelable: false}
                );

            }
        }
    }
    //Asynkron funktion. Tjekker først om kodeord er ens. Dernæst tjekkes om checkboksen er krydset af. Hvis begge kriterier er opfyldt, benyttes en  prædefineret metode som tager mail og password som argumenter og opretter en bruger.
    const handleSubmit2 = async () => {
        if (password !== confirm_password) {
            setErrorMessage("Kodeord er ikke ens");
        } else {
            if (isSelected)
                try {
                    await firebase.auth().createUserWithEmailAndPassword(email, password).then(async(data) => {
                        const user = data.user;
                        const userId = user.uid;
                        const email = user.email;

                        await firebase
                            .database()
                            .ref("candidates/" + userId)
                            .set({
                                email: email,
                                userId,
                            });
                        await asyncStorage.save("candidateId", userId)
                    });
                    navigation.navigate('Profil', 'candidate');
                } catch (error) {
                    setErrorMessage(error.message)
                } else {
                setErrorMessage('Handelsbetingelser ikke accepteret \n Accepter venligst handelsbetingelserne for at tilmelde til Vicarius')

                Alert.alert(
                    "Handelsbetingelser ikke accepteret",
                    "Accepter venligst handelsbetingelserne for at tilmelde til Vicarius",
                    [
                        {text: "OK", onPress: () => console.log("OK Pressed")}
                    ],
                    {cancelable: false}
                );

            }
        }
    }


        return (
            <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>
                    Vicarius
                </Text>
                <Text style={styles.paragraph}>
                    Genvej til din næste vikar
                </Text>
                <Text style={styles.header2}></Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={(email) => setEmail(email)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Kodeord"
                        value={password}
                        onChangeText={(password) => setPassword(password)}
                        secureTextEntry
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Bekræft kodeord"
                        value={confirm_password}
                        onChangeText={(confirm_password) => setConfirmPassword(confirm_password)}
                        secureTextEntry
                        style={styles.inputField}
                    />

                    <View style={styles.section}>
                        <CheckBox
                            title='Accepterer du Handelsbetingelserne?'
                            checked={isSelected}
                            onPress={() => setSelection((preValue)=> !preValue)}
                        />
                    </View>

                    {errorMessage && (
                        <Text style={styles.error}>Error: {errorMessage}</Text>
                    )}
                    <View style={{flexDirection: "row"}}>
                        {renderButton()}{renderButton2()}
                    </View>
                </View>
            </View>
            </ScrollView>
        );
    }


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,

    },
    inputContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        margin: 10,
    },

    inputField: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },

    header: {
        fontSize: 80,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'blue',
        fontWeight: 'bold',
    },

    renderButton: {
        backgroundColor: 'blue',
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        width: '50%',
    },
    renderButton2: {
        backgroundColor: 'blue',
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        width: '50%',
    },

    header2: {
        fontSize: 30,
        textAlign: 'center',
        color: 'blue',
        justifyContent: 'center',
        fontWeight: 'bold',
    },

    paragraph: {
        margin: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },

    section: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        },
});