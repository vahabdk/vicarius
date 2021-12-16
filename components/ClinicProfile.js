import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableHighlight,
    Alert,
    Linking,
} from "react-native";
import firebase from "firebase";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash"; //https://lodash.com/docs/#xorBy
import onlyDigits from "../utilities/onlyDigits";
import isValidEmail from "../utilities/isValidEmail";
import asyncStorage from "../utilities/asyncstorage";
import deleteAccount from "../services/deleteAccount";
import { AntDesign } from '@expo/vector-icons';
import Constants from "expo-constants";


//Startværdien bliver defineret og useState definerer hvilket format de indtastede værdier skal gemmes som.
export default function ClinicProfile({ navigation }) {
    const [contactName, setContactName] = useState("");
    const [tlf, setTlf] = useState("");
    const [workPlace, setWorkPlace] = useState("");
    const [workTime, setWorkTime] = useState("");
    const [candidateData, setCandidateData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [contactMail, setContactMail] = useState("");
    //Definerer de forskellige demands en kandidat kan vælge.
    const demands = [
        { item: "Dental Suite", id: "DS" },
        { item: "Al Dente", id: "AD" },
        { item: "Sterilen", id: "ST" },
        { item: "Assistere tandlæge", id: "AT" },
        { item: "Reception", id: "RC" },
        { item: "Børnetandpleje", id: "BT" },
        { item: "Røntgen", id: "RO" },
        { item: "Tandrens", id: "TR" },
        { item: "Afpudsning", id: "AP" },
        { item: "Assistere kirurgi", id: "AK" },
        { item: "Tage aftryk/scanne", id: "TA" },
    ];
    //Tjekker databasen efter kandidatdata og fremviser disse, hvis de findes.
    useEffect(() => {
        if (!candidateData.length) {
            const dbRef = firebase.database().ref();
            dbRef
                .child("candidates")
                .get()
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const response = snapshot.val();
                        const candidates = Object.values(response);
                        setCandidateData(candidates);
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);
    //Matchfunktion, som tjekker efter match mellem companyCriteria og selectedJobs.
    const hasMatch = (companyCriterias, selectedJobs) => {
        if (!companyCriterias?.length || !selectedJobs?.length) {
            return false;
        }
        for (let i = 0; i < companyCriterias.length; i++) {
            for (let j = 0; j < selectedJobs.length; j++) {
                const companyCriteria = companyCriterias[i];
                const candidateCriteria = selectedJobs[j];

                if (companyCriteria?.item == candidateCriteria?.item) {
                    return true;
                }
            }
        }
        return false;
    };
    //Filtreringsfunktion som viser det filtreret data på baggrund af om der er match mellem companyCriteria og selectedJobs.
    function filterByCriteria(companyCriterias) {
        const allCandidates = candidateData;

        if (!companyCriterias?.length || !allCandidates?.length) return [];

        const filteredData = allCandidates.filter((candidate) => {
            const selectedJobs = candidate.selectedItemsC;

            return hasMatch(companyCriterias, selectedJobs);
        });

        return filteredData;
    }
    /*Send ansøgning knappen. Asynkron funktion som først tjekker om der er valgt items fra selectbox.
        Samtidigt tjekker funktionen om kontaktmailen er gyldig.
        Hvis begge kriterier ikke er opfyldt bliver klinikkens værdier ikke opdateret.
        Hvis begge kriterier derimod er opfyld, bliver de indskrevne værdier opdateret*/
    const handleSubmit = async () => {
        if (selectedItems.length) {
            try {
                setErrorMessage("");
                if (!isValidEmail(contactMail)) {
                    setErrorMessage(contactMail + "Ugyldig kontaktmail ");

                    return;
                }

                const clinicId = await asyncStorage.getValueFor("clinicId")

                var clinicRef = firebase.database().ref(`/clinics/${clinicId}`)
                await clinicRef.update({
                    selectedItems,
                    workPlace,
                    workTime,
                    tlf,
                    contactName,
                    contactMail,
                });
                setSelectedItems([]);

                Alert.alert(
                    "Ansøgning sendt",
                    "Du kan nu oprette ny ansøgning",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage(
                "Vælg mindst én fra listen \n Du skal vælge mindst én fra listen for at forsætte"
            );

            Alert.alert(
                "Intet valg registreret",
                "Du skal vælge mindst én fra listen for at forsætte",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }
    };
    //Logger ud fra Firebase og navigerer til loginsiden
    const handleLogOut = async () => {
        await firebase.auth().signOut();
        navigation.navigate("Login");
    };
    //Når der er selectedItems, bliver de returneret samt at filtreringsfunktionen bliver kaldt.
    function onMultiChange() {
        if (selectedItems)
            return (item) => setSelectedItems(xorBy(selectedItems, [item], "id"));
    }
    const combinedCriterias = [...selectedItems];

    const filteredData =
        combinedCriterias.length === 0
            ? candidateData
            : filterByCriteria(combinedCriterias);

    //Bekræftelse på slet brugerprofil
    const confirmDelete = () => {
            Alert.alert('Er du sikker?', 'Ønsker du at slette din bruger?', [
                {text: 'Annuller', style: 'cancel'},
                {text: 'Slet', style: 'destructive', onPress: () => handleDelete()},
            ])
    };
    //Profilen bliver slettet under /clinics i Firebase og brugeren bliver navigeret tilbage til tilmeldingssiden
    const deleteUserInfo = async () => {
        const clinicId = await asyncStorage.getValueFor("clinicId");
        try {
            await firebase.database().ref(`/clinics/${clinicId}`).remove();
            navigation.navigate("Tilmelding");
        } catch (error) {
            Alert.alert(error.message);
        }
    };
    //Clinicinfo bliver slettet under Authentication i Firebase
    const handleDelete = () => {
        const onAccountDeleteSuccess = async () => {
            await deleteUserInfo();
        };
        //Skulle slet funktionen slå fejl, bliver en alert vist med error.message.
        const onAccountDeleteFail = (error) => {
            Alert.alert(
                " Something went wrong, We can not delete account :" + error.message
            );
        };

        deleteAccount(onAccountDeleteSuccess, onAccountDeleteFail);
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>VICARIUS</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Kontaktpersonens navn"
                        value={contactName}
                        onChangeText={(contactName) => setContactName(contactName)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Tlf"
                        value={tlf}
                        onChangeText={(tlf) => setTlf(onlyDigits(tlf))}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Email"
                        value={firebase.auth().currentUser.email}
                        editable={false}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Kontakt mail"
                        value={contactMail}
                        onChangeText={(contactMail) => setContactMail(contactMail)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Arbejdssted"
                        value={workPlace}
                        onChangeText={(workPlace) => setWorkPlace(workPlace)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Antal timer om ugen"
                        value={workTime}
                        keybordType="numerical"
                        onChangeText={(workTime) => setWorkTime(onlyDigits(workTime))}
                        style={styles.inputField}
                    />
                </View>

                <View style={{ paddingVertical: 10 }}>
                    <Text style={{ color: "red" }}> {errorMessage} </Text>
                </View>

                <View style={styles.multiselect}>
                    <SelectBox
                        label="Vælg ønskede erfaring hos vikaren"
                        options={demands}
                        selectedValues={selectedItems}
                        onMultiSelect={onMultiChange()}
                        onTapClose={onMultiChange()}
                        flex={1}
                        alignItems={"center"}
                        justifyContent={"center"}
                        width={"60%"}
                        isMulti
                    />
                </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                {Boolean(filteredData.length) &&
                filteredData.map((candidate, index) => (
                    <View key={index} style={styles.infoContainer}>
                        <ScrollView>
                            <Text> Vikarens navn: {candidate?.candidateName} </Text>
                            <Text> Vikarens tlf: {candidate?.cTlf} </Text>
                            <Text> Vikarens kontakt mail: {candidate?.contactMailC} </Text>

                            <View>
                                <Text> Vikaren har erfaring indenfor:</Text>
                                {candidate?.selectedItemsC &&
                                candidate?.selectedItemsC.map((item) => (
                                    <Text key={item.id}> - {item.item}</Text>
                                ))}
                            </View>

                            <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                            <TouchableHighlight onPress={() => Linking.openURL("mailto:" + candidate.contactMailC)} style={styles.listButton}>
                                <View style={{flexDirection: "row", justifyContent: "center"}}>
                                    <View style={{padding: 5}}>
                                        <AntDesign name="mail" size={20} color="white" />
                                    </View>
                                        <View style={{padding: 5, justifyContent: "center"}}>
                                            <Text style={styles.buttonText}> Send mail</Text>
                                        </View>
                                </View>

                            </TouchableHighlight>
                            </View>

                            <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                            <TouchableHighlight onPress={() => Linking.openURL("tel:" + candidate.cTlf)} style={styles.listButton}>
                                <View style={{flexDirection: "row", justifyContent: "center"}}>
                                    <View style={{padding: 5}}>
                                        <AntDesign name="phone" size={20} color="white" />
                                </View>
                                <View style={{padding: 5, justifyContent: "center"}}>
                                    <Text style={styles.buttonText}> Ring til</Text>
                                </View>
                                </View>
                            </TouchableHighlight>
                            </View>
                        </ScrollView>
                    </View>
                ))}
            </View>

            <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                <TouchableHighlight onPress={() => handleSubmit()} style={styles.submitButton}>
                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <View style={{padding: 5}}>
                        <AntDesign name="upload" size={24} color="white" />
                        </View>
                    <View style={{padding: 5, justifyContent: "center"}}>
                    <Text style={styles.buttonText}> Send ansøgning</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>

            <View style={{ alignItems: "center" }}>
                <TouchableHighlight
                    onPress={() => handleLogOut()}
                    style={styles.logOutButton}
                >
                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <View style={{padding: 5}}>
                            <AntDesign name="logout" size={24} color="white" />
                        </View>
                        <View style={{padding: 5, justifyContent: "center"}}>
                        <Text style={styles.buttonText}>Log ud</Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={() => confirmDelete()}
                    style={styles.deleteButton}
                >
                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <View style={{padding: 5}}>
                            <AntDesign name="delete" size={24} color="white" />
                        </View>
                        <View style={{padding: 5, justifyContent: "center"}}>
                    <Text style={styles.buttonText}>Slet profil</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },

    inputContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
    },

    inputField: {
        width: "100%",
        borderBottomWidth: 0.5,
        borderColor: '#aaaaaa',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },

    infoContainer: {
        padding: 10,
        margin: 10,
        borderRadius: 5,
        elevation: 10,
        borderWidth: 0.5,
        borderColor: "#aaaaaa",
        alignItems: "center",
        width: "60%",
        marginVertical: 10,
    },

    header: {
        fontSize: 60,
        alignItems: "center",
        justifyContent: "center",
        color: "#81d4fa",
        fontWeight: "bold",
    },

    multiselect: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 10,
    },

    logOutButton: {
        backgroundColor: "pink",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        width: "60%",
        marginTop: 10,
    },

    submitButton: {
        backgroundColor: "#81d4fa",
        padding: 10,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        width: "60%",
    },

    deleteButton: {
        backgroundColor: "red",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        width: "60%",
        marginTop: 10,
    },

    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },

    listButton: {
        backgroundColor: "lightgreen",
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        width: "65%",
        marginTop: 5,
    }
});