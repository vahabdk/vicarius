import React from 'react';
import SignUpScreen from './components/SignUpScreen';
import ClinicProfile from './components/ClinicProfile';
import LoginScreen from './components/LoginScreen';
import CandidateProfile from './components/CandidateProfile';
import firebase from 'firebase';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';

//Navigation bliver defineret
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Firebase konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCnvk99y9_kB84kIL_MXe5P6z_WedccxLI",
  authDomain: "vicarius-ny.firebaseapp.com",
  databaseURL: "https://vicarius-ny-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vicarius-ny",
  storageBucket: "vicarius-ny.appspot.com",
  messagingSenderId: "45927527723",
  appId: "1:45927527723:web:d2a0afb42f1caa2ddcc16e"
};
//eksporterer funktionen som indeholder alle importeret komponenter, som skal anvendes i programmet.
export default function App() {

  //Koden sikrer at kun én Firebase initieres under brug af appen.
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  //Funktion som adskiller views baseret på brugerparamtere således, at man kommer ind på den rigtige brugerprofil.
  function StackNavi({route}) {
    const param = () => {
      return route.params;
    }
    return (
        <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName={ param()}
        >
          <Stack.Screen name='candidate' component={CandidateProfile}/>
          <Stack.Screen name='company' component={ClinicProfile}/>
        </Stack.Navigator>
    );
  }

  // Laver tabnavigator i bunden
  function TabNavi() {
    return (
        <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Tilmelding" component={SignUpScreen}
                      options={{
                        tabBarLabel: 'Tilmelding',
                        tabBarColor: '#0094DE',
                        tabBarIcon: ({ color }) => (
                            <AntDesign name="addusergroup" size={24} color="black" />                        ),
                      }}/>
          <Tab.Screen name="Login" component={LoginScreen}
                      options={{
                        tabBarLabel: 'Login',
                        tabBarColor: '#0094DE',
                        tabBarIcon: ({ color }) => (
                            <AntDesign name="login" size={24} color="black" />                        ),
                      }}/>
          <Tab.Screen name="Profil" component={StackNavi}
                      options={{
                        tabBarLabel: 'Profil',
                        tabBarColor: '#0094DE',
                        tabBarIcon: ({ color }) => (
                            <AntDesign name="user" size={24} color="black" />                        ),
                      }}/>
        </Tab.Navigator>
        </NavigationContainer>

    );
  }


return <TabNavi/>

}
