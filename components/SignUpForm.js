import React, {useState} from 'react';
import {
    Button, Text,
    View,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import firebase from 'firebase';
import Checkbox from 'expo-checkbox';



function SignUpForm() {
    //Instantiering af state-variabler, der skal benyttes i SignUpForm
    const [name, setName] = useState('')
    const [cvr, setCvr] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isCompleted, setCompleted] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [isSelected, setSelection] = useState(false);

    //Her defineres brugeroprettelsesknappen, som aktiverer handleSubmit igennem onPress
    const renderButton = () => {
        return <Button onPress={() => handleSubmit()} title="Tilmed virksomhed til Vicarius App!" />;
    };

    /*
   * Metoden herunder håndterer oprettelse af brugere ved at anvende den prædefinerede metode, som stilles til rådighed af firebase
   * signInWithEmailAndPassword tager en mail og et password med som argumenter og foretager et asynkront kald, der eksekverer en brugeroprettelse i firebase
   * Opstår der fejl under forsøget på oprettelse, vil der i catch blive fremsat en fejlbesked, som, ved brug af
   * setErrorMessage, angiver værdien for state-variablen, errormessage
   */
    const handleSubmit = async() => {
        if (isSelected===true){
            console.log("working")

        }else {
console.log("not working")
        }
        Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
        );
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then((data)=>{
            });
        } catch (error){
            setErrorMessage(error.message)
        }

    }

//I return oprettes en tekstkomponent, der angiver at dette er SignUpform
//Dernæst er der to inputfelter, som løbende sætter værdien af state-variablerne, mail og password.
// Afslutningsvis, angives det at, hvis errorMessage får fastsat en værdi, skal denne udskrives i en tekstkomponent.

    return (
        <View>
            <Text style={styles.header}>Første måned gratis, herefter kr. 79,-/måned</Text>
            <TextInput
                placeholder="Virksomhedsnavn"
                value={name}
                onChangeText={(name) => setName(name)}
                style={styles.inputField}
            />
            <TextInput
                placeholder="CVR"
                value={cvr}
                onChangeText={(cvr) => setCvr(cvr)}
                style={styles.inputField}
            />
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
            <View style={styles.section}>
                <Checkbox
                    style={styles.checkbox}
                    value={isSelected}
                    onValueChange={setSelection}
                    color={isSelected ? '#4630EB' : undefined}
                />
                <Text style={styles.paragraph}>Custom colored checkbox</Text>
            </View>

            <Text style={styles.label}>
                Accepterer virksomheden Handelsbetingelserne? {isSelected ? "👍" : "👎"}</Text>


            {errorMessage && (
                <Text style={styles.error}>Error: {errorMessage}</Text>
            )}
            {renderButton()}
        </View>
    );
}

//Lokal styling til brug i SignUpForm
const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    inputField: {
        borderWidth: 1,
        margin: 10,
        padding: 10,
        justifyContent: 'center',

    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        color: 'blue',
        justifyContent: 'center',

    },
    renderButton: {
        borderWidth: 1,
        margin: 10,
        paddingBottom: '20%',
        textAlign: 'center',
        color: 'blue',
        justifyContent: 'center',
    },

    label: {
        margin: 5,
        alignSelf: "center",
        justifyContent: 'center',
    },
    checkbox: {
        margin: 8,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 15,
    },
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default SignUpForm;

/*
            <CheckBox
                value={isSelected}
                onValueChange={() => setSelection(!isSelected)}
                style={styles.checkbox}
            />*/