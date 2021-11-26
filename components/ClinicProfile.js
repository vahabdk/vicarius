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
import { xorBy } from "lodash";
import Button from "react-native-select-two/lib/Button";
import onlyDigits from "../utilities/onlyDigits";
import isValidEmail from "../utilities/isValidEmail";



export default function ClinicProfile({ navigation }) {
    const [contactName, setContactName] = useState("");
    const [tlf, setTlf] = useState("");
    const [workPlace, setWorkPlace] = useState("");
    const [workTime, setWorkTime] = useState("");
    const [candidateData, setCandidateData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [contactMail, setContactMail] = useState("");

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

    useEffect(() => {
        if (!candidateData.length) {
            const dbRef = firebase.database().ref();
            dbRef
                .child("candidates")
                .get()
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log(snapshot.val());
                        const response = snapshot.val();
                        const candidates = Object.values(response);
                        console.log(candidates);
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

    function filterByCriteria(companyCriterias) {
        const allCandidates = candidateData;

        if (!companyCriterias?.length || !allCandidates?.length) return [];

        const filteredData = allCandidates.filter((candidate) => {
            const selectedJobs = candidate.selectedItemsC;

            return hasMatch(companyCriterias, selectedJobs);
        });

        return filteredData;
    }

    const handleSubmit = async () => {
        if (selectedItems.length) {
            try {
                setErrorMessage("");
                if (!isValidEmail(contactMail)) {
                    setErrorMessage(contactMail + "ugyldig email ");

                    return;
                }

                var clinicRef = firebase.database().ref("clinics").push();
                var key = clinicRef.key;
                await firebase.database().ref("clinics").push({
                    id: key,
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


    const handleLogOut = async () => {
        await firebase.auth().signOut();
        navigation.navigate("Login");
    };

    function onMultiChange() {
        if (selectedItems)
            return (item) => setSelectedItems(xorBy(selectedItems, [item], "id"));
    }
    const combinedCriterias = [...selectedItems];

    const filteredData =
        combinedCriterias.length === 0
            ? candidateData
            : filterByCriteria(combinedCriterias);
    console.log(combinedCriterias);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Vicarius</Text>
                <Text style={styles.paragraph}>Genvej til din næste vikar</Text>
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
                            <Button
                                style={styles.button}
                                title="Send email"
                                onPress={() =>
                                    Linking.openURL("mailto:" + candidate.contactMailC)
                                }
                            />
                            <Button
                                style={styles.button}
                                title="Ring til"
                                onPress={() => Linking.openURL("tel:" + candidate.cTlf)}
                            />
                        </ScrollView>
                    </View>
                ))}
            </View>

            <View style={{ alignItems: "center", justifyContent: "space-around" }}>
                <TouchableHighlight
                    onPress={() => handleSubmit()}
                    style={styles.submitButton}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            justifyContent: "space-around",
                        }}
                    >
                        Send ansøgning
                    </Text>
                </TouchableHighlight>
            </View>

            <View style={{ alignItems: "center" }}>
                <TouchableHighlight
                    onPress={() => handleLogOut()}
                    style={styles.logOutButton}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Log ud</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },

    inputContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
    },

    inputField: {
        width: "100%",
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 5,
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

    header: {
        fontSize: 80,
        alignItems: "center",
        justifyContent: "center",
        color: "blue",
        fontWeight: "bold",
    },

    paragraph: {
        margin: 10,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
    },

    multiselect: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        color: "blue",
        marginTop: 10,
    },

    logOutButton: {
        backgroundColor: "red",
        borderWidth: 1,
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

    button: {
        justifyContent: "space-around",
        backgroundColor: "green",
        alignItems: "center",
        borderWidth: 1,
        width: 200,
        marginTop: 10,
    },
});