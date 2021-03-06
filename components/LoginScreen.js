import React, {useState} from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import firebase from 'firebase';

export default function LoginForm({navigation}) {
    //Startværdien bliver defineret og useState definerer hvilket format de indtastede værdier skal gemmes som.
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    //Virksomhedslogin til en eksisterende bruger. Asynkron funktion som benytter en prædefineret metode som tager mail og password som argumenter.
    const handleLogin = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then((data)=>{
                navigation.navigate('Profil', 'company');
            });

        } catch (error){
            setErrorMessage(error.message)
        }
    }
    ////Kandidatlogin til en eksisterende bruger. Asynkron funktion som benytter en prædefineret metode som tager mail og password som argumenter.
    const handleLogin2 = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then((data)=>{
                navigation.navigate('Profil','candidate');
            });

        } catch (error){
            setErrorMessage(error.message)
        }
    }

    const loginButton = () => {
        return <TouchableHighlight onPress={() => handleLogin()} style={styles.loginButton}>
            <Text style={{color:"white", fontWeight: "bold"}}>Virksomheds login</Text>
        </TouchableHighlight>;
    };
    const loginButton2 = () => {
        return <TouchableHighlight onPress={() => handleLogin2()} style={styles.loginButton2}>
            <Text style={{color:"white", fontWeight: "bold"}}>Klinikassistent login</Text>
        </TouchableHighlight>;
    };

    return(

        <View style={styles.container}>
            <Text style={styles.header}>
                VICARIUS
            </Text>
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
                    onChangeText={(password) => setPassword(password) }
                    secureTextEntry
                    style={styles.inputField}
                />
                {errorMessage && (
                    <Text style={styles.error}>Error: {errorMessage}</Text>
                )}
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                    {loginButton()}
                </View>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                    {loginButton2()}
                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,

    },
    inputContainer: {
        marginTop: 100,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    inputField: {
        width: "100%",
        borderBottomWidth: 0.5,
        borderColor: '#aaaaaa',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },

    header: {
        fontSize: 60,
        alignItems: "center",
        justifyContent: "center",
        color: "#81d4fa",
        fontWeight: "bold",
    },

    paragraph: {
        margin: 10,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center',
    },

    loginButton: {
        marginTop: 50,
        backgroundColor: '#81d4fa',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        width: '80%',

    },
    loginButton2: {
        backgroundColor: '#81d4fa',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        width: '80%',

    },
});

