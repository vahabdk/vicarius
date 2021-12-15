import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Alert,
    Linking,
} from "react-native";
import firebase from "firebase";
import { useEffect, useState } from "react";
import Constants from "expo-constants"; //https://docs.expo.dev/versions/latest/sdk/constants/
import { ScrollView } from "react-native-gesture-handler"; //Giver mulighed for at scrolle i view
import SelectBox from "react-native-multi-selectbox"; //Mulighed for at vælge flere valg i qualifications
import Button from "react-native-select-two/lib/Button";
import { xorBy } from "lodash"; //https://lodash.com/docs/#xorBy
import onlyDigits from "../utilities/onlyDigits";
import isValidEmail from "../utilities/isValidEmail";
import asyncStorage from "../utilities/asyncStorage";
import deleteAccount from "../services/deleteAccount";

//Startværdien bliver defineret og useState definerer hvilket format de indtastede værdier skal gemmes som.
export default function ApplicationDetails({ navigation }) {
    const [candidateName, setCandidateName] = useState("");
    const [cTlf, setCTlf] = useState("");
    const [selectedItemsC, setSelectedItemsC] = useState([]);
    const [clinicData, setClinicData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [contactMailC, setContactMailC] = useState("");
    //Definerer de forskellige qualifications en kandidat kan vælge.
    const qualifications = [
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
    //Tjekker databasen efter klinikdata og fremviser disse, hvis de findes.
    useEffect(() => {
        if (!clinicData.length) {
            const dbRef = firebase.database().ref();
            dbRef
                .child("clinics")
                .get()
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const response = snapshot.val();
                        const clinics = Object.values(response);
                        setClinicData(clinics);
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);
    //Matchfunktion, som tjekker efter match mellem candidateCriteria og selectedExp.
    const hasMatch = (candidateCriterias, selectedExp) => {
        if (!selectedExp?.length) {
            return false;
        }
        for (let i = 0; i < candidateCriterias.length; i++) {
            for (let j = 0; j < selectedExp.length; j++) {
                const companyCriteria = candidateCriterias[i];
                const candidateCriteria = selectedExp[j];

                if (candidateCriteria?.item == companyCriteria?.item) {
                    return true;
                }
            }
            return false;
        }
    };
    //Filtreringsfunktion som viser det filtreret data på baggrund af om der er match mellem candidateCriteria og selectedExp.
    function filterByCriteria(candidateCriteria) {
        const allCompany = clinicData;

        if (!candidateCriteria?.length || !allCompany?.length) return [];

        const filteredData = allCompany.filter((company) => {
            const selectedExp = company.selectedItems;

            return hasMatch(candidateCriteria, selectedExp);
        });

        return filteredData;
    }
    //Logger ud fra Firebase og navigerer til loginsiden
    const handleLogOut = async () => {
        await firebase.auth().signOut();
        navigation.navigate("Login");
    };
    /*Gem knappen. Asynkron funktion som først tjekker om der er valgt items fra selectbox.
    Samtidigt tjekker funktionen om kontaktmailen er gyldig.
    Hvis begge kriterier ikke er opfyldt bliver kandidatens værdier ikke opdateret.
    Hvis begge kriterier derimod er opfyld, bliver de indskrevne værdier opdateret*/
    const handleApply = async () => {
        if (selectedItemsC.length) {
            try {
                setErrorMessage("");
                if (!isValidEmail(contactMailC)) {
                    setErrorMessage(contactMailC + " er ugyldig ");

                    return;
                }
                const candidateId = await asyncStorage.getValueFor("candidateId")

                var candidateRef = firebase.database().ref(`/candidates/${candidateId}`)
                await candidateRef.update({
                    selectedItemsC,
                    cTlf,
                    candidateName,
                    contactMailC,
                });
                setSelectedItemsC([]);

                Alert.alert(
                    "Ansøgning sendt",
                    "Du kan nu sende ny ansøgning",
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
    //Når der er selectedItems, bliver de returneret samt at filtreringsfunktionen bliver kaldt.
    function onMultiChangeC() {
        if (selectedItemsC)
            return (item) => setSelectedItemsC(xorBy(selectedItemsC, [item], "id"));
    }
    const combinedCriterias = [...selectedItemsC];

    const filteredData =
        combinedCriterias.length === 0
            ? clinicData
            : filterByCriteria(combinedCriterias);
    //Bekræftelse på slet brugerprofil
    const confirmDelete = () => {
        Alert.alert('Er du sikker?', 'Ønsker du at slette din bruger?', [
            {text: 'Annuller', style: 'cancel'},
            {text: 'Slet', style: 'destructive', onPress: () => handleDelete()},
        ])
    };
    //Profilen bliver slettet under /candidates i Firebase og brugeren bliver navigeret tilbage til tilmeldingssiden
    const deleteUserInfo = async () => {
        const candidateId = await asyncStorage.getValueFor("candidateId");
        try {
            await firebase.database().ref(`/candidates/${candidateId}`).remove();
            navigation.navigate("Tilmelding");
        } catch (error) {
            Alert.alert(error.message);
        }
    };
    //Kandidatinfo bliver slettet under Authentication i Firebase
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
                <Text style={styles.header}>Vicarius</Text>
                <Text style={styles.paragraph}>Genvej til dit næste vikariat</Text>
                <TextInput
                    placeholder="Dit navn"
                    value={candidateName}
                    onChangeText={(candidateName) => setCandidateName(candidateName)}
                    style={styles.inputField}
                />
                <TextInput
                    placeholder="Tlf"
                    value={cTlf}
                    onChangeText={(cTlf) => setCTlf(onlyDigits(cTlf))}
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
                    value={contactMailC}
                    onChangeText={(contactMailC) => setContactMailC(contactMailC)}
                    style={styles.inputField}
                />

                <View style={styles.multiselect}>
                    <SelectBox
                        label="Vælg din erfaring indenfor:"
                        options={qualifications}
                        selectedValues={selectedItemsC}
                        onMultiSelect={onMultiChangeC()}
                        onTapClose={onMultiChangeC()}
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
                filteredData.map((clinic, index) => {
                    return (
                        <View key={index} style={styles.infoContainer}>
                            <ScrollView>
                                <Text> Kontaktperson: {clinic?.contactName} </Text>
                                <Text> Kontakt mail: {clinic?.contactMail} </Text>
                                <Text> Kontakt tlf: {clinic?.tlf} </Text>
                                <Text> Arbejdssted: {clinic?.workPlace} </Text>
                                <Text> Antal timer om ugen: {clinic?.workTime} </Text>

                                <View>
                                    <Text> Søger vikar med erfaring indenfor:</Text>
                                    {clinic?.selectedItems &&
                                    clinic?.selectedItems.map((item) => (
                                        <Text key={item.id}> - {item.item}</Text>
                                    ))}
                                </View>
                                <Button
                                    style={styles.button}
                                    title="Send email"
                                    onPress={() =>
                                        Linking.openURL("mailto:" + clinic.contactMail)
                                    }
                                />
                                <Button
                                    style={styles.button}
                                    title="Ring til"
                                    onPress={() => Linking.openURL("tel:" + clinic.tlf)}
                                />
                            </ScrollView>
                        </View>
                    );
                })}
            </View>

            <View style={{ paddingVertical: 10, alignItems: "center"}}>
                <Text style={{ color: "red" }}> {errorMessage} </Text>
            </View>

            <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                <TouchableHighlight
                    onPress={() => handleApply()}
                    style={styles.applyButton}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Gem</Text>
                </TouchableHighlight>
            </View>
            <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                <TouchableHighlight
                    onPress={() => handleLogOut()}
                    style={styles.loginButton}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Log ud</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => confirmDelete()}
                    style={styles.deleteButton}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Slet profil</Text>
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

    header: {
        margin: 10,
        fontSize: 60,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
        color: "blue",
    },

    paragraph: {
        margin: 10,
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
    },

    inputField: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        width: "60%",
    },

    loginButton: {
        backgroundColor: "red",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        width: "60%",
        marginTop: 10,
    },
    applyButton: {
        backgroundColor: "blue",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        width: "60%",
    },

    infoContainer: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: "center",
        width: "60%",
        marginVertical: 10,
    },

    button: {
        justifyContent: "space-around",
        backgroundColor: "green",
        alignItems: "center",
        borderWidth: 1,
        width: 150,
        marginTop: 10,
    },

    multiselect: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        color: "blue",
    },

    deleteButton: {
        justifyContent: "space-around",
        backgroundColor: "pink",
        alignItems: "center",
        borderWidth: 1,
        width: 150,
        marginTop: 10,
    },
});