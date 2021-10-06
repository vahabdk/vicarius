import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import firebase from 'firebase';

function ProfileScreen () {

    //handleLogout håndterer log ud af en aktiv bruger.
    //Metoden er en prædefineret metode, som firebase stiller tilrådighed
    //Metoden er et asynkrontkald.
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    //Hvis der af en eller anden grund ikke skulle være muligt at fremfinde den aktive bruger,
    //skal der udprintes en besked om dette igennem en tekstkomponent
    if (!firebase.auth().currentUser) {
        return <View><Text>Virksomhed ikke tilmeldt</Text></View>;
    }

    //I return() udnyttes en prædefineret metode, som firebase stiller til rådighed.
    // Metoden returnerer mailadressen af den aktive bruger.
    // Mailadressen udskrives ved brug af en tekstkomponent.
    return (
        <View style={styles.container} >
            <Text>Virksomheden er nu tilmeldt med: {firebase.auth().currentUser.email}</Text>
            <Button onPress={() => handleLogOut()} title="Log ud" />
        </View>
    );

}

//Lokal styling til brug i ProfileScreen
const styles = StyleSheet.create({
    container: {
        fontSize: 20,
        flex: 1,
        textAlign:'center',
        justifyContent: 'center',
        paddingTop: '5%',
        backgroundColor: '#ecf0f1',
        padding: 10,
    },
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default ProfileScreen;