/*import * as React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Picker,
    TouchableHighlight
} from 'react-native'
import { MultipleSelectPicker } from 'react-native-multi-select-picker'
import firebase from "firebase";

class App extends React.Component {
    state = {
        selectectedItems: [],
        isShownPicker: false
    }

    render() {
        const items = [
            {label: 'Dental Suite', value: '1'},
            {label: 'Al Dente', value: '2'},
            {label: 'Klinikassistent', value: '3'},
            {label: 'Receptionist', value: '4'},
            {label: 'Tandplejer', value: '5'},
            {label: 'Tandlæge', value: '6'},
            {label: 'Tandkirurg', value: '7'},

            {label: 'Elev', value: '9'},
        ]
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ isShownPicker: !this.state.isShownPicker })
                    }}
                    style={{ height: 50, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#dadde3' }}
                >
                    <Text>Picker</Text>
                </TouchableOpacity>
                {this.state.isShownPicker && <MultipleSelectPicker
                        items={items}
                        onSelectionsChange={(ele) => { this.setState({ selectectedItems: ele }) }}
                        selectedItems={this.state.selectectedItems}
                        buttonStyle={{ height: '10%', justifyContent: 'center', alignItems: 'center', margin: 10, padding: 10 }}
                        buttonText='hello'
                        checkboxStyle={{ height: 20, width: 20 }}
                    />
                }

                {(this.state.selectectedItems || []).map((item, index) => {
                    return <Text key={index}>
                        {item.label}
                    </Text>
                })}

            </View >
        )
    }
}


<ScrollView>
    <View style={styles.container}>
        <Text style={styles.header}>
            Vicarius
        </Text>
        <Text style={styles.paragraph}>
            Genvej til din næste vikar
        </Text>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>

            <View>
                <Text>Udfyld venligst</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Virksomhedens navn"
                        value={companyName}
                        onChangeText={(companyName) => setCompanyName(companyName)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="CVR"
                        value={cvr}
                        onChangeText={(cvr) => setCvr(cvr)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Tlf"
                        value={tlf}
                        onChangeText={(tlf) => setTlf(tlf)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder="Email"
                        value={firebase.auth().currentUser.email}
                        onChangeText={(email) => setEmail(email)}
                        style={styles.inputField}
                    />

                    <View style={styles.picker}>
                        <Text>Søger en:</Text>
                        <Picker
                            selectedValue={picker1}
                            onValueChange={(setPicker1) => {
                                setPicker1(setPicker1)
                            }}>

                            <Picker.Item label="Klinikassistent" value="klinikassistent"/>
                            <Picker.Item label="Receptionist" value="receptionist"/>
                            <Picker.Item label="Tandlæge" value="tandlæge"/>
                            <Picker.Item label="Tandplejer" value="tandplejer"/>
                            <Picker.Item label="Tandkirurg" value="tandkirurg"/>
                            <Picker.Item label="Elev" value="elev"/>
                        </Picker>
                    </View>
                    <Multiselect />
                    <View style={styles.picker}>
                        <Text>Ancinetet</Text>
                        <Picker
                            selectedValue={item3}
                            onValueChange={(setItem) => {
                                setItem3(setItem)
                            }}>

                            <Picker.Item label="0-1 år" value="0-1 år"/>
                            <Picker.Item label="1-2 år" value="1-2 år"/>
                            <Picker.Item label="3-5 år" value="3-5 år"/>
                            <Picker.Item label="5+ år" value="5+ år"/>
                        </Picker>
                    </View>

                </View>
            </View>

        </View>
        <TouchableHighlight onPress={() => submitHandler()} style={styles.renderButton}>
            <Text style={{color: "white", fontWeight: "bold"}}>submit</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => handleLogOut()} style={styles.renderButton2}>
            <Text style={{color: "white", fontWeight: "bold"}}>Log ud</Text>
        </TouchableHighlight>
    </View>
</ScrollView>

<Text style={{ fontSize: 20, paddingBottom: 10 }}>Ancinetet:</Text>
                    <SelectBox
                        label="Vælg fra listen"
                        options={ancinetet}
                        value={selectValue}
                        onChange={onChange()}
                        hideInputFilter={false}
                    />

                    // Multiple Select / Dropdown / Picker Example in React Native
// https://aboutreact.com/multiple-select-dropdown-picker-example-in-react-native/

// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

// import MultiSelect library
import MultiSelect from 'react-native-multiple-select';

// Dummy Data for the MutiSelect
const items = [
  // name key is must. It is to show the text in front
  {id: 1, name: 'angellist'},
  {id: 2, name: 'codepen'},
  {id: 3, name: 'envelope'},
  {id: 4, name: 'etsy'},
  {id: 5, name: 'facebook'},
  {id: 6, name: 'foursquare'},
  {id: 7, name: 'github-alt'},
  {id: 8, name: 'github'},
  {id: 9, name: 'gitlab'},
  {id: 10, name: 'instagram'},
];

const App = () => {
  // Data Source for the SearchableDropdown
  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    setSelectedItems(selectedItems);
  };

  useEffect(() => {
    fetch('https://aboutreact.herokuapp.com/demosearchables.php')
      .then((response) => response.json())
      .then((responseJson) => {
        //Successful response from the API Call
        setServerData(responseJson.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Multiple Select / Dropdown / Picker Example
          in React Native
        </Text>
        <MultiSelect
          hideTags
          items={items}
          uniqueKey="id"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={(text) => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{color: '#CCC'}}
          submitButtonColor="#48d22b"
          submitButtonText="Submit"
        />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headingText: {
    padding: 8,
  },
});



<SelectBox
                        label="Erfaring indenfor:"
                        options={erfaring}
                        selectedValues={selectValues}
                        onMultiSelect={onMultiChange()}
                        onTapClose={onMultiChange()}
                        isMulti
                    />



                    <View style={styles.picker}>
                                    <Text>Erfaring indenfor:</Text>
                                    <Multiselect
                                        placeholder="Vælg én eller flere fra listen"
                                        onMultiSelect={onMultiChange()}
                                        options={erfaring.id} // Options to display in the dropdown
                                        uniqueKey="id"
                                        showDropDowns={true}
                                        readOnlyHeadings={true}
                                        selectedValues={erfaring.id} // Preselected value to persist in dropdown
                                        onSelect={(itemValue) => setPicker(itemValue)} // Function will trigger on select event
                                        onRemove={onRemove} // Function will trigger on remove event
                                    />
                                </View>
                                <View>
                                <CustomMultiPicker
                                    options={erfaring}
                                    search={true} // should show search bar?
                                    multiple={true} //
                                    placeholder={"Search"}
                                    placeholderTextColor={'#757575'}
                                    returnValue={"label"} // label or value
                                    callback={(res)=>{ console.log(res) }} // callback, array of selected items
                                    rowBackgroundColor={"#eee"}
                                    rowHeight={40}
                                    rowRadius={5}
                                    searchIconName="ios-checkmark"
                                    searchIconColor="red"
                                    searchIconSize={30}
                                    iconColor={"#00a2dd"}
                                    iconSize={30}
                                    selectedIconName={"ios-checkmark-circle-outline"}
                                    unselectedIconName={"ios-radio-button-off-outline"}
                                    scrollViewHeight={130}
                                    selected={["Tom", "Christin"]} // list of options which are selected by default
                                />
                                </View>



                                <SelectPicker
                                options={erfaring}
                                selectedValue={selectValue}
                                onValueChange={(itemValue, itemIndex) => selectedValue(itemValue)}
                                selected={selected}>

                                {Object.values(options).map((val, index) => (
                                    <SelectPicker.Item label={val} value={val} key={index}/>
                                ))}

                            </SelectPicker>




                                                                    <TouchableOpacity
                                            onPress={() => {
                                                setState({ isShownPicker: !state.isShownPicker })
                                            }}
                                            style={{ height: 50, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#dadde3' }}
                                        >
                                            <Text>Picker</Text>
                                        </TouchableOpacity>
                                        {state.isShownPicker ? <MultipleSelectPicker
                                                items={erfaring}
                                                onSelectionsChange={(ele) => { setState({ selectectedItems: ele }) }}
                                                selectedItems={state.selectedItems}
                                                buttonStyle={{ height: 100, justifyContent: 'center', alignItems: 'center' }}
                                                buttonText='hello'
                                                checkboxStyle={{ height: 20, width: 20 }}
                                            />
                                            : null
                                        }

                                        {(state.selectedItems || []).map((item: any, index) => {
                                            return <Text key={index}>
                                                {item.label}
                                            </Text>
                                        })}
                                        </View>



                                        <View style={styles.picker}>
                                <Text>Søger en:</Text>
                                <Picker
                                    selectedValue={picker}
                                    onValueChange={(itemValue, itemIndex) => setPicker(itemValue)}>

                                    <Picker.Item label="Klinikassistent" value="klinikassistent"/>
                                    <Picker.Item label="Receptionist" value="receptionist"/>
                                    <Picker.Item label="Tandlæge" value="tandlæge"/>
                                    <Picker.Item label="Tandplejer" value="tandplejer"/>
                                    <Picker.Item label="Tandkirurg" value="tandkirurg"/>
                                    <Picker.Item label="Elev" value="elev"/>
                                </Picker>

                            </View>

                            picker: {
        height: '15%',
        margin: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },



    const loginButton = () => {
        return <TouchableHighlight onPress={() => {navigation.navigate('Login')}} style={styles.renderButton} >
            <Text style={{color:"white", fontWeight: "bold"}}>Allerede bruger? Login her!</Text>
        </TouchableHighlight>;
    };
    loginButton: {
        backgroundColor: 'blue',
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,

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

    },
    RenderButton2: {
        backgroundColor: 'red',
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,

    },

//onAuthstatechanged er en prædefineret metode, forsynet af firebase, som konstant observerer brugerens status (logget ind vs logget ud)
//Pba. brugerens status foretages et callback i form af setUSer metoden, som håndterer user-state variablens status.
  /*function onAuthStateChange(callback) {
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


                           <Checkbox
                                style={styles.checkbox}
                                value={isSelected}
                                onValueChange={setSelection}
                                color={isSelected ? '#4630EB' : undefined}
                            />

                            <View style={styles.section}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={setIsChecked}
                                onPress={onChange()}
                                color={isChecked ? '#4630EB' : undefined}
                            />
                            <Text>Virksomhed/ {isChecked}</Text>
                        </View>

                        if (!firebase.auth().currentUser) {
        return <View><Text>Email ikke genkendt</Text></View>;
    };

    <View style={styles.section}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={setIsChecked}
                                color={isChecked ? '#4630EB' : undefined}
                            />
                            <Text>Virksomhed {isChecked}</Text>
                        </View>



                        firebase.auth().currentUser.email

                        if (isSelected && !isChecked)
                        try {
                            navigation.navigate('Profil', "privat");
                        } catch (error) {
                            setErrorMessage(error.message)
 */



