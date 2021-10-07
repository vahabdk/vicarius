import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SignUpForm from './components/SignUpForm';
import ProfileScreen from './components/ProfileScreen';
import firebase from 'firebase';
import { Card } from 'react-native-paper';

const firebaseConfig = {
  apiKey: "AIzaSyCtMKAay4vecprbykKaGeO6oQDZpCyf9uI",
  authDomain: "vicarius-5dc40.firebaseapp.com",
  databaseURL: "https://vicarius-5dc40-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vicarius-5dc40",
  storageBucket: "vicarius-5dc40.appspot.com",
  messagingSenderId: "898186916297",
  appId: "1:898186916297:web:1b9803a081b6f687e03818"
};

export default function App() {

//Her oprettes bruger state variblen
  const [user, setUser] = useState({ loggedIn: false });

  //Koden sikrer at kun én Firebase initieres under brug af appen.
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

//onAuthstatechanged er en prædefineret metode, forsynet af firebase, som konstant observerer brugerens status (logget ind vs logget ud)
//Pba. brugerens status foretages et callback i form af setUSer metoden, som håndterer user-state variablens status.
  function onAuthStateChange(callback) {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        callback({loggedIn: true, user: user});
      } else {
        callback({loggedIn: false});
      }
    });
  }

  //Heri aktiverer vi vores listener i form af onAuthStateChanged, så vi dynamisk observerer om brugeren er aktiv eller ej.
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

//Her oprettes gæstekomponentsindhold, der udgøres af sign-up
  const GuestPage = () => {
    return(
        <View style={styles.container}>
          <Text style={styles.header}>
            Vicarius
          </Text>
          <Text style={styles.paragraph}>
            Genvej til din næste vikar
          </Text>

          <Card style={{padding:20}}>

            <SignUpForm/>
          </Card>

        </View>
    )
  }

  return user.loggedIn ? <ProfileScreen /> : <GuestPage/> ;

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  header: {
    margin: 10,
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    color: 'blue',
  },

  paragraph: {
    margin: 10,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },

});